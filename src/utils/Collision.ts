export interface CollisionBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function intersects(
  first: CollisionBox,
  second: CollisionBox,
): boolean {
  return (
    first.x <
      second.x + second.width &&

    first.x + first.width >
      second.x &&

    first.y <
      second.y + second.height &&

    first.y + first.height >
      second.y
  );
}