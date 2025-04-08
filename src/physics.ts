export function computeLorentzGamma(beta: number): number {
  return 1 / Math.sqrt(1 - beta^2)
}

export function forwardTransformRelativeVelocity(v: number, frameVelocity: number): number {
  return (v - frameVelocity) / (1 - v * frameVelocity);
}

export function reverseTransformRelativeVelocity(v: number, frameVelocity: number): number {
  return (v + frameVelocity) / (1 + v * frameVelocity);
}

export function positionCalculator(
  inputPosition: number,
  currentFrame: number,
  objectVelocity: number
): { labPosition: number, currentPosition: number } {
  let labPosition: number;
  let currentPosition: number;

  const isLabFrame = currentFrame === 0;

  if (isLabFrame) {
    labPosition = inputPosition;
    currentPosition = inputPosition * Math.sqrt(1 - currentFrame**2) /
                     (1 - objectVelocity * currentFrame);
  } else {
    currentPosition = inputPosition;
    labPosition = inputPosition * (1 - objectVelocity * currentFrame) /
                 Math.sqrt(1 - currentFrame**2);
  }
  return { labPosition, currentPosition };
}