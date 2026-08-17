/// <reference types="vite/client" />

import { Game } from "./core/game";

let activeGame: Game | null = null;

async function bootstrap(): Promise<void> {
  const game = new Game();

  activeGame = game;
  await game.start();
}

function destroyGame(): void {
  activeGame?.destroy();
  activeGame = null;
}

function showStartupError(message: string): void {
  const main = document.createElement("main");
  const title = document.createElement("h1");
  const description = document.createElement("p");

  title.textContent = "Game initialization error";
  description.textContent = message;

  main.append(title, description);
  document.body.replaceChildren(main);
}

const handlePageHide = (
  event: PageTransitionEvent,
): void => {
  if (!event.persisted) {
    destroyGame();
  }
};

window.addEventListener("pagehide", handlePageHide);

import.meta.hot?.dispose(() => {
  window.removeEventListener(
    "pagehide",
    handlePageHide,
  );

  destroyGame();
});

bootstrap().catch((error: unknown) => {
  console.error("Failed to start the game:", error);

  const message =
    error instanceof Error
      ? error.message
      : "Unknown initialization error";

  destroyGame();
  showStartupError(message);
});