import React from 'react';
import {
  Settings,
  Server,
  Database,
  CheckCircle2,
} from 'lucide-react';

export const SettingsPanel: React.FC = () => {
  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="glass-panel p-6 rounded-2xl shadow-xl">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Settings className="w-5 h-5 text-indigo-400" />
          <span>Platform Infrastructure & System Settings</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Configure gRPC ports, Redis/Postgres connection state, Flower FL Server parameters, and Gemini API keys.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
        {/* gRPC & Communication Settings */}
        <div className="glass-panel rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="font-bold text-white text-sm flex items-center gap-2 pb-2 border-b border-slate-800">
            <Server className="w-4 h-4 text-cyan-400" />
            <span>gRPC mTLS Network Settings</span>
          </h3>

          <div className="space-y-3 font-mono">
            <div>
              <label className="block text-slate-400 font-medium mb-1 font-sans">gRPC Listen Host & Port</label>
              <input
                type="text"
                disabled
                value="0.0.0.0:8080 (TLS 1.3 Strict)"
                className="w-full bg-slate-950 border border-slate-800 text-slate-300 rounded-lg p-2.5 font-mono text-xs"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-medium mb-1 font-sans">mTLS Certificate Authority (CA)</label>
              <input
                type="text"
                disabled
                value="/etc/fedmed/certs/ca-chain.crt (X.509 RSA-4096)"
                className="w-full bg-slate-950 border border-slate-800 text-slate-300 rounded-lg p-2.5 font-mono text-xs"
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-950/60 rounded-xl border border-slate-800">
              <span className="text-slate-300 font-sans">mTLS Handshake Status:</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1 text-[11px]">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>ACTIVE & ENFORCED</span>
              </span>
            </div>
          </div>
        </div>

        {/* Database & Caching Settings */}
        <div className="glass-panel rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="font-bold text-white text-sm flex items-center gap-2 pb-2 border-b border-slate-800">
            <Database className="w-4 h-4 text-indigo-400" />
            <span>Database & Pub/Sub Caching</span>
          </h3>

          <div className="space-y-3 font-mono">
            <div>
              <label className="block text-slate-400 font-medium mb-1 font-sans">PostgreSQL Master Instance</label>
              <input
                type="text"
                disabled
                value="postgresql://fedmed_admin@localhost:5432/fedmed_db"
                className="w-full bg-slate-950 border border-slate-800 text-slate-300 rounded-lg p-2.5 font-mono text-xs"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-medium mb-1 font-sans">Redis Pub/Sub Memory Cache</label>
              <input
                type="text"
                disabled
                value="redis://localhost:6379/0 (Real-time Telemetry)"
                className="w-full bg-slate-950 border border-slate-800 text-slate-300 rounded-lg p-2.5 font-mono text-xs"
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-950/60 rounded-xl border border-slate-800">
              <span className="text-slate-300 font-sans">Connection Pool Status:</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1 text-[11px]">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>HEALTHY (20 Connections)</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

