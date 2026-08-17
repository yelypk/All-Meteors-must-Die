import { Container, Rectangle } from "pixi.js";

export abstract class Entity extends Container {
  private active = true;

  private readonly collisionBox = new Rectangle();

  protected constructor(
    private readonly hitboxWidth: number,
    private readonly hitboxHeight: number,
  ) {
    super();
  }

  public get isActive(): boolean {
    return this.active;
  }

  public get hitBox(): Rectangle {
    this.collisionBox.x = this.x - this.hitboxWidth / 2;
    this.collisionBox.y = this.y - this.hitboxHeight / 2;
    this.collisionBox.width = this.hitboxWidth;
    this.collisionBox.height = this.hitboxHeight;

    return this.collisionBox;
  }

  public abstract update(deltaTime: number): void;

  public removeFromGame(): void {
    if (!this.active) {
      return;
    }

    this.active = false;

    this.parent?.removeChild(this);

    this.destroy({
      children: true,
    });
  }
}