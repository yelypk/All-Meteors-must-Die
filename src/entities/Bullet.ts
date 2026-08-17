import { Graphics } from "pixi.js";

import {
  BULLET_HEIGHT,
  BULLET_WIDTH,
} from "../conf";

import { Entity } from "./Entity";

interface BulletOptions {
  x: number;
  y: number;
  velocityY: number;
  color: number;
}

export class Bullet extends Entity {
  private readonly velocityY: number;

  public constructor(options: BulletOptions) {
    super(BULLET_WIDTH, BULLET_HEIGHT);

    this.position.set(
      options.x,
      options.y,
    );

    this.velocityY = options.velocityY;

    this.createView(options.color);
  }

  public update(deltaTime: number): void {
    this.y +=
      this.velocityY * deltaTime;
  }

  public isOutsideScreen(
    screenHeight: number,
  ): boolean {
    const halfHeight =
      BULLET_HEIGHT / 2;

    return (
      this.y + halfHeight < 0 ||
      this.y - halfHeight > screenHeight
    );
  }

  private createView(color: number): void {
    const bullet = new Graphics();

    bullet
      .roundRect(
        -BULLET_WIDTH / 2,
        -BULLET_HEIGHT / 2,
        BULLET_WIDTH,
        BULLET_HEIGHT,
        BULLET_WIDTH / 2,
      )

      .fill({
        color,
      });

    this.addChild(bullet);
  }
}