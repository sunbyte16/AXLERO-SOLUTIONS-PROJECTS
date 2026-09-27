/**
 * FedMed Coordinate-wise Trimmed Mean Byzantine-Robust Aggregation Strategy
 * Prunes statistical outlier weights submitted by compromised or noisy hospital silos.
 */

export function coordinateWiseTrimmedMean(
  clientVectors: number[][],
  betaTrimRatio: number = 0.1
): number[] {
  if (clientVectors.length === 0) return [];
  const numClients = clientVectors.length;
  const vectorDim = clientVectors[0].length;
  const trimCount = Math.floor(numClients * betaTrimRatio);

  const aggregated: number[] = new Array(vectorDim).fill(0);

  for (let d = 0; d < vectorDim; d++) {
    const coords = clientVectors.map(vec => vec[d]).sort((a, b) => a - b);
    // Slice off lowest and highest trimCount values
    const retained = coords.slice(trimCount, numClients - trimCount);
    const mean = retained.reduce((acc, val) => acc + val, 0) / retained.length;
    aggregated[d] = Number(mean.toFixed(6));
  }

  return aggregated;
}
