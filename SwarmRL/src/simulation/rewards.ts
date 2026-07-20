/**
 * SwarmRL - Modular Multi-Agent Reward Engine
 */

import { DroneAgentState, RewardWeights, Vector3D } from '../types';

export const DEFAULT_REWARD_WEIGHTS: RewardWeights = {
  exploration: 5.0,        // Per newly discovered cell
  collision_penalty: -50.0,// Severe penalty on impact
  boundary_penalty: -15.0, // On wall hit
  cooperation: 1.5,        // For maintaining optimal swarm dispersion
  efficiency: 0.5,         // For steady progress vs idling
  safety_buffer: -2.0,     // Minor penalty when dangerously close to neighbors
};

export class RewardEngine {
  private weights: RewardWeights;

  constructor(weights: RewardWeights = DEFAULT_REWARD_WEIGHTS) {
    this.weights = weights;
  }

  public setWeights(weights: RewardWeights) {
    this.weights = { ...weights };
  }

  /**
   * Computes multi-component scalar reward for an individual agent
   */
  public calculateAgentReward(
    agent: DroneAgentState,
    allAgents: DroneAgentState[],
    newlyExploredCells: number,
    hasCollided: boolean,
    hitBoundary: boolean,
    envSize: { width: number; length: number; height: number }
  ): { totalReward: number; breakdown: Record<string, number> } {
    let explorationR = newlyExploredCells * this.weights.exploration;

    let collisionR = hasCollided ? this.weights.collision_penalty : 0;
    let boundaryR = hitBoundary ? this.weights.boundary_penalty : 0;

    // Cooperation / Dispersion Reward:
    // Compute distance to nearest neighbor drone. Reward if distance is in optimal range [5m, 20m]
    let cooperationR = 0;
    let safetyBufferR = 0;

    let minNeighborDist = Infinity;
    for (const other of allAgents) {
      if (other.agent_id !== agent.agent_id && other.status !== 'COLLIDED') {
        const dx = agent.position.x - other.position.x;
        const dy = agent.position.y - other.position.y;
        const dz = agent.position.z - other.position.z;
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (dist < minNeighborDist) {
          minNeighborDist = dist;
        }
      }
    }

    if (minNeighborDist !== Infinity) {
      if (minNeighborDist < 3.0) {
        // Too close - danger of collision!
        safetyBufferR = this.weights.safety_buffer * (3.0 - minNeighborDist);
      } else if (minNeighborDist >= 5.0 && minNeighborDist <= 25.0) {
        // Healthy search spacing
        cooperationR = this.weights.cooperation;
      }
    }

    // Efficiency Reward:
    // Reward non-zero speed in forward flight, penalize stationary hover or excessive spinning
    const speed = Math.sqrt(
      agent.velocity.x * agent.velocity.x +
      agent.velocity.y * agent.velocity.y +
      agent.velocity.z * agent.velocity.z
    );

    let efficiencyR = 0;
    if (speed > 1.0) {
      efficiencyR = (speed / 12.0) * this.weights.efficiency;
    } else {
      efficiencyR = -0.1; // minor penalty for stationary hovering without exploring
    }

    const totalReward = explorationR + collisionR + boundaryR + cooperationR + safetyBufferR + efficiencyR;

    return {
      totalReward,
      breakdown: {
        exploration: explorationR,
        collision: collisionR,
        boundary: boundaryR,
        cooperation: cooperationR,
        safety_buffer: safetyBufferR,
        efficiency: efficiencyR,
      },
    };
  }
}
