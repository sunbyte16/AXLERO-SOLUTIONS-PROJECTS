import React, { useState } from 'react';
import {
  Cpu,
  Play,
  Lock,
  Activity,
  CheckCircle2,
  Sliders,
} from 'lucide-react';
import { RoundMetric } from '../types';

interface FLTrainingEngineProps {
  currentRound: number;
  totalRounds: number;
  activeStrategy: string;
  targetEpsilon: number;
  history: RoundMetric[];
  onTriggerRound: () => void;
  isTriggeringRound: boolean;
  onUpdateConfig: (config: any) => Promise<void>;
}

export const FLTrainingEngine: React.FC<FLTrainingEngineProps> = ({
  currentRound,
  totalRounds,
  activeStrategy,
  targetEpsilon,
  history,
  onTriggerRound,
  isTriggeringRound,
  onUpdateConfig,
}) => {
  const [strategy, setStrategy] = useState(activeStrategy);
  const [tr, setTr] = useState(totalRounds);
  const [eps, setEps] = useState(targetEpsilon);
  const [isSaving, setIsSaving] = useState(false);
  const [configMessage, setConfigMessage] = useState<string | null>(null);

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onUpdateConfig({
        strategy,
        totalRounds: Number(tr),
        targetEpsilon: Number(eps),
      });
      setConfigMessage('FL Strategy configuration updated successfully.');
      setTimeout(() => setConfigMessage(null), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Top Banner */}
      <div className="glass-panel p-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5 font-mono">
            <span className="bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded">
              Flower Orchestration Core
            </span>
            <span className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded">
              3D U-Net (MONAI)
            </span>
          </div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Cpu className="w-5 h-5 text-cyan-400" />
            <span>Encrypted Federated Round Executor</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Coordinates client selection, gRPC weight distribution, TenSEAL homomorphic ciphertext aggregation, and DP-SGD noise addition.
          </p>
        </div>

        <button
          onClick={onTriggerRound}
          disabled={isTriggeringRound || currentRound >= totalRounds}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-md shadow-[0_0_15px_rgba(16,185,129,0.4)] transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
        >
          <Play className={`w-4 h-4 ${isTriggeringRound ? 'animate-spin' : 'fill-white'}`} />
          <span>{isTriggeringRound ? 'Aggregating Round...' : `Execute Round #${currentRound + 1}`}</span>
        </button>
      </div>

      {/* Configuration & Protocol Parameters Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Strategy Control Panel */}
        <div className="glass-panel rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 pb-3 border-b border-slate-800">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <span>FL Strategy Parameters</span>
          </h3>

          <form onSubmit={handleSaveConfig} className="space-y-4 text-xs font-sans">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Aggregation Strategy</label>
              <select
                value={strategy}
                onChange={(e) => setStrategy(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-lg p-2.5 focus:border-cyan-500 focus:outline-none font-mono"
              >
                <option value="FedAvg (Secure HE + DP-SGD)">FedAvg (Federated Averaging + TenSEAL)</option>
                <option value="FedProx (Heterogeneous Hardware)">FedProx (Handling Non-IID & Dropping Nodes)</option>
                <option value="FedOpt (Federated Adam Optimizer)">FedOpt (Server Adam Momentum)</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3 font-mono">
              <div>
                <label className="block text-slate-300 font-medium mb-1 font-sans">Total Target Rounds</label>
                <input
                  type="number"
                  value={tr}
                  onChange={(e) => setTr(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-lg p-2.5 focus:border-cyan-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-medium mb-1 font-sans">DP Epsilon (&epsilon;)</label>
                <input
                  type="number"
                  step="0.5"
                  value={eps}
                  onChange={(e) => setEps(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-lg p-2.5 focus:border-cyan-500 focus:outline-none"
                />
              </div>
            </div>

            {configMessage && (
              <div className="p-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded text-xs font-semibold text-center font-mono">
                {configMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={isSaving}
              className="w-full bg-slate-900 hover:bg-slate-800 text-cyan-300 font-bold uppercase tracking-wider text-[11px] py-2.5 rounded-md border border-slate-700 transition-colors cursor-pointer"
            >
              {isSaving ? 'Updating...' : 'Update Strategy Config'}
            </button>
          </form>
        </div>

        {/* Homomorphic Ciphertext Inspector */}
        <div className="lg:col-span-2 glass-panel rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center justify-between pb-3 border-b border-slate-800">
            <span className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-400" />
              <span>TenSEAL CKKS Homomorphic Inspector</span>
            </span>
            <span className="text-[10px] bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-2.5 py-0.5 rounded font-mono font-bold uppercase tracking-wider">
              0 Plaintext Transmissions
            </span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
            <div className="bg-slate-950/60 border border-slate-800 p-3 rounded-xl space-y-1">
              <div className="text-slate-500 text-[10px] font-bold uppercase">Encryption Scheme:</div>
              <div className="text-slate-200 font-bold">CKKS (Vector Floating Point)</div>
            </div>
            <div className="bg-slate-950/60 border border-slate-800 p-3 rounded-xl space-y-1">
              <div className="text-slate-500 text-[10px] font-bold uppercase">Polynomial Degree:</div>
              <div className="text-cyan-400 font-bold">8192 (128-bit Security)</div>
            </div>
            <div className="bg-slate-950/60 border border-slate-800 p-3 rounded-xl space-y-1">
              <div className="text-slate-500 text-[10px] font-bold uppercase">Modulus Bit Sizes:</div>
              <div className="text-indigo-300 font-bold">[60, 40, 40, 60]</div>
            </div>
            <div className="bg-slate-950/60 border border-slate-800 p-3 rounded-xl space-y-1">
              <div className="text-slate-500 text-[10px] font-bold uppercase">Homomorphic Operator:</div>
              <div className="text-emerald-400 font-bold">E(A) + E(B) = E(A + B)</div>
            </div>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs font-mono space-y-1">
            <div className="text-slate-500 font-bold flex items-center justify-between text-[10px]">
              <span>ACTIVE ENCRYPTED TENSOR PAYLOAD LOG</span>
              <span className="text-emerald-400">VERIFIED OK</span>
            </div>
            <p className="text-slate-400 text-[11px]">
              [Round #{currentRound}] Receiving update packages from online hospital silos via gRPC mTLS...
            </p>
            <p className="text-slate-400 text-[11px]">
              Layer: <span className="text-cyan-300">encoder1.conv.0.weight</span> | Shape: [32, 1, 3, 3, 3] | Ciphertext bytes: 142.5 MB
            </p>
            <p className="text-emerald-400 text-[11px]">
              &gt;&gt; Homomorphic Sum Executed in 1.42s on Coordinator. Model weights remain fully encrypted.
            </p>
          </div>
        </div>
      </div>

      {/* Round Execution History Table */}
      <div className="glass-panel rounded-2xl p-6 shadow-xl space-y-4 font-mono">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 font-sans">
            <Activity className="w-4 h-4 text-cyan-400" />
            <span>Federated Round History & Metric Logs</span>
          </h3>
          <span className="text-xs text-slate-400">{history.length} Rounds Recorded</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/80 text-slate-500 uppercase font-bold text-[10px]">
                <th className="p-3">Round</th>
                <th className="p-3">Dice Score (DSC)</th>
                <th className="p-3">Loss (BCE)</th>
                <th className="p-3">Mean IoU</th>
                <th className="p-3">Silos</th>
                <th className="p-3">Payload</th>
                <th className="p-3">DP Spent (&epsilon;)</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {history.map((m) => (
                <tr key={m.round} className="hover:bg-slate-900/50 transition-colors">
                  <td className="p-3 font-bold text-white">#{m.round}</td>
                  <td className="p-3 font-bold text-cyan-400">{m.diceScore.toFixed(3)}</td>
                  <td className="p-3 font-semibold text-indigo-300">{m.loss.toFixed(3)}</td>
                  <td className="p-3 text-slate-300">{m.iou.toFixed(3)}</td>
                  <td className="p-3 text-slate-300">{m.participatedNodes} Silos</td>
                  <td className="p-3 text-slate-400">{m.encryptedBytesMb} MB</td>
                  <td className="p-3 text-emerald-400 font-bold">{m.dpEpsilonSpent.toFixed(2)} &epsilon;</td>
                  <td className="p-3">
                    <span className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[9px] font-bold px-2 py-0.5 rounded flex items-center w-fit gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>AGGREGATED</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

