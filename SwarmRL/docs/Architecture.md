# Architecture.md

# SwarmRL – Multi-Agent Deep Reinforcement Learning Simulator

**Version:** 1.0  
**Status:** Planning  
**Project Type:** AI / Reinforcement Learning / Autonomous Systems  
**Architecture Style:** Modular, Layered, Event-Driven  
**Primary Algorithm:** MAPPO  
**Target Agents:** Up to 50 autonomous drones

---

# 1. Architecture Overview

SwarmRL is an advanced Multi-Agent Deep Reinforcement Learning platform designed to train, simulate, evaluate, and visualize autonomous drone swarms operating inside a continuous 3D disaster-response environment.

The system combines:

- Multi-Agent Simulation
- Reinforcement Learning
- MAPPO
- Centralized Training
- Decentralized Execution
- Physics Simulation
- Collision Avoidance
- Exploration Optimization
- Dynamic Obstacles
- Wind Simulation
- Curriculum Learning
- Real-Time WebSocket Streaming
- 3D WebGL Visualization
- Training Analytics
- Model Checkpointing

The architecture is designed so that each major subsystem can be developed, tested, scaled, and replaced independently.

---

# 2. Architecture Goals

The system architecture must:

- Support multiple autonomous agents.
- Scale toward 50 agents.
- Support centralized training.
- Support decentralized inference.
- Support continuous action spaces.
- Support configurable observation spaces.
- Support real-time simulation.
- Support real-time visualization.
- Support dynamic obstacles.
- Support wind resistance.
- Support collision detection.
- Support exploration tracking.
- Support curriculum learning.
- Support distributed RL training.
- Support model checkpointing.
- Support reproducible experiments.
- Maintain strict separation of concerns.

---

# 3. Core Architectural Principles

## 3.1 Modular Design

Each subsystem must have one primary responsibility.

```text
Simulation
    ↓
Environment State

RL Engine
    ↓
Policy Learning

Backend
    ↓
Application Control

Streaming
    ↓
Real-Time State Distribution

Frontend
    ↓
Visualization and User Interaction
```

---

## 3.2 Separation of Concerns

The following responsibilities must remain separate:

- Environment logic
- Physics
- Reward calculation
- RL training
- API handling
- WebSocket streaming
- Frontend state
- 3D rendering
- Analytics
- Model management

No module should become responsible for unrelated functionality.

---

## 3.3 Configuration-Driven System

The following must be configurable:

- Number of agents
- Environment size
- Agent speed
- Sensor range
- Collision distance
- Reward weights
- Obstacle density
- Wind strength
- Training parameters
- Rendering settings
- Curriculum parameters

Configuration must not require source-code modifications.

---

# 4. High-Level Architecture

```text
                                    ┌───────────────────────┐
                                    │       User            │
                                    │   Researcher / Admin  │
                                    └───────────┬───────────┘
                                                │
                                                ▼
                              ┌───────────────────────────────┐
                              │       React Dashboard         │
                              │                               │
                              │ React + TypeScript            │
                              │ Tailwind CSS                  │
                              │ Three.js                      │
                              │ React Three Fiber             │
                              │ Recharts                      │
                              └──────────────┬────────────────┘
                                             │
                              ┌──────────────┴──────────────┐
                              │                             │
                           REST API                     WebSocket
                              │                             │
                              ▼                             ▼
                   ┌─────────────────────┐       ┌─────────────────────┐
                   │   FastAPI Backend   │       │ Streaming Gateway   │
                   │                     │       │                     │
                   │ Simulation Control  │       │ Simulation State     │
                   │ Training Control    │       │ Training Metrics    │
                   │ Model Management    │       │ System Events       │
                   │ Configuration       │       └──────────┬──────────┘
                   └──────────┬──────────┘                  │
                              │                             │
                              ▼                             │
                   ┌─────────────────────┐                  │
                   │ Application Layer   │                  │
                   │                     │                  │
                   │ Simulation Service  │                  │
                   │ Training Service    │                  │
                   │ Model Service       │                  │
                   │ Metrics Service     │                  │
                   └──────────┬──────────┘                  │
                              │                             │
             ┌────────────────┴────────────────┐            │
             │                                 │            │
             ▼                                 ▼            │
   ┌──────────────────────┐       ┌──────────────────────┐ │
   │  Simulation Engine   │◄─────►│  RL Training Engine  │ │
   │                      │       │                      │ │
   │ PettingZoo/Gymnasium │       │ Ray RLlib             │ │
   │ Physics              │       │ MAPPO                 │ │
   │ Agents               │       │ PyTorch               │ │
   │ Sensors              │       │ Actor                  │ │
   │ Obstacles            │       │ Critic                 │ │
   │ Coverage             │       │ Distributed Training   │ │
   │ Rewards              │       └──────────┬───────────┘ │
   └──────────┬───────────┘                  │             │
              │                              ▼             │
              │                    ┌─────────────────────┐ │
              │                    │   Model Registry    │ │
              │                    │                     │ │
              │                    │ Models              │ │
              │                    │ Checkpoints         │ │
              │                    │ Metadata            │ │
              │                    └─────────────────────┘ │
              │                                            │
              └────────────────────┬───────────────────────┘
                                   │
                                   ▼
                         ┌───────────────────────┐
                         │   State Publisher     │
                         └────────────┬──────────┘
                                      │
                                      ▼
                                WebSocket Stream
```

