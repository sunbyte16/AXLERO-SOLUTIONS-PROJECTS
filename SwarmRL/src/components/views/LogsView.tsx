/**
 * SwarmRL - System & Telemetry Event Logger View
 */

import React from 'react';
import { Terminal } from 'lucide-react';
import { useSwarmStore } from '../../stores/useSwarmStore';

export const LogsView: React.FC = () => {
  const { logs } = useSwarmStore();

  return (
    <div className="p-4 md:p-6 space-y-4 overflow-y-auto h-full font-mono text-xs">
      <div>
        <h2 className="text-lg font-bold text-[#F5F5F5] font-sans uppercase tracking-wider flex items-center space-x-2">
          <Terminal className="w-5 h-5 text-[#C5A059]" />
          <span>System Telemetry & Real-Time Event Log</span>
        </h2>
        <p className="text-xs text-white/50 font-sans font-light mt-0.5">
          Structured logs from Simulation Engine, MAPPO update steps, and WebSockets.
        </p>
      </div>

      <div className="bg-[#0A0A0A] border border-white/10 rounded-sm p-4 shadow-2xl space-y-2 max-h-[600px] overflow-y-auto">
        {logs.map((log) => (
          <div key={log.id} className="flex items-start space-x-3 text-[11px] py-1.5 border-b border-white/5">
            <span className="text-white/40 shrink-0">{log.timestamp}</span>
            <span
              className={`px-1.5 py-0.5 rounded-sm text-[9px] font-bold uppercase tracking-widest shrink-0 ${
                log.level === 'SUCCESS'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                  : log.level === 'MAPPO'
                  ? 'bg-[#C5A059]/10 text-[#E8D09E] border border-[#C5A059]/30'
                  : log.level === 'WARN'
                  ? 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
                  : log.level === 'ERROR'
                  ? 'bg-red-500/10 text-red-300 border border-red-500/30'
                  : 'bg-white/5 text-white/70 border border-white/10'
              }`}
            >
              {log.level}
            </span>
            <span className="text-[#C5A059] font-semibold shrink-0">[{log.category}]</span>
            <span className="text-white/90">{log.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
