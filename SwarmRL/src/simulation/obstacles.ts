/**
 * SwarmRL - Obstacle & Environment Hazard Manager
 */

import { ObstacleState, Vector3D } from '../types';

export class ObstacleManager {
  private obstacles: ObstacleState[] = [];

  constructor() {}

  /**
   * Generates a procedural disaster response environment with collapsed buildings, rubble towers, and dynamic hazard zones
   */
  public generateDisasterZone(
    width: number,
    length: number,
    density: 'LOW' | 'MEDIUM' | 'HIGH' | 'EXTREME'
  ): ObstacleState[] {
    this.obstacles = [];

    const numBuildingCols = density === 'LOW' ? 3 : density === 'MEDIUM' ? 5 : density === 'HIGH' ? 7 : 9;
    const numBuildingRows = density === 'LOW' ? 3 : density === 'MEDIUM' ? 5 : density === 'HIGH' ? 7 : 9;

    const xSpacing = width / (numBuildingCols + 1);
    const zSpacing = length / (numBuildingRows + 1);

    let idCount = 1;

    for (let c = 1; c <= numBuildingCols; c++) {
      for (let r = 1; r <= numBuildingRows; r++) {
        // Skip central search square for initial drone spawn safety
        const posX = c * xSpacing - width / 2;
        const posZ = r * zSpacing - length / 2;

        if (Math.abs(posX) < 15 && Math.abs(posZ) < 15) {
          continue; // keep center clear for takeoff
        }

        const isCollapsed = Math.random() < 0.4;
        const isHighRise = Math.random() < 0.3;

        const w = 8 + Math.random() * 12;
        const d = 8 + Math.random() * 12;
        const h = isCollapsed
          ? 4 + Math.random() * 6
          : isHighRise
          ? 22 + Math.random() * 18
          : 12 + Math.random() * 10;

        const type = isCollapsed ? 'RUIN' : isHighRise ? 'COLLAPSED_TOWER' : 'BUILDING';

        this.obstacles.push({
          id: `obs_${idCount++}`,
          type,
          position: { x: posX, y: h / 2, z: posZ },
          size: { x: w, y: h, z: d },
          danger_radius: Math.max(w, d) / 2 + 1.5,
          color: isCollapsed ? '#78716C' : '#475569',
        });
      }
    }

    // Add 2-4 Dynamic hazards (floating/moving crane debris or smoke plumes)
    const numDynamic = density === 'EXTREME' ? 4 : 2;
    for (let i = 0; i < numDynamic; i++) {
      const angle = (i * Math.PI * 2) / numDynamic;
      const radius = 25 + Math.random() * 15;
      this.obstacles.push({
        id: `dyn_hazard_${i + 1}`,
        type: 'DYNAMIC_HAZARD',
        position: {
          x: Math.cos(angle) * radius,
          y: 12 + Math.random() * 10,
          z: Math.sin(angle) * radius,
        },
        size: { x: 5, y: 5, z: 5 },
        velocity: {
          x: (Math.random() - 0.5) * 4,
          y: (Math.random() - 0.5) * 1.5,
          z: (Math.random() - 0.5) * 4,
        },
        danger_radius: 4.5,
        color: '#EF4444',
      });
    }

    return this.obstacles;
  }

  public getObstacles(): ObstacleState[] {
    return this.obstacles;
  }

  /**
   * Updates dynamic obstacles positions
   */
  public updateDynamicObstacles(width: number, length: number, dt: number = 0.05) {
    const halfW = width / 2;
    const halfL = length / 2;

    for (const obs of this.obstacles) {
      if (obs.type === 'DYNAMIC_HAZARD' && obs.velocity) {
        obs.position.x += obs.velocity.x * dt;
        obs.position.y += obs.velocity.y * dt;
        obs.position.z += obs.velocity.z * dt;

        // Bounce back if hitting environment limits
        if (Math.abs(obs.position.x) > halfW - 5) obs.velocity.x *= -1;
        if (Math.abs(obs.position.z) > halfL - 5) obs.velocity.z *= -1;
        if (obs.position.y < 5 || obs.position.y > 35) obs.velocity.y *= -1;
      }
    }
  }

  /**
   * Checks point collision with axis-aligned bounding boxes of all obstacles
   */
  public checkPointCollision(pos: Vector3D, droneRadius: number = 0.8): { hit: boolean; obstacle?: ObstacleState } {
    for (const obs of this.obstacles) {
      const minX = obs.position.x - obs.size.x / 2 - droneRadius;
      const maxX = obs.position.x + obs.size.x / 2 + droneRadius;
      const minY = 0; // Ground level
      const maxY = obs.position.y + obs.size.y / 2 + droneRadius;
      const minZ = obs.position.z - obs.size.z / 2 - droneRadius;
      const maxZ = obs.position.z + obs.size.z / 2 + droneRadius;

      if (
        pos.x >= minX &&
        pos.x <= maxX &&
        pos.y >= minY &&
        pos.y <= maxY &&
        pos.z >= minZ &&
        pos.z <= maxZ
      ) {
        return { hit: true, obstacle: obs };
      }
    }
    return { hit: false };
  }
}
