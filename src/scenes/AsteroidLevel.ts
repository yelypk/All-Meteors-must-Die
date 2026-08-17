import {
  ASTEROID_AREA_BOTTOM,
  ASTEROID_AREA_TOP,
  ASTEROID_COUNT,
  ASTEROID_MAX_RADIUS,
  ASTEROID_MAX_SPEED,
  ASTEROID_MIN_RADIUS,
  ASTEROID_MIN_SPEED,
  ASTEROID_SPAWN_GAP,
  GAME_WIDTH,
} from "../conf";

import type { InputManager } from "../core/InputManager";
import { Asteroid } from "../entities/Asteroid";
import { intersects } from "../utils/Collision";

import { Scene } from "./Scene";
import type { SceneResult } from "./Scene";

interface Position {
  x: number;
  y: number;
}

export class AsteroidLevel extends Scene {
  private readonly asteroids: Asteroid[] = [];

  public constructor(
    inputManager: InputManager,
    onComplete: (result: SceneResult) => void,
  ) {
    super(1, inputManager, onComplete);
    this.createAsteroids();
  }

  protected updateLevel(
    deltaTime: number,
  ): void {
    this.updateAsteroids(deltaTime);
    this.resolveAsteroidCollisions();
    this.resolveBulletAsteroidCollisions();

    if (this.asteroids.length === 0) {
      this.complete({
        type: "next-level",
        description: "",
      });
    }
  }

  private createAsteroids(): void {
    for (
      let index = 0;
      index < ASTEROID_COUNT;
      index += 1
    ) {
      const radius = this.randomBetween(
        ASTEROID_MIN_RADIUS,
        ASTEROID_MAX_RADIUS,
      );

      const position =
        this.findSpawnPosition(radius);

      const asteroid = new Asteroid({
        x: position.x,
        y: position.y,
        radius,
        speed: this.randomBetween(
          ASTEROID_MIN_SPEED,
          ASTEROID_MAX_SPEED,
        ),
        directionAngle: this.randomBetween(
          0,
          Math.PI * 2,
        ),
        rotationSpeed:
          (Math.random() < 0.5 ? -1 : 1) *
          this.randomBetween(0.15, 0.5),
        seed: Math.floor(
          Math.random() * 1_000_000,
        ),
      });

      this.asteroids.push(asteroid);
      this.addGameObject(asteroid);
    }
  }

  private updateAsteroids(
    deltaTime: number,
  ): void {
    for (const asteroid of this.asteroids) {
      if (asteroid.isActive) {
        asteroid.update(deltaTime);
      }
    }
  }

  private resolveAsteroidCollisions(): void {
    const maximumIterations = 4;

    for (
      let iteration = 0;
      iteration < maximumIterations;
      iteration += 1
    ) {
      let collisionFound = false;

      for (
        let firstIndex = 0;
        firstIndex < this.asteroids.length;
        firstIndex += 1
      ) {
        for (
          let secondIndex = firstIndex + 1;
          secondIndex < this.asteroids.length;
          secondIndex += 1
        ) {
          collisionFound =
            this.asteroids[
              firstIndex
            ].resolveCollisionWith(
              this.asteroids[secondIndex],
            ) || collisionFound;
        }
      }

      if (!collisionFound) {
        break;
      }
    }
  }

  private resolveBulletAsteroidCollisions(): void {
    for (
      let bulletIndex = this.bullets.length - 1;
      bulletIndex >= 0;
      bulletIndex -= 1
    ) {
      const bullet = this.bullets[bulletIndex];

      for (
        let asteroidIndex =
          this.asteroids.length - 1;
        asteroidIndex >= 0;
        asteroidIndex -= 1
      ) {
        const asteroid =
          this.asteroids[asteroidIndex];

        if (
          !intersects(
            bullet.hitBox,
            asteroid.hitBox,
          )
        ) {
          continue;
        }

        bullet.removeFromGame();
        asteroid.removeFromGame();

        this.bullets.splice(bulletIndex, 1);
        this.asteroids.splice(asteroidIndex, 1);

        break;
      }
    }
  }

  private findSpawnPosition(
    radius: number,
  ): Position {
    const maximumAttempts = 300;

    for (
      let attempt = 0;
      attempt < maximumAttempts;
      attempt += 1
    ) {
      const candidate: Position = {
        x: this.randomBetween(
          radius + ASTEROID_SPAWN_GAP,
          GAME_WIDTH -
            radius -
            ASTEROID_SPAWN_GAP,
        ),
        y: this.randomBetween(
          ASTEROID_AREA_TOP +
            radius +
            ASTEROID_SPAWN_GAP,
          ASTEROID_AREA_BOTTOM -
            radius -
            ASTEROID_SPAWN_GAP,
        ),
      };

      if (!this.overlapsExisting(candidate, radius)) {
        return candidate;
      }
    }

    return this.createFallbackPosition(radius);
  }

  private overlapsExisting(
    position: Position,
    radius: number,
  ): boolean {
    return this.asteroids.some((asteroid) => {
      const distance = Math.hypot(
        asteroid.x - position.x,
        asteroid.y - position.y,
      );

      return (
        distance <
        asteroid.radius +
          radius +
          ASTEROID_SPAWN_GAP
      );
    });
  }

  private createFallbackPosition(
    radius: number,
  ): Position {
    const index = this.asteroids.length;
    const columnCount = 4;
    const rowCount = 2;
    const row = Math.floor(index / columnCount);
    const column = index % columnCount;

    const x =
      (GAME_WIDTH / (columnCount + 1)) *
      (column + 1);

    const areaHeight =
      ASTEROID_AREA_BOTTOM -
      ASTEROID_AREA_TOP;

    const y =
      ASTEROID_AREA_TOP +
      (areaHeight / (rowCount + 1)) *
        (row + 1);

    return {
      x: this.clamp(
        x,
        radius + ASTEROID_SPAWN_GAP,
        GAME_WIDTH -
          radius -
          ASTEROID_SPAWN_GAP,
      ),
      y: this.clamp(
        y,
        ASTEROID_AREA_TOP +
          radius +
          ASTEROID_SPAWN_GAP,
        ASTEROID_AREA_BOTTOM -
          radius -
          ASTEROID_SPAWN_GAP,
      ),
    };
  }

  private randomBetween(
    minimum: number,
    maximum: number,
  ): number {
    return (
      minimum +
      Math.random() * (maximum - minimum)
    );
  }

  private clamp(
    value: number,
    minimum: number,
    maximum: number,
  ): number {
    return Math.max(
      minimum,
      Math.min(maximum, value),
    );
  }
}