---

# 5. System Layers

SwarmRL uses a layered architecture.

```text
┌─────────────────────────────────────────────┐
│ Presentation Layer                          │
│ React + Three.js + Recharts                 │
├─────────────────────────────────────────────┤
│ API / Streaming Layer                       │
│ FastAPI + WebSockets                        │
├─────────────────────────────────────────────┤
│ Application Layer                           │
│ Services + Controllers                     │
├─────────────────────────────────────────────┤
│ Simulation / Domain Layer                   │
│ Environment + Agents + Physics + Rewards   │
├─────────────────────────────────────────────┤
│ Machine Learning Layer                      │
│ MAPPO + RLlib + PyTorch                     │
├─────────────────────────────────────────────┤
│ Infrastructure Layer                        │
│ Storage + Checkpoints + Monitoring          │
└─────────────────────────────────────────────┘
```

---

# 6. Simulation Engine

The Simulation Engine is the authoritative source of environment state.

Responsibilities:

- Environment initialization
- Agent creation
- Agent movement
- Physics updates
- Collision detection
- Obstacle handling
- Wind simulation
- Sensor processing
- Coverage tracking
- Reward calculation
- Episode lifecycle

The Simulation Engine must not depend on:

- React
- Browser APIs
- Three.js
- Frontend state management

---

# 7. Simulation Components

```text
Simulation Engine
│
├── Environment
│
├── Agent Manager
│   └── Drone Agents
│
├── Physics Engine
│
├── Collision System
│
├── Obstacle Manager
│
├── Wind Model
│
├── Sensor System
│
├── Coverage System
│
├── Reward Engine
│
├── Episode Manager
│
└── State Publisher
```

---

# 8. Environment Architecture

The environment should follow a PettingZoo/Gymnasium-compatible multi-agent interface.

Core operations:

```python
reset()
step(actions)
render()
close()
```

Responsibilities:

- Maintain agents.
- Maintain environment state.
- Receive actions.
- Generate observations.
- Calculate rewards.
- Track terminated agents.
- Track truncated episodes.
- Maintain episode state.

---

# 9. Agent Architecture

Each drone is modeled as an independent autonomous agent.

```text
DroneAgent
│
├── Identity
│   └── agent_id
│
├── Position
│   ├── x
│   ├── y
│   └── z
│
├── Velocity
│   ├── vx
│   ├── vy
│   └── vz
│
├── Orientation
│   ├── pitch
│   └── yaw
│
├── Sensors
│   └── sensor_range
│
├── State
│   ├── active
│   ├── collision
│   └── searching
│
└── Metrics
    ├── reward
    ├── distance_travelled
    └── explored_area
```

The agent must not contain global environment logic.

---

# 10. Canonical Simulation State

The simulation must maintain one authoritative state representation.

Example:

```text
SimulationState
│
├── episode_id
├── step
├── timestamp
├── environment
├── agents
├── obstacles
├── coverage
├── collisions
└── metrics
```

This canonical state is consumed by:

- RL Engine
- Metrics Service
- WebSocket Publisher
- Debugging Tools
- Visualization Layer

