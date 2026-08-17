import { Container } from "pixi.js";

import {
  BULLET_HEIGHT,
  GAME_HEIGHT,
  GAME_WIDTH,
  LEVEL_TIME_SECONDS,
  MAX_PLAYER_SHOTS,
  PLAYER_BULLET_SPEED,
  PLAYER_HEIGHT,
  PLAYER_START_OFFSET,
} from "../conf";

import type { InputManager } from "../core/InputManager";
import { Bullet } from "../entities/Bullet";
import { Player } from "../entities/Player";
import { colors } from "../theme/palette";
import { GameHUD } from "../ui/GameHUD";

export type SceneResultType =
  | "next-level"
  | "win"
  | "lose";

export interface SceneResult {
  type: SceneResultType;
  description: string;
}

type SceneCompleteHandler = (
  result: SceneResult,
) => void;

export abstract class Scene extends Container {
  protected readonly player: Player;

  protected readonly bullets: Bullet[] = [];

  private readonly worldLayer = new Container();

  private readonly hud = new GameHUD();

  private remainingShots = MAX_PLAYER_SHOTS;

  private timeRemaining = LEVEL_TIME_SECONDS;

  private readonly levelDeadline =
    performance.now() + LEVEL_TIME_SECONDS * 1000;

  private running = true;

  protected constructor(
    level: number,
    private readonly inputManager: InputManager,
    private readonly onComplete: SceneCompleteHandler,
  ) {
    super();

    this.player = new Player(
      GAME_WIDTH / 2,
      GAME_HEIGHT - PLAYER_START_OFFSET,
    );

    this.hud.setLevel(level);
    this.hud.updateTime(this.timeRemaining);
    this.hud.updateShots(this.remainingShots);

    this.worldLayer.addChild(this.player);
    this.addChild(this.worldLayer, this.hud);
  }

  public update(deltaTime: number): void {
    if (!this.running) {
      return;
    }

    this.updateTimer();

    if (this.timeRemaining <= 0) {
      this.complete({
        type: "lose",
        description: "TIME IS UP",
      });

      return;
    }

    this.player.update(
      deltaTime,
      this.inputManager.horizontalDirection,
    );
    this.handleShooting();
    this.updateBullets(this.bullets, deltaTime);
    this.updateLevel(deltaTime);

    if (!this.running) {
      return;
    }

    if (
      this.remainingShots === 0 &&
      this.bullets.length === 0
    ) {
      this.complete({
        type: "lose",
        description: "NO SHOTS LEFT",
      });
    }
  }

  protected abstract updateLevel(
    deltaTime: number,
  ): void;

  protected complete(result: SceneResult): void {
    if (!this.running) {
      return;
    }

    this.running = false;
    this.inputManager.consumeShootRequest();
    this.onComplete(result);
  }

  protected addGameObject(
    object: Container,
  ): void {
    this.worldLayer.addChild(object);
  }

  protected updateBullets(
    bullets: Bullet[],
    deltaTime: number,
  ): void {
    for (
      let index = bullets.length - 1;
      index >= 0;
      index -= 1
    ) {
      const bullet = bullets[index];

      bullet.update(deltaTime);

      if (bullet.isOutsideScreen(GAME_HEIGHT)) {
        bullet.removeFromGame();
        bullets.splice(index, 1);
      }
    }
  }

  private updateTimer(): void {
    this.timeRemaining = Math.max(
      0,
      (this.levelDeadline - performance.now()) /
        1000,
    );

    this.hud.updateTime(this.timeRemaining);
  }

  private handleShooting(): void {
    const shootRequested =
      this.inputManager.consumeShootRequest();

    if (
      !shootRequested ||
      this.remainingShots <= 0
    ) {
      return;
    }

    const bulletStartY =
      this.player.y -
      PLAYER_HEIGHT / 2 -
      BULLET_HEIGHT / 2;

    const bullet = new Bullet({
      x: this.player.x,
      y: bulletStartY,
      velocityY: -PLAYER_BULLET_SPEED,
      color: colors.bullet.player,
    });

    this.bullets.push(bullet);
    this.remainingShots -= 1;

    this.hud.updateShots(this.remainingShots);
    this.addGameObject(bullet);
  }
}
