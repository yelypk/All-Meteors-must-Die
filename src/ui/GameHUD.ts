import {
  Container,
  Text,
  TextStyle,
} from "pixi.js";

import {
  GAME_WIDTH,
  MAX_PLAYER_SHOTS,
} from "../conf";

import { colors } from "../theme/palette";
import {
  hudVisual,
  typography,
} from "../theme/visual";

export class GameHUD extends Container {
  private readonly levelText: Text;
  private readonly timerText: Text;
  private readonly shotsText: Text;

  public constructor() {
    super();

    const commonStyle = new TextStyle({
      fontFamily: typography.fontFamily,
      fontSize: hudVisual.fontSize,
      fontWeight: typography.fontWeight,
      fill: colors.hud.text,
    });

    this.levelText = new Text({
      text: "LEVEL 1",
      style: commonStyle,
    });

    this.timerText = new Text({
      text: "TIME: 60",
      style: commonStyle,
    });

    this.shotsText = new Text({
      text: `SHOTS: ${MAX_PLAYER_SHOTS}`,
      style: commonStyle,
    });

    this.configurePositions();

    this.addChild(
      this.levelText,
      this.timerText,
      this.shotsText,
    );
  }

  public updateTime(
    secondsRemaining: number,
  ): void {
    const roundedSeconds =
      Math.max(
        0,
        Math.ceil(secondsRemaining),
      );

    this.timerText.text =
      `TIME: ${roundedSeconds}`;

    this.timerText.style.fill =
      roundedSeconds <= hudVisual.warningSeconds
        ? colors.hud.warning
        : colors.hud.text;
  }

  public updateShots(
    shotsRemaining: number,
  ): void {
    this.shotsText.text =
      `SHOTS: ${Math.max(0, shotsRemaining)}`;
  }

  public setLevel(level: number): void {
    this.levelText.text =
      `LEVEL ${level}`;
  }

  private configurePositions(): void {
    this.levelText.position.set(
      hudVisual.sidePadding,
      hudVisual.top,
    );

    this.timerText.anchor.set(
      0.5,
      0,
    );

    this.timerText.position.set(
      GAME_WIDTH / 2,
      hudVisual.top,
    );

    this.shotsText.anchor.set(
      1,
      0,
    );

    this.shotsText.position.set(
      GAME_WIDTH - hudVisual.sidePadding,
      hudVisual.top,
    );
  }
}