/**
 * SwarmRL - Interactive 3D Camera Control Panel
 * Supports Isometric, Top-Down, Free-Roam, and Follow Agent camera modes with angle presets & zoom controls.
 */

import React, { useState } from 'react';
import {
  ArrowDown,
  ArrowDownLeft,
  ArrowDownRight,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowUpLeft,
  ArrowUpRight,
  Bot,
  Box,
  ChevronDown,
  ChevronUp,
  Compass,
  Crosshair,
  Eye,
  Grid,
  Maximize2,
  Minimize2,
  Move,
  RefreshCw,
  RotateCw,
  Sliders,
  Video,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { useSwarmStore } from '../../stores/useSwarmStore';
import { CameraMode } from '../../types';

interface CameraControlPanelProps {
  isMinimized?: boolean;
  onToggleMinimize?: () => void;
}

export const CameraControlPanel: React.FC<CameraControlPanelProps> = ({
  isMinimized: externalIsMinimized,
  onToggleMinimize,
}) => {
  const {
    cameraMode,
    cameraAltitude,
    cameraAutoRotate,
    selectedDroneId,
    agents,
    setCameraMode,
    setCameraAltitude,
    setCameraAutoRotate,
    setSelectedDroneId,
  } = useSwarmStore();

  const [internalIsMinimized, setInternalIsMinimized] = useState<boolean>(false);
  const isMinimized = externalIsMinimized !== undefined ? externalIsMinimized : internalIsMinimized;
  const toggleMinimize = onToggleMinimize || (() => setInternalIsMinimized(!internalIsMinimized));

  const [showPresets, setShowPresets] = useState<boolean>(false);

  // Quick mode list
  const modes: {
    id: CameraMode;
    label: string;
    description: string;
    icon: React.ReactNode;
  }[] = [
    {
      id: 'ISOMETRIC',
      label: 'Isometric',
      description: 'Tactical 45° angled grid overview',
      icon: <Box className="w-4 h-4" />,
    },
    {
      id: 'TOP_DOWN',
      label: 'Top-Down',
      description: '2D overhead vertical map view',
      icon: <Maximize2 className="w-4 h-4" />,
    },
    {
      id: 'FREE_ROAM',
      label: 'Free-Roam',
      description: 'Unrestricted 360° orbit, zoom & pitch',
      icon: <Eye className="w-4 h-4" />,
    },
    {
      id: 'FOLLOW_AGENT',
      label: 'Follow Agent',
      description: 'Lock camera on active drone telemetry',
      icon: <Bot className="w-4 h-4" />,
    },
  ];

  // Quick Zoom handlers
  const handleZoomIn = () => {
    setCameraAltitude(Math.max(20, cameraAltitude - 15));
  };

  const handleZoomOut = () => {
    setCameraAltitude(Math.min(220, cameraAltitude + 15));
  };

  const handleResetCamera = () => {
    setCameraAltitude(75);
    setCameraAutoRotate(false);
    if (cameraMode === 'FOLLOW_AGENT') {
      setCameraMode('ISOMETRIC');
    }
  };

  return (
    <div className="bg-[#121212]/95 border border-white/10 backdrop-blur-md rounded-sm shadow-2xl font-mono text-xs w-80 overflow-hidden select-none animate-in fade-in duration-200">
      {/* Panel Header */}
      <div className="bg-[#0A0A0A] border-b border-white/10 px-3.5 py-2 flex items-center justify-between text-white">
        <div className="flex items-center space-x-2">
          <Compass className="w-4 h-4 text-[#C5A059]" />
          <span className="font-bold uppercase tracking-wider text-[11px] text-[#F5F5F5]">
            Camera Control Panel
          </span>
        </div>

        <div className="flex items-center space-x-1.5">
          <span className="px-1.5 py-0.2 rounded-sm bg-[#C5A059]/20 text-[#E8D09E] text-[9px] font-bold uppercase tracking-wider">
            {cameraMode.replace('_', ' ')}
          </span>
          <button
            onClick={toggleMinimize}
            className="p-1 hover:bg-white/10 rounded-sm text-white/50 hover:text-white transition-colors cursor-pointer"
            title={isMinimized ? 'Expand Camera Panel' : 'Minimize Camera Panel'}
          >
            {isMinimized ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {!isMinimized && (
        <div className="p-3.5 space-y-4">
          {/* Mode Selection Buttons */}
          <div className="space-y-1.5">
            <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold block">
              Viewport Camera Mode
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              {modes.map((m) => {
                const isActive = cameraMode === m.id || (m.id === 'FREE_ROAM' && cameraMode === 'ORBIT');
                return (
                  <button
                    key={m.id}
                    onClick={() => setCameraMode(m.id)}
                    className={`p-2 rounded-sm border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      isActive
                        ? 'bg-[#C5A059] border-[#C5A059] text-black shadow-md shadow-[#C5A059]/20'
                        : 'bg-[#0A0A0A] border-white/10 hover:border-[#C5A059]/50 text-white/70 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="font-bold text-[11px] uppercase tracking-wider flex items-center space-x-1.5">
                        {m.icon}
                        <span>{m.label}</span>
                      </span>
                      {isActive && <div className="w-1.5 h-1.5 rounded-full bg-black animate-ping" />}
                    </div>
                    <span
                      className={`text-[9px] mt-1 line-clamp-1 ${
                        isActive ? 'text-black/70 font-medium' : 'text-white/40'
                      }`}
                    >
                      {m.description}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Follow Agent Selector (if in FOLLOW_AGENT mode) */}
          {cameraMode === 'FOLLOW_AGENT' && (
            <div className="bg-[#0A0A0A] p-2.5 rounded-sm border border-[#C5A059]/30 space-y-2 animate-in fade-in duration-150">
              <div className="flex items-center justify-between text-[10px] text-[#C5A059] font-bold uppercase tracking-wider">
                <span className="flex items-center space-x-1">
                  <Crosshair className="w-3.5 h-3.5" />
                  <span>Target Follow Agent</span>
                </span>
                <span className="text-white/40">{agents.length} Swarm Drones</span>
              </div>

              <select
                value={selectedDroneId || ''}
                onChange={(e) => setSelectedDroneId(e.target.value || null)}
                className="w-full bg-[#121212] border border-white/20 rounded-sm px-2 py-1.5 text-xs text-white focus:outline-none focus:border-[#C5A059] cursor-pointer"
              >
                <option value="">-- Select Drone to Lock View --</option>
                {agents.map((agent) => (
                  <option key={agent.agent_id} value={agent.agent_id}>
                    {agent.agent_id.toUpperCase()} ({agent.status}) - Batt: {agent.battery}%
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Camera Controls & Altitude Slider */}
          <div className="space-y-2 bg-[#0A0A0A] p-3 rounded-sm border border-white/5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold">
                Elevation / Altitude
              </span>
              <span className="text-xs font-bold text-[#E8D09E]">{cameraAltitude} m</span>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handleZoomIn}
                className="p-1.5 rounded-sm bg-white/5 border border-white/10 hover:border-[#C5A059] text-white transition-colors cursor-pointer"
                title="Zoom In (Decrease Altitude)"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>

              <input
                type="range"
                min="20"
                max="200"
                step="5"
                value={cameraAltitude}
                onChange={(e) => setCameraAltitude(Number(e.target.value))}
                className="w-full accent-[#C5A059] cursor-pointer"
              />

              <button
                onClick={handleZoomOut}
                className="p-1.5 rounded-sm bg-white/5 border border-white/10 hover:border-[#C5A059] text-white transition-colors cursor-pointer"
                title="Zoom Out (Increase Altitude)"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Camera Angles / Cardinal Presets */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[10px] text-white/40 uppercase tracking-widest font-bold">
              <span>Quick Cardinal Angles</span>
              <button
                onClick={() => setShowPresets(!showPresets)}
                className="text-[#C5A059] hover:underline cursor-pointer text-[9px]"
              >
                {showPresets ? 'Hide Grid' : 'Show Grid'}
              </button>
            </div>

            {showPresets && (
              <div className="grid grid-cols-4 gap-1 animate-in fade-in duration-150">
                <button
                  onClick={() => {
                    setCameraMode('ISOMETRIC');
                    setCameraAltitude(75);
                  }}
                  className="p-1.5 bg-[#0A0A0A] border border-white/10 hover:border-[#C5A059] rounded-sm text-[10px] text-white/80 hover:text-white flex flex-col items-center justify-center space-y-0.5 cursor-pointer"
                >
                  <ArrowUp className="w-3 h-3 text-[#C5A059]" />
                  <span>N (0°)</span>
                </button>
                <button
                  onClick={() => {
                    setCameraMode('ISOMETRIC');
                    setCameraAltitude(75);
                  }}
                  className="p-1.5 bg-[#0A0A0A] border border-white/10 hover:border-[#C5A059] rounded-sm text-[10px] text-white/80 hover:text-white flex flex-col items-center justify-center space-y-0.5 cursor-pointer"
                >
                  <ArrowRight className="w-3 h-3 text-[#C5A059]" />
                  <span>E (90°)</span>
                </button>
                <button
                  onClick={() => {
                    setCameraMode('ISOMETRIC');
                    setCameraAltitude(75);
                  }}
                  className="p-1.5 bg-[#0A0A0A] border border-white/10 hover:border-[#C5A059] rounded-sm text-[10px] text-white/80 hover:text-white flex flex-col items-center justify-center space-y-0.5 cursor-pointer"
                >
                  <ArrowDown className="w-3 h-3 text-[#C5A059]" />
                  <span>S (180°)</span>
                </button>
                <button
                  onClick={() => {
                    setCameraMode('ISOMETRIC');
                    setCameraAltitude(75);
                  }}
                  className="p-1.5 bg-[#0A0A0A] border border-white/10 hover:border-[#C5A059] rounded-sm text-[10px] text-white/80 hover:text-white flex flex-col items-center justify-center space-y-0.5 cursor-pointer"
                >
                  <ArrowLeft className="w-3 h-3 text-[#C5A059]" />
                  <span>W (270°)</span>
                </button>
              </div>
            )}
          </div>

          {/* Footer Action Buttons */}
          <div className="pt-1 flex items-center justify-between border-t border-white/10 text-[10px]">
            {/* Auto-Rotate Showcase Toggle */}
            <button
              onClick={() => setCameraAutoRotate(!cameraAutoRotate)}
              className={`px-2.5 py-1.5 rounded-sm border flex items-center space-x-1.5 transition-all cursor-pointer ${
                cameraAutoRotate
                  ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 font-bold'
                  : 'bg-white/5 border-white/10 hover:border-white/20 text-white/60 hover:text-white'
              }`}
            >
              <RotateCw className={`w-3 h-3 ${cameraAutoRotate ? 'animate-spin text-emerald-400' : ''}`} />
              <span>Auto-Rotate {cameraAutoRotate ? 'ON' : 'OFF'}</span>
            </button>

            {/* Reset Camera Button */}
            <button
              onClick={handleResetCamera}
              className="px-2.5 py-1.5 rounded-sm bg-white/5 border border-white/10 hover:border-[#C5A059] text-white/70 hover:text-white flex items-center space-x-1 transition-all cursor-pointer font-bold uppercase tracking-wider"
              title="Reset view to default isometric perspective"
            >
              <RefreshCw className="w-3 h-3 text-[#C5A059]" />
              <span>Reset View</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