---

# 11. Observation Architecture

Each agent receives a local observation generated from the environment state.

Possible observation values:

```text
Own Position
Own Velocity
Own Orientation

Nearest Neighbor Distance

Nearby Agent Information

Nearby Obstacle Distances

Environment Boundaries

Local Coverage

Sensor Information
```

Observation generation must be:

- Deterministic
- Configurable
- Testable
- Versioned

---

# 12. Action Architecture

The agents operate using continuous actions.

```text
Action
│
├── velocity
├── pitch
└── yaw
```

Action pipeline:

```text
Agent Observation
       ↓
Actor Network
       ↓
Action
       ↓
Action Validation
       ↓
Physics Constraints
       ↓
Environment Update
```

The environment must reject or clamp invalid actions without corrupting the simulation state.

---

# 13. Physics Architecture

Physics handles movement and environmental forces.

```text
Agent Action
     ↓
Action Validation
     ↓
Acceleration
     ↓
Velocity Update
     ↓
Wind Effect
     ↓
Position Update
     ↓
Boundary Check
     ↓
Collision Detection
     ↓
Final Agent State
```

Configurable parameters:

- Maximum speed
- Maximum acceleration
- Maximum altitude
- Minimum altitude
- Turn rate
- Drone radius
- Drag coefficient
- Wind strength
- Wind direction

---

# 14. Collision Architecture

Supported collision types:

```text
Agent ↔ Agent

Agent ↔ Obstacle

Agent ↔ Boundary
```

Collision pipeline:

```text
Position Update
      ↓
Collision Detection
      ↓
Collision Event
      ↓
Reward Penalty
      ↓
Metrics Update
      ↓
Visualization Event
```

Each collision must produce a structured event.

---

# 15. Sensor Architecture

Initial sensor model:

**LiDAR-like distance sensing**

The sensor system must be abstracted so that future sensors can be added without changing the environment architecture.

Possible sensors:

- LiDAR
- Camera
- Radar
- Depth Sensor
- GPS
- IMU

Common interface:

```text
Sensor
├── observe()
├── configure()
└── validate()
```

---

# 16. Coverage Architecture

The search environment is divided into coverage regions.

```text
Coverage Map
│
├── Unexplored
├── Explored
└── Recently Explored
```

Coverage Manager responsibilities:

- Track visited regions.
- Detect newly explored areas.
- Calculate coverage percentage.
- Generate coverage metrics.
- Prevent inappropriate repeated rewards.

---

# 17. Reward Architecture

The reward engine is modular.

```text
Reward Engine
│
├── Exploration Reward
├── Collision Penalty
├── Boundary Penalty
├── Cooperation Reward
├── Efficiency Reward
└── Safety Reward
```

Conceptual reward:

```text
Total Reward =
    Exploration
  + Cooperation
  + Efficiency
  - Collision
  - Boundary Violation
  - Unsafe Behavior
```

Reward weights must be configurable.

---

# 18. Reinforcement Learning Architecture

Primary algorithm:

**Multi-Agent Proximal Policy Optimization (MAPPO)**

Training strategy:

**Centralized Training with Decentralized Execution (CTDE)**

---

# 19. MAPPO Training Architecture

During training:

```text
                 Global State
                      │
                      ▼
              ┌───────────────┐
              │ Central Critic│
              └───────┬───────┘
                      │
        ┌─────────────┼─────────────┐
        ▼             ▼             ▼
     Actor A       Actor B       Actor N
        │             │             │
        ▼             ▼             ▼
     Action A       Action B      Action N
        │             │             │
        └─────────────┼─────────────┘
                      ▼
                 Environment
```

The centralized critic can use global information during training.

---

# 20. Decentralized Inference

During inference, each actor must operate using its local observation.

```text
Agent A Observation
        ↓
     Actor A
        ↓
     Action A


Agent B Observation
        ↓
     Actor B
        ↓
     Action B


Agent N Observation
        ↓
     Actor N
        ↓
     Action N
```

No centralized action controller should be required during inference.

---

# 21. RLlib Responsibilities

Ray RLlib manages:

- Distributed rollout workers
- Policy execution
- Experience collection
- Training iterations
- Resource allocation
- Algorithm execution
- Evaluation
- Checkpoint integration

