 export class InputManager {
  private readonly pressedKeys = new Set<string>();

  private attached = false;

  private shootRequested = false;

  public attach(): void {
    if (this.attached) {
      return;
    }

    window.addEventListener(
      "keydown",
      this.handleKeyDown,
    );

    window.addEventListener(
      "keyup",
      this.handleKeyUp,
    );

    window.addEventListener(
      "blur",
      this.handleWindowBlur,
    );

    this.attached = true;
  }

  public detach(): void {
    if (!this.attached) {
      return;
    }

    window.removeEventListener(
      "keydown",
      this.handleKeyDown,
    );

    window.removeEventListener(
      "keyup",
      this.handleKeyUp,
    );

    window.removeEventListener(
      "blur",
      this.handleWindowBlur,
    );

    this.reset();
    this.attached = false;
  }

  public get horizontalDirection(): number {
    const movingLeft =
      this.pressedKeys.has("ArrowLeft");

    const movingRight =
      this.pressedKeys.has("ArrowRight");

    return (
      Number(movingRight) -
      Number(movingLeft)
    );
  }

  public consumeShootRequest(): boolean {
    const requested = this.shootRequested;

    this.shootRequested = false;

    return requested;
  }

  private readonly handleKeyDown = (
    event: KeyboardEvent,
  ): void => {
    if (!this.isGameKey(event.code)) {
      return;
    }

    event.preventDefault();

    if (
      event.code === "Space" &&
      !event.repeat
    ) {
      this.shootRequested = true;
    }

    this.pressedKeys.add(event.code);
  };

  private readonly handleKeyUp = (
    event: KeyboardEvent,
  ): void => {
    if (!this.isGameKey(event.code)) {
      return;
    }

    this.pressedKeys.delete(event.code);
  };

  private readonly handleWindowBlur = (): void => {
    this.reset();
  };

  private reset(): void {
    this.pressedKeys.clear();
    this.shootRequested = false;
  }

  private isGameKey(code: string): boolean {
    return (
      code === "ArrowLeft" ||
      code === "ArrowRight" ||
      code === "Space"
    );
  }
}