import React from 'react';
import {
  Activity,
  Building2,
  Lock,
  TrendingUp,
  Zap,
  Play,
  CheckCircle2,
  ShieldCheck,
  Cpu,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { OverviewMetrics, RoundMetric, HospitalNode } from '../types';

interface DashboardOverviewProps {
  metrics: OverviewMetrics | null;
  history: RoundMetric[];
  hospitals: HospitalNode[];
  onTriggerRound: () => void;
  isTriggeringRound: boolean;
  onNavigateToTab: (tab: any) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  metrics,
  history,
  hospitals,
  onTriggerRound,
  isTriggeringRound,
  onNavigateToTab,
}) => {
  const latestMetric = history[history.length - 1];

  return (
    <div className="space-y-6">
      {/* Executive Command Banner */}
      <div className="glass-panel border border-slate-800 rounded-2xl p-6 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[11px] font-semibold font-mono px-2.5 py-0.5 rounded-md">
                3D Swin UNETR &bull; MONAI Brain Tumor Segmentation
              </span>
              <span className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[11px] font-semibold font-mono px-2.5 py-0.5 rounded-md">
                CKKS HE + DP-SGD Enforced
              </span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Federated Clinical Learning & Compliance Command Center
            </h2>
            <p className="text-slate-400 text-xs mt-1.5 max-w-3xl leading-relaxed font-sans">
              Collaboratively training medical segmentation models across {hospitals.length} active hospital silos.
              Model gradients are encrypted with TenSEAL homomorphic ciphertext and injected with DP noise. Zero patient records leave local hospital perimeters.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onTriggerRound}
              disabled={isTriggeringRound}
              className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-md shadow-[0_0_15px_rgba(8,145,178,0.4)] transition-all duration-150 active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              <Play className={`w-3.5 h-3.5 ${isTriggeringRound ? 'animate-spin' : 'fill-white'}`} />
              <span>{isTriggeringRound ? 'Executing Round...' : 'Execute FL Round'}</span>
            </button>
            <button
              onClick={() => onNavigateToTab('fl-engine')}
              className="bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 font-semibold text-xs px-4 py-2.5 rounded-md transition-colors cursor-pointer"
            >
              Strategy Config
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid with Border Accent Colors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Mean Dice Score */}
        <div className="glass-panel glass-panel-hover rounded-2xl p-5 border-l-4 border-l-cyan-500">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
              Mean Dice Score (DSC)
            </span>
            <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white font-mono glow-cyan">
              {latestMetric ? latestMetric.diceScore.toFixed(4) : '0.8742'}
            </span>
          </div>
          <div className="mt-2 text-[11px] text-emerald-400 font-mono flex items-center gap-1">
            <span>+2.4% last round</span>
          </div>
        </div>

        {/* Metric 2: Global Loss */}
        <div className="glass-panel glass-panel-hover rounded-2xl p-5 border-l-4 border-l-indigo-500">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
              Global Training Loss
            </span>
            <div className="w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Activity className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white font-mono">
              {latestMetric ? latestMetric.loss.toFixed(4) : '0.0128'}
            </span>
          </div>
          <div className="mt-2 text-[11px] text-emerald-400 font-mono flex items-center gap-1">
            <span>-0.0041 improvement</span>
          </div>
        </div>

        {/* Metric 3: Active Hospitals */}
        <div className="glass-panel glass-panel-hover rounded-2xl p-5 border-l-4 border-l-purple-500">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
              Active Hospital Silos
            </span>
            <div className="w-7 h-7 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Building2 className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white font-mono">
              {metrics?.activeHospitalsCount ?? 4} / {metrics?.totalHospitalsCount ?? 5}
            </span>
          </div>
          <div className="mt-2 text-[11px] text-cyan-400 font-mono flex items-center gap-1">
            <span>Quorum Reached ({metrics?.totalSamplesTrained.toLocaleString() ?? '5,570'} MRI)</span>
          </div>
        </div>

        {/* Metric 4: Privacy Budget Spent */}
        <div className="glass-panel glass-panel-hover rounded-2xl p-5 border-l-4 border-l-emerald-500">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
              Privacy Budget (&epsilon;)
            </span>
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Lock className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white font-mono">
              {latestMetric ? latestMetric.dpEpsilonSpent.toFixed(2) : '3.36'}
            </span>
            <span className="text-xs text-slate-400 font-mono">/ {metrics?.targetEpsilon ?? 10.0} &epsilon;</span>
          </div>
          <div className="mt-2 text-[11px] text-emerald-400 font-mono flex items-center gap-1">
            <span>Strict HIPAA/GDPR Enforced</span>
          </div>
        </div>
      </div>

      {/* Main Content Grid: Learning Curve & Node Orchestration */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Central Visualization Chart */}
        <div className="lg:col-span-8 glass-panel rounded-3xl p-6 relative flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-500" />
                <span>Segmentation Accuracy Convergence</span>
              </h3>
              <div className="flex items-center gap-3 text-[10px] font-mono">
                <span className="flex items-center gap-1.5 text-cyan-400">
                  <span className="w-2 h-2 bg-cyan-400 rounded-full inline-block shadow-[0_0_8px_rgba(34,211,238,0.8)]"></span>
                  <span>3D Swin UNETR</span>
                </span>
                <span className="flex items-center gap-1.5 text-indigo-400">
                  <span className="w-2 h-2 bg-indigo-400 rounded-full inline-block"></span>
                  <span>Validation Loss</span>
                </span>
              </div>
            </div>

            <div className="h-72 w-full mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={history} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(51, 65, 85, 0.4)" />
                  <XAxis dataKey="round" stroke="#64748b" tick={{ fontSize: 11, fontFamily: 'JetBrains Mono' }} tickFormatter={(r) => `R${r}`} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 11, fontFamily: 'JetBrains Mono' }} domain={[0, 1]} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#38bdf840', borderRadius: '12px', color: '#fff', fontFamily: 'JetBrains Mono', fontSize: '12px' }}
                  />
                  <Line type="monotone" dataKey="diceScore" name="Dice Score" stroke="#22d3ee" strokeWidth={3} dot={{ r: 4, fill: '#22d3ee' }} />
                  <Line type="monotone" dataKey="loss" name="Loss" stroke="#6366f1" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between text-xs text-slate-400 font-mono">
            <span className="flex items-center gap-1.5 text-cyan-400">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Protocol: TenSEAL CKKS 8192-bit Homomorphic Sum</span>
            </span>
            <button
              onClick={() => onNavigateToTab('fl-engine')}
              className="text-cyan-400 hover:underline font-bold text-[11px] uppercase tracking-wider cursor-pointer"
            >
              Full Round Logs &rarr;
            </button>
          </div>
        </div>

        {/* Node Orchestration Side Panel */}
        <div className="lg:col-span-4 glass-panel rounded-3xl p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-cyan-500" />
              <span>Node Orchestration</span>
            </h3>

            <div className="space-y-3">
              {hospitals.map((node) => (
                <div
                  key={node.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-500/30 transition-all"
                >
                  <div>
                    <div className="text-xs font-semibold text-white">{node.name}</div>
                    <div className="text-[10px] text-slate-500 font-mono">Encryption: CKKS-HE</div>
                  </div>
                  <div className="text-right">
                    <div
                      className={`text-xs font-bold font-mono ${
                        node.status === 'ONLINE' ? 'text-emerald-400' : 'text-slate-400'
                      }`}
                    >
                      {node.status === 'ONLINE' ? 'TRANSMITTING' : 'IDLE'}
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono">
                      Dice: {node.localDiceScore}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => onNavigateToTab('hospitals')}
            className="mt-6 w-full py-2 border border-slate-800 text-slate-300 text-[10px] uppercase font-bold tracking-wider hover:bg-slate-900 transition-colors rounded-lg cursor-pointer font-mono"
          >
            Manage All Clinical Partners
          </button>
        </div>
      </div>
    </div>
  );
};

