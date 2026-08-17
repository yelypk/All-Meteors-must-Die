import {
  Container,
  Graphics,
} from "pixi.js";

import {
  GAME_WIDTH,
  PLAYER_HEIGHT,
  PLAYER_SPEED,
  PLAYER_WIDTH,
} from "../conf";

import { colors } from "../theme/palette";
import { playerVisual } from "../theme/visual";
import { Entity } from "./Entity";

export class Player extends Entity {
  public constructor(x: number, y: number) {
    super(PLAYER_WIDTH, PLAYER_HEIGHT);

    this.position.set(x, y);

    this.createView();
  }

  public update(
    deltaTime: number,
    horizontalDirection = 0,
  ): void {
    const nextX =
      this.x +
      horizontalDirection *
        PLAYER_SPEED *
        deltaTime;

    this.x = this.clampHorizontalPosition(nextX);
  }

  private clampHorizontalPosition(
    positionX: number,
  ): number {
    const halfWidth = PLAYER_WIDTH / 2;

    const minimumX = halfWidth;
    const maximumX = GAME_WIDTH - halfWidth;

    return Math.max(
      minimumX,
      Math.min(maximumX, positionX),
    );
  }

  private createView(): void {
    const view = new Container();

    view.y = playerVisual.viewOffsetY;

    const supports = this.createSupports();
    const body = this.createBody();
    const window = this.createWindow();

    view.addChild(
      supports,
      body,
      window,
    );

    this.addChild(view);
  }

  private createBody(): Graphics {
    const body = new Graphics();

    const {
      halfWidth,
      height: bodyHeight,
      bottomY,
      bottomInsetRatio,
      upperCurveRatio,
      lowerCurveRatio,
      strokeWidth,
    } = playerVisual.body;

    const topY = bottomY - bodyHeight;

    body
      .moveTo(0, bottomY)
      .lineTo(
        halfWidth * bottomInsetRatio,
        bottomY,
      )

      .bezierCurveTo(
        halfWidth,
        bottomY - bodyHeight * lowerCurveRatio,

        halfWidth,
        bottomY - bodyHeight * upperCurveRatio,

        0,
        topY,
      )

      .bezierCurveTo(
        -halfWidth,
        bottomY - bodyHeight * upperCurveRatio,

        -halfWidth,
        bottomY - bodyHeight * lowerCurveRatio,

        -halfWidth * bottomInsetRatio,
        bottomY,
      )

      .lineTo(0, bottomY)
      .closePath()

      .fill({
        color: colors.player.body,
      })

      .stroke({
        color: colors.player.bodyStroke,
        width: strokeWidth,
      });

    return body;
  }

  private createSupports(): Graphics {
    const supports = new Graphics();
    const {
      innerX,
      outerX,
      outerControlY,
      outerEndX,
      outerEndY,
      innerControlX,
      innerControlY,
      innerEndX,
      innerEndY,
      strokeWidth,
    } = playerVisual.support;

    supports
      .moveTo(innerX, 0)

      .quadraticCurveTo(
        outerX,
        outerControlY,
        outerEndX,
        outerEndY,
      )

      .quadraticCurveTo(
        innerControlX,
        innerControlY,
        innerEndX,
        innerEndY,
      )

      .closePath()

      .fill({
        color: colors.player.support,
      })

      .stroke({
        color: colors.player.supportStroke,
        width: strokeWidth,
      });

    supports
      .moveTo(-innerX, 0)

      .quadraticCurveTo(
        -outerX,
        outerControlY,
        -outerEndX,
        outerEndY,
      )

      .quadraticCurveTo(
        -innerControlX,
        innerControlY,
        -innerEndX,
        innerEndY,
      )

      .closePath()

      .fill({
        color: colors.player.support,
      })

      .stroke({
        color: colors.player.supportStroke,
        width: strokeWidth,
      });

    return supports;
  }

  private createWindow(): Graphics {
    const window = new Graphics();
    const { y, radius, strokeWidth } =
      playerVisual.window;

    window
      .circle(
        0,
        y,
        radius,
      )

      .fill({
        color: colors.player.window,
      })

      .stroke({
        color: colors.player.windowStroke,
        width: strokeWidth,
      });

    return window;
  }
} 