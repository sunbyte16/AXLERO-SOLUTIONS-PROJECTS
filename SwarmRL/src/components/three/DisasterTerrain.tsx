/**
 * SwarmRL - 3D Procedural Disaster Zone Terrain & Obstacles
 */

import React from 'react';
import { ObstacleState } from '../../types';

interface DisasterTerrainProps {
  width: number;
  length: number;
  obstacles: ObstacleState[];
  showObstacleBoxes: boolean;
}

export const DisasterTerrain: React.FC<DisasterTerrainProps> = ({
  width,
  length,
  obstacles,
  showObstacleBoxes,
}) => {
  return (
    <group>
      {/* Disaster Ground Floor Grid */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[width, length, 32, 32]} />
        <meshStandardMaterial color="#0F172A" roughness={0.9} metalness={0.1} />
      </mesh>

      {/* Coordinate Grid Overlay */}
      <gridHelper args={[Math.max(width, length), 24, '#334155', '#1E293B']} position={[0, 0.02, 0]} />

      {/* Outer Boundary Perimeter Walls */}
      {[
        { pos: [0, 20, -length / 2] as [number, number, number], rot: [0, 0, 0] as [number, number, number], size: [width, 40, 1] as [number, number, number] },
        { pos: [0, 20, length / 2] as [number, number, number], rot: [0, 0, 0] as [number, number, number], size: [width, 40, 1] as [number, number, number] },
        { pos: [-width / 2, 20, 0] as [number, number, number], rot: [0, Math.PI / 2, 0] as [number, number, number], size: [length, 40, 1] as [number, number, number] },
        { pos: [width / 2, 20, 0] as [number, number, number], rot: [0, Math.PI / 2, 0] as [number, number, number], size: [length, 40, 1] as [number, number, number] },
      ].map((wall, idx) => (
        <mesh key={idx} position={wall.pos} rotation={wall.rot}>
          <boxGeometry args={wall.size} />
          <meshBasicMaterial color="#0284C7" wireframe transparent opacity={0.15} />
        </mesh>
      ))}

      {/* Render Obstacles (Buildings, Collapsed Ruins, Dynamic Debris) */}
      {showObstacleBoxes &&
        obstacles.map((obs) => {
          const isHazard = obs.type === 'DYNAMIC_HAZARD';
          const isRuin = obs.type === 'RUIN';

          return (
            <group key={obs.id} position={[obs.position.x, obs.position.y, obs.position.z]}>
              <mesh castShadow receiveShadow>
                <boxGeometry args={[obs.size.x, obs.size.y, obs.size.z]} />
                <meshStandardMaterial
                  color={obs.color || (isRuin ? '#78716C' : isHazard ? '#EF4444' : '#334155')}
                  roughness={0.6}
                  metalness={0.2}
                />
              </mesh>

              {/* Wireframe accent overlay for technical aesthetic */}
              <mesh>
                <boxGeometry args={[obs.size.x + 0.05, obs.size.y + 0.05, obs.size.z + 0.05]} />
                <meshBasicMaterial
                  color={isHazard ? '#EF4444' : '#64748B'}
                  wireframe
                  transparent
                  opacity={0.3}
                />
              </mesh>
            </group>
          );
        })}
    </group>
  );
};
