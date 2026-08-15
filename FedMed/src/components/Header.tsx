import React from 'react';
import { ShieldCheck, Activity, Lock, Sparkles, RefreshCw, LogOut, User } from 'lucide-react';
import { OverviewMetrics } from '../types';

interface HeaderProps {
  metrics: OverviewMetrics | null;
  onRefresh: () => void;
  onOpenAiModal: () => void;
  isRefreshing: boolean;
  user?: { id: number; email: string; fullName: string; role: string } | null;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  metrics,
  onRefresh,
  onOpenAiModal,
  isRefreshing,
  user,
  onLogout,
}) => {
  return (
    <header className="h-16 bg-slate-950/60 backdrop-blur-md border-b border-slate-800 text-slate-100 px-6 flex flex-col md:flex-row items-center justify-between gap-4 sticky top-0 z-30">
      {/* Brand Identity */}
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 p-0.5 shadow-[0_0_12px_rgba(6,182,212,0.4)] flex items-center justify-center">
          <ShieldCheck className="w-4 h-4 text-cyan-400" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="font-bold text-lg text-white tracking-tight">
              FedMed<span className="text-cyan-400 font-light">.ai</span>
            </h1>
            <span className="bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider">
              Cross-Silo FL
            </span>
          </div>
          <div className="text-[9px] text-slate-500 font-mono mt-0.5 hidden sm:block">
            Created By <span className="text-cyan-400">𝕊𝕦𝕟𝕚𝕝 𝕊𝕙𝕒𝕣𝕞𝕒</span>
          </div>
        </div>
      </div>

      {/* Live Telemetry Bar */}
      <div className="flex flex-wrap items-center gap-4">
        {/* Training Round Metric */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Training Round</span>
          <span className="text-sm font-bold font-mono text-white glow-cyan">
            {metrics?.currentRound ?? 12} / {metrics?.totalRounds ?? 30}
          </span>
        </div>

        <div className="h-4 w-[1px] bg-slate-800 hidden sm:block"></div>

        {/* Aggregator Status */}
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-700/80">
          <div className="w-2 h-2 rounded-full bg-emerald-500 status-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
          <span className="text-xs font-semibold text-slate-300">
            Aggregator: <span className="text-emerald-400 font-mono">{metrics?.activeHospitalsCount ?? 0}/{metrics?.totalHospitalsCount ?? 0} ACTIVE</span>
          </span>
        </div>

        {/* Encryption Badge */}
        <div className="hidden lg:flex items-center gap-1.5 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 px-2.5 py-1 rounded-md text-xs font-mono">
          <Lock className="w-3 h-3 text-cyan-400" />
          <span>TenSEAL CKKS</span>
        </div>

        {/* Gemini AI Insights Button */}
        <button
          onClick={onOpenAiModal}
          className="flex items-center gap-1.5 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white px-3 py-1.5 rounded-md text-xs font-bold shadow-[0_0_15px_rgba(8,145,178,0.35)] transition-all uppercase tracking-wider cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
          <span>AI Assessment</span>
        </button>

        {/* Manual Refresh Button */}
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="p-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white rounded-md border border-slate-700 transition-colors disabled:opacity-50 cursor-pointer"
          title="Manual Telemetry Sync"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-cyan-400' : ''}`} />
        </button>

        {/* User Menu */}
        {user && onLogout && (
          <div className="flex items-center gap-3 pl-4 border-l border-slate-700">
            <div className="hidden md:flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="text-left">
                <div className="text-xs font-semibold text-white">{user.fullName}</div>
                <div className="text-[10px] text-slate-500">{user.email}</div>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="p-1.5 bg-slate-900 hover:bg-red-900/30 text-slate-300 hover:text-red-400 rounded-md border border-slate-700 hover:border-red-500/30 transition-colors cursor-pointer"
              title="Logout"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

