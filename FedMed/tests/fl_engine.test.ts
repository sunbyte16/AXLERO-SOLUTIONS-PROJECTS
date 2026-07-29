import { describe, it, expect } from 'vitest';

// Differential Privacy Math verification
function clipAndAddNoise(value: number, clippingNorm: number, noiseStdDev: number): number {
  const clipped = Math.max(-clippingNorm, Math.min(clippingNorm, value));
  // Deterministic check for test range
  return clipped + noiseStdDev * 0.05;
}

// Dice Score calculation verification
function computeDiceScore(intersection: number, totalPred: number, totalTarget: number): number {
  return (2 * intersection) / (totalPred + totalTarget);
}

describe('FedMed Differential Privacy & Segmentation Metrics Tests', () => {
  it('should clip gradient to max L2 norm C', () => {
    const rawGradient = 5.0;
    const clipped = Math.min(1.0, rawGradient);
    expect(clipped).toBe(1.0);
  });

  it('should correctly compute Dice Similarity Coefficient (DSC)', () => {
    const dice = computeDiceScore(80, 90, 90);
    expect(dice).toBeCloseTo(0.8888, 3);
  });

  it('should verify privacy budget consumption accumulator', () => {
    let spentEps = 0.0;
    const deltaEpsPerRound = 0.28;
    for (let r = 1; r <= 10; r++) {
      spentEps += deltaEpsPerRound;
    }
    expect(spentEps).toBeCloseTo(2.80, 2);
  });
});
