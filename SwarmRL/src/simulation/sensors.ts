/**
 * SwarmRL - Multi-Directional LiDAR Sensor Model
 */

import { ObstacleState, Vector3D } from '../types';

export class LidarSensor {
  private numRays: number;
  private maxRange: number;

  constructor(numRays: number = 8, maxRange: number = 25.0) {
    this.numRays = numRays;
    this.maxRange = maxRange;
  }

  /**
   * Generates ray readings in a 360-degree horizontal fan around the agent
   */
  public readSensors(
    agentPos: Vector3D,
    agentYaw: number,
    obstacles: ObstacleState[],
    envBounds: { width: number; length: number; height: number }
  ): number[] {
    const readings: number[] = [];
    const angleStep = (2 * Math.PI) / this.numRays;

    const halfW = envBounds.width / 2;
    const halfL = envBounds.length / 2;

    for (let i = 0; i < this.numRays; i++) {
      const rayAngle = agentYaw + i * angleStep;
      const dirX = Math.cos(rayAngle);
      const dirZ = Math.sin(rayAngle);

      let closestDist = this.maxRange;

      // 1. Raycast against Environment Boundary Walls
      if (dirX > 0) {
        const distWallX = (halfW - agentPos.x) / dirX;
        if (distWallX > 0 && distWallX < closestDist) closestDist = distWallX;
      } else if (dirX < 0) {
        const distWallX = (-halfW - agentPos.x) / dirX;
        if (distWallX > 0 && distWallX < closestDist) closestDist = distWallX;
      }

      if (dirZ > 0) {
        const distWallZ = (halfL - agentPos.z) / dirZ;
        if (distWallZ > 0 && distWallZ < closestDist) closestDist = distWallZ;
      } else if (dirZ < 0) {
        const distWallZ = (-halfL - agentPos.z) / dirZ;
        if (distWallZ > 0 && distWallZ < closestDist) closestDist = distWallZ;
      }

      // 2. Raycast against Obstacles AABB
      for (const obs of obstacles) {
        const minX = obs.position.x - obs.size.x / 2;
        const maxX = obs.position.x + obs.size.x / 2;
        const minZ = obs.position.z - obs.size.z / 2;
        const maxZ = obs.position.z + obs.size.z / 2;

        // Ray-AABB intersection test
        let tmin = -Infinity;
        let tmax = Infinity;

        if (dirX !== 0) {
          const t1 = (minX - agentPos.x) / dirX;
          const t2 = (maxX - agentPos.x) / dirX;
          tmin = Math.max(tmin, Math.min(t1, t2));
          tmax = Math.min(tmax, Math.max(t1, t2));
        }

        if (dirZ !== 0) {
          const t1 = (minZ - agentPos.z) / dirZ;
          const t2 = (maxZ - agentPos.z) / dirZ;
          tmin = Math.max(tmin, Math.min(t1, t2));
          tmax = Math.min(tmax, Math.max(t1, t2));
        }

        if (tmax >= tmin && tmin > 0) {
          if (tmin < closestDist) {
            closestDist = tmin;
          }
        }
      }

      // Normalize distance reading [0, 1]
      readings.push(Math.min(1.0, closestDist / this.maxRange));
    }

    return readings;
  }
}