The simulation environment should remain reusable independently of RLlib.

---

# 22. PyTorch Model Architecture

Expected model components:

```text
Actor Network
│
├── Observation Encoder
├── Feature Extraction
├── Hidden Layers
└── Action Head


Critic Network
│
├── Global State Encoder
├── Feature Extraction
├── Hidden Layers
└── Value Head
```

Actor and critic implementations must remain independently replaceable.

---

# 23. Training Pipeline

```text
Load Configuration
        ↓
Initialize Environment
        ↓
Initialize Agents
        ↓
Initialize MAPPO
        ↓
Collect Experiences
        ↓
Calculate Rewards
        ↓
Calculate Advantages
        ↓
Update Actors
        ↓
Update Critic
        ↓
Evaluate Policy
        ↓
Record Metrics
        ↓
Save Checkpoint
        ↓
Next Training Iteration
```

---

# 24. Training Configuration

Training configuration must be externalized.

Example:

```yaml
algorithm:
  name: mappo

environment:
  num_agents: 10
  width: 100
  height: 100
  depth: 50

training:
  iterations: 1000
  learning_rate: 0.0003
  gamma: 0.99
  batch_size: 4096

resources:
  num_workers: 4
  num_gpus: 1
```

These values are configurable examples and should not be treated as permanent production values.

---

# 25. Curriculum Learning

Curriculum learning progressively increases environment complexity.

```text
Level 1
Basic Environment
        ↓
Level 2
Static Obstacles
        ↓
Level 3
Increased Agent Density
        ↓
Level 4
Dynamic Obstacles
        ↓
Level 5
Wind + Complex Environment
```

The transition between levels should be based on measurable performance.

Possible criteria:

- Coverage threshold
- Collision threshold
- Average reward
- Episode completion rate

---

# 26. Backend Architecture

FastAPI acts as the control plane.

```text
FastAPI
│
├── Simulation API
├── Training API
├── Model API
├── Metrics API
├── Configuration API
└── Health API
```

Long-running RL training must not block FastAPI request handlers.

Training should execute in:

- Separate processes
- Background workers
- Ray-managed workers

---

# 27. Application Services

```text
SimulationService
TrainingService
ModelService
MetricsService
ConfigurationService
```

Responsibilities:

### SimulationService

- Start simulation
- Stop simulation
- Pause simulation
- Resume simulation
- Load configuration

### TrainingService

- Start training
- Stop training
- Resume training
- Retrieve training status

### ModelService

- List models
- Load models
- Save checkpoints
- Version models

### MetricsService

- Record metrics
- Aggregate metrics
- Return analytics

### ConfigurationService

- Load configuration
- Validate configuration
- Update configuration
- Provide current configuration

---

# 28. REST API Architecture

API version:

```text
/api/v1
```

Simulation:

```text
POST /api/v1/simulation/start
POST /api/v1/simulation/stop
POST /api/v1/simulation/pause
POST /api/v1/simulation/resume
```

Training:

```text
POST /api/v1/training/start
POST /api/v1/training/stop
GET  /api/v1/training/status
```

Models:

```text
GET /api/v1/models
GET /api/v1/models/{model_id}
```

Metrics:

```text
GET /api/v1/metrics
GET /api/v1/metrics/{run_id}
```

Configuration:

```text
GET /api/v1/config
PUT /api/v1/config
```

Health:

```text
GET /api/v1/health
```

All request and response contracts must be defined using typed Pydantic schemas.

---

# 29. WebSocket Architecture

WebSockets are responsible for real-time communication.

Channels:

```text
/ws/simulation
/ws/training
/ws/events
```

---

# 30. Simulation WebSocket

Publishes:

- Agent positions
- Agent velocity
- Agent rotation
- Collision events
- Coverage
- Environment state

Example payload:

```json
{
  "type": "simulation_state",
  "timestamp": 1720000000,
  "episode": 10,
  "step": 152,
  "agents": [
    {
      "id": "drone_01",
      "x": 10.4,
      "y": 7.8,
      "z": 15.2,
      "vx": 0.5,
      "vy": 0.1,
      "vz": -0.2,
      "yaw": 1.4,
      "collision": false
    }
  ],
  "coverage": 74.3,
  "collisions": 2
}
```

