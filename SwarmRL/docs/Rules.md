# Rules.md

# SwarmRL – AI Development & Engineering Rules

**Version:** 1.0  
**Status:** Active  
**Project:** SwarmRL – Multi-Agent Deep Reinforcement Learning Simulator

---

# 1. Purpose

This document defines the mandatory coding, architecture, reinforcement learning, simulation, security, testing, and AI-assistant rules for SwarmRL.

Every developer and AI coding assistant must follow these rules.

These rules exist to ensure that SwarmRL remains:

- Modular
- Stable
- Reproducible
- Testable
- Scalable
- Maintainable
- Performance-oriented

---

# 2. Core Principles

Always prioritize:

1. Correctness
2. Reproducibility
3. Modularity
4. Testability
5. Performance
6. Maintainability
7. Security
8. Observability

Never sacrifice correctness merely to make implementation shorter.

---

# 3. Documentation Rules

The following documents are the source of truth:

```text
docs/PRD.md
docs/Architecture.md
docs/Rules.md
docs/Phases.md
docs/Design.md
```

Before implementing a feature, AI assistants must read the relevant documentation.

If implementation assumptions conflict with documentation:

```text
Documentation > Assumption
```

Never silently redefine project requirements.

---

# 4. Architecture Rules

Follow the architecture defined in `Architecture.md`.

Mandatory layers:

```text
Frontend
    ↓
API / WebSocket
    ↓
Application Services
    ↓
Simulation / Domain
    ↓
RL Engine
    ↓
Infrastructure
```

Do not collapse all functionality into a single module.

---

# 5. Module Responsibility Rules

Each module must have one clear responsibility.

Examples:

```text
environment/
    Environment logic

physics/
    Movement and physics

rewards/
    Reward calculation

sensors/
    Sensor observations

rl/
    Reinforcement learning

backend/
    APIs and application services

frontend/
    User interface

three/
    3D rendering
```

Never place unrelated functionality into an existing module simply because it is convenient.

---

# 6. Simulation Rules

The Simulation Engine is the authoritative source of environment state.

Only the simulation engine may directly modify:

- Agent position
- Agent velocity
- Agent orientation
- Environment state
- Collision state
- Coverage state

The frontend must never directly mutate authoritative simulation state.

---

# 7. Agent Rules

Every agent must have:

- Unique ID
- Position
- Velocity
- Orientation
- Observation
- Action
- Status
- Reward
- Collision state

Agent state must be explicit and serializable.

Never rely on hidden mutable state.

---

# 8. Multi-Agent Rules

SwarmRL must support configurable agent counts.

Supported target progression:

```text
1 → 5 → 10 → 25 → 50
```

The system must not hardcode exactly 50 agents.

Agent count must be configuration-driven.

Example:

```yaml
environment:
  num_agents: 10
```

---

# 9. Environment Rules

The environment must use a standard multi-agent interface compatible with PettingZoo/Gymnasium.

Required operations:

```python
reset()
step(actions)
render()
close()
```

Environment implementations must be deterministic when provided with:

- Same seed
- Same configuration
- Same initial state
- Same actions

---

# 10. Randomness Rules

All randomness must be controllable.

Every training or evaluation run must support:

```text
random_seed
```

Randomness must not be generated using uncontrolled global state.

Record the seed for every experiment.

---

# 11. Observation Rules

Observations must:

- Have a documented schema.
- Have fixed or explicitly dynamic dimensions.
- Be normalized when required.
- Be reproducible.
- Be validated before entering the policy.

Observation generation must not depend on frontend code.

---

# 12. Action Rules

All actions must be validated before application.

Validation must check:

- Shape
- Type
- Bounds
- NaN values
- Infinite values

Invalid actions must not corrupt the environment.

Never silently accept invalid numerical values.

---

# 13. Physics Rules

Physics must be isolated from RL logic.

The physics engine is responsible for:

- Position updates
- Velocity updates
- Acceleration
- Rotation
- Wind
- Movement constraints

RL policies must select actions; they must not directly manipulate positions.

---

# 14. Collision Rules

Collision detection must be deterministic and independently testable.

Supported collision types:

```text
Drone ↔ Drone
Drone ↔ Obstacle
Drone ↔ Boundary
```

