import { Graphics } from "pixi.js";

import {
  ASTEROID_AREA_BOTTOM,
  ASTEROID_AREA_TOP,
  GAME_WIDTH,
} from "../conf";

import { colors } from "../theme/palette";
import { asteroidVisual } from "../theme/visual";
import { Entity } from "./Entity";

interface AsteroidOptions {
  x: number;
  y: number;

  radius: number;

  speed: number;
  directionAngle: number;

  rotationSpeed: number;

  seed: number;
}

export class Asteroid extends Entity {
  public readonly radius: number;

  private velocityX: number;
  private velocityY: number;

  private readonly rotationSpeed: number;

  public constructor(options: AsteroidOptions) {
    const diameter = options.radius * 2;

    super(diameter, diameter);

    this.radius = options.radius;

    this.position.set(
      options.x,
      options.y,
    );

    this.velocityX =
      Math.cos(options.directionAngle) *
      options.speed;

    this.velocityY =
      Math.sin(options.directionAngle) *
      options.speed;

    this.rotationSpeed =
      options.rotationSpeed;

    this.createView(options.seed);
  }

  public update(deltaTime: number): void {
    this.x +=
      this.velocityX * deltaTime;

    this.y +=
      this.velocityY * deltaTime;

    this.rotation +=
      this.rotationSpeed * deltaTime;

    this.handleScreenBounds();
  }

  public resolveCollisionWith(
    other: Asteroid,
  ): boolean {
    if (!this.isActive || !other.isActive) {
      return false;
    }

    const differenceX = other.x - this.x;
    const differenceY = other.y - this.y;

    const minimumDistance =
      this.radius + other.radius;

    const distanceSquared =
      differenceX * differenceX +
      differenceY * differenceY;

    if (
      distanceSquared >=
      minimumDistance * minimumDistance
    ) {
      return false;
    }

    const distance = Math.sqrt(
      distanceSquared,
    );

    const normalX =
      distance > 0 ? differenceX / distance : 1;

    const normalY =
      distance > 0 ? differenceY / distance : 0;

    const overlap =
      minimumDistance - distance;

    const thisMass =
      this.radius * this.radius;

    const otherMass =
      other.radius * other.radius;

    const totalMass =
      thisMass + otherMass;

    this.x -=
      normalX *
      overlap *
      (otherMass / totalMass);

    this.y -=
      normalY *
      overlap *
      (otherMass / totalMass);

    other.x +=
      normalX *
      overlap *
      (thisMass / totalMass);

    other.y +=
      normalY *
      overlap *
      (thisMass / totalMass);

    const thisNormalVelocity =
      this.velocityX * normalX +
      this.velocityY * normalY;

    const otherNormalVelocity =
      other.velocityX * normalX +
      other.velocityY * normalY;

    if (
      thisNormalVelocity >
      otherNormalVelocity
    ) {
      const nextThisNormalVelocity =
        (
          thisNormalVelocity *
            (thisMass - otherMass) +
          2 *
            otherMass *
            otherNormalVelocity
        ) /
        totalMass;

      const nextOtherNormalVelocity =
        (
          otherNormalVelocity *
            (otherMass - thisMass) +
          2 *
            thisMass *
            thisNormalVelocity
        ) /
        totalMass;

      this.velocityX +=
        (
          nextThisNormalVelocity -
          thisNormalVelocity
        ) * normalX;

      this.velocityY +=
        (
          nextThisNormalVelocity -
          thisNormalVelocity
        ) * normalY;

      other.velocityX +=
        (
          nextOtherNormalVelocity -
          otherNormalVelocity
        ) * normalX;

      other.velocityY +=
        (
          nextOtherNormalVelocity -
          otherNormalVelocity
        ) * normalY;
    }

    this.handleScreenBounds();
    other.handleScreenBounds();

    return true;
  }

  private handleScreenBounds(): void {
    const minimumX = this.radius;
    const maximumX =
      GAME_WIDTH - this.radius;

    const minimumY =
      ASTEROID_AREA_TOP + this.radius;

    const maximumY =
      ASTEROID_AREA_BOTTOM - this.radius;

    if (this.x <= minimumX) {
      this.x = minimumX;

      this.velocityX =
        Math.abs(this.velocityX);
    }

    if (this.x >= maximumX) {
      this.x = maximumX;

      this.velocityX =
        -Math.abs(this.velocityX);
    }

    if (this.y <= minimumY) {
      this.y = minimumY;

      this.velocityY =
        Math.abs(this.velocityY);
    }

    if (this.y >= maximumY) {
      this.y = maximumY;

      this.velocityY =
        -Math.abs(this.velocityY);
    }
  }

  private createView(seed: number): void {
    const asteroid = new Graphics();

    const points =
      this.createPolygonPoints(seed);

    asteroid
      .poly(points)

      .fill({
        color: colors.asteroid.fill,
      })

      .stroke({
        color: colors.asteroid.stroke,
        width: asteroidVisual.strokeWidth,
      });

    this.drawCraters(
      asteroid,
      seed,
    );

    this.addChild(asteroid);
  }

  private createPolygonPoints(
    seed: number,
  ): number[] {
    const {
      pointCount,
      angleJitterRatio,
      minimumRadiusScale,
      radiusScaleRange,
    } = asteroidVisual;

    const angleStep =
      (Math.PI * 2) / pointCount;

    const points: number[] = [];

    for (
      let index = 0;
      index < pointCount;
      index += 1
    ) {
      const baseAngle =
        angleStep * index;

      const angleOffset =
        (
          this.pseudoRandom(
            seed + index * 2,
          ) - 0.5
        ) *
        angleStep *
        angleJitterRatio;

      const radiusScale =
        minimumRadiusScale +
        this.pseudoRandom(
          seed + index * 2 + 1,
        ) *
        radiusScaleRange;

      const pointRadius =
        this.radius * radiusScale;

      const angle =
        baseAngle + angleOffset;

      points.push(
        Math.cos(angle) * pointRadius,
        Math.sin(angle) * pointRadius,
      );
    }

    return points;
  }

  private drawCraters(
    graphics: Graphics,
    seed: number,
  ): void {
    const {
      positionScale,
      firstRadiusScale,
      secondRadiusScale,
      strokeWidth,
      seedOffsets,
    } = asteroidVisual.crater;

    const firstX =
      (
        this.pseudoRandom(seed + seedOffsets[0]) -
        0.5
      ) *
      this.radius *
      positionScale;

    const firstY =
      (
        this.pseudoRandom(seed + seedOffsets[1]) -
        0.5
      ) *
      this.radius *
      positionScale;

    const secondX =
      (
        this.pseudoRandom(seed + seedOffsets[2]) -
        0.5
      ) *
      this.radius *
      positionScale;

    const secondY =
      (
        this.pseudoRandom(seed + seedOffsets[3]) -
        0.5
      ) *
      this.radius *
      positionScale;

    graphics
      .circle(
        firstX,
        firstY,
        this.radius * firstRadiusScale,
      )

      .stroke({
        color: colors.asteroid.crater,
        width: strokeWidth,
      });

    graphics
      .circle(
        secondX,
        secondY,
        this.radius * secondRadiusScale,
      )

      .stroke({
        color: colors.asteroid.crater,
        width: strokeWidth,
      });
  }

  private pseudoRandom(seed: number): number {
    const value =
      Math.sin(seed * 12.9898) *
      43758.5453;

    return value - Math.floor(value);
  }
}
