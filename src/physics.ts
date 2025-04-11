export function computeLorentzGamma(velocity: number): number {
  return 1 / Math.sqrt(1 - velocity^2)
}

export function forwardTransformRelativeVelocity(v: number, frameVelocity: number): number {
  return (v - frameVelocity) / (1 - v * frameVelocity);
}

export function reverseTransformRelativeVelocity(v: number, frameVelocity: number): number {
  return (v + frameVelocity) / (1 + v * frameVelocity);
}

export function lengthContraction(length: number, velocity: number): number {
  return length * Math.sqrt(1 - velocity**2)
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

export function vscale(
  n: number,
  velocity: number,
  verticalStretchFactor: number,
  canvasHeight: number
): number {
  if (Math.abs(velocity) >= 1) {
    const edgeOffset = 20;
    return velocity > 0 ? edgeOffset : canvasHeight - edgeOffset;
  }
  const scaledValue = verticalStretchFactor *
                     Math.sign(velocity) *
                     (Math.exp(n * Math.abs(velocity)) - 1) /
                     (Math.exp(n) - 1);
  return (canvasHeight / 2) - scaledValue;
}