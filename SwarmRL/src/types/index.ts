/**
 * SwarmRL - Core TypeScript Type Definitions
 */

export type DroneStatus = 'SEARCHING' | 'RETURNING' | 'COLLIDED' | 'IDLE' | 'CHARGING';

export interface Vector3D {
  x: number;
  y: number;
  z: number;
}

export interface DroneAgentState {
  agent_id: string;
  position: Vector3D;
  velocity: Vector3D;
  orientation: {
    pitch: number; // in radians
    yaw: number;   // in radians
    roll: number;  // in radians
  };
  status: DroneStatus;
  battery: number; // 0 - 100
  collision_state: boolean;
  sensor_range: number;
  explored_area: number;
  distance_travelled: number;
  current_reward: number;
  cumulative_reward: number;
  target_waypoint?: Vector3D;
  flight_path: Vector3D[];
  last_action: [number, number, number]; // [vx, pitch, yaw]
  lidar_readings: number[]; // 8-directional or 12-directional distance measurements
}

export interface ObstacleState {
  id: string;
  type: 'BUILDING' | 'RUIN' | 'DYNAMIC_HAZARD' | 'COLLAPSED_TOWER';
  position: Vector3D;
  size: Vector3D; // width (x), height (y), depth (z)
  velocity?: Vector3D; // For dynamic obstacles
  danger_radius: number;
  color?: string;
}

export interface WindState {
  enabled: boolean;
  strength: number;  // m/s
  direction: number; // angle in degrees
  gust_variability: number;
  vertical_draft: number;
}

export interface EnvironmentConfig {
  width: number;  // X axis bound (m)
  length: number; // Z axis bound (m)
  height: number; // Y axis max ceiling (m)
  num_agents: number;
  obstacle_density: 'LOW' | 'MEDIUM' | 'HIGH' | 'EXTREME';
  wind: WindState;
  lidar_rays: number;
  lidar_range: number;
  grid_resolution: number; // size of coverage grid cells (e.g. 2m)
}

export interface RewardWeights {
  exploration: number;
  collision_penalty: number;
  boundary_penalty: number;
  cooperation: number;
  efficiency: number;
  safety_buffer: number;
}

export interface SimulationMetrics {
  episode: number;
  step: number;
  timestamp: number;
  map_coverage_percent: number;
  explored_cells: number;
  total_cells: number;
  total_collisions: number;
  collision_rate: number; // collisions per episode step
  active_agents: number;
  avg_reward: number;
  max_reward: number;
  cooperation_index: number;
  fps: number;
  step_time_ms: number;
}

export interface MAPPOConfig {
  learning_rate: number;
  gamma: number;           // Discount factor
  gae_lambda: number;      // GAE parameter
  clip_param: number;      // PPO clip range (0.1 - 0.3)
  value_loss_coef: number;
  entropy_coef: number;
  batch_size: number;
  mini_batch_size: number;
  epochs: number;
  hidden_dim: number;
}

export interface TrainingMetrics {
  iteration: number;
  total_episodes: number;
  total_timesteps: number;
  actor_loss: number;
  critic_loss: number;
  entropy: number;
  mean_episode_reward: number;
  mean_coverage: number;
  collision_rate: number;
  learning_rate: number;
  timestamp: number;
}

export interface CheckpointMetadata {
  id: string;
  version: string;
  name: string;
  iteration: number;
  episodes: number;
  mean_reward: number;
  mean_coverage: number;
  created_at: string;
  config: {
    num_agents: number;
    curriculum_level: number;
    mappo: MAPPOConfig;
  };
  weights?: any;
}

export type CurriculumLevel = 1 | 2 | 3 | 4 | 5;

export interface CurriculumConfig {
  level: CurriculumLevel;
  name: string;
  description: string;
  target_coverage_threshold: number; // % to advance
  max_collision_threshold: number;   // max allowed collision rate
  environment_overrides: Partial<EnvironmentConfig>;
}

export interface CollisionEvent {
  id: string;
  timestamp: number;
  step: number;
  type: 'DRONE_DRONE' | 'DRONE_OBSTACLE' | 'DRONE_BOUNDARY';
  agent_id_1: string;
  agent_id_2?: string;
  obstacle_id?: string;
  position: Vector3D;
  severity: 'MINOR' | 'CRITICAL';
}

export interface SimulationSnapshot {
  id: string;
  name: string;
  timestamp: string;
  createdAt: number;
  step: number;
  episode: number;
  mapCoverage: number;
  activeAgents: number;
  totalCollisions: number;
  avgReward: number;
  agents: DroneAgentState[];
  obstacles: ObstacleState[];
  metrics: SimulationMetrics;
  config: EnvironmentConfig;
}

export interface AlertConfig {
  enabled: boolean;
  minAgentBattery: number;       // e.g. 25 (%)
  minActiveAgentRatio: number;   // e.g. 70 (%)
  minMissionCoverage: number;    // e.g. 20 (%) target coverage by step 200
  maxCollisionRate: number;      // e.g. 0.08 collisions/step
  autoPauseOnCritical: boolean;  // Automatically pause simulation when CRITICAL alert fires
  soundEnabled: boolean;         // Audio warning chime
}

export interface AlertNotification {
  id: string;
  timestamp: string;
  step: number;
  type: 'BATTERY_LOW' | 'MISSION_FAILURE_RISK' | 'HIGH_COLLISION_RATE' | 'AGENT_CRASH';
  severity: 'WARNING' | 'CRITICAL';
  title: string;
  message: string;
  acknowledged: boolean;
}

export interface SystemLogEntry {
  id: string;
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR' | 'SUCCESS' | 'MAPPO';
  category: 'SIMULATION' | 'TRAINING' | 'PHYSICS' | 'WEBSOCKET' | 'SYSTEM' | 'SAFETY';
  message: string;
  details?: Record<string, any>;
}

export type ViewTab =
  | 'dashboard'
  | 'simulator'
  | 'training'
  | 'agents'
  | 'environment'
  | 'analytics'
  | 'models'
  | 'logs'
  | 'settings';

export type CameraMode = 'ISOMETRIC' | 'TOP_DOWN' | 'FREE_ROAM' | 'FOLLOW_AGENT' | 'ORBIT';
