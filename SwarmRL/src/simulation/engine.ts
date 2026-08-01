/**
 * SwarmRL - Authoritative Multi-Agent Simulation Engine
 */

import {
  CollisionEvent,
  DroneAgentState,
  EnvironmentConfig,
  ObstacleState,
  SimulationMetrics,
  Vector3D,
} from '../types';
import { CoverageMap } from './coverage';
import { CURRICULUM_LEVELS, CurriculumManager } from './curriculum';
import { ObstacleManager } from './obstacles';
import { DEFAULT_PHYSICS_LIMITS, DronePhysics } from './physics';
import { DEFAULT_REWARD_WEIGHTS, RewardEngine } from './rewards';
import { LidarSensor } from './sensors';

export const DEFAULT_ENV_CONFIG: EnvironmentConfig = {
  width: 120,
  length: 120,
  height: 45,
  num_agents: 10,
  obstacle_density: 'MEDIUM',
  wind: { enabled: false, strength: 0, direction: 0, gust_variability: 0, vertical_draft: 0 },
  lidar_rays: 8,
  lidar_range: 25.0,
  grid_resolution: 2.5,
};

export class SimulationEngine {
  private config: EnvironmentConfig;
  private physics: DronePhysics;
  private obstacleManager: ObstacleManager;
  private lidarSensor: LidarSensor;
  private coverageMap: CoverageMap;
  private rewardEngine: RewardEngine;
  private curriculumManager: CurriculumManager;

  private agents: Map<string, DroneAgentState> = new Map();
  private collisionEvents: CollisionEvent[] = [];
  private stepCount: number = 0;
  private episodeCount: number = 0;
  private totalCollisionsCount: number = 0;
  private startTime: number = Date.now();

  constructor(configPartial?: Partial<EnvironmentConfig>) {
    this.config = { ...DEFAULT_ENV_CONFIG, ...configPartial };

    this.physics = new DronePhysics(DEFAULT_PHYSICS_LIMITS);
    this.obstacleManager = new ObstacleManager();
    this.lidarSensor = new LidarSensor(this.config.lidar_rays, this.config.lidar_range);
    this.coverageMap = new CoverageMap(this.config.width, this.config.length, this.config.grid_resolution);
    this.rewardEngine = new RewardEngine(DEFAULT_REWARD_WEIGHTS);
    this.curriculumManager = new CurriculumManager(1);

    this.initEpisode();
  }

  public setConfig(configPartial: Partial<EnvironmentConfig>) {
    this.config = { ...this.config, ...configPartial };
    this.lidarSensor = new LidarSensor(this.config.lidar_rays, this.config.lidar_range);
    this.coverageMap = new CoverageMap(this.config.width, this.config.length, this.config.grid_resolution);
    this.reset();
  }

  public setRewardWeights(weights: typeof DEFAULT_REWARD_WEIGHTS) {
    this.rewardEngine.setWeights(weights);
  }

  public getCurriculumManager(): CurriculumManager {
    return this.curriculumManager;
  }

  public reset(): Map<string, DroneAgentState> {
    this.episodeCount++;
    this.initEpisode();
    return this.agents;
  }

  private initEpisode() {
    this.stepCount = 0;
    this.collisionEvents = [];
    this.coverageMap.reset();

    // Check if curriculum level applies environment overrides
    const currConfig = this.curriculumManager.getConfig();
    if (currConfig && currConfig.environment_overrides) {
      this.config = { ...this.config, ...currConfig.environment_overrides };
    }

    // 1. Generate Disaster Zone Obstacles
    this.obstacleManager.generateDisasterZone(
      this.config.width,
      this.config.length,
      this.config.obstacle_density
    );

    // 2. Spawn Agents in a ring or grid around the center
    this.agents.clear();
    const N = this.config.num_agents;
    const ringRadius = Math.min(18.0, 4.0 + N * 0.35);

    for (let i = 0; i < N; i++) {
      const id = `drone_${(i + 1).toString().padStart(2, '0')}`;
      const angle = (i * Math.PI * 2) / N;

      const px = Math.cos(angle) * ringRadius;
      const pz = Math.sin(angle) * ringRadius;
      const py = 3.0 + (i % 3) * 1.5; // Staggered initial takeoff height

      const initialYaw = angle + Math.PI; // Face outwards

      const agentState: DroneAgentState = {
        agent_id: id,
        position: { x: px, y: py, z: pz },
        velocity: { x: 0, y: 0, z: 0 },
        orientation: { pitch: 0, yaw: initialYaw, roll: 0 },
        status: 'SEARCHING',
        battery: 100,
        collision_state: false,
        sensor_range: this.config.lidar_range,
        explored_area: 0,
        distance_travelled: 0,
        current_reward: 0,
        cumulative_reward: 0,
        flight_path: [{ x: px, y: py, z: pz }],
        last_action: [0, 0, 0],
        lidar_readings: new Array(this.config.lidar_rays).fill(1.0),
      };

      this.agents.set(id, agentState);
    }
  }

