import {
  Application,
  Container,
} from "pixi.js";

import {
  GAME_HEIGHT,
  GAME_WIDTH,
} from "../conf";

import { AsteroidLevel } from "../scenes/AsteroidLevel";
import { BossLevel } from "../scenes/BossLevel";
import type {
  Scene,
  SceneResult,
} from "../scenes/Scene";
import { colors } from "../theme/palette";
import { ResultMessage } from "../ui/ResultMessage";

import { InputManager } from "./InputManager";

export class Game {
  private application: Application | null = null;

  private currentScene: Scene | null = null;

  private resultMessage: ResultMessage | null = null;

  private readonly inputManager =
    new InputManager();

  public async start(): Promise<void> {
    if (this.application !== null) {
      throw new Error(
        "Game has already been started",
      );
    }

    const application = new Application();

    await application.init({
      width: GAME_WIDTH,
      height: GAME_HEIGHT,
      backgroundColor: colors.game.background,
      antialias: true,
      autoDensity: true,
      resolution: window.devicePixelRatio || 1,
    });

    this.application = application;

    this.configureCanvas();

    document.body.appendChild(
      application.canvas,
    );

    this.inputManager.attach();
    this.startAsteroidLevel();

    application.ticker.add((ticker) => {
      const deltaTime = Math.min(
        ticker.deltaMS / 1000,
        0.05,
      );

      this.currentScene?.update(deltaTime);
    });
  }

  public get stage(): Container {
    if (this.application === null) {
      throw new Error(
        "Game has not been started",
      );
    }

    return this.application.stage;
  }

  public destroy(): void {
    this.inputManager.detach();

    if (this.application === null) {
      return;
    }

    this.application.destroy(true, {
      children: true,
    });

    this.application = null;
    this.currentScene = null;
    this.resultMessage = null;
  }

  private startAsteroidLevel(): void {
    const scene = new AsteroidLevel(
      this.inputManager,
      (result) => {
        this.handleSceneResult(result);
      },
    );

    this.replaceScene(scene);
  }

  private startBossLevel(): void {
    const scene = new BossLevel(
      this.inputManager,
      (result) => {
        this.handleSceneResult(result);
      },
    );

    this.replaceScene(scene);
  }

  private replaceScene(scene: Scene): void {
    if (this.application === null) {
      return;
    }

    if (this.currentScene !== null) {
      this.currentScene.removeFromParent();
      this.currentScene.destroy({
        children: true,
      });
    }

    this.currentScene = scene;
    this.application.stage.addChild(scene);
  }

  private handleSceneResult(
    result: SceneResult,
  ): void {
    if (result.type === "next-level") {
      this.startBossLevel();
      return;
    }

    this.showResult(result);
  }

  private showResult(result: SceneResult): void {
    if (this.application === null) {
      return;
    }

    const won = result.type === "win";

    this.resultMessage = new ResultMessage({
      title: won ? "YOU WIN" : "YOU LOSE",
      description: result.description,
      titleColor: won
        ? colors.result.win
        : colors.result.lose,
      onRestart: () => {
        this.restartGame();
      },
    });

    this.application.stage.addChild(
      this.resultMessage,
    );
  }

  private restartGame(): void {
    if (this.resultMessage !== null) {
      this.resultMessage.removeFromParent();
      this.resultMessage.destroy({
        children: true,
      });

      this.resultMessage = null;
    }

    this.inputManager.consumeShootRequest();
    this.startAsteroidLevel();
  }

  private configureCanvas(): void {
    if (this.application === null) {
      return;
    }

    const canvas = this.application.canvas;

    canvas.id = "game-canvas";

    canvas.setAttribute(
      "aria-label",
      "All Meteors Must Die game",
    );

    canvas.style.display = "block";
    canvas.style.width = "100%";
    canvas.style.maxWidth = `${GAME_WIDTH}px`;
    canvas.style.height = "auto";
    canvas.style.margin = "0 auto";
  }
}
