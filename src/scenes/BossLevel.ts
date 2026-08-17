import {
  BOSS_BULLET_SPEED,
  BOSS_SHOOT_INTERVAL,
  BOSS_START_Y,
  BULLET_HEIGHT,
  GAME_WIDTH,
} from "../conf";

import type { InputManager } from "../core/InputManager";
import { Boss } from "../entities/Boss";
import { Bullet } from "../entities/Bullet";
import { colors } from "../theme/palette";
import { intersects } from "../utils/Collision";

import { Scene } from "./Scene";
import type { SceneResult } from "./Scene";

export class BossLevel extends Scene {
  private readonly boss: Boss;

  private readonly bossBullets: Bullet[] = [];

  private shootTimeRemaining =
    BOSS_SHOOT_INTERVAL;

  public constructor(
    inputManager: InputManager,
    onComplete: (result: SceneResult) => void,
  ) {
    super(2, inputManager, onComplete);

    this.boss = new Boss(
      GAME_WIDTH / 2,
      BOSS_START_Y,
    );

    this.addGameObject(this.boss);
  }

  protected updateLevel(
    deltaTime: number,
  ): void {
    this.boss.update(deltaTime);
    this.updateBossShooting(deltaTime);
    this.updateBullets(
      this.bossBullets,
      deltaTime,
    );

    this.resolveBulletToBulletCollisions();
    this.resolveBulletBossCollisions();

    if (this.boss.isDefeated) {
      this.complete({
        type: "win",
        description: "BOSS DESTROYED",
      });

      return;
    }

    this.resolveBossBulletPlayerCollisions();
  }

  private updateBossShooting(
    deltaTime: number,
  ): void {
    if (!this.boss.isActive) {
      return;
    }

    this.shootTimeRemaining -= deltaTime;

    if (this.shootTimeRemaining > 0) {
      return;
    }

    const bullet = new Bullet({
      x: this.boss.shotOriginX,
      y:
        this.boss.shotOriginY +
        BULLET_HEIGHT / 2,
      velocityY: BOSS_BULLET_SPEED,
      color: colors.bullet.boss,
    });

    this.bossBullets.push(bullet);
    this.addGameObject(bullet);

    this.shootTimeRemaining +=
      BOSS_SHOOT_INTERVAL;
  }

  private resolveBulletToBulletCollisions(): void {
    for (
      let bossIndex = this.bossBullets.length - 1;
      bossIndex >= 0;
      bossIndex -= 1
    ) {
      const bossBullet =
        this.bossBullets[bossIndex];

      for (
        let playerIndex = this.bullets.length - 1;
        playerIndex >= 0;
        playerIndex -= 1
      ) {
        const playerBullet =
          this.bullets[playerIndex];

        if (
          !intersects(
            bossBullet.hitBox,
            playerBullet.hitBox,
          )
        ) {
          continue;
        }

        bossBullet.removeFromGame();
        playerBullet.removeFromGame();

        this.bossBullets.splice(bossIndex, 1);
        this.bullets.splice(playerIndex, 1);

        break;
      }
    }
  }

  private resolveBulletBossCollisions(): void {
    if (!this.boss.isActive) {
      return;
    }

    for (
      let index = this.bullets.length - 1;
      index >= 0;
      index -= 1
    ) {
      const bullet = this.bullets[index];

      if (
        !intersects(
          bullet.hitBox,
          this.boss.hitBox,
        )
      ) {
        continue;
      }

      bullet.removeFromGame();
      this.bullets.splice(index, 1);
      this.boss.takeDamage();

      if (this.boss.isDefeated) {
        this.boss.removeFromGame();
        return;
      }
    }
  }

  private resolveBossBulletPlayerCollisions(): void {
    for (
      let index = this.bossBullets.length - 1;
      index >= 0;
      index -= 1
    ) {
      const bullet = this.bossBullets[index];

      if (
        !intersects(
          bullet.hitBox,
          this.player.hitBox,
        )
      ) {
        continue;
      }

      bullet.removeFromGame();
      this.bossBullets.splice(index, 1);

      this.complete({
        type: "lose",
        description: "YOUR SHIP WAS HIT",
      });

      return;
    }
  }
}
