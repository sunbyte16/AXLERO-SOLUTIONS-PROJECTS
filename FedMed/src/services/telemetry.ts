/**
 * FedMed Federated Learning Telemetry & Convergence Utilities
 */

import { NodeConvergenceTelemetry } from '../types';

/**
 * Calculates the loss delta between successive federated training rounds.
 */
export function calculateConvergenceDelta(previousLoss: number, currentLoss: number): number {
  if (previousLoss === 0) return 0;
  return Number(((previousLoss - currentLoss) / previousLoss).toFixed(4));
}

/**
 * Computes estimated privacy budget consumption velocity per round.
 */
export function computePrivacyBudgetVelocity(spentEps: number, roundsCompleted: number): number {
  if (roundsCompleted <= 0) return 0;
  return Number((spentEps / roundsCompleted).toFixed(3));
}

/**
 * Evaluates node reliability based on historical Dice score, CPU load, and VRAM availability.
 */
export function evaluateNodeReliabilityScore(
  localDice: number,
  cpuUsagePercent: number,
  vramUsageGb: number,
  totalVramGb: number = 24
): number {
  const diceFactor = Math.min(1.0, Math.max(0.0, localDice));
  const cpuFactor = Math.max(0.0, 1.0 - cpuUsagePercent / 100);
  const vramFactor = Math.max(0.0, 1.0 - vramUsageGb / totalVramGb);

  // Weighted score (0.0 to 1.0)
  const score = (diceFactor * 0.5) + (cpuFactor * 0.25) + (vramFactor * 0.25);
  return Number(score.toFixed(3));
}

/**
 * Builds telemetry packet for hospital node round performance.
 */
export function buildNodeTelemetryPacket(
  nodeId: string,
  round: number,
  prevLoss: number,
  currentLoss: number,
  dice: number,
  cpuUsage: number,
  vramUsage: number
): NodeConvergenceTelemetry {
  const lossDelta = calculateConvergenceDelta(prevLoss, currentLoss);
  const reliabilityScore = evaluateNodeReliabilityScore(dice, cpuUsage, vramUsage);

  return {
    nodeId,
    round,
    lossDelta,
    convergenceRate: Math.max(0, lossDelta),
    reliabilityScore,
    timestamp: new Date().toISOString(),
  };
}
