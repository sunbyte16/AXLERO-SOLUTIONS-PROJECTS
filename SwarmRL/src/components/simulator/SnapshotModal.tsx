/**
 * SwarmRL - State Snapshot Library & Comparison Drawer Component
 */

import React, { useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  Camera,
  Check,
  ChevronRight,
  Clock,
  Download,
  Layers,
  Sparkles,
  Trash2,
  X,
} from 'lucide-react';
import { useSwarmStore } from '../../stores/useSwarmStore';
import { SimulationSnapshot } from '../../types';

interface SnapshotModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SnapshotModal: React.FC<SnapshotModalProps> = ({ isOpen, onClose }) => {
  const { snapshots, metrics, deleteSnapshot, clearSnapshots, takeSnapshot } = useSwarmStore();
  const [selectedSnapshot, setSelectedSnapshot] = useState<SimulationSnapshot | null>(null);
  const [comparingSnapshot, setComparingSnapshot] = useState<SimulationSnapshot | null>(null);
  const [customNameInput, setCustomNameInput] = useState<string>('');
  const [justTaken, setJustTaken] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleTakeNewSnapshot = () => {
    takeSnapshot(customNameInput.trim() || undefined);
    setCustomNameInput('');
    setJustTaken(true);
    setTimeout(() => setJustTaken(false), 2000);
  };