The schema must be versioned.

---

# 31. Training WebSocket

Publishes:

- Training iteration
- Episode reward
- Average reward
- Loss
- Coverage
- Collision rate
- Policy metrics
- Checkpoint events

---

# 32. Event Architecture

Important domain events:

```text
SimulationStarted
SimulationStopped
EpisodeStarted
EpisodeCompleted
CollisionDetected
CoverageUpdated
TrainingStarted
TrainingIterationCompleted
CheckpointCreated
TrainingCompleted
```

Events must be:

- Lightweight
- Serializable
- Versioned where appropriate

---

# 33. Frontend Architecture

The frontend contains:

```text
Dashboard
Simulation
Training
Analytics
Models
Settings
```

Technology:

- React
- TypeScript
- Vite
- Tailwind CSS
- Three.js
- React Three Fiber
- Recharts

---

# 34. 3D Visualization Architecture

```text
3D Scene
│
├── Camera
├── Lighting
├── Terrain
├── Obstacles
├── Drone Instances
├── Sensor Cones
├── Flight Paths
├── Coverage Map
└── Debug Overlay
```

The rendering system receives data through frontend state and must not directly control the backend.

---

# 35. Drone Visualization

Each drone should display:

- Position
- Rotation
- Agent ID
- Search status
- Collision status
- Sensor cone
- Flight path

Visual states:

```text
Normal
Searching
Near Collision
Collision
Inactive
Selected
```

---

# 36. Sensor Visualization

Each drone has a semi-transparent sensor cone.

```text
               /\
              /  \
             /    \
            /      \
           /        \
          /          \
         ●
       Drone
```

The visualization indicates the region the drone is currently sensing.

---

# 37. Coverage Visualization

The 3D environment should show search progress.

```text
Unexplored
    ↓
Neutral / Dark

Explored
    ↓
Highlighted

Recently Explored
    ↓
Strong Highlight

Obstacle
    ↓
Distinct Visualization
```

Coverage updates must be streamed in real time.

---

# 38. Frontend State Architecture

Separate state by domain:

```text
simulationStore
trainingStore
uiStore
configurationStore
```

The frontend must not duplicate unnecessary backend state.

---

# 39. Frontend Data Flow

```text
REST API
    ↓
API Service
    ↓
React Query
    ↓
Application State


WebSocket
    ↓
WebSocket Service
    ↓
Simulation / Training Store
    ↓
React Components
    ↓
Three.js Scene
```

---

# 40. Analytics Architecture

```text
Simulation Engine
       +
RL Engine
       ↓
Metrics Service
       ↓
Metrics Aggregation
       ↓
REST / WebSocket
       ↓
Analytics Dashboard
```

Primary metrics:

- Percentage of Map Explored
- Total Collisions
- Collision Rate
- Average Reward
- Maximum Reward
- Episode Length
- Training Loss
- Policy Performance
- Active Agent Count

---

# 41. Model Management

Models must be versioned.

```text
models/
└── mappo/
    ├── v001/
    ├── v002/
    ├── v003/
    └── best/
```

Model metadata must include:

- Model version
- Training run
- Environment version
- Reward configuration
- Training configuration
- Evaluation metrics
- Timestamp
- Git commit

---

# 42. Checkpoint Architecture

A checkpoint should contain sufficient information to resume training.

Required:

```text
Actor Weights
Critic Weights
Optimizer State
Training Iteration
Random Seed
Environment Configuration
Training Configuration
Reward Configuration
Curriculum State
```

The checkpoint system must support:

```text
Save Checkpoint
       ↓
Load Checkpoint
       ↓
Resume Training
```

Checkpoint restoration must be automatically tested.

---

# 43. Reproducibility Architecture

Every training run must record:

- Run ID
- Random seed
- Model version
- Environment version
- Number of agents
- Environment configuration
- Reward configuration
- Training configuration
- Python version
- PyTorch version
- Ray version
- Hardware information
- Git commit

Compatible environments should produce comparable results from the same configuration.

---

# 44. Configuration Architecture

Configuration files:

```text
configs/
│
├── environment.yaml
├── training.yaml
├── reward.yaml
├── rendering.yaml
└── development.yaml
```

Configuration categories:

