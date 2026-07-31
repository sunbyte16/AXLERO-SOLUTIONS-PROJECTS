/**
 * SwarmRL - 3D Search Coverage Heatmap Plane
 */

import React from 'react';
import { DroneAgentState } from '../../types';

interface CoverageMap3DProps {
  width: number;
  length: number;
  agents: DroneAgentState[];
}

export const CoverageMap3D: React.FC<CoverageMap3DProps> = ({ width, length, agents }) => {
  return (
    <group position={[0, 0.1, 0]}>
      {/* Search Spotlights projecting searched ground sectors */}
      {agents.map(
        (agent) =>
          agent.status !== 'COLLIDED' && (
            <mesh
              key={agent.agent_id}
              position={[agent.position.x, 0.15, agent.position.z]}
              rotation={[-Math.PI / 2, 0, 0]}
            >
              <circleGeometry args={[6.5, 24]} />
              <meshBasicMaterial
                color="#06B6D4"
                transparent
                opacity={0.25}
                depthWrite={false}
              />
            </mesh>
          )
      )}
    </group>
  );
};
