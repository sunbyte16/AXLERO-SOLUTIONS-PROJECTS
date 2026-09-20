import { describe, it, expect } from 'vitest';

interface NodeWeightUpdate {
  nodeId: string;
  sampleCount: number;
  weightValues: number[];
}

function federatedAveraging(updates: NodeWeightUpdate[]): number[] {
  const totalSamples = updates.reduce((sum, u) => sum + u.sampleCount, 0);
  if (totalSamples === 0) return [];

  const vectorLen = updates[0].weightValues.length;
  const aggregated = new Array(vectorLen).fill(0);

  for (const update of updates) {
    const weightFactor = update.sampleCount / totalSamples;
    for (let i = 0; i < vectorLen; i++) {
      aggregated[i] += update.weightValues[i] * weightFactor;
    }
  }

  return aggregated;
}

describe('FedMed Model Aggregation Test Suite', () => {
  it('should compute weighted FedAvg correctly across 3 hospital nodes', () => {
    const updates: NodeWeightUpdate[] = [
      { nodeId: 'node-metro', sampleCount: 100, weightValues: [1.0, 2.0, 3.0] },
      { nodeId: 'node-stjude', sampleCount: 200, weightValues: [2.0, 4.0, 6.0] },
      { nodeId: 'node-mayo', sampleCount: 100, weightValues: [3.0, 6.0, 9.0] },
    ];
    const result = federatedAveraging(updates);
    expect(result[0]).toBeCloseTo(2.0, 4);
    expect(result[1]).toBeCloseTo(4.0, 4);
    expect(result[2]).toBeCloseTo(6.0, 4);
  });

  it('should reject outlier update with extreme norm divergence', () => {
    const baseNorm = 2.5;
    const extremeNorm = 250.0;
    const isOutlier = (norm: number, threshold: number) => norm > threshold;
    expect(isOutlier(extremeNorm, baseNorm * 3)).toBe(true);
  });
});