```text
Environment
Training
Rewards
Physics
Sensors
Obstacles
Wind
Rendering
Logging
Resources
```

---

# 45. Resource Architecture

Training and visualization should be isolated when necessary.

## Training

Uses:

- GPU
- CPU
- RAM
- Ray Workers

## Simulation

Uses:

- CPU
- RAM

## Visualization

Uses:

- Browser GPU
- WebGL

Training must not unnecessarily block real-time visualization.

---

# 46. Scalability Architecture

Initial target:

```text
10 Agents
```

Intermediate target:

```text
25 Agents
```

Primary target:

```text
50 Agents
```

Future:

```text
100+ Agents
```

Scalability mechanisms:

- Vectorized environments
- Distributed rollout workers
- Batched policy inference
- Efficient observations
- Efficient serialization
- WebSocket throttling
- Instanced rendering
- Level-of-detail rendering

---

# 47. Performance Architecture

The following metrics must be measured independently:

```text
Simulation Step Time
Policy Inference Time
Training Iteration Time
WebSocket Latency
Frontend Render Time
3D FPS
Memory Usage
GPU Usage
CPU Usage
```

The system must allow configurable WebSocket update frequency.

---

# 48. Fault Tolerance

The platform must gracefully handle:

- Simulation failure
- Training interruption
- WebSocket disconnection
- Model loading failure
- Invalid configuration
- Resource exhaustion

Recovery mechanisms:

```text
Checkpoint Recovery
Retry
Reconnect
Graceful Shutdown
State Restoration
```

---

# 49. Logging Architecture

Subsystems:

```text
Simulation Logs
Training Logs
API Logs
WebSocket Logs
Model Logs
Error Logs
```

Log levels:

```text
DEBUG
INFO
WARNING
ERROR
CRITICAL
```

Production mode must avoid excessive per-step logging.

---

# 50. Observability Architecture

The platform should expose:

- System health
- Simulation status
- Training status
- Resource usage
- Error rates
- Active connections
- Model status

Recommended stack:

```text
Application
    ↓
Prometheus
    ↓
Grafana
```

Training metrics can additionally use:

- TensorBoard
- MLflow

---

# 51. Testing Architecture

Testing layers:

```text
Unit Tests
     ↓
Environment Tests
     ↓
Physics Tests
     ↓
Reward Tests
     ↓
RL Tests
     ↓
API Tests
     ↓
WebSocket Tests
     ↓
Integration Tests
     ↓
End-to-End Tests
```

Critical tests:

- Observation correctness
- Action validation
- Physics calculations
- Collision detection
- Reward calculation
- Coverage calculation
- Curriculum progression
- MAPPO integration
- Checkpoint recovery
- WebSocket schema validation
- Simulation synchronization

---

# 52. Security Architecture

The simulator must protect:

- Training configurations
- Model artifacts
- API endpoints
- Administrative functions

Use:

- Authentication
- Authorization
- Input validation
- API rate limiting
- Secure environment variables
- HTTPS
- Protected model storage

Never store secrets in source code.

---

# 53. Deployment Architecture

## Development

```text
React
   ↓
FastAPI
   ↓
Simulation Engine
   ↓
RL Engine
```

---

## Production

```text
                    ┌──────────────┐
                    │    Nginx     │
                    └──────┬───────┘
                           │
             ┌─────────────┴─────────────┐
             │                           │
             ▼                           ▼
      React Frontend               FastAPI Backend
                                           │
                              ┌────────────┴────────────┐
                              │                         │
                              ▼                         ▼
                       Simulation Service        Training Service
                              │                         │
                              ▼                         ▼
                     Simulation Engine             Ray RLlib
                                                        │
                                                        ▼
                                                     PyTorch
```

GPU training may run on dedicated compute infrastructure.

---

# 54. Docker Architecture

Development and deployment may use:

```text
docker-compose.yml
```

Services:

```text
frontend
backend
simulation
training
monitoring
nginx
```

Training containers should support GPU access when available.

---

# 55. Project Directory Structure

