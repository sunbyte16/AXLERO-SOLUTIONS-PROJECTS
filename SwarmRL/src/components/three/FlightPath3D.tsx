/**
 * SwarmRL - 3D Flight Trajectory Trail Renderer
 */

import React from 'react';
import * as THREE from 'three';
import { DroneAgentState } from '../../types';

interface FlightPath3DProps {
  agents: DroneAgentState[];
}

export const FlightPath3D: React.FC<FlightPath3DProps> = ({ agents }) => {
  return (
    <group>
      {agents.map((agent) => {
        if (!agent.flight_path || agent.flight_path.length < 2) return null;

        const points = agent.flight_path.map((p) => new THREE.Vector3(p.x, p.y, p.z));

        return (
          <line key={`path_${agent.agent_id}`}>
            <bufferGeometry
              attach="geometry"
              onUpdate={(geom) => geom.setFromPoints(points)}
            />
            <lineBasicMaterial
              attach="material"
              color={agent.status === 'COLLIDED' ? '#EF4444' : '#38BDF8'}
              linewidth={2}
              transparent
              opacity={0.6}
            />
          </line>
        );
      })}
    </group>
  );
};