Every collision must produce a structured event.

Collision information must be available to:

- Reward Engine
- Metrics System
- Event System
- Visualization Layer

The frontend must not independently determine authoritative collisions.

---

# 15. Reward Rules

Rewards must be modular.

Never implement the complete reward function inside the environment's main class.

Use independent components such as:

```text
ExplorationReward
CollisionPenalty
BoundaryPenalty
CooperationReward
EfficiencyReward
SafetyReward
```

Reward weights must be configurable.

Example:

```yaml
reward:
  exploration: 1.0
  collision: -100.0
  boundary: -10.0
  cooperation: 0.5
  efficiency: 0.2
```

Do not hardcode reward values inside policy code.

---

# 16. Reward Engineering Rules

Reward functions must encourage the intended behavior.

The reward system must avoid:

- Reward exploitation
- Endless circling
- Agent clustering
- Boundary hugging
- Collision farming
- Repeated exploration rewards for the same region

Whenever reward behavior changes, add or update tests.

---

# 17. Coverage Rules

Coverage calculation must be independent from the UI.

The Coverage Manager is responsible for:

- Tracking explored cells.
- Detecting newly explored regions.
- Calculating coverage percentage.
- Providing exploration metrics.

Coverage must not depend on rendered pixels.

---

# 18. Sensor Rules

Sensors must use an abstraction layer.

Required interface concept:

```python
class Sensor:
    def observe(self, state):
        ...
```

Initial sensor:

```text
LiDAR-like distance sensor
```

Potential future sensors:

```text
Camera
Radar
Depth
GPS
IMU
```

Adding a new sensor should not require rewriting the environment.

---

# 19. Reinforcement Learning Rules

Primary algorithm:

```text
MAPPO
```

Framework:

```text
Ray RLlib
```

Deep learning:

```text
PyTorch
```

The RL engine must remain independent from frontend rendering.

---

# 20. Centralized Training Rules

During training, the centralized critic may access global information.

Global information can include:

- Agent positions
- Agent velocities
- Global coverage
- Global obstacle state
- Global environment state

The critic must not expose global information to decentralized actors during inference unless explicitly required by the architecture.

---

# 21. Decentralized Inference Rules

During inference:

Each agent must make decisions from its permitted local observation.

```text
Local Observation
        ↓
Actor
        ↓
Action
```

Do not implement a centralized action controller unless explicitly introduced as a separate experiment.

---

# 22. RL Model Rules

Actor and critic networks must be modular.

Recommended structure:

```text
models/
├── actor_network.py
├── critic_network.py
└── sensor_encoder.py
```

Never place training orchestration inside neural network classes.

Neural network classes should focus on:

- Forward pass
- Architecture
- Tensor handling

---

# 23. RLlib Rules

RLlib is responsible for:

- Distributed training
- Rollout execution
- Resource management
- Algorithm orchestration
- Training iterations

Do not duplicate RLlib functionality unnecessarily.

Avoid writing custom distributed infrastructure when RLlib already provides the required capability.

---

# 24. Training Rules

Every training run must have:

- Configuration
- Run ID
- Seed
- Environment version
- Model version
- Reward version
- Training metrics
- Checkpoints

Training must be resumable.

Never start long training runs without checkpoint support.

---

# 25. Checkpoint Rules

Checkpoints must contain enough information to resume training.

Minimum:

```text
Actor State
Critic State
Optimizer State
Training Iteration
Environment Configuration
Training Configuration
Reward Configuration
Random Seed
Curriculum State
```

Never overwrite the only existing checkpoint.

Keep versioned checkpoints.

---

# 26. Curriculum Learning Rules

Curriculum learning must be measurable.

Do not increase difficulty simply because a certain number of episodes has passed.

Possible progression criteria:

```text
Average Reward
Collision Rate
Coverage
Episode Success Rate
```

Difficulty changes must be logged.

---

# 27. Dynamic Obstacle Rules

Obstacles must have clear state.

Example:

```text
Obstacle
├── ID
├── Position
├── Size
├── Velocity
├── Type
└── Active
```

Obstacle behavior must be deterministic under a fixed seed.

---

# 28. Wind Simulation Rules

Wind must be configurable.

Example:

```yaml
wind:
  enabled: true
  strength: 2.0
  direction: 90
  variability: 0.1
```

