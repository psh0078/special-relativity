export function computeLorentzGamma(velocity: number): number {
  return 1 / Math.sqrt(1 - velocity**2)
}

export function forwardTransformRelativeVelocity(v: number, frameVelocity: number): number {
  return (v - frameVelocity) / (1 - v * frameVelocity);
}

// back to lab frame
export function reverseTransformRelativeVelocity(v: number, frameVelocity: number): number {
  return (v + frameVelocity) / (1 + v * frameVelocity);
}

export function lengthContraction(length: number, velocity: number): number {
  return length / computeLorentzGamma(velocity)
}

export function forwardTransformRelativePosition(position: number, velocity: number, time: number): number {
  return computeLorentzGamma(velocity) * (position - velocity * time)
}

export function reverseTransformRelativePosition(position: number, velocity: number, time: number): number {
  return computeLorentzGamma(velocity) * (position + velocity * time)
}

export function forwardTransformRelativeTime(time: number, velocity: number, position: number): number {
  return computeLorentzGamma(velocity) * (time - velocity * position)
}

export function reverseTransformRelativeTime(time: number, velocity: number, position: number): number {
  return computeLorentzGamma(velocity) * (time + velocity * position)
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