  const handleDownloadSnapshotJSON = (snap: SimulationSnapshot) => {
    const jsonStr = JSON.stringify(snap, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `swarm_snapshot_${snap.id}_step${snap.step}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 font-sans animate-in fade-in duration-200">
      <div className="bg-[#121212] border border-white/10 rounded-sm shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-[#0A0A0A]">
          <div className="flex items-center space-x-2">
            <Camera className="w-5 h-5 text-[#C5A059]" />
            <div>
              <h3 className="font-bold text-sm text-[#F5F5F5] uppercase tracking-wider">
                Simulation State Snapshots
              </h3>
              <p className="text-[11px] text-white/50 font-light">
                Locally saved state points for agent positions, metrics & collision comparisons.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {snapshots.length > 0 && (
              <button
                onClick={clearSnapshots}
                className="text-white/40 hover:text-red-400 text-xs font-mono uppercase tracking-wider transition-colors"
              >
                Clear All
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1 rounded-sm text-white/50 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 flex-1 overflow-y-auto space-y-6">
          {/* Quick Capture Input Bar */}
          <div className="bg-[#0A0A0A] border border-white/10 p-3 rounded-sm flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center space-x-2 w-full sm:w-auto flex-1">
              <Camera className="w-4 h-4 text-[#C5A059] shrink-0" />
              <input
                type="text"
                value={customNameInput}
                onChange={(e) => setCustomNameInput(e.target.value)}
                placeholder="Optional label (e.g., Post-Obstacle Re-route Step 400)..."
                className="bg-[#121212] border border-white/10 text-white text-xs rounded-sm px-3 py-1.5 w-full focus:outline-none focus:border-[#C5A059] font-mono"
              />
            </div>
            <button
              onClick={handleTakeNewSnapshot}
              className={`px-4 py-2 rounded-sm text-xs font-bold uppercase tracking-widest flex items-center space-x-2 transition-all cursor-pointer ${
                justTaken
                  ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20'
                  : 'bg-[#C5A059] hover:bg-[#d4b06a] text-black shadow-lg shadow-[#C5A059]/20'
              }`}
            >
              {justTaken ? <Check className="w-4 h-4" /> : <Camera className="w-4 h-4" />}
              <span>{justTaken ? 'Captured!' : 'Capture Snapshot'}</span>
            </button>
          </div>

          {/* Snapshot Comparison Drawer View */}
          {comparingSnapshot && (
            <div className="bg-[#0A0A0A] border border-[#C5A059]/40 p-4 rounded-sm space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-[#C5A059]" />
                  <span className="font-bold text-xs text-[#F5F5F5] uppercase tracking-wider">
                    Delta Comparison: Saved Snapshot vs Live State
                  </span>
                </div>
                <button
                  onClick={() => setComparingSnapshot(null)}
                  className="text-xs text-white/50 hover:text-white uppercase font-mono"
                >
                  Close Comparison
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                {/* Saved Snapshot Side */}
                <div className="bg-[#121212] p-3 rounded-sm border border-white/10 space-y-2">
                  <div className="text-[#C5A059] font-bold uppercase text-[11px] truncate">
                    [Snapshot] {comparingSnapshot.name}
                  </div>
                  <div className="text-white/40 text-[10px]">Saved at {comparingSnapshot.timestamp} (Step {comparingSnapshot.step})</div>
                  <div className="space-y-1 text-white/80 pt-1">
                    <div>Map Coverage: <span className="text-white font-bold">{comparingSnapshot.mapCoverage.toFixed(1)}%</span></div>
                    <div>Active Drones: <span className="text-white font-bold">{comparingSnapshot.activeAgents}</span></div>
                    <div>Total Collisions: <span className="text-white font-bold">{comparingSnapshot.totalCollisions}</span></div>
                    <div>Average Reward: <span className="text-white font-bold">{comparingSnapshot.avgReward.toFixed(2)}</span></div>
                  </div>
                </div>

                {/* Live State Side with Deltas */}
                <div className="bg-[#121212] p-3 rounded-sm border border-emerald-500/30 space-y-2">
                  <div className="text-emerald-400 font-bold uppercase text-[11px]">
                    [Live State] Current Step {metrics.step}
                  </div>
                  <div className="text-white/40 text-[10px]">Live Telemetry Delta</div>
                  <div className="space-y-1 pt-1">
                    <div className="flex items-center justify-between">
                      <span className="text-white/80">Map Coverage:</span>
                      <span className="font-bold">
                        {metrics.map_coverage_percent.toFixed(1)}%{' '}
                        <span className={metrics.map_coverage_percent >= comparingSnapshot.mapCoverage ? 'text-emerald-400' : 'text-red-400'}>
                          ({(metrics.map_coverage_percent - comparingSnapshot.mapCoverage >= 0 ? '+' : '')}
                          {(metrics.map_coverage_percent - comparingSnapshot.mapCoverage).toFixed(1)}%)
                        </span>
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-white/80">Active Drones:</span>
                      <span className="font-bold">
                        {metrics.active_agents}{' '}
                        <span className="text-white/50">
                          ({(metrics.active_agents - comparingSnapshot.activeAgents >= 0 ? '+' : '')}
                          {metrics.active_agents - comparingSnapshot.activeAgents})
                        </span>
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-white/80">Collisions:</span>
                      <span className="font-bold">
                        {metrics.total_collisions}{' '}
                        <span className={metrics.total_collisions <= comparingSnapshot.totalCollisions ? 'text-emerald-400' : 'text-red-400'}>
                          ({(metrics.total_collisions - comparingSnapshot.totalCollisions >= 0 ? '+' : '')}
                          {metrics.total_collisions - comparingSnapshot.totalCollisions})
                        </span>
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-white/80">Avg Reward:</span>
                      <span className="font-bold">
                        {metrics.avg_reward.toFixed(2)}{' '}
                        <span className={metrics.avg_reward >= comparingSnapshot.avgReward ? 'text-emerald-400' : 'text-red-400'}>
                          ({(metrics.avg_reward - comparingSnapshot.avgReward >= 0 ? '+' : '')}
                          {(metrics.avg_reward - comparingSnapshot.avgReward).toFixed(2)})
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Snapshots List */}
          {snapshots.length === 0 ? (
            <div className="text-center py-12 text-white/40 space-y-2">
              <Camera className="w-8 h-8 mx-auto text-white/20" />
              <p className="text-xs font-mono uppercase tracking-wider">No state snapshots captured yet</p>
              <p className="text-xs text-white/30 max-w-sm mx-auto">
                Click "Capture Snapshot" above to save agent positions, coverage, and environment telemetry.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {snapshots.map((snap) => (
                <div
                  key={snap.id}
                  className="bg-[#0A0A0A] border border-white/10 hover:border-[#C5A059]/50 p-4 rounded-sm space-y-3 transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-xs text-[#F5F5F5] uppercase tracking-wider">
                        {snap.name}
                      </h4>
                      <div className="flex items-center space-x-2 text-[10px] text-white/40 font-mono mt-0.5">
                        <Clock className="w-3 h-3" />
                        <span>{snap.timestamp}</span>
                        <span>•</span>
                        <span>Step {snap.step}</span>
                        <span>•</span>
                        <span>Episode {snap.episode}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => deleteSnapshot(snap.id)}
                      className="text-white/30 hover:text-red-400 p-1 transition-colors"
                      title="Delete Snapshot"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Metrics Badge Grid */}
                  <div className="grid grid-cols-4 gap-2 text-[10px] font-mono bg-[#121212] p-2 rounded-sm border border-white/5">
                    <div>
                      <span className="text-white/40 uppercase block">Coverage</span>
                      <span className="text-[#C5A059] font-bold">{snap.mapCoverage.toFixed(1)}%</span>
                    </div>
                    <div>
                      <span className="text-white/40 uppercase block">Drones</span>
                      <span className="text-white/90 font-bold">{snap.activeAgents}</span>
                    </div>
                    <div>
                      <span className="text-white/40 uppercase block">Collisions</span>
                      <span className="text-red-400 font-bold">{snap.totalCollisions}</span>
                    </div>
                    <div>
                      <span className="text-white/40 uppercase block">Avg Reward</span>
                      <span className="text-emerald-400 font-bold">{snap.avgReward.toFixed(1)}</span>
                    </div>
                  </div>

                  {/* Agent Positions Mini Summary */}
                  <div className="text-[10px] font-mono text-white/50 space-y-1">
                    <div className="text-white/40 uppercase text-[9px]">Agent Position Samples:</div>
                    <div className="flex flex-wrap gap-1">
                      {snap.agents.slice(0, 4).map((ag) => (
                        <span
                          key={ag.agent_id}
                          className="bg-white/5 px-1.5 py-0.5 rounded-sm border border-white/5 text-[9px]"
                        >
                          {ag.agent_id}: [{ag.position.x.toFixed(0)}, {ag.position.z.toFixed(0)}]
                        </span>
                      ))}
                      {snap.agents.length > 4 && (
                        <span className="text-white/30 text-[9px] self-center">
                          +{snap.agents.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-1 border-t border-white/5 text-[10px] font-mono">
                    <button
                      onClick={() => setComparingSnapshot(snap)}
                      className="text-[#C5A059] hover:text-[#d4b06a] uppercase font-bold flex items-center space-x-1"
                    >
                      <span>Compare with Live State</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>

                    <button
                      onClick={() => handleDownloadSnapshotJSON(snap)}
                      className="text-white/50 hover:text-white uppercase flex items-center space-x-1"
                    >
                      <Download className="w-3 h-3" />
                      <span>Export JSON</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