Wind logic must remain inside the physics/environment subsystem.

Do not place wind calculations inside the neural network.

---

# 29. Backend Rules

Backend:

```text
FastAPI
```

Architecture:

```text
API Route
   ↓
Service
   ↓
Domain / Engine
```

API routes must remain thin.

Do not place:

- Physics logic
- RL algorithms
- Large processing loops

inside API route handlers.

---

# 30. Long-Running Task Rules

Never execute long-running RL training directly inside a normal HTTP request.

Bad:

```python
@app.post("/training/start")
def start_training():
    run_training_for_hours()
```

Instead:

```text
API
 ↓
Training Service
 ↓
Training Process / Ray
```

The API should return job information rather than block indefinitely.

---

# 31. API Rules

API version:

```text
/api/v1
```

Use REST semantics.

Always:

- Validate requests.
- Validate responses.
- Use proper status codes.
- Use typed schemas.
- Return structured errors.

Never expose internal exceptions to users.

---

# 32. WebSocket Rules

WebSockets are for real-time state delivery.

Do not use WebSockets for operations that are better represented by REST.

Examples:

```text
REST:
Start Training

WebSocket:
Training Progress
```

WebSocket messages must use documented schemas.

---

# 33. WebSocket Performance Rules

Do not stream every internal simulation operation blindly.

Streaming frequency must be configurable.

Example:

```yaml
streaming:
  simulation_hz: 20
```

When agent count increases, the system should be able to reduce transmission frequency without breaking simulation correctness.

---

# 34. Frontend Rules

Frontend:

```text
React
TypeScript
Vite
Tailwind CSS
```

Use functional components only.

Use:

- React Query
- Zustand
- React Hook Form

Avoid:

- Class components
- Excessive global state
- Duplicate API logic

---

# 35. TypeScript Rules

TypeScript strict mode must be enabled.

Avoid:

```typescript
any
```

unless there is a documented reason.

Prefer:

```typescript
interface
type
unknown
```

Never suppress TypeScript errors without explanation.

---

# 36. 3D Rendering Rules

Technology:

```text
Three.js
React Three Fiber
```

The 3D renderer must only visualize state.

It must not become the source of truth.

Never calculate authoritative:

- Rewards
- Collisions
- Coverage
- Agent physics

inside Three.js components.

---

# 37. 3D Performance Rules

The renderer must be designed for multi-agent visualization.

Use:

- Instanced rendering where appropriate.
- Shared geometries.
- Shared materials.
- Object reuse.
- Level-of-detail techniques.

Avoid creating excessive objects every frame.

---

# 38. State Management Rules

Separate stores:

```text
simulationStore
trainingStore
uiStore
configurationStore
```

Do not place all application state into one global store.

Avoid storing large immutable simulation histories in React state.

---

# 39. Configuration Rules

Configuration must be externalized.

Required configuration areas:

```text
environment
training
reward
physics
sensors
obstacles
wind
rendering
streaming
logging
```

Never hardcode environment-specific values throughout the codebase.

---

# 40. Dependency Rules

Preferred core libraries:

```text
PettingZoo
Gymnasium
Ray RLlib
PyTorch
FastAPI
Pydantic
React
TypeScript
Three.js
React Three Fiber
Recharts
```

Before adding a dependency:

1. Check whether an existing library already solves the problem.
2. Check whether the dependency is actively maintained.
3. Consider project complexity.
4. Document why it is needed.

Do not add dependencies unnecessarily.

---

# 41. Python Standards

Use:

```text
Python 3.12+
PEP 8
Type Hints
Ruff
Black
```

Prefer:

- Clear names
- Small functions
- Explicit interfaces
- Dataclasses/Pydantic where suitable

Avoid:

- Global mutable state
- Hidden side effects
- Magic numbers
- Deeply nested logic

---

# 42. Function Rules

Functions should have one responsibility.

Preferred maximum:

```text
~50 lines
```

Longer functions should be reviewed for decomposition.

Avoid functions that simultaneously:

- Read configuration
- Run physics
- Calculate rewards
- Save data
- Send WebSocket messages

Break these responsibilities into services/components.

---

# 43. File Rules

Preferred maximum:

```text
~400 lines
```

