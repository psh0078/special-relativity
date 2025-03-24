export function computeLorentzGamma(beta: number): number {
  return 1 / Math.sqrt(1 - beta^2)
}

export function computeRelativeVelocity(v1: number, v2: number): number {
  return (v1 - v2) / (1 - v1 * v2);
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

export function convertToLabVelocity(v: number): number {
  return computeRelativeVelocity(0, v);
}
