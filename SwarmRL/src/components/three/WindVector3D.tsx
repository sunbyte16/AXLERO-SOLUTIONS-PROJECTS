/**
 * SwarmRL - Animated 3D Atmospheric Wind Vectors
 */

import React from 'react';
import { WindState } from '../../types';

interface WindVector3DProps {
  wind: WindState;
  envWidth: number;
}

export const WindVector3D: React.FC<WindVector3DProps> = ({ wind, envWidth }) => {
  if (!wind || !wind.enabled || wind.strength === 0) return null;

  const windRad = (wind.direction * Math.PI) / 180;
  const dirX = Math.cos(windRad);
  const dirZ = Math.sin(windRad);

  const numArrows = 12;
  const positions: Array<[number, number, number]> = [];

  for (let i = 0; i < numArrows; i++) {
    const angle = (i * Math.PI * 2) / numArrows;
    const radius = envWidth * 0.35;
    positions.push([Math.cos(angle) * radius, 30, Math.sin(angle) * radius]);
  }

  return (
    <group>
      {positions.map((pos, idx) => (
        <group key={idx} position={pos} rotation={[0, -windRad, 0]}>
          <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.1, 0.1, 8, 8]} />
            <meshBasicMaterial color="#38BDF8" transparent opacity={0.4} />
          </mesh>
          <mesh position={[4, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
            <coneGeometry args={[0.4, 1.2, 8]} />
            <meshBasicMaterial color="#38BDF8" transparent opacity={0.7} />
          </mesh>
        </group>
      ))}
    </group>
  );
};