  /**
   * Main simulation step (e.g., dt = 0.05s, 20Hz step rate)
   * Actions map: agent_id -> [speedCmd, pitchCmd, yawCmd]
   */
  public step(actions: Record<string, [number, number, number]>): {
    states: Map<string, DroneAgentState>;
    rewards: Record<string, number>;
    metrics: SimulationMetrics;
    collisions: CollisionEvent[];
  } {
    this.stepCount++;
    const stepCollisions: CollisionEvent[] = [];

    // 1. Update dynamic hazard movements
    this.obstacleManager.updateDynamicObstacles(this.config.width, this.config.length);
    const obstacles = this.obstacleManager.getObstacles();

    const halfW = this.config.width / 2;
    const halfL = this.config.length / 2;

    const agentList = Array.from(this.agents.values());
    const stepRewards: Record<string, number> = {};

    // 2. Physics & State updates for active agents
    for (const agent of agentList) {
      if (agent.status === 'COLLIDED') {
        stepRewards[agent.agent_id] = 0;
        continue;
      }

      const action = actions[agent.agent_id] || [0.4, 0, (Math.random() - 0.5) * 0.2];
      agent.last_action = action;

      // Physics step
      const { nextPos, nextVel, nextOrientation } = this.physics.step(
        agent.position,
        agent.velocity,
        agent.orientation,
        action,
        this.config.wind
      );

      // Distance travelled accumulation
      const dx = nextPos.x - agent.position.x;
      const dy = nextPos.y - agent.position.y;
      const dz = nextPos.z - agent.position.z;
      const stepDist = Math.sqrt(dx * dx + dy * dy + dz * dz);
      agent.distance_travelled += stepDist;

      // Update position
      agent.position = nextPos;
      agent.velocity = nextVel;
      agent.orientation = nextOrientation;

      // Maintain breadcrumb flight path history (max 35 recent points for 3D trail)
      agent.flight_path.push({ ...nextPos });
      if (agent.flight_path.length > 35) {
        agent.flight_path.shift();
      }

      // Battery drain
      agent.battery = Math.max(0, agent.battery - 0.02);

      // Check Boundary Violation
      let hitBoundary = false;
      if (
        Math.abs(agent.position.x) >= halfW - 1.0 ||
        Math.abs(agent.position.z) >= halfL - 1.0 ||
        agent.position.y >= this.config.height - 1.0
      ) {
        hitBoundary = true;
        const event: CollisionEvent = {
          id: `col_bound_${Date.now()}_${agent.agent_id}`,
          timestamp: Date.now(),
          step: this.stepCount,
          type: 'DRONE_BOUNDARY',
          agent_id_1: agent.agent_id,
          position: { ...agent.position },
          severity: 'MINOR',
        };
        stepCollisions.push(event);
      }

      // Check Obstacle Collision
      const obsHit = this.obstacleManager.checkPointCollision(agent.position, 0.8);
      let hitObstacle = false;
      if (obsHit.hit) {
        hitObstacle = true;
        agent.status = 'COLLIDED';
        agent.collision_state = true;
        this.totalCollisionsCount++;

        const event: CollisionEvent = {
          id: `col_obs_${Date.now()}_${agent.agent_id}`,
          timestamp: Date.now(),
          step: this.stepCount,
          type: 'DRONE_OBSTACLE',
          agent_id_1: agent.agent_id,
          obstacle_id: obsHit.obstacle?.id,
          position: { ...agent.position },
          severity: 'CRITICAL',
        };
        stepCollisions.push(event);
      }

      // Check Drone-to-Drone Collision
      let hitDrone = false;
      for (const other of agentList) {
        if (other.agent_id !== agent.agent_id && other.status !== 'COLLIDED') {
          const distance = Math.sqrt(
            Math.pow(agent.position.x - other.position.x, 2) +
            Math.pow(agent.position.y - other.position.y, 2) +
            Math.pow(agent.position.z - other.position.z, 2)
          );

          if (distance < 1.6) {
            hitDrone = true;
            agent.status = 'COLLIDED';
            agent.collision_state = true;
            this.totalCollisionsCount++;

            const event: CollisionEvent = {
              id: `col_drone_${Date.now()}_${agent.agent_id}`,
              timestamp: Date.now(),
              step: this.stepCount,
              type: 'DRONE_DRONE',
              agent_id_1: agent.agent_id,
              agent_id_2: other.agent_id,
              position: { ...agent.position },
              severity: 'CRITICAL',
            };
            stepCollisions.push(event);
            break;
          }
        }
      }

      // Update Coverage Map
      let newlyExplored = 0;
      if (agent.status !== 'COLLIDED') {
        newlyExplored = this.coverageMap.updateCoverage(agent.position, 6.0);
        agent.explored_area += newlyExplored * this.config.grid_resolution * this.config.grid_resolution;
      }

      // Read LiDAR Sensors
      agent.lidar_readings = this.lidarSensor.readSensors(
        agent.position,
        agent.orientation.yaw,
        obstacles,
        { width: this.config.width, length: this.config.length, height: this.config.height }
      );

      // Compute MAPPO Reward
      const hasCollided = hitObstacle || hitDrone;
      const { totalReward } = this.rewardEngine.calculateAgentReward(
        agent,
        agentList,
        newlyExplored,
        hasCollided,
        hitBoundary,
        { width: this.config.width, length: this.config.length, height: this.config.height }
      );

      agent.current_reward = totalReward;
      agent.cumulative_reward += totalReward;
      stepRewards[agent.agent_id] = totalReward;
    }

    this.collisionEvents.push(...stepCollisions);

    // Compute metrics
    const activeAgentsCount = Array.from(this.agents.values()).filter((a) => a.status !== 'COLLIDED').length;
    const coveragePercent = this.coverageMap.getCoveragePercentage();

    const allRewards = Array.from(this.agents.values()).map((a) => a.current_reward);
    const avgReward = allRewards.reduce((a, b) => a + b, 0) / (allRewards.length || 1);
    const maxReward = Math.max(...allRewards, 0);

    const metrics: SimulationMetrics = {
      episode: this.episodeCount,
      step: this.stepCount,
      timestamp: Date.now(),
      map_coverage_percent: Number(coveragePercent.toFixed(1)),
      explored_cells: this.coverageMap.getExploredCount(),
      total_cells: this.coverageMap.getTotalCells(),
      total_collisions: this.totalCollisionsCount,
      collision_rate: Number((this.totalCollisionsCount / Math.max(1, this.stepCount)).toFixed(3)),
      active_agents: activeAgentsCount,
      avg_reward: Number(avgReward.toFixed(2)),
      max_reward: Number(maxReward.toFixed(2)),
      cooperation_index: Number((activeAgentsCount / this.config.num_agents).toFixed(2)),
      fps: 20,
      step_time_ms: 2.5,
    };

    return {
      states: this.agents,
      rewards: stepRewards,
      metrics,
      collisions: stepCollisions,
    };
  }

