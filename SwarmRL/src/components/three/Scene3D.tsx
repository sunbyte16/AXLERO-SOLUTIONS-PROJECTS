/**
 * SwarmRL - Main 3D WebGL Scene Canvas
 */

import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { useSwarmStore } from '../../stores/useSwarmStore';
import { CoverageMap3D } from './CoverageMap3D';
import { DisasterTerrain } from './DisasterTerrain';
import { DroneMesh } from './DroneMesh';
import { FlightPath3D } from './FlightPath3D';
import { WindVector3D } from './WindVector3D';

const CameraController: React.FC = () => {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null!);
  const controlsRef = useRef<any>(null!);
  const previousModeRef = useRef<string>('');

  const { cameraMode, cameraAltitude, cameraAutoRotate, selectedDroneId, agents } = useSwarmStore();

  // Mode change or altitude change trigger
  React.useEffect(() => {
    if (!controlsRef.current || !cameraRef.current) return;

    if (cameraMode === 'ISOMETRIC') {
      const alt = cameraAltitude || 75;
      cameraRef.current.position.set(alt, alt, alt);
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();
    } else if (cameraMode === 'TOP_DOWN') {
      const alt = (cameraAltitude || 75) * 1.5;
      cameraRef.current.position.set(0, alt, 0.001);
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();
    } else if ((cameraMode === 'FREE_ROAM' || cameraMode === 'ORBIT') && previousModeRef.current !== 'FREE_ROAM' && previousModeRef.current !== 'ORBIT') {
      // If switching to free roam from isometric/top down, set a balanced angle
      const alt = cameraAltitude || 75;
      cameraRef.current.position.set(0, alt, alt * 1.2);
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();
    }

    previousModeRef.current = cameraMode;
  }, [cameraMode, cameraAltitude]);

  useFrame(() => {
    if (cameraMode === 'FOLLOW_AGENT' && selectedDroneId) {
      const targetAgent = agents.find((a) => a.agent_id === selectedDroneId);
      if (targetAgent && controlsRef.current) {
        controlsRef.current.target.set(
          targetAgent.position.x,
          targetAgent.position.y,
          targetAgent.position.z
        );
        controlsRef.current.update();
      }
    } else if (cameraMode === 'TOP_DOWN' && cameraRef.current && controlsRef.current) {
      // Maintain zero tilt for top-down
      controlsRef.current.target.set(0, 0, 0);
    }
  });

  return (
    <>
      <PerspectiveCamera ref={cameraRef} makeDefault position={[75, 75, 75]} fov={50} />
      <OrbitControls
        ref={controlsRef}
        enableDamping
        dampingFactor={0.05}
        autoRotate={cameraAutoRotate}
        autoRotateSpeed={1.5}
        maxPolarAngle={cameraMode === 'TOP_DOWN' ? Math.PI / 2 : Math.PI / 2 - 0.05} // Don't clip ground
        minDistance={10}
        maxDistance={300}
      />
    </>
  );
};

export const Scene3D: React.FC = () => {
  const {
    agents,
    obstacles,
    config,
    showSensors,
    showFlightPaths,
    showCoverageMap,
    showWindVectors,
    showObstacleBoxes,
    selectedDroneId,
    setSelectedDroneId,
  } = useSwarmStore();

  return (
    <div className="w-full h-full relative bg-slate-950 overflow-hidden select-none">
      <Canvas shadows gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}>
        <color attach="background" args={['#090D16']} />
        <fog attach="fog" args={['#090D16', 70, 220]} />

        {/* Lighting Setup */}
        <ambientLight intensity={0.6} />
        <directionalLight
          position={[40, 80, 40]}
          intensity={1.2}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-far={250}
          shadow-camera-left={-80}
          shadow-camera-right={80}
          shadow-camera-top={80}
          shadow-camera-bottom={-80}
        />
        <pointLight position={[0, 30, 0]} intensity={0.8} color="#38BDF8" />

        {/* Camera Control */}
        <CameraController />

        {/* Disaster Terrain & Ruins */}
        <DisasterTerrain
          width={config.width}
          length={config.length}
          obstacles={obstacles}
          showObstacleBoxes={showObstacleBoxes}
        />

        {/* Search Coverage Heatmap Plane */}
        {showCoverageMap && (
          <CoverageMap3D width={config.width} length={config.length} agents={agents} />
        )}

        {/* Flight Trajectory Trails */}
        {showFlightPaths && <FlightPath3D agents={agents} />}

        {/* Atmospheric Wind Vectors */}
        {showWindVectors && <WindVector3D wind={config.wind} envWidth={config.width} />}

        {/* Render 3D Drones */}
        {agents.map((agent) => (
          <DroneMesh
            key={agent.agent_id}
            agent={agent}
            isSelected={selectedDroneId === agent.agent_id}
            showSensors={showSensors}
            showFlightPath={showFlightPaths}
            onSelect={setSelectedDroneId}
          />
        ))}
      </Canvas>
    </div>
  );
};
