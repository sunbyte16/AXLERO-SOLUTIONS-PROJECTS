/**
 * SwarmRL - Curriculum Learning Manager
 */

import { CurriculumConfig, CurriculumLevel } from '../types';

export const CURRICULUM_LEVELS: Record<CurriculumLevel, CurriculumConfig> = {
  1: {
    level: 1,
    name: 'Level 1: Open Air Training',
    description: 'Empty disaster ground field with zero obstacles and clear weather to master basic flight motion.',
    target_coverage_threshold: 60,
    max_collision_threshold: 0.05,
    environment_overrides: {
      obstacle_density: 'LOW',
      wind: { enabled: false, strength: 0, direction: 0, gust_variability: 0, vertical_draft: 0 },
    },
  },
  2: {
    level: 2,
    name: 'Level 2: Static Ruins Search',
    description: 'Static collapsed buildings and concrete rubble blocks requiring obstacle avoidance.',
    target_coverage_threshold: 70,
    max_collision_threshold: 0.04,
    environment_overrides: {
      obstacle_density: 'MEDIUM',
      wind: { enabled: false, strength: 0, direction: 0, gust_variability: 0, vertical_draft: 0 },
    },
  },
  3: {
    level: 3,
    name: 'Level 3: High-Density Urban Disaster',
    description: 'Dense high-rise building clusters and narrow search corridors with higher drone swarm density.',
    target_coverage_threshold: 80,
    max_collision_threshold: 0.03,
    environment_overrides: {
      obstacle_density: 'HIGH',
      wind: { enabled: true, strength: 1.5, direction: 45, gust_variability: 0.1, vertical_draft: 0.1 },
    },
  },
  4: {
    level: 4,
    name: 'Level 4: Dynamic Hazards & Crane Debris',
    description: 'Moving crane hazard debris and active collapse zones requiring real-time reactive path planning.',
    target_coverage_threshold: 85,
    max_collision_threshold: 0.02,
    environment_overrides: {
      obstacle_density: 'HIGH',
      wind: { enabled: true, strength: 3.0, direction: 90, gust_variability: 0.2, vertical_draft: 0.2 },
    },
  },
  5: {
    level: 5,
    name: 'Level 5: Extreme Storm Swarm Operation',
    description: 'Full 50-drone swarm operation in severe wind gusts, extreme obstacle density, and moving hazards.',
    target_coverage_threshold: 90,
    max_collision_threshold: 0.01,
    environment_overrides: {
      obstacle_density: 'EXTREME',
      wind: { enabled: true, strength: 5.5, direction: 120, gust_variability: 0.35, vertical_draft: 0.5 },
    },
  },
};

export class CurriculumManager {
  private currentLevel: CurriculumLevel = 1;

  constructor(initialLevel: CurriculumLevel = 1) {
    this.currentLevel = initialLevel;
  }

  public getLevel(): CurriculumLevel {
    return this.currentLevel;
  }

  public getConfig(): CurriculumConfig {
    return CURRICULUM_LEVELS[this.currentLevel];
  }

  public setLevel(level: CurriculumLevel) {
    this.currentLevel = level;
  }

  /**
   * Evaluates performance and advances level if thresholds are satisfied
   */
  public evaluateProgression(meanCoveragePercent: number, meanCollisionRate: number): {
    promoted: boolean;
    newLevel: CurriculumLevel;
    reason?: string;
  } {
    const currentConfig = this.getConfig();

    if (
      meanCoveragePercent >= currentConfig.target_coverage_threshold &&
      meanCollisionRate <= currentConfig.max_collision_threshold
    ) {
      if (this.currentLevel < 5) {
        this.currentLevel = (this.currentLevel + 1) as CurriculumLevel;
        return {
          promoted: true,
          newLevel: this.currentLevel,
          reason: `Achieved ${meanCoveragePercent.toFixed(1)}% coverage with low collision rate (${meanCollisionRate.toFixed(3)}). Advanced to Level ${this.currentLevel}!`,
        };
      }
    }

    return { promoted: false, newLevel: this.currentLevel };
  }
}
