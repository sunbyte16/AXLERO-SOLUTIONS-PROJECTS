/**
 * SwarmRL - 3D Quadcopter Drone Mesh Component with Animated Props & Sensors
 */

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { DroneAgentState } from '../../types';

interface DroneMeshProps {
  agent: DroneAgentState;
  isSelected: boolean;
  showSensors: boolean;
  showFlightPath: boolean;
  onSelect: (id: string) => void;
}

export const DroneMesh: React.FC<DroneMeshProps> = ({
  agent,
  isSelected,
  showSensors,
  onSelect,
}) => {
  const droneGroupRef = useRef<THREE.Group>(null!);
  const prop1Ref = useRef<THREE.Group>(null!);
  const prop2Ref = useRef<THREE.Group>(null!);
  const prop3Ref = useRef<THREE.Group>(null!);
  const prop4Ref = useRef<THREE.Group>(null!);

  // Animate rotors on every frame if not crashed
  useFrame((_, delta) => {
    if (agent.status !== 'COLLIDED') {
      const rotSpeed = delta * 25;
      if (prop1Ref.current) prop1Ref.current.rotation.y += rotSpeed;
      if (prop2Ref.current) prop2Ref.current.rotation.y -= rotSpeed;
      if (prop3Ref.current) prop3Ref.current.rotation.y += rotSpeed;
      if (prop4Ref.current) prop4Ref.current.rotation.y -= rotSpeed;
    }
  });

  const isCollided = agent.status === 'COLLIDED';
  const droneColor = isCollided ? '#EF4444' : isSelected ? '#06B6D4' : '#2563EB';

  return (
    <group
      ref={droneGroupRef}
      position={[agent.position.x, agent.position.y, agent.position.z]}
      rotation={[agent.orientation.pitch, agent.orientation.yaw, agent.orientation.roll]}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(agent.agent_id);
      }}
    >
      {/* Central Drone Fuselage */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[0.8, 0.25, 0.8]} />
        <meshStandardMaterial color={droneColor} roughness={0.3} metalness={0.7} />
      </mesh>

      {/* Top Status LED Dome */}
      <mesh position={[0, 0.18, 0]}>
        <sphereGeometry args={[0.15, 12, 12]} />
        <meshBasicMaterial color={isCollided ? '#EF4444' : '#22C55E'} />
      </mesh>

      {/* Front Facing Direction Indicator Nose */}
      <mesh position={[0.45, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <coneGeometry args={[0.1, 0.25, 8]} />
        <meshBasicMaterial color="#38BDF8" />
      </mesh>

      {/* 4 Rotor Arms */}
      {[
        { x: 0.5, z: 0.5, ref: prop1Ref },
        { x: -0.5, z: 0.5, ref: prop2Ref },
        { x: 0.5, z: -0.5, ref: prop3Ref },
        { x: -0.5, z: -0.5, ref: prop4Ref },
      ].map((arm, idx) => (
        <group key={idx}>
          {/* Arm Strut */}
          <mesh position={[arm.x / 2, 0, arm.z / 2]}>
            <boxGeometry args={[Math.abs(arm.x), 0.06, 0.08]} />
            <meshStandardMaterial color="#1E293B" />
          </mesh>

          {/* Motor Hub */}
          <mesh position={[arm.x, 0.05, arm.z]}>
            <cylinderGeometry args={[0.08, 0.08, 0.12, 12]} />
            <meshStandardMaterial color="#64748B" />
          </mesh>

          {/* Spinning Propeller Blades */}
          <group ref={arm.ref} position={[arm.x, 0.12, arm.z]}>
            <mesh>
              <boxGeometry args={[0.6, 0.01, 0.06]} />
              <meshBasicMaterial color={isCollided ? '#94A3B8' : '#F8FAFC'} opacity={0.8} transparent />
            </mesh>
            <mesh rotation={[0, Math.PI / 2, 0]}>
              <boxGeometry args={[0.6, 0.01, 0.06]} />
              <meshBasicMaterial color={isCollided ? '#94A3B8' : '#F8FAFC'} opacity={0.8} transparent />
            </mesh>
          </group>
        </group>
      ))}

      {/* Selection Halo Glow Ring */}
      {isSelected && (
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.1, 1.3, 32]} />
          <meshBasicMaterial color="#06B6D4" side={THREE.DoubleSide} transparent opacity={0.7} />
        </mesh>
      )}

      {/* 360 LiDAR Sensor Cones / Ray Projections */}
      {showSensors && !isCollided && (
        <group>
          {agent.lidar_readings.map((distNorm, idx) => {
            const angle = (idx * Math.PI * 2) / agent.lidar_readings.length;
            const dist = distNorm * agent.sensor_range;
            const rayColor = distNorm < 0.2 ? '#EF4444' : distNorm < 0.5 ? '#F59E0B' : '#06B6D4';

            return (
              <line key={idx}>
                <bufferGeometry
                  attach="geometry"
                  onUpdate={(geom) => {
                    geom.setFromPoints([
                      new THREE.Vector3(0, 0, 0),
                      new THREE.Vector3(Math.cos(angle) * dist, -0.2, Math.sin(angle) * dist),
                    ]);
                  }}
                />
                <lineBasicMaterial attach="material" color={rayColor} linewidth={2} transparent opacity={0.6} />
              </line>
            );
          })}
        </group>
      )}

      {/* Agent Telemetry HUD Label */}
      <Html position={[0, 0.8, 0]} center distanceFactor={15}>
        <div className={`px-2 py-0.5 rounded text-[10px] font-mono border backdrop-blur-md shadow-md flex items-center space-x-1.5 whitespace-nowrap ${
          isCollided
            ? 'bg-red-950/80 border-red-500 text-red-300'
            : isSelected
            ? 'bg-cyan-950/90 border-cyan-400 text-cyan-200'
            : 'bg-slate-900/80 border-slate-700 text-slate-200'
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${isCollided ? 'bg-red-500 animate-ping' : 'bg-emerald-400'}`} />
          <span className="font-bold">{agent.agent_id}</span>
          <span className="text-slate-400">Alt: {agent.position.y.toFixed(1)}m</span>
        </div>
      </Html>
    </group>
  );
};