Large files must be reviewed for module decomposition.

Do not create one giant:

```text
simulation.py
```

containing the entire simulator.

---

# 44. Error Handling Rules

Always:

- Catch expected exceptions.
- Log useful context.
- Return safe errors.
- Preserve system state where possible.

Never:

- Use empty exception handlers.
- Hide failures.
- Continue silently after corrupted state.
- Expose stack traces publicly.

---

# 45. Numerical Stability Rules

Machine learning and simulation code must explicitly handle:

- NaN
- Infinity
- Overflow
- Invalid tensor shapes
- Invalid dimensions
- Division by zero

Before training:

```text
Validate Inputs
↓
Validate Observations
↓
Validate Actions
↓
Validate Rewards
```

Training must stop or fail safely when numerical corruption is detected.

---

# 46. GPU Rules

GPU usage must be configurable.

The application must support:

```text
CPU-only
GPU
Multi-GPU where supported
```

Do not assume CUDA is always available.

Always check device availability.

---

# 47. Reproducibility Rules

Every experiment must record:

```text
Seed
Model Version
Environment Version
Configuration
Software Versions
Hardware
Git Commit
```

Whenever possible, use deterministic settings for evaluation experiments.

---

# 48. Logging Rules

Use structured logging.

Log important events:

```text
Simulation Started
Simulation Stopped
Episode Started
Episode Completed
Collision Detected
Training Started
Training Iteration Completed
Checkpoint Created
Training Completed
```

Do not log every simulation step in production unless explicitly enabled.

---

# 49. Metrics Rules

Always track:

- Episode reward
- Average reward
- Episode length
- Coverage
- Collision count
- Collision rate
- Training loss
- Policy metrics
- Agent count
- Simulation step time

Metrics must be structured and machine-readable.

---

# 50. Testing Rules

All significant features must have tests.

Testing categories:

```text
Unit
Environment
Physics
Reward
RL
API
WebSocket
Integration
End-to-End
```

Critical functionality must never rely only on manual testing.

---

# 51. Environment Testing Rules

Test:

- Reset behavior
- Agent creation
- Step behavior
- Observation shape
- Action validation
- Termination
- Truncation
- Seed reproducibility

---

# 52. Physics Testing Rules

Test:

- Position updates
- Velocity updates
- Boundary handling
- Wind calculations
- Rotation
- Movement constraints

Physics tests should use deterministic inputs.

---

# 53. Collision Testing Rules

Test:

- Agent-to-agent collisions
- Agent-to-obstacle collisions
- Boundary collisions
- Near-collision safety threshold
- Collision event generation

Use known geometric test cases.

---

# 54. Reward Testing Rules

Each reward component must be independently testable.

Example:

```text
New Area Explored
→ Positive Reward

Collision
→ Strong Negative Reward

Boundary Violation
→ Negative Reward
```

Do not test only the final combined reward.

---

# 55. RL Testing Rules

Do not require thousands of training iterations in unit tests.

Use:

- Small environments
- Few agents
- Small models
- Short rollouts

Training smoke tests should confirm:

- Model initializes.
- Environment integrates.
- Forward pass works.
- Backpropagation works.
- Checkpoint works.

---

# 56. API Testing Rules

Test:

- Success cases
- Invalid inputs
- Missing parameters
- Unauthorized access
- Server errors
- Training job status

---

# 57. WebSocket Testing Rules

Test:

- Connection
- Disconnection
- Reconnection
- Message schema
- Event ordering
- Invalid payloads

---

# 58. Frontend Testing Rules

Test:

- Components
- Stores
- API integration
- WebSocket integration
- Dashboard rendering
- Simulation controls

3D rendering tests should focus on state-to-visual synchronization rather than pixel-perfect screenshots.

---

# 59. Security Rules

Protect:

- APIs
- Model files
- Training controls
- Configuration endpoints
- Administrative operations

Use:

- Authentication
- Authorization
- HTTPS
- Input validation
- Rate limiting
- Secure environment variables

Never commit:

```text
API Keys
Passwords
Tokens
Private Certificates
Secrets
```

---

# 60. Git Rules

Branches:

```text
main
develop
feature/<name>
bugfix/<name>
refactor/<name>
experiment/<name>
```

Commit format:

