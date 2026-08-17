import { Graphics } from "pixi.js";

import {
  BOSS_HEIGHT,
  BOSS_IDLE_DURATION,
  BOSS_MAX_HP,
  BOSS_MOVE_DURATION,
  BOSS_SPEED,
  BOSS_WIDTH,
  GAME_WIDTH,
} from "../conf";

import { colors } from "../theme/palette";
import { bossVisual } from "../theme/visual";
import { Entity } from "./Entity";

enum BossMotionState {
  Idle = "idle",
  Moving = "moving",
}

export class Boss extends Entity {
  private readonly healthBar =
    new Graphics();

  private hitPoints = BOSS_MAX_HP;

  private motionState =
    BossMotionState.Idle;

  private stateTimeRemaining =
    BOSS_IDLE_DURATION;

  private movementDirectionX = 1;

  public constructor(x: number, y: number) {
    super(BOSS_WIDTH, BOSS_HEIGHT);

    this.position.set(x, y);

    this.createView();
    this.updateHealthBar();
  }

  public get remainingHitPoints(): number {
    return this.hitPoints;
  }

  public get isDefeated(): boolean {
    return this.hitPoints <= 0;
  }

  public get shotOriginX(): number {
    return this.x;
  }

  public get shotOriginY(): number {
    return this.y + BOSS_HEIGHT / 2;
  }

  public update(deltaTime: number): void {
    if (!this.isActive) {
      return;
    }

    this.stateTimeRemaining -= deltaTime;

    if (this.stateTimeRemaining <= 0) {
      this.switchMotionState();
    }

    if (
      this.motionState ===
      BossMotionState.Moving
    ) {
      this.moveHorizontally(deltaTime);
    }
  }

  public takeDamage(): void {
    if (!this.isActive || this.isDefeated) {
      return;
    }

    this.hitPoints = Math.max(
      0,
      this.hitPoints - 1,
    );

    this.updateHealthBar();
  }

  private switchMotionState(): void {
    if (
      this.motionState ===
      BossMotionState.Idle
    ) {
      this.motionState =
        BossMotionState.Moving;

      this.stateTimeRemaining =
        BOSS_MOVE_DURATION;

      this.movementDirectionX =
        Math.random() < 0.5 ? -1 : 1;

      return;
    }

    this.motionState = BossMotionState.Idle;

    this.stateTimeRemaining =
      BOSS_IDLE_DURATION;
  }

  private moveHorizontally(
    deltaTime: number,
  ): void {
    this.x +=
      this.movementDirectionX *
      BOSS_SPEED *
      deltaTime;

    const minimumX = BOSS_WIDTH / 2;
    const maximumX =
      GAME_WIDTH - BOSS_WIDTH / 2;

    if (this.x <= minimumX) {
      this.x = minimumX;
      this.movementDirectionX = 1;
    }

    if (this.x >= maximumX) {
      this.x = maximumX;
      this.movementDirectionX = -1;
    }
  }

  private createView(): void {
    const body = new Graphics();
    const {
      body: bodyVisual,
      cockpit,
      lights,
      cannon,
    } = bossVisual;

    body
      .ellipse(
        0,
        bodyVisual.centerY,
        BOSS_WIDTH / 2,
        bodyVisual.radiusY,
      )
      .fill({ color: colors.boss.body })
      .stroke({
        color: colors.boss.bodyStroke,
        width: bodyVisual.strokeWidth,
      });

    body
      .ellipse(
        0,
        cockpit.centerY,
        cockpit.radiusX,
        cockpit.radiusY,
      )
      .fill({ color: colors.boss.cockpit })
      .stroke({
        color: colors.boss.cockpitStroke,
        width: cockpit.strokeWidth,
      });

    body
      .circle(
        -lights.sideX,
        lights.sideY,
        lights.radius,
      )
      .circle(0, lights.centerY, lights.radius)
      .circle(
        lights.sideX,
        lights.sideY,
        lights.radius,
      )
      .fill({ color: colors.boss.lights });

    body
      .roundRect(
        cannon.x,
        cannon.y,
        cannon.width,
        cannon.height,
        cannon.radius,
      )
      .fill({ color: colors.boss.cannon });

    this.addChild(body, this.healthBar);
  }

  private updateHealthBar(): void {
    const {
      width,
      height,
      offsetY,
      radius,
      strokeWidth,
      highThreshold,
      mediumThreshold,
    } = bossVisual.healthBar;

    const healthRatio =
      this.hitPoints / BOSS_MAX_HP;

    const healthColor =
      healthRatio > highThreshold
        ? colors.boss.healthHigh
        : healthRatio > mediumThreshold
          ? colors.boss.healthMedium
          : colors.boss.healthLow;

    this.healthBar.clear();

    this.healthBar
      .roundRect(
        -width / 2,
        -BOSS_HEIGHT / 2 - offsetY,
        width,
        height,
        radius,
      )
      .fill({
        color: colors.boss.healthBackground,
      });

    if (healthRatio > 0) {
      this.healthBar
        .roundRect(
          -width / 2,
          -BOSS_HEIGHT / 2 - offsetY,
          width * healthRatio,
          height,
          radius,
        )
        .fill({ color: healthColor });
    }

    this.healthBar
      .roundRect(
        -width / 2,
        -BOSS_HEIGHT / 2 - offsetY,
        width,
        height,
        radius,
      )
      .stroke({
        color: colors.boss.healthStroke,
        width: strokeWidth,
      });
  }
}
