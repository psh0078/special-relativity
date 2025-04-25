export function computeLorentzGamma(velocity: number): number {
  return 1 / Math.sqrt(1 - velocity**2)
}

export function lengthContraction(length: number, velocity: number): number {
  return length / computeLorentzGamma(velocity)
}

export function transformVelocityToFrame(v: number, frameVelocity: number): number {
  return (v - frameVelocity) / (1 - v * frameVelocity);
}

export function transformVelocityToLab(v: number, frameVelocity: number): number {
  return (v + frameVelocity) / (1 + v * frameVelocity);
}

export function transformPositionToFrame(position: number, velocity: number, time: number): number {
  return computeLorentzGamma(velocity) * (position - velocity * time);
}

export function transformPositionToLab(position: number, velocity: number, time: number): number {
  return computeLorentzGamma(velocity) * (position + velocity * time);
}

export function transformTimeToFrame(time: number, velocity: number, position: number): number {
  return computeLorentzGamma(velocity) * (time - velocity * position);
}

export function transformTimeToLab(time: number, velocity: number, position: number): number {
  return computeLorentzGamma(velocity) * (time + velocity * position);
}

export function calculateVelocityFromPosition(
  currentX: number,
  x0: number,
  currentTime: number,
  t0: number
): number {
  if (currentTime === t0) return 0;
  return (currentX - x0) / (currentTime - t0);
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