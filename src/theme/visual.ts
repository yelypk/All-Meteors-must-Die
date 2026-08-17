export const typography = {
  fontFamily: "monospace",
  fontWeight: "bold",
} as const;

export const playerVisual = {
  viewOffsetY: 28,
  body: {
    halfWidth: 38,
    height: 120,
    bottomY: 34,
    bottomInsetRatio: 0.3,
    upperCurveRatio: 0.78,
    lowerCurveRatio: 0.2,
    strokeWidth: 4,
  },
  support: {
    innerX: 26,
    outerX: 58,
    outerControlY: 10,
    outerEndX: 44,
    outerEndY: 34,
    innerControlX: 50,
    innerControlY: 13,
    innerEndX: 20,
    innerEndY: 18,
    strokeWidth: 2,
  },
  window: {
    y: -37,
    radius: 12,
    strokeWidth: 2,
  },
} as const;

export const asteroidVisual = {
  pointCount: 12,
  angleJitterRatio: 0.45,
  minimumRadiusScale: 0.68,
  radiusScaleRange: 0.32,
  strokeWidth: 3,
  crater: {
    positionScale: 0.65,
    firstRadiusScale: 0.14,
    secondRadiusScale: 0.09,
    strokeWidth: 2,
    seedOffsets: [100, 101, 102, 103],
  },
} as const;

export const bossVisual = {
  body: {
    centerY: 8,
    radiusY: 30,
    strokeWidth: 4,
  },
  cockpit: {
    centerY: -16,
    radiusX: 48,
    radiusY: 32,
    strokeWidth: 4,
  },
  lights: {
    sideX: 52,
    sideY: 14,
    centerY: 22,
    radius: 7,
  },
  cannon: {
    x: -42,
    y: 34,
    width: 84,
    height: 15,
    radius: 7,
  },
  healthBar: {
    width: 150,
    height: 14,
    offsetY: 28,
    radius: 7,
    strokeWidth: 2,
    highThreshold: 0.5,
    mediumThreshold: 0.25,
  },
} as const;

export const hudVisual = {
  fontSize: 24,
  top: 20,
  sidePadding: 24,
  warningSeconds: 10,
} as const;

export const resultVisual = {
  overlayAlpha: 0.76,
  panel: {
    width: 520,
    height: 290,
    radius: 24,
    alpha: 0.98,
    strokeWidth: 3,
  },
  title: {
    fontSize: 54,
    offsetY: -72,
  },
  description: {
    fontSize: 22,
    offsetY: 0,
  },
  button: {
    offsetY: 82,
    width: 210,
    height: 60,
    radius: 14,
    fontSize: 24,
  },
} as const;
