/**
 * SwarmRL - Automated Safety & Mission Alert System
 * Monitors telemetry, agent battery/health, and coverage metrics against configurable thresholds.
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  AlertCircle,
  AlertTriangle,
  Bell,
  BellOff,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock,
  History,
  Pause,
  Play,
  RotateCcw,
  ShieldAlert,
  Sliders,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react';
import { useSwarmStore } from '../../stores/useSwarmStore';
import { AlertNotification } from '../../types';

interface SwarmAlertSystemProps {
  onOpenSettings: () => void;
}

// Simple Web Audio API Synthesizer for Alert Chimes
const playAlertChime = (severity: 'WARNING' | 'CRITICAL') => {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = severity === 'CRITICAL' ? 'sawtooth' : 'sine';
    const freq = severity === 'CRITICAL' ? 880 : 587.33; // A5 vs D5
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    if (severity === 'CRITICAL') {
      osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.25);
    } else {
      osc.frequency.exponentialRampToValueAtTime(659.25, ctx.currentTime + 0.2);
    }

    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.3);
  } catch (e) {
    // Audio Context might be blocked prior to user interaction
  }
};

export const SwarmAlertSystem: React.FC<SwarmAlertSystemProps> = ({ onOpenSettings }) => {
  const {
    agents,
    metrics,
    config,
    alertConfig,
    activeAlerts,
    triggerAlert,
    acknowledgeAlert,
    dismissAlert,
    isSimPaused,
    setSimPaused,
  } = useSwarmStore();

  const prevActiveAlertsCountRef = useRef<number>(0);

  // Play sound when new active alerts appear
  useEffect(() => {
    if (
      alertConfig.enabled &&
      alertConfig.soundEnabled &&
      activeAlerts.length > prevActiveAlertsCountRef.current
    ) {
      const latest = activeAlerts[0];
      if (latest && !latest.acknowledged) {
        playAlertChime(latest.severity);
      }
    }
    prevActiveAlertsCountRef.current = activeAlerts.length;
  }, [activeAlerts, alertConfig.enabled, alertConfig.soundEnabled]);

  // Automated Threshold Monitoring Loop
  useEffect(() => {
    if (!alertConfig.enabled || agents.length === 0) return;

    // 1. Agent Battery / Health Check
    const lowBatteryAgents = agents.filter(
      (a) => a.battery < alertConfig.minAgentBattery && a.status !== 'COLLIDED'
    );
    if (lowBatteryAgents.length > 0) {
      const sample = lowBatteryAgents[0];
      triggerAlert({
        step: metrics.step,
        type: 'BATTERY_LOW',
        severity: lowBatteryAgents.some((a) => a.battery < 10) ? 'CRITICAL' : 'WARNING',
        title: 'Low Battery Warning',
        message: `${lowBatteryAgents.length} drone(s) depleted below ${alertConfig.minAgentBattery}% (e.g., ${sample.agent_id} at ${sample.battery.toFixed(0)}%).`,
      });
    }

    // 2. Agent Crash / Collision Check
    const crashedAgents = agents.filter((a) => a.status === 'COLLIDED');
    if (crashedAgents.length > 0) {
      triggerAlert({
        step: metrics.step,
        type: 'AGENT_CRASH',
        severity: 'CRITICAL',
        title: 'Agent Deactivated (Crash)',
        message: `${crashedAgents.length} drone(s) crashed and lost telemetry (${crashedAgents.map((a) => a.agent_id).join(', ')}).`,
      });
    }

    // 3. Mission Active Swarm Ratio Check
    const totalConfigured = config.num_agents || 1;
    const activeRatio = (metrics.active_agents / totalConfigured) * 100;
    if (activeRatio < alertConfig.minActiveAgentRatio) {
      triggerAlert({
        step: metrics.step,
        type: 'MISSION_FAILURE_RISK',
        severity: 'CRITICAL',
        title: 'Swarm Mission Risk (Low Operational Capacity)',
        message: `Active swarm operational capacity dropped to ${activeRatio.toFixed(0)}% (${metrics.active_agents}/${totalConfigured} drones active). Configured threshold is ${alertConfig.minActiveAgentRatio}%.`,
      });
    }

    // 4. Mission Search Coverage Pace Check
    if (metrics.step >= 150 && metrics.map_coverage_percent < alertConfig.minMissionCoverage) {
      triggerAlert({
        step: metrics.step,
        type: 'MISSION_FAILURE_RISK',
        severity: 'WARNING',
        title: 'Low Search Coverage Rate',
        message: `Disaster zone search coverage is ${metrics.map_coverage_percent.toFixed(1)}% at Step #${metrics.step} (Minimum target threshold: ${alertConfig.minMissionCoverage}%).`,
      });
    }

    // 5. Collision Rate Spike Check
    if (metrics.collision_rate > alertConfig.maxCollisionRate) {
      triggerAlert({
        step: metrics.step,
        type: 'HIGH_COLLISION_RATE',
        severity: 'WARNING',
        title: 'High Collision Rate Detected',
        message: `Telemetry collision rate at ${metrics.collision_rate.toFixed(3)} collisions/step exceeds max safety limit ${alertConfig.maxCollisionRate}.`,
      });
    }
  }, [
    agents,
    metrics,
    config.num_agents,
    alertConfig,
    triggerAlert,
  ]);

  if (!alertConfig.enabled) return null;

  const unacknowledgedAlerts = activeAlerts.filter((a) => !a.acknowledged);

  return (
    <div className="absolute top-4 right-4 z-40 max-w-sm w-full space-y-2 pointer-events-none font-sans">
      {/* Active Unacknowledged Toast Notifications */}
      {unacknowledgedAlerts.map((alert) => {
        const isCritical = alert.severity === 'CRITICAL';
        return (
          <div
            key={alert.id}
            className={`pointer-events-auto p-3 rounded-sm shadow-2xl border backdrop-blur-md transition-all duration-300 animate-in slide-in-from-right-4 fade-in ${
              isCritical
                ? 'bg-red-950/90 border-red-500/80 text-white shadow-red-500/20 ring-1 ring-red-500/50'
                : 'bg-[#18150F]/95 border-[#C5A059]/80 text-[#F5F5F5] shadow-[#C5A059]/20'
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-start space-x-2.5">
                {isCritical ? (
                  <ShieldAlert className="w-5 h-5 text-red-400 shrink-0 mt-0.5 animate-bounce" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-[#C5A059] shrink-0 mt-0.5" />
                )}
                <div>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`text-[9px] font-mono uppercase font-bold px-1.5 py-0.2 rounded-sm ${
                        isCritical ? 'bg-red-500 text-white' : 'bg-[#C5A059] text-black'
                      }`}
                    >
                      {alert.severity}
                    </span>
                    <span className="text-[10px] text-white/50 font-mono">{alert.timestamp}</span>
                  </div>
                  <h4 className="font-bold text-xs mt-1 leading-tight">{alert.title}</h4>
                  <p className="text-[11px] text-white/80 font-mono mt-1 leading-snug">
                    {alert.message}
                  </p>
                </div>
              </div>

              <button
                onClick={() => dismissAlert(alert.id)}
                className="text-white/40 hover:text-white p-0.5 transition-colors"
                title="Dismiss Alert"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Action Footer */}
            <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-white/10 text-[10px] font-mono">
              <button
                onClick={() => acknowledgeAlert(alert.id)}
                className="flex items-center space-x-1 text-emerald-400 hover:text-emerald-300 uppercase font-bold"
              >
                <CheckCircle2 className="w-3 h-3" />
                <span>Acknowledge</span>
              </button>

              <div className="flex items-center space-x-2">
                {isCritical && (
                  <button
                    onClick={() => setSimPaused(!isSimPaused)}
                    className="flex items-center space-x-1 px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-white uppercase font-bold"
                  >
                    {isSimPaused ? <Play className="w-3 h-3" /> : <Pause className="w-3 h-3" />}
                    <span>{isSimPaused ? 'Resume' : 'Pause Sim'}</span>
                  </button>
                )}

                <button
                  onClick={onOpenSettings}
                  className="text-white/60 hover:text-white underline uppercase"
                >
                  Config Thresholds
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// Modal for Threshold Configuration & Alert History
interface AlertSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AlertSettingsModal: React.FC<AlertSettingsModalProps> = ({ isOpen, onClose }) => {
  const {
    alertConfig,
    updateAlertConfig,
    alertHistory,
    clearAlerts,
    triggerAlert,
    metrics,
  } = useSwarmStore();

  const [activeTab, setActiveTab] = useState<'CONFIG' | 'HISTORY'>('CONFIG');

  if (!isOpen) return null;

  const handleTestAlert = () => {
    triggerAlert({
      step: metrics.step,
      type: 'BATTERY_LOW',
      severity: 'WARNING',
      title: 'Test Alert Notification',
      message: 'This is a manual test alert verifying audio chime and UI banner thresholds.',
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 font-sans animate-in fade-in duration-200">
      <div className="bg-[#121212] border border-white/10 rounded-sm shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-[#0A0A0A]">
          <div className="flex items-center space-x-2">
            <ShieldAlert className="w-5 h-5 text-[#C5A059]" />
            <div>
              <h3 className="font-bold text-sm text-[#F5F5F5] uppercase tracking-wider">
                Automated Safety & Mission Alert Configuration
              </h3>
              <p className="text-[11px] text-white/50 font-light">
                Set custom health, battery, and coverage thresholds for real-time notifications.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-sm text-white/50 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex items-center border-b border-white/10 bg-[#0A0A0A] px-4 font-mono text-xs">
          <button
            onClick={() => setActiveTab('CONFIG')}
            className={`py-2.5 px-4 font-bold uppercase tracking-wider border-b-2 transition-all ${
              activeTab === 'CONFIG'
                ? 'border-[#C5A059] text-[#C5A059]'
                : 'border-transparent text-white/50 hover:text-white'
            }`}
          >
            Threshold Settings
          </button>
          <button
            onClick={() => setActiveTab('HISTORY')}
            className={`py-2.5 px-4 font-bold uppercase tracking-wider border-b-2 transition-all flex items-center space-x-2 ${
              activeTab === 'HISTORY'
                ? 'border-[#C5A059] text-[#C5A059]'
                : 'border-transparent text-white/50 hover:text-white'
            }`}
          >
            <span>Alert History</span>
            <span className="bg-white/10 text-white/80 px-1.5 py-0.2 rounded-sm text-[10px]">
              {alertHistory.length}
            </span>
          </button>
        </div>

        {/* Body Content */}
        <div className="p-5 flex-1 overflow-y-auto space-y-5 font-mono text-xs">
          {activeTab === 'CONFIG' ? (
            <div className="space-y-5">
              {/* Enable / Audio Toggles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-[#0A0A0A] p-3 rounded-sm border border-white/5">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-white/80 font-bold uppercase text-[11px]">
                    Alert Monitoring
                  </span>
                  <input
                    type="checkbox"
                    checked={alertConfig.enabled}
                    onChange={(e) => updateAlertConfig({ enabled: e.target.checked })}
                    className="accent-[#C5A059] w-4 h-4 rounded-sm"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-white/80 font-bold uppercase text-[11px]">
                    Audio Warning Chime
                  </span>
                  <input
                    type="checkbox"
                    checked={alertConfig.soundEnabled}
                    onChange={(e) => updateAlertConfig({ soundEnabled: e.target.checked })}
                    className="accent-[#C5A059] w-4 h-4 rounded-sm"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer sm:col-span-2 pt-2 border-t border-white/5">
                  <div>
                    <span className="text-white/80 font-bold uppercase text-[11px] block">
                      Auto-Pause Simulation on Critical Alert
                    </span>
                    <span className="text-white/40 text-[10px]">
                      Automatically pauses simulation loop when a Critical alert fires.
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={alertConfig.autoPauseOnCritical}
                    onChange={(e) => updateAlertConfig({ autoPauseOnCritical: e.target.checked })}
                    className="accent-red-500 w-4 h-4 rounded-sm shrink-0"
                  />
                </label>
              </div>

              {/* Slider Controls */}
              <div className="space-y-4">
                {/* Min Agent Battery */}
                <div className="bg-[#0A0A0A] p-3.5 rounded-sm border border-white/5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[#C5A059] font-bold uppercase text-[11px]">
                      Min Agent Battery Threshold
                    </span>
                    <span className="text-white font-bold">{alertConfig.minAgentBattery}%</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="50"
                    step="5"
                    value={alertConfig.minAgentBattery}
                    onChange={(e) => updateAlertConfig({ minAgentBattery: Number(e.target.value) })}
                    className="w-full accent-[#C5A059] cursor-pointer"
                  />
                  <p className="text-[10px] text-white/40">
                    Triggers warning when any active drone battery drops below this charge percentage.
                  </p>
                </div>

                {/* Min Active Swarm Capacity */}
                <div className="bg-[#0A0A0A] p-3.5 rounded-sm border border-white/5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[#C5A059] font-bold uppercase text-[11px]">
                      Min Active Swarm Ratio Threshold
                    </span>
                    <span className="text-white font-bold">{alertConfig.minActiveAgentRatio}%</span>
                  </div>
                  <input
                    type="range"
                    min="30"
                    max="95"
                    step="5"
                    value={alertConfig.minActiveAgentRatio}
                    onChange={(e) => updateAlertConfig({ minActiveAgentRatio: Number(e.target.value) })}
                    className="w-full accent-[#C5A059] cursor-pointer"
                  />
                  <p className="text-[10px] text-white/40">
                    Triggers critical alert if uncollided operational drones fall below this percentage of total fleet.
                  </p>
                </div>

                {/* Min Mission Search Coverage */}
                <div className="bg-[#0A0A0A] p-3.5 rounded-sm border border-white/5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[#C5A059] font-bold uppercase text-[11px]">
                      Min Search Coverage Target (at Step 150)
                    </span>
                    <span className="text-white font-bold">{alertConfig.minMissionCoverage}%</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="50"
                    step="5"
                    value={alertConfig.minMissionCoverage}
                    onChange={(e) => updateAlertConfig({ minMissionCoverage: Number(e.target.value) })}
                    className="w-full accent-[#C5A059] cursor-pointer"
                  />
                  <p className="text-[10px] text-white/40">
                    Triggers alert if total map exploration coverage is lagging behind target pace.
                  </p>
                </div>

                {/* Max Collision Rate */}
                <div className="bg-[#0A0A0A] p-3.5 rounded-sm border border-white/5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[#C5A059] font-bold uppercase text-[11px]">
                      Max Allowed Collision Rate
                    </span>
                    <span className="text-white font-bold">{alertConfig.maxCollisionRate.toFixed(2)} / step</span>
                  </div>
                  <input
                    type="range"
                    min="0.01"
                    max="0.20"
                    step="0.01"
                    value={alertConfig.maxCollisionRate}
                    onChange={(e) => updateAlertConfig({ maxCollisionRate: Number(e.target.value) })}
                    className="w-full accent-[#C5A059] cursor-pointer"
                  />
                  <p className="text-[10px] text-white/40">
                    Triggers warning if average collision frequency exceeds this safety threshold.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-white/10">
                <button
                  onClick={handleTestAlert}
                  className="px-3 py-1.5 rounded-sm bg-white/5 border border-white/10 hover:border-[#C5A059] text-white uppercase text-[10px] tracking-wider transition-colors"
                >
                  Trigger Test Alert
                </button>
                <button
                  onClick={onClose}
                  className="px-4 py-1.5 rounded-sm bg-[#C5A059] hover:bg-[#d4b06a] text-black font-bold uppercase text-[10px] tracking-wider transition-colors"
                >
                  Save & Apply
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <span className="text-white/60 uppercase text-[10px]">Recent Alert Log Entries</span>
                {alertHistory.length > 0 && (
                  <button
                    onClick={clearAlerts}
                    className="text-white/40 hover:text-red-400 uppercase text-[10px]"
                  >
                    Clear Log
                  </button>
                )}
              </div>

              {alertHistory.length === 0 ? (
                <div className="text-center py-10 text-white/40 space-y-1">
                  <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-500/50" />
                  <p className="uppercase tracking-wider text-[11px]">No alerts triggered</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {alertHistory.map((alt) => (
                    <div
                      key={alt.id}
                      className="bg-[#0A0A0A] p-3 rounded-sm border border-white/5 space-y-1 text-[11px]"
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className={`font-bold uppercase text-[9px] px-1.5 py-0.2 rounded-sm ${
                            alt.severity === 'CRITICAL'
                              ? 'bg-red-500 text-white'
                              : 'bg-[#C5A059] text-black'
                          }`}
                        >
                          {alt.severity}
                        </span>
                        <span className="text-white/40 text-[10px]">{alt.timestamp}</span>
                      </div>
                      <div className="font-bold text-[#F5F5F5]">{alt.title}</div>
                      <div className="text-white/70">{alt.message}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
