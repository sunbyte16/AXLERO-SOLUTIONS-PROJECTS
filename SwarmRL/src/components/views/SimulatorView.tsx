/**
 * SwarmRL - Fullscreen 3D Simulator Viewport Laboratory
 */

import React, { useState } from 'react';
import {
  AlertCircle,
  Bookmark,
  Bot,
  Camera,
  Check,
  Compass,
  Flame,
  Globe,
  Layers,
  Pause,
  Play,
  RotateCcw,
  ShieldAlert,
  Sliders,
  Wind,
} from 'lucide-react';
import { useSwarmStore } from '../../stores/useSwarmStore';
import { Scene3D } from '../three/Scene3D';
import { TelemetryHUD } from '../dashboard/TelemetryHUD';
import { SnapshotModal } from '../simulator/SnapshotModal';
import { AlertSettingsModal, SwarmAlertSystem } from '../simulator/SwarmAlertSystem';
import { CameraControlPanel } from '../simulator/CameraControlPanel';

export const SimulatorView: React.FC = () => {
  const { config, updateConfig, addLog, takeSnapshot, snapshots, metrics, activeAlerts, alertConfig } = useSwarmStore();
  const [isSnapshotModalOpen, setIsSnapshotModalOpen] = useState<boolean>(false);
  const [isAlertSettingsOpen, setIsAlertSettingsOpen] = useState<boolean>(false);
  const [isCameraPanelOpen, setIsCameraPanelOpen] = useState<boolean>(true);
  const [showToast, setShowToast] = useState<boolean>(false);

  const handleWindToggle = () => {
    const isWind = !config.wind.enabled;
    updateConfig({
      wind: {
        ...config.wind,
        enabled: isWind,
        strength: isWind ? 3.5 : 0,
        direction: 90,
      },
    });
    addLog('INFO', 'PHYSICS', isWind ? 'Atmospheric wind activated (3.5 m/s).' : 'Wind disabled.');
  };

  const handleQuickSnapshot = () => {
    takeSnapshot();
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  return (
    <div className="w-full h-full relative bg-[#0A0A0A] flex flex-col overflow-hidden">
      {/* Viewport Toolbar Header */}
      <div className="h-12 bg-[#121212] border-b border-white/10 px-4 flex items-center justify-between z-20 font-sans text-xs">
        <div className="flex items-center space-x-2">
          <Globe className="w-4 h-4 text-[#C5A059]" />
          <span className="font-bold text-[#F5F5F5] uppercase tracking-wider">3D Disaster Response Simulation Laboratory</span>
        </div>

        <div className="flex items-center space-x-3 font-mono">
          {/* Camera Panel Toggle Button */}
          <button
            onClick={() => setIsCameraPanelOpen(!isCameraPanelOpen)}
            className={`px-3 py-1.5 rounded-sm border font-medium text-[11px] uppercase tracking-wider flex items-center space-x-1.5 transition-all cursor-pointer ${
              isCameraPanelOpen
                ? 'bg-[#C5A059]/20 border-[#C5A059] text-[#E8D09E]'
                : 'bg-white/5 border-white/10 text-white/70 hover:border-[#C5A059]'
            }`}
            title="Toggle 3D Camera Controls Panel"
          >
            <Compass className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Camera Panel</span>
          </button>

          {/* Automated Safety Alert Config Button */}
          <button
            onClick={() => setIsAlertSettingsOpen(true)}
            className={`px-3 py-1.5 rounded-sm border font-medium text-[11px] uppercase tracking-wider flex items-center space-x-1.5 transition-all cursor-pointer ${
              activeAlerts.length > 0
                ? 'bg-red-500/20 border-red-500 text-red-400 animate-pulse'
                : 'bg-white/5 border-white/10 hover:border-[#C5A059] text-white'
            }`}
            title="Configure automated safety & mission alert thresholds"
          >
            <ShieldAlert className={`w-3.5 h-3.5 ${activeAlerts.length > 0 ? 'text-red-400' : 'text-[#C5A059]'}`} />
            <span>Alert Thresholds</span>
            {activeAlerts.length > 0 && (
              <span className="bg-red-500 text-white font-bold text-[9px] px-1.5 py-0.2 rounded-full">
                {activeAlerts.length}
              </span>
            )}
          </button>

          {/* Quick Take Snapshot Button */}
          <button
            onClick={handleQuickSnapshot}
            className="px-3 py-1.5 rounded-sm bg-[#C5A059] hover:bg-[#d4b06a] text-black font-bold uppercase tracking-wider text-[11px] flex items-center space-x-1.5 transition-all shadow-md shadow-[#C5A059]/20 cursor-pointer"
            title="Snapshot current agent positions & environment metrics"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Take Snapshot</span>
          </button>

          {/* Snapshots Drawer Button */}
          <button
            onClick={() => setIsSnapshotModalOpen(true)}
            className="px-3 py-1.5 rounded-sm bg-white/5 border border-white/10 hover:border-[#C5A059]/50 text-white font-medium flex items-center space-x-1.5 transition-all cursor-pointer"
          >
            <Bookmark className="w-3.5 h-3.5 text-[#C5A059]" />
            <span className="uppercase text-[11px] tracking-wider">Snapshots</span>
            <span className="bg-[#C5A059]/20 text-[#E8D09E] px-1.5 py-0.2 rounded-sm text-[10px] font-bold">
              {snapshots.length}
            </span>
          </button>

          {/* Wind Toggle */}
          <button
            onClick={handleWindToggle}
            className={`px-3 py-1.5 rounded-sm border font-medium text-[11px] uppercase tracking-wider flex items-center space-x-1.5 transition-all cursor-pointer ${
              config.wind.enabled
                ? 'bg-[#C5A059]/20 border-[#C5A059]/40 text-[#E8D09E]'
                : 'bg-white/5 border-white/10 text-white/50 hover:text-white'
            }`}
          >
            <Wind className="w-3.5 h-3.5" />
            <span>Wind {config.wind.enabled ? 'ON' : 'OFF'}</span>
          </button>
        </div>
      </div>

      {/* Main 3D Canvas */}
      <div className="flex-1 relative">
        <Scene3D />
        <TelemetryHUD />

        {/* Floating Camera Control Panel */}
        {isCameraPanelOpen && (
          <div className="absolute top-16 right-4 z-30 pointer-events-auto">
            <CameraControlPanel onToggleMinimize={() => setIsCameraPanelOpen(false)} />
          </div>
        )}

        {/* Real-time Automated Alert System Banner Overlay */}
        <SwarmAlertSystem onOpenSettings={() => setIsAlertSettingsOpen(true)} />

        {/* Snapshot Toast Notification */}
        {showToast && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-[#0A0A0A] border border-[#C5A059] px-4 py-2.5 rounded-sm shadow-2xl flex items-center space-x-3 text-xs font-mono text-white animate-in fade-in slide-in-from-top-2 duration-200">
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <div>
              <span className="font-bold text-[#C5A059] uppercase tracking-wider block text-[11px]">Snapshot Captured</span>
              <span className="text-white/60 text-[10px]">Step #{metrics.step} saved locally to browser store.</span>
            </div>
          </div>
        )}
      </div>

      {/* Snapshot Library & Comparison Modal */}
      <SnapshotModal
        isOpen={isSnapshotModalOpen}
        onClose={() => setIsSnapshotModalOpen(false)}
      />

      {/* Automated Safety & Mission Threshold Config Modal */}
      <AlertSettingsModal
        isOpen={isAlertSettingsOpen}
        onClose={() => setIsAlertSettingsOpen(false)}
      />
    </div>
  );
};
