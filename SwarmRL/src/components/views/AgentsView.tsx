/**
 * SwarmRL - Multi-Agent Telemetry Inspector Grid
 */

import React from 'react';
import { Battery, Bot, Eye, Navigation, ShieldAlert, Zap } from 'lucide-react';
import { useSwarmStore } from '../../stores/useSwarmStore';

export const AgentsView: React.FC = () => {
  const { agents, selectedDroneId, setSelectedDroneId } = useSwarmStore();

  return (
    <div className="p-4 md:p-6 space-y-6 overflow-y-auto h-full font-sans">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-[#F5F5F5] uppercase tracking-wider flex items-center space-x-2">
            <Bot className="w-5 h-5 text-[#C5A059]" />
            <span>Autonomous Drone Fleet Telemetry Inspector</span>
          </h2>
          <p className="text-xs text-white/50 font-light mt-0.5">
            Real-time individual drone state, battery, LiDAR distance sensors, and rewards.
          </p>
        </div>
        <span className="px-3 py-1 rounded-sm text-xs font-mono font-bold bg-[#C5A059]/10 text-[#E8D09E] border border-[#C5A059]/30 uppercase tracking-widest">
          {agents.length} Drones Active
        </span>
      </div>

      {/* Agents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {agents.map((agent) => {
          const isCollided = agent.status === 'COLLIDED';
          const isSelected = selectedDroneId === agent.agent_id;

          return (
            <div
              key={agent.agent_id}
              onClick={() => setSelectedDroneId(agent.agent_id)}
              className={`p-4 rounded-sm border transition-all cursor-pointer font-mono text-xs space-y-3 ${
                isCollided
                  ? 'bg-red-950/30 border-red-500/40 text-red-200'
                  : isSelected
                  ? 'bg-[#181818] border-[#C5A059] text-white shadow-xl shadow-[#C5A059]/10'
                  : 'bg-[#121212] border-white/10 hover:border-white/30 text-white/80'
              }`}
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <div className="flex items-center space-x-2 font-bold text-sm">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isCollided ? 'bg-red-500 animate-pulse' : 'bg-emerald-400'
                    }`}
                  />
                  <span className="text-white">{agent.agent_id}</span>
                </div>
                <span className="px-2 py-0.5 rounded-sm text-[9px] uppercase tracking-widest bg-white/5 text-white/60">
                  {agent.status}
                </span>
              </div>

              {/* Coordinates & Battery */}
              <div className="grid grid-cols-2 gap-2 text-[11px] text-white/70">
                <div>
                  <span className="text-white/40 uppercase tracking-widest text-[9px]">Pos X/Y/Z:</span>
                  <p className="font-bold">
                    {agent.position.x.toFixed(1)}, {agent.position.y.toFixed(1)}, {agent.position.z.toFixed(1)}m
                  </p>
                </div>
                <div>
                  <span className="text-white/40 uppercase tracking-widest text-[9px]">Battery:</span>
                  <div className="flex items-center space-x-1 font-bold">
                    <Battery className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{agent.battery.toFixed(0)}%</span>
                  </div>
                </div>
              </div>

              {/* LiDAR Rays Mini Meter */}
              <div className="space-y-1 pt-1">
                <div className="flex items-center justify-between text-[10px] text-white/40 uppercase tracking-widest">
                  <span className="flex items-center space-x-1">
                    <Eye className="w-3 h-3 text-[#C5A059]" />
                    <span>LiDAR Rays (8-Fan):</span>
                  </span>
                  <span>{agent.lidar_readings.length} Rays</span>
                </div>
                <div className="grid grid-cols-8 gap-1">
                  {agent.lidar_readings.map((dist, idx) => (
                    <div
                      key={idx}
                      className="h-3 rounded-sm bg-[#0A0A0A] overflow-hidden relative border border-white/5"
                      title={`Ray ${idx + 1}: ${(dist * 25).toFixed(1)}m`}
                    >
                      <div
                        className={`h-full ${
                          dist < 0.2 ? 'bg-red-500' : dist < 0.5 ? 'bg-amber-400' : 'bg-[#C5A059]'
                        }`}
                        style={{ height: `${dist * 100}%` }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Reward & Travelled */}
              <div className="flex items-center justify-between text-[11px] pt-2 border-t border-white/10">
                <span className="text-white/40 uppercase tracking-widest text-[9px]">Step Reward:</span>
                <span className="font-bold text-[#E8D09E]">{agent.current_reward.toFixed(2)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