```text
swarmrl/
│
├── backend/
│   └── app/
│       ├── api/
│       │   ├── simulation.py
│       │   ├── training.py
│       │   ├── models.py
│       │   ├── metrics.py
│       │   └── config.py
│       │
│       ├── core/
│       ├── schemas/
│       ├── services/
│       ├── websocket/
│       └── main.py
│
├── environment/
│   ├── agents/
│   │   ├── drone.py
│   │   └── agent_registry.py
│   │
│   ├── physics/
│   │   ├── physics_engine.py
│   │   ├── movement.py
│   │   └── wind.py
│   │
│   ├── obstacles/
│   │   ├── obstacle.py
│   │   └── obstacle_manager.py
│   │
│   ├── sensors/
│   │   ├── sensor_model.py
│   │   └── lidar_sensor.py
│   │
│   ├── rewards/
│   │   ├── reward_engine.py
│   │   ├── exploration_reward.py
│   │   └── collision_penalty.py
│   │
│   ├── coverage/
│   │   ├── coverage_map.py
│   │   └── coverage_tracker.py
│   │
│   ├── curriculum/
│   │   └── curriculum_manager.py
│   │
│   └── disaster_env.py
│
├── rl/
│   ├── algorithms/
│   │   └── mappo.py
│   │
│   ├── policies/
│   │   ├── actor.py
│   │   └── critic.py
│   │
│   ├── models/
│   │   ├── actor_network.py
│   │   ├── critic_network.py
│   │   └── sensor_encoder.py
│   │
│   ├── trainers/
│   │   └── trainer.py
│   │
│   ├── callbacks/
│   │   └── metrics_callback.py
│   │
│   └── evaluation/
│       ├── evaluator.py
│       └── benchmark.py
│
├── simulation/
│   ├── state/
│   │   └── simulation_state.py
│   │
│   ├── engine/
│   │   └── simulation_engine.py
│   │
│   ├── events/
│   │   └── events.py
│   │
│   └── streaming/
│       └── state_publisher.py
│
├── frontend/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── layouts/
│       ├── hooks/
│       ├── services/
│       ├── stores/
│       ├── utils/
│       │
│       └── three/
│           ├── Scene.tsx
│           ├── Drone.tsx
│           ├── Terrain.tsx
│           ├── Obstacle.tsx
│           ├── SensorCone.tsx
│           ├── CoverageMap.tsx
│           └── FlightPath.tsx
│
├── configs/
│   ├── environment.yaml
│   ├── training.yaml
│   ├── reward.yaml
│   └── rendering.yaml
│
├── models/
│
├── checkpoints/
│
├── metrics/
│
├── tests/
│   ├── unit/
│   ├── environment/
│   ├── rl/
│   ├── api/
│   ├── websocket/
│   └── e2e/
│
├── scripts/
│
├── docker/
│
├── docs/
│   ├── PRD.md
│   ├── Architecture.md
│   ├── Rules.md
│   ├── Phases.md
│   └── Design.md
│
├── pyproject.toml
├── docker-compose.yml
└── README.md
```

---

# 56. Module Responsibilities

| Module | Responsibility |
|---|---|
| `environment` | Environment and agent interaction |
| `environment/agents` | Drone state and agent identity |
| `environment/physics` | Movement and physical behavior |
| `environment/obstacles` | Static and dynamic obstacles |
| `environment/sensors` | Sensor observations |
| `environment/rewards` | Reward calculation |
| `environment/coverage` | Exploration tracking |
| `environment/curriculum` | Difficulty progression |
| `simulation` | Runtime simulation management |
| `rl` | MAPPO and model training |
| `backend` | API and application control |
| `frontend` | UI and 3D visualization |
| `configs` | Runtime configuration |
| `models` | Model artifacts |
| `checkpoints` | Training recovery |
| `metrics` | Analytics |
| `tests` | Automated verification |

---

# 57. Mandatory Architecture Boundaries

## Frontend MUST NOT

- Implement MAPPO.
- Calculate authoritative rewards.
- Modify simulation state directly.
- Access Python internals.
- Contain training logic.

## Backend MUST NOT

- Contain Three.js rendering code.
- Duplicate environment physics.
- Implement RL algorithms.
- Become the simulation state source.

## Simulation Engine MUST NOT

- Depend on React.
- Depend on browser APIs.
- Contain REST route logic.
- Contain UI state.

## RL Engine MUST NOT

- Contain frontend rendering.
- Depend on browser components.
- Hardcode environment configuration.

