import {
  Container,
  Graphics,
  Text,
  TextStyle,
} from "pixi.js";

import {
  GAME_HEIGHT,
  GAME_WIDTH,
} from "../conf";

import { colors } from "../theme/palette";
import {
  resultVisual,
  typography,
} from "../theme/visual";

interface ResultMessageOptions {
  title: string;
  description: string;
  titleColor: number;
  onRestart: () => void;
}

export class ResultMessage extends Container {
  private readonly buttonBackground =
    new Graphics();

  public constructor(
    options: ResultMessageOptions,
  ) {
    super();

    this.createOverlay();
    this.createPanel();
    this.createTitle(
      options.title,
      options.titleColor,
    );
    this.createDescription(
      options.description,
    );
    this.createRestartButton(
      options.onRestart,
    );
  }

  private createOverlay(): void {
    const overlay = new Graphics();

    overlay
      .rect(0, 0, GAME_WIDTH, GAME_HEIGHT)
      .fill({
        color: colors.result.overlay,
        alpha: resultVisual.overlayAlpha,
      });

    this.addChild(overlay);
  }

  private createPanel(): void {
    const {
      width,
      height,
      radius,
      alpha,
      strokeWidth,
    } = resultVisual.panel;

    const panel = new Graphics();

    panel
      .roundRect(
        GAME_WIDTH / 2 - width / 2,
        GAME_HEIGHT / 2 - height / 2,
        width,
        height,
        radius,
      )
      .fill({
        color: colors.result.panel,
        alpha,
      })
      .stroke({
        color: colors.result.panelStroke,
        width: strokeWidth,
      });

    this.addChild(panel);
  }

  private createTitle(
    value: string,
    color: number,
  ): void {
    const title = new Text({
      text: value,
      style: new TextStyle({
        fontFamily: typography.fontFamily,
        fontSize: resultVisual.title.fontSize,
        fontWeight: typography.fontWeight,
        fill: color,
        align: "center",
      }),
    });

    title.anchor.set(0.5);
    title.position.set(
      GAME_WIDTH / 2,
      GAME_HEIGHT / 2 +
        resultVisual.title.offsetY,
    );

    this.addChild(title);
  }

  private createDescription(
    value: string,
  ): void {
    const description = new Text({
      text: value,
      style: new TextStyle({
        fontFamily: typography.fontFamily,
        fontSize:
          resultVisual.description.fontSize,
        fill: colors.result.description,
        align: "center",
      }),
    });

    description.anchor.set(0.5);
    description.position.set(
      GAME_WIDTH / 2,
      GAME_HEIGHT / 2 +
        resultVisual.description.offsetY,
    );

    this.addChild(description);
  }

  private createRestartButton(
    onRestart: () => void,
  ): void {
    const button = new Container();

    button.position.set(
      GAME_WIDTH / 2,
      GAME_HEIGHT / 2 +
        resultVisual.button.offsetY,
    );

    button.eventMode = "static";
    button.cursor = "pointer";

    this.drawButton(colors.result.button);

    const label = new Text({
      text: "PLAY AGAIN",
      style: new TextStyle({
        fontFamily: typography.fontFamily,
        fontSize: resultVisual.button.fontSize,
        fontWeight: typography.fontWeight,
        fill: colors.result.buttonText,
      }),
    });

    label.anchor.set(0.5);

    button.addChild(
      this.buttonBackground,
      label,
    );

    button.on("pointerover", () => {
      this.drawButton(colors.result.buttonHover);
    });

    button.on("pointerout", () => {
      this.drawButton(colors.result.button);
    });

    button.on("pointertap", onRestart);

    this.addChild(button);
  }

  private drawButton(color: number): void {
    const {
      width,
      height,
      radius,
    } = resultVisual.button;

    this.buttonBackground
      .clear()
      .roundRect(
        -width / 2,
        -height / 2,
        width,
        height,
        radius,
      )
      .fill({ color });
  }
}