  /**
   * Generates local observation vector for an agent (PettingZoo / Gymnasium compatible)
   */
  public getObservation(agentId: string): number[] {
    const agent = this.agents.get(agentId);
    if (!agent) return new Array(24).fill(0);

    const halfW = this.config.width / 2;
    const halfL = this.config.length / 2;

    // Normalized own state
    const normX = agent.position.x / halfW;
    const normY = agent.position.y / this.config.height;
    const normZ = agent.position.z / halfL;

    const normVx = agent.velocity.x / 12.0;
    const normVy = agent.velocity.y / 6.0;
    const normVz = agent.velocity.z / 12.0;

    const normYaw = agent.orientation.yaw / Math.PI;

    // Find nearest neighbor info
    let nearestDx = 1.0;
    let nearestDy = 1.0;
    let nearestDz = 1.0;
    let minDist = 1.0;

    for (const [otherId, other] of this.agents.entries()) {
      if (otherId !== agentId && other.status !== 'COLLIDED') {
        const dx = (other.position.x - agent.position.x) / halfW;
        const dy = (other.position.y - agent.position.y) / this.config.height;
        const dz = (other.position.z - agent.position.z) / halfL;
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (dist < minDist) {
          minDist = dist;
          nearestDx = dx;
          nearestDy = dy;
          nearestDz = dz;
        }
      }
    }

    // Combine into flat observation vector (Normalized floats [-1, 1])
    return [
      normX,
      normY,
      normZ,
      normVx,
      normVy,
      normVz,
      normYaw,
      nearestDx,
      nearestDy,
      nearestDz,
      minDist,
      ...agent.lidar_readings, // 8 rays
      this.coverageMap.getCoveragePercentage() / 100.0,
      agent.battery / 100.0,
      agent.collision_state ? 1 : 0,
      (this.config.wind.strength || 0) / 10.0,
      (this.config.wind.direction || 0) / 360.0,
    ];
  }

  public getAgents(): Map<string, DroneAgentState> {
    return this.agents;
  }

  public getObstacles(): ObstacleState[] {
    return this.obstacleManager.getObstacles();
  }

  public getCoverageData() {
    return this.coverageMap.getGridData();
  }

  public getConfig(): EnvironmentConfig {
    return this.config;
  }

  public getRecentCollisions(): CollisionEvent[] {
    return this.collisionEvents.slice(-20);
  }
}