## Configuration MUST NOT

- Be duplicated across source files.
- Be hardcoded into model classes.

---

# 58. End-to-End Training Data Flow

```text
Configuration
      ↓
Environment Initialization
      ↓
Agent Creation
      ↓
Observation Generation
      ↓
MAPPO Actor
      ↓
Actions
      ↓
Environment Step
      ↓
Physics
      ↓
Collision Detection
      ↓
Coverage Update
      ↓
Reward Calculation
      ↓
Next Observation
      ↓
Experience Collection
      ↓
MAPPO Update
      ↓
Evaluation
      ↓
Metrics
      ↓
Checkpoint
```

---

# 59. End-to-End Visualization Data Flow

```text
Simulation Engine
      ↓
Canonical Simulation State
      ↓
State Publisher
      ↓
WebSocket
      ↓
Frontend WebSocket Service
      ↓
Simulation Store
      ↓
React Components
      ↓
Three.js Scene
      ↓
3D Drone Visualization
```

---

# 60. End-to-End Analytics Data Flow

```text
Simulation Engine
        +
RL Training Engine
        ↓
Metrics Service
        ↓
Metrics Aggregation
        ↓
REST API / WebSocket
        ↓
Frontend Analytics Store
        ↓
Recharts
        ↓
Analytics Dashboard
```

---

# 61. Architecture Decision Record

| Decision | Selected Technology | Reason |
|---|---|---|
| Multi-Agent Environment | PettingZoo / Gymnasium | Standard multi-agent RL interface |
| RL Framework | Ray RLlib | Distributed RL training |
| RL Algorithm | MAPPO | Cooperative multi-agent learning |
| Deep Learning | PyTorch | Flexible neural network development |
| Backend | FastAPI | High-performance Python API |
| Frontend | React | Component-based UI |
| 3D Engine | Three.js | Browser-based WebGL |
| React 3D | React Three Fiber | React integration with Three.js |
| Charts | Recharts | React-compatible analytics |
| Real-Time | WebSockets | Low-latency streaming |
| Configuration | YAML | Human-readable configuration |
| Containerization | Docker | Reproducible environments |
| Monitoring | Prometheus + Grafana | System observability |
| Experiment Tracking | TensorBoard / MLflow | ML experiment analysis |

---

# 62. Future Architecture Extensions

The architecture must support future integration with:

- ROS2
- Real autonomous drones
- Hardware-in-the-loop simulation
- LiDAR simulation
- Camera simulation
- GPS-denied navigation
- Real-world terrain data
- Multi-swarm coordination
- Edge inference
- Multi-objective RL
- Imitation Learning
- Human-in-the-loop control
- Distributed multi-cluster training

New features must respect the existing architectural boundaries.

---

# 63. Architecture Validation Checklist

Before considering the architecture complete, verify:

- [ ] Simulation is independent from frontend.
- [ ] RL engine is independent from frontend.
- [ ] Backend provides clean application APIs.
- [ ] WebSockets provide real-time state.
- [ ] Environment follows multi-agent interfaces.
- [ ] Agent observations are well-defined.
- [ ] Actions are validated.
- [ ] Physics is modular.
- [ ] Collision detection is isolated.
- [ ] Reward system is modular.
- [ ] Coverage tracking is isolated.
- [ ] Curriculum learning is configurable.
- [ ] MAPPO supports centralized training.
- [ ] Inference supports decentralized execution.
- [ ] Models are versioned.
- [ ] Checkpoints are recoverable.
- [ ] Training is reproducible.
- [ ] Dashboard renders the swarm in 3D.
- [ ] Analytics are available.
- [ ] System can scale toward 50 agents.
- [ ] Tests exist for all critical modules.
- [ ] Configuration is externalized.
- [ ] Documentation remains synchronized with implementation.

---

# 64. Final Architecture Principle

The most important rule of the SwarmRL architecture is:

> **The environment is the source of truth, the RL engine learns from the environment, the backend controls the application, WebSockets distribute real-time state, and the frontend visualizes that state.**

The system must never collapse these responsibilities into one large module.

The final architecture must remain:

```text
Modular
+
Scalable
+
Testable
+
Reproducible
+
Maintainable
+
Real-Time
+
AI-Ready
```