```text
feat:
fix:
refactor:
docs:
test:
perf:
chore:
experiment:
```

Example:

```text
feat: add multi-agent collision detection
```

---

# 61. Experiment Branch Rules

Experimental RL work must not silently modify production behavior.

Use:

```text
experiment/<experiment-name>
```

Document:

- Hypothesis
- Configuration
- Expected outcome
- Actual outcome
- Metrics

---

# 62. Documentation Rules

Every major module must include:

- Purpose
- Responsibilities
- Public interfaces
- Configuration
- Usage
- Testing notes

Update documentation when architecture changes.

---

# 63. AI Coding Assistant Rules

AI coding assistants must:

1. Read `PRD.md`.
2. Read `Architecture.md`.
3. Read `Rules.md`.
4. Read `Phases.md`.
5. Read `Design.md`.
6. Inspect existing code before creating files.
7. Follow the current phase only.
8. Reuse existing components where possible.
9. Write tests with implementation.
10. Explain significant architectural changes.

AI assistants must NOT:

- Rewrite the whole project unnecessarily.
- Ignore existing implementations.
- Create duplicate modules.
- Change architecture without justification.
- Add dependencies without reason.
- Skip testing.
- Introduce mock production logic.
- Invent requirements.

---

# 64. Phase Execution Rules

Only work on the active phase from `Phases.md`.

Do not automatically implement future phases.

Before moving to the next phase:

```text
Code
↓
Tests
↓
Validation
↓
Documentation
↓
Review
```

Only then proceed.

---

# 65. Change Management Rules

Architectural changes require documentation.

For significant changes, update:

```text
Architecture.md
Rules.md
Phases.md
README.md
```

Never make a major architectural change silently.

---

# 66. Performance Rules

Monitor:

```text
Simulation Step Time
Policy Inference
Training Iteration
Memory Usage
GPU Usage
WebSocket Latency
3D FPS
```

Performance optimizations must be evidence-driven.

Do not optimize prematurely without measurements.

---

# 67. Scalability Rules

The architecture must work progressively with:

```text
1 Agent
5 Agents
10 Agents
25 Agents
50 Agents
```

Do not optimize only for the 1-agent case.

Before increasing agent count, verify:

- CPU usage
- Memory usage
- Simulation step time
- WebSocket throughput
- Rendering FPS

---

# 68. Production Rules

Production code must:

- Have error handling.
- Have logging.
- Have tests.
- Have configuration.
- Have documentation.
- Have health checks.
- Avoid debug output.
- Avoid development-only shortcuts.

Never deploy experimental code as production code without validation.

---

# 69. Definition of Done

A feature is complete only when:

- [ ] Implementation follows Architecture.md.
- [ ] Implementation follows Rules.md.
- [ ] Requirements in PRD.md are satisfied.
- [ ] Tests are added.
- [ ] Tests pass.
- [ ] Error handling exists.
- [ ] Logging exists where appropriate.
- [ ] Configuration is externalized.
- [ ] Documentation is updated.
- [ ] No unnecessary dependencies were added.
- [ ] No architectural boundaries were violated.
- [ ] Performance is acceptable.
- [ ] Security requirements are satisfied.

---

# 70. Golden Rules

These principles override convenience:

1. **The simulation is the source of truth.**
2. **The frontend only visualizes and controls through defined interfaces.**
3. **The RL engine must remain modular.**
4. **Centralized training must remain separate from decentralized execution.**
5. **Rewards must be independently testable.**
6. **Configuration must not be hardcoded.**
7. **Experiments must be reproducible.**
8. **Long-running training must not block API requests.**
9. **Every critical subsystem must be testable.**
10. **Do not change architecture silently.**
11. **Do not create duplicate implementations.**
12. **Do not optimize without measurements.**
13. **Never sacrifice correctness for speed.**
14. **Build one phase at a time.**
15. **Production code must be explainable, maintainable, and recoverable.**

---

# Final Rule

When uncertain about an implementation decision:

```text
Check PRD.md
      ↓
Check Architecture.md
      ↓
Check Rules.md
      ↓
Check Phases.md
      ↓
Inspect Existing Code
      ↓
Choose the smallest solution that preserves the architecture.
```

The system must evolve incrementally rather than being rewritten repeatedly.
