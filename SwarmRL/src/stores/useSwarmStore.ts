/**
 * SwarmRL - Zustand Central Application & Telemetry Store
 */

import { create } from 'zustand';
import {
  AlertConfig,
  AlertNotification,
  CameraMode,
  CheckpointMetadata,
  CollisionEvent,
  CurriculumLevel,
  DroneAgentState,
  EnvironmentConfig,
  ObstacleState,
  RewardWeights,
  SimulationMetrics,
  SimulationSnapshot,
  SystemLogEntry,
  TrainingMetrics,
  ViewTab,
} from '../types';

let initialSnapshots: SimulationSnapshot[] = [];
try {
  const stored = localStorage.getItem('swarmrl_snapshots');
  if (stored) {
    initialSnapshots = JSON.parse(stored);
  }
} catch (e) {}

interface SwarmStoreState {
  // Navigation & UI Layout
  activeTab: ViewTab;
  setActiveTab: (tab: ViewTab) => void;

  // Snapshots
  snapshots: SimulationSnapshot[];
  takeSnapshot: (name?: string) => void;
  deleteSnapshot: (id: string) => void;
  clearSnapshots: () => void;

  // Automated Alert System
  alertConfig: AlertConfig;
  activeAlerts: AlertNotification[];
  alertHistory: AlertNotification[];
  updateAlertConfig: (configPartial: Partial<AlertConfig>) => void;
  triggerAlert: (alert: Omit<AlertNotification, 'id' | 'timestamp' | 'acknowledged'>) => void;
  acknowledgeAlert: (id: string) => void;
  dismissAlert: (id: string) => void;
  clearAlerts: () => void;

  // 3D Visualizer Layer Controls
  showSensors: boolean;
  showFlightPaths: boolean;
  showCoverageMap: boolean;
  showWindVectors: boolean;
  showObstacleBoxes: boolean;
  selectedDroneId: string | null;
  cameraMode: CameraMode;
  cameraAltitude: number;
  cameraAutoRotate: boolean;
  toggleLayer: (layer: 'sensors' | 'paths' | 'coverage' | 'wind' | 'obstacles') => void;
  setSelectedDroneId: (id: string | null) => void;
  setCameraMode: (mode: CameraMode) => void;
  setCameraAltitude: (altitude: number) => void;
  setCameraAutoRotate: (autoRotate: boolean) => void;

  // Simulation State
  isSimRunning: boolean;
  isSimPaused: boolean;
  simulationHz: number;
  config: EnvironmentConfig;
  agents: DroneAgentState[];
  obstacles: ObstacleState[];
  metrics: SimulationMetrics;
  collisions: CollisionEvent[];
  curriculumLevel: CurriculumLevel;

  // Training & MAPPO State
  trainingStatus: 'IDLE' | 'TRAINING' | 'PAUSED' | 'EVALUATING';
  trainingMetricsHistory: TrainingMetrics[];
  checkpoints: CheckpointMetadata[];
  selectedCheckpointId: string | null;

  // Logging
  logs: SystemLogEntry[];
  addLog: (level: SystemLogEntry['level'], category: SystemLogEntry['category'], message: string, details?: any) => void;

  // Actions
  setSimRunning: (running: boolean) => void;
  setSimPaused: (paused: boolean) => void;
  setSwarmSize: (numAgents: number) => void;
  setCurriculumLevel: (level: CurriculumLevel) => void;
  updateSimData: (
    agents: DroneAgentState[],
    obstacles: ObstacleState[],
    metrics: SimulationMetrics,
    collisions: CollisionEvent[]
  ) => void;
  updateTrainingMetrics: (metricsHistory: TrainingMetrics[], status: 'IDLE' | 'TRAINING' | 'PAUSED' | 'EVALUATING') => void;
  updateCheckpoints: (checkpoints: CheckpointMetadata[]) => void;
  updateConfig: (configPartial: Partial<EnvironmentConfig>) => void;
}

