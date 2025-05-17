// Scale factor for converting between physical units and pixels
// maybe rename to SPACING_SCALE_FACTOR
export const VELOCITY_SCALE_FACTOR = 80;

// Vertical stretch factor for velocity visualization
export const VELOCITY_VERTICAL_STRETCH_FACTOR = 150;

export const DEFAULT_OBJECT_DIMENSIONS = {
  FLASH: {
    width: 20,
    height: 20
  },
  CLOCK: {
    width: 40,
    height: 40
  },
  BOX: {
    width: 80,
    height: 20
  }
} as const;

export const DEFAULT_TIME_CONTROLS_PARAMS = {
  tMin: 0,
  tMax: 10,
  tStep: 0.1
} as const;
