/**
 * FedMed Differential Privacy Numerical Accountant
 * Implements adaptive gradient clipping and numerical stability for high-dimensional tensors.
 */

export function computeL2Norm(vector: number[]): number {
  let sumSq = 0.0;
  for (let i = 0; i < vector.length; i++) {
    sumSq += vector[i] * vector[i];
  }
  return Math.sqrt(sumSq);
}

export function clipVectorL2(vector: number[], maxNorm: number = 1.0): { clipped: number[]; scaleFactor: number } {
  const norm = computeL2Norm(vector);
  if (norm <= maxNorm || norm === 0) {
    return { clipped: [...vector], scaleFactor: 1.0 };
  }
  const scale = maxNorm / norm;
  const clipped = vector.map(v => v * scale);
  return { clipped, scaleFactor: scale };
}

export function sampleGaussianNoise(dimension: number, sigma: number): number[] {
  // Box-Muller transform for Gaussian random variable generation
  const noise: number[] = [];
  for (let i = 0; i < dimension; i += 2) {
    const u1 = Math.max(1e-12, Math.random());
    const u2 = Math.random();
    const mag = sigma * Math.sqrt(-2.0 * Math.log(u1));
    noise.push(mag * Math.cos(2.0 * Math.PI * u2));
    if (i + 1 < dimension) {
      noise.push(mag * Math.sin(2.0 * Math.PI * u2));
    }
  }
  return noise;
}