export const useSwarmStore = create<SwarmStoreState>((set, get) => ({
  activeTab: 'dashboard',
  setActiveTab: (tab) => set({ activeTab: tab }),

  // Snapshots
  snapshots: initialSnapshots,
  takeSnapshot: (customName) => {
    const state = get();
    const now = new Date();
    const snapshot: SimulationSnapshot = {
      id: `snap_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: customName || `Snapshot #${state.snapshots.length + 1} (${state.metrics.map_coverage_percent.toFixed(1)}% Coverage)`,
      timestamp: now.toLocaleTimeString(),
      createdAt: Date.now(),
      step: state.metrics.step,
      episode: state.metrics.episode,
      mapCoverage: state.metrics.map_coverage_percent,
      activeAgents: state.agents.length,
      totalCollisions: state.metrics.total_collisions,
      avgReward: state.metrics.avg_reward,
      agents: JSON.parse(JSON.stringify(state.agents)),
      obstacles: JSON.parse(JSON.stringify(state.obstacles)),
      metrics: { ...state.metrics },
      config: { ...state.config },
    };

    const newSnapshots = [snapshot, ...state.snapshots];
    set({ snapshots: newSnapshots });
    try {
      localStorage.setItem('swarmrl_snapshots', JSON.stringify(newSnapshots));
    } catch (e) {
      console.error('Failed to save snapshots to localStorage', e);
    }
    state.addLog('SUCCESS', 'SIMULATION', `State snapshot "${snapshot.name}" saved locally at Step ${snapshot.step}.`);
  },
  deleteSnapshot: (id) => {
    const state = get();
    const newSnapshots = state.snapshots.filter((s) => s.id !== id);
    set({ snapshots: newSnapshots });
    try {
      localStorage.setItem('swarmrl_snapshots', JSON.stringify(newSnapshots));
    } catch (e) {
      console.error('Failed to save snapshots to localStorage', e);
    }
  },
  clearSnapshots: () => {
    set({ snapshots: [] });
    try {
      localStorage.removeItem('swarmrl_snapshots');
    } catch (e) {}
  },

  // Automated Alert System State & Actions
  alertConfig: {
    enabled: true,
    minAgentBattery: 25,
    minActiveAgentRatio: 70,
    minMissionCoverage: 15,
    maxCollisionRate: 0.08,
    autoPauseOnCritical: false,
    soundEnabled: true,
  },
  activeAlerts: [],
  alertHistory: [],

  updateAlertConfig: (configPartial) =>
    set((state) => ({
      alertConfig: { ...state.alertConfig, ...configPartial },
    })),

  triggerAlert: (alertData) => {
    const state = get();
    if (!state.alertConfig.enabled) return;

    // Check for duplicate recent active alert of same type within 3 seconds
    const now = new Date();
    const isDuplicate = state.activeAlerts.some(
      (a) => a.type === alertData.type && !a.acknowledged
    );
    if (isDuplicate) return;

    const newAlert: AlertNotification = {
      ...alertData,
      id: `alt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: now.toLocaleTimeString(),
      acknowledged: false,
    };

    // Auto-pause if critical and configured
    if (alertData.severity === 'CRITICAL' && state.alertConfig.autoPauseOnCritical) {
      set({ isSimPaused: true });
      state.addLog(
        'WARN',
        'SAFETY',
        `AUTOMATIC SIMULATION PAUSE triggered by Critical Alert: ${alertData.title}`
      );
    }

    state.addLog(
      alertData.severity === 'CRITICAL' ? 'ERROR' : 'WARN',
      'SAFETY',
      `[ALERT ${alertData.severity}] ${alertData.title}: ${alertData.message}`
    );

    set((s) => ({
      activeAlerts: [newAlert, ...s.activeAlerts].slice(0, 5), // max 5 active alerts
      alertHistory: [newAlert, ...s.alertHistory].slice(0, 50),
    }));
  },

  acknowledgeAlert: (id) =>
    set((state) => ({
      activeAlerts: state.activeAlerts.map((a) =>
        a.id === id ? { ...a, acknowledged: true } : a
      ),
      alertHistory: state.alertHistory.map((a) =>
        a.id === id ? { ...a, acknowledged: true } : a
      ),
    })),

  dismissAlert: (id) =>
    set((state) => ({
      activeAlerts: state.activeAlerts.filter((a) => a.id !== id),
    })),

  clearAlerts: () => set({ activeAlerts: [], alertHistory: [] }),

  // 3D Layers Defaults
  showSensors: true,
  showFlightPaths: true,
  showCoverageMap: true,
  showWindVectors: true,
  showObstacleBoxes: true,
  selectedDroneId: null,
  cameraMode: 'ISOMETRIC',
  cameraAltitude: 75,
  cameraAutoRotate: false,

  toggleLayer: (layer) =>
    set((state) => {
      switch (layer) {
        case 'sensors':
          return { showSensors: !state.showSensors };
        case 'paths':
          return { showFlightPaths: !state.showFlightPaths };
        case 'coverage':
          return { showCoverageMap: !state.showCoverageMap };
        case 'wind':
          return { showWindVectors: !state.showWindVectors };
        case 'obstacles':
          return { showObstacleBoxes: !state.showObstacleBoxes };
        default:
          return {};
      }
    }),

  setSelectedDroneId: (id) => set({ selectedDroneId: id }),
  setCameraMode: (mode) => set({ cameraMode: mode }),
  setCameraAltitude: (altitude) => set({ cameraAltitude: altitude }),
  setCameraAutoRotate: (autoRotate) => set({ cameraAutoRotate: autoRotate }),

  // Simulation Defaults
  isSimRunning: true,
  isSimPaused: false,
  simulationHz: 20,

  config: {
    width: 120,
    length: 120,
    height: 45,
    num_agents: 10,
    obstacle_density: 'MEDIUM',
    wind: { enabled: false, strength: 0, direction: 0, gust_variability: 0, vertical_draft: 0 },
    lidar_rays: 8,
    lidar_range: 25.0,
    grid_resolution: 2.5,
  },

  agents: [],
  obstacles: [],
  metrics: {
    episode: 1,
    step: 0,
    timestamp: Date.now(),
    map_coverage_percent: 0.0,
    explored_cells: 0,
    total_cells: 2304,
    total_collisions: 0,
    collision_rate: 0.0,
    active_agents: 10,
    avg_reward: 0.0,
    max_reward: 0.0,
    cooperation_index: 1.0,
    fps: 60,
    step_time_ms: 2.0,
  },
  collisions: [],
  curriculumLevel: 1,

  // Training
  trainingStatus: 'IDLE',
  trainingMetricsHistory: [],
  checkpoints: [],
  selectedCheckpointId: null,

  // Logs
  logs: [
    {
      id: 'log_01',
      timestamp: new Date().toLocaleTimeString(),
      level: 'INFO',
      category: 'SYSTEM',
      message: 'SwarmRL Multi-Agent DRL System initialized cleanly.',
    },
    {
      id: 'log_02',
      timestamp: new Date().toLocaleTimeString(),
      level: 'SUCCESS',
      category: 'SIMULATION',
      message: '10 Autonomous Drones spawned in Disaster Zone (120m x 120m).',
    },
    {
      id: 'log_03',
      timestamp: new Date().toLocaleTimeString(),
      level: 'MAPPO',
      category: 'TRAINING',
      message: 'MAPPO Centralized Critic & Decentralized Actor networks ready.',
    },
  ],

  addLog: (level, category, message, details) =>
    set((state) => ({
      logs: [
        {
          id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
          timestamp: new Date().toLocaleTimeString(),
          level,
          category,
          message,
          details,
        },
        ...state.logs.slice(0, 99), // Keep 100 entries
      ],
    })),

  setSimRunning: (running) => set({ isSimRunning: running }),
  setSimPaused: (paused) => set({ isSimPaused: paused }),

  setSwarmSize: (numAgents) =>
    set((state) => ({
      config: { ...state.config, num_agents: numAgents },
    })),

  setCurriculumLevel: (level) => set({ curriculumLevel: level }),

  updateSimData: (agents, obstacles, metrics, collisions) =>
    set({
      agents,
      obstacles,
      metrics,
      collisions,
    }),

  updateTrainingMetrics: (history, status) =>
    set({
      trainingMetricsHistory: history,
      trainingStatus: status,
    }),

  updateCheckpoints: (checkpoints) => set({ checkpoints }),

  updateConfig: (configPartial) =>
    set((state) => ({
      config: { ...state.config, ...configPartial },
    })),
}));
