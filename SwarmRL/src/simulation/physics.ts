/**
 * SwarmRL - Authoritative Drone Physics Engine
 */

import { Vector3D, WindState } from '../types';

export interface PhysicsLimits {
  max_speed: number;       // m/s
  max_acceleration: number;// m/s^2
  max_ascent_rate: number; // m/s
  max_descent_rate: number;// m/s
  min_altitude: number;    // m (ground buffer)
  max_altitude: number;    // m (ceiling)
  drag_coefficient: number;
}

export const DEFAULT_PHYSICS_LIMITS: PhysicsLimits = {
  max_speed: 12.0,
  max_acceleration: 15.0,
  max_ascent_rate: 6.0,
  max_descent_rate: 4.0,
  min_altitude: 1.5,
  max_altitude: 45.0,
  drag_coefficient: 0.1,
};

export class DronePhysics {
  private limits: PhysicsLimits;

  constructor(limits: PhysicsLimits = DEFAULT_PHYSICS_LIMITS) {
    this.limits = limits;
  }

  /**
   * Calculates new position and velocity given continuous action inputs and wind forces
   * Actions: [speed_cmd (-1 to 1), pitch_cmd (-1 to 1), yaw_cmd (-1 to 1)]
   */
  public step(
    currentPos: Vector3D,
    currentVel: Vector3D,
    currentOrientation: { pitch: number; yaw: number; roll: number },
    action: [number, number, number],
    wind: WindState,
    dt: number = 0.05
  ): {
    nextPos: Vector3D;
    nextVel: Vector3D;
    nextOrientation: { pitch: number; yaw: number; roll: number };
  } {
    const [speedCmd, pitchCmd, yawCmd] = action;

    // Clamp action inputs to [-1, 1]
    const clampedSpeed = Math.max(-1, Math.min(1, speedCmd || 0));
    const clampedPitch = Math.max(-1, Math.min(1, pitchCmd || 0));
    const clampedYaw = Math.max(-1, Math.min(1, yawCmd || 0));

    // Update orientation (Yaw angle change based on yaw command)
    const yawRate = clampedYaw * Math.PI; // max turn rate rad/s
    let nextYaw = currentOrientation.yaw + yawRate * dt;
    // Normalize yaw to [-PI, PI]
    while (nextYaw > Math.PI) nextYaw -= 2 * Math.PI;
    while (nextYaw < -Math.PI) nextYaw += 2 * Math.PI;

    // Pitch angle (-30 deg to +30 deg)
    const targetPitch = clampedPitch * (Math.PI / 6);
    const nextPitch = currentOrientation.pitch + (targetPitch - currentOrientation.pitch) * 0.2;
    const nextRoll = -clampedYaw * (Math.PI / 8); // banking angle during turns

    // Calculate desired forward velocity in horizontal plane based on Yaw
    const targetSpeed = clampedSpeed * this.limits.max_speed;
    const targetVx = Math.cos(nextYaw) * targetSpeed;
    const targetVz = Math.sin(nextYaw) * targetSpeed;
    const targetVy = -Math.sin(nextPitch) * this.limits.max_ascent_rate;

    // Compute thrust accelerations
    let ax = (targetVx - currentVel.x) * 5.0;
    let ay = (targetVy - currentVel.y) * 5.0;
    let az = (targetVz - currentVel.z) * 5.0;

    // Limit acceleration magnitude
    const accelMag = Math.sqrt(ax * ax + ay * ay + az * az);
    if (accelMag > this.limits.max_acceleration) {
      const scale = this.limits.max_acceleration / accelMag;
      ax *= scale;
      ay *= scale;
      az *= scale;
    }

    // Add wind disturbance force
    let windFx = 0;
    let windFz = 0;
    let windFy = 0;

    if (wind && wind.enabled && wind.strength > 0) {
      const windRad = (wind.direction * Math.PI) / 180;
      const gust = 1.0 + (Math.random() - 0.5) * wind.gust_variability;
      const effectiveWind = wind.strength * gust;
      windFx = Math.cos(windRad) * effectiveWind * 0.4;
      windFz = Math.sin(windRad) * effectiveWind * 0.4;
      windFy = (Math.random() - 0.5) * wind.vertical_draft;
    }

    // Apply drag forces
    const dragX = -this.limits.drag_coefficient * currentVel.x;
    const dragY = -this.limits.drag_coefficient * currentVel.y;
    const dragZ = -this.limits.drag_coefficient * currentVel.z;

    // Net acceleration
    const netAx = ax + windFx + dragX;
    const netAy = ay + windFy + dragY;
    const netAz = az + windFz + dragZ;

    // Integrate velocity
    let vx = currentVel.x + netAx * dt;
    let vy = currentVel.y + netAy * dt;
    let vz = currentVel.z + netAz * dt;

    // Clamp speed limits
    const currentSpeed = Math.sqrt(vx * vx + vy * vy + vz * vz);
    if (currentSpeed > this.limits.max_speed) {
      const scale = this.limits.max_speed / currentSpeed;
      vx *= scale;
      vy *= scale;
      vz *= scale;
    }

    // Integrate position
    let px = currentPos.x + vx * dt;
    let py = currentPos.y + vy * dt;
    let pz = currentPos.z + vz * dt;

    // Altitude constraints
    if (py < this.limits.min_altitude) {
      py = this.limits.min_altitude;
      vy = Math.max(0, vy);
    } else if (py > this.limits.max_altitude) {
      py = this.limits.max_altitude;
      vy = Math.min(0, vy);
    }

    return {
      nextPos: { x: px, y: py, z: pz },
      nextVel: { x: vx, y: vy, z: vz },
      nextOrientation: { pitch: nextPitch, yaw: nextYaw, roll: nextRoll },
    };
  }
}
