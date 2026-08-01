/**
 * SwarmRL - Telemetry HUD Overlay Component for 3D Viewport
 */

import React from 'react';
import {
  AlertOctagon,
  Eye,
  Flame,
  Grid,
  Layers,
  Maximize2,
  Navigation,
  ShieldAlert,
  Wind,
  Zap,
} from 'lucide-react';
import { useSwarmStore } from '../../stores/useSwarmStore';

export const TelemetryHUD: React.FC = () => {
  const {
    metrics,
    config,
    agents,
    showSensors,
    showFlightPaths,
    showCoverageMap,
    showWindVectors,
    showObstacleBoxes,
    toggleLayer,
    cameraMode,
    setCameraMode,
  } = useSwarmStore();

  const activeCount = agents.filter((a) => a.status !== 'COLLIDED').length;

  return (
    <div className="absolute inset-0 pointer-events-none p-4 flex flex-col justify-between z-10 font-mono select-none">
      {/* Top HUD Telemetry Bar */}
      <div className="flex items-start justify-between">
        {/* Left Stats Block */}
        <div className="pointer-events-auto bg-[#121212]/95 border border-white/10 backdrop-blur-md rounded-sm p-3 shadow-2xl flex items-center space-x-4 text-xs">
          {/* Map Coverage Meter */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[10px] text-white/50 uppercase tracking-wider font-mono space-x-2">
              <span className="flex items-center space-x-1">
                <Flame className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>Search Coverage:</span>
              </span>
              <span className="font-bold text-[#E8D09E]">{metrics.map_coverage_percent}%</span>
            </div>
            <div className="w-36 h-1.5 bg-[#0A0A0A] rounded-sm overflow-hidden border border-white/10">
              <div
                className="h-full bg-gradient-to-r from-[#C5A059] to-[#E8D09E] transition-all duration-300 rounded-sm"
                style={{ width: `${Math.min(100, metrics.map_coverage_percent)}%` }}
              />
            </div>
          </div>

          <div className="h-8 w-[1px] bg-white/10" />

          {/* Active Agents */}
          <div>
            <div className="text-[9px] text-white/40 uppercase tracking-widest">Active Swarm</div>
            <div className="text-xs font-bold text-white flex items-center space-x-1">
              <span className="text-emerald-400">{activeCount}</span>
              <span className="text-white/30 text-[10px]">/ {config.num_agents}</span>
            </div>
          </div>

          <div className="h-8 w-[1px] bg-white/10" />

          {/* Collisions */}
          <div>
            <div className="text-[9px] text-white/40 uppercase tracking-widest">Collisions</div>
            <div
              className={`text-xs font-bold ${
                metrics.total_collisions > 0 ? 'text-red-400' : 'text-white/80'
              }`}
            >
              {metrics.total_collisions}
            </div>
          </div>

          <div className="h-8 w-[1px] bg-white/10" />

          {/* Mean Reward */}
          <div>
            <div className="text-[9px] text-white/40 uppercase tracking-widest">Mean Reward</div>
            <div className="text-xs font-bold text-[#E8D09E]">{metrics.avg_reward}</div>
          </div>
        </div>

        {/* Right Camera & Camera Presets */}
        <div className="pointer-events-auto bg-[#121212]/95 border border-white/10 backdrop-blur-md rounded-sm p-1.5 shadow-2xl flex items-center space-x-1 text-xs">
          {(['ISOMETRIC', 'TOP_DOWN', 'FREE_ROAM', 'FOLLOW_AGENT'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setCameraMode(mode)}
              className={`px-2.5 py-1 rounded-sm font-sans text-[10px] uppercase tracking-wider font-semibold transition-all ${
                cameraMode === mode || (mode === 'FREE_ROAM' && cameraMode === 'ORBIT')
                  ? 'bg-[#C5A059] text-black shadow-sm'
                  : 'text-white/50 hover:text-white hover:bg-white/5'
              }`}
            >
              {mode.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Bottom HUD - 3D Layer Toggles */}
      <div className="flex items-end justify-between">
        {/* Environment Hazards & Wind Indicator */}
        {config.wind && config.wind.enabled && (
          <div className="pointer-events-auto bg-[#121212]/95 border border-white/10 backdrop-blur-md px-3 py-1.5 rounded-sm text-xs flex items-center space-x-2">
            <Wind className="w-3.5 h-3.5 text-[#C5A059] animate-spin" />
            <span className="text-white/70 font-semibold text-[11px] uppercase tracking-wider">
              Wind: {config.wind.strength} m/s ({config.wind.direction}°)
            </span>
          </div>
        )}

        {/* Layer Visibility Controls */}
        <div className="pointer-events-auto bg-[#121212]/95 border border-white/10 backdrop-blur-md rounded-sm p-1 shadow-2xl flex items-center space-x-1 text-xs">
          <button
            onClick={() => toggleLayer('sensors')}
            className={`px-2.5 py-1 rounded-sm font-sans text-[10px] uppercase tracking-wider font-semibold flex items-center space-x-1.5 transition-all ${
              showSensors ? 'bg-[#C5A059] text-black' : 'text-white/50 hover:bg-white/5'
            }`}
          >
            <Eye className="w-3 h-3" />
            <span>LiDAR Rays</span>
          </button>

          <button
            onClick={() => toggleLayer('paths')}
            className={`px-2.5 py-1 rounded-sm font-sans text-[10px] uppercase tracking-wider font-semibold flex items-center space-x-1.5 transition-all ${
              showFlightPaths ? 'bg-[#C5A059] text-black' : 'text-white/50 hover:bg-white/5'
            }`}
          >
            <Navigation className="w-3 h-3" />
            <span>Flight Trails</span>
          </button>

          <button
            onClick={() => toggleLayer('coverage')}
            className={`px-2.5 py-1 rounded-sm font-sans text-[10px] uppercase tracking-wider font-semibold flex items-center space-x-1.5 transition-all ${
              showCoverageMap ? 'bg-[#C5A059] text-black' : 'text-white/50 hover:bg-white/5'
            }`}
          >
            <Grid className="w-3 h-3" />
            <span>Coverage Plane</span>
          </button>

          <button
            onClick={() => toggleLayer('obstacles')}
            className={`px-2.5 py-1 rounded-sm font-sans text-[10px] uppercase tracking-wider font-semibold flex items-center space-x-1.5 transition-all ${
              showObstacleBoxes ? 'bg-[#C5A059] text-black' : 'text-white/50 hover:bg-white/5'
            }`}
          >
            <Layers className="w-3 h-3" />
            <span>Ruins & Debris</span>
          </button>
        </div>
      </div>
    </div>
  );
};
