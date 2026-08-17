# All Meteors Must Die!

A two-level 1280 × 720 space shooter implemented with TypeScript and PixiJS.

## Run locally

```bash
npm install
npm run dev
```

Open the displayed local URL. Use **Arrow Left / Arrow Right** to move and **Space** to fire.

## Rules

- Level 1: destroy eight asteroids with at most ten shots in 60 seconds.
- Level 2: hit the guardian four times with a fresh ten-shot magazine in 60 seconds.
- The guardian alternates between moving and stationary states and fires every two seconds.
- Player and enemy bullets cancel each other. A guardian bullet that reaches the ship ends the game.
- The final fired projectile is allowed to finish its flight before the no-ammo loss is evaluated.

## Architecture

- `SpaceShooter` owns the game loop, level transitions, timers, collision pass, and UI state.
- `Entity` is the base class for every object with a hit box and lifecycle.
- `PlayerShip`, `Asteroid`, `Boss`, and `Projectile` encapsulate drawing and behavior.
- `KeyboardInput` isolates browser input from game rules.
- `algorithms.ts` contains pure reusable algorithms: AABB intersection, range clamping, and deterministic row distribution.

Collision detection uses axis-aligned bounding boxes. With `P` active player projectiles, `A` asteroids, and `E` enemy projectiles, the straightforward collision pass is `O(P × (A + E))`. The intentionally small entity caps keep this predictable; a spatial grid would be the natural extension for hundreds of entities.

