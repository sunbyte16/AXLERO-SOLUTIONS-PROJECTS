/**
 * SwarmRL - Model Registry & Checkpoints View
 */

import React from 'react';
import { Award, Box, Download, HardDrive, Sparkles, Upload } from 'lucide-react';
import { useSwarmStore } from '../../stores/useSwarmStore';

export const ModelsView: React.FC = () => {
  const { checkpoints, addLog } = useSwarmStore();

  const handleExportJSON = (ckpt: any) => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(ckpt, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${ckpt.version}_mappo_weights.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    addLog('SUCCESS', 'SYSTEM', `Exported MAPPO checkpoint weights file: ${ckpt.version}.json`);
  };

  return (
    <div className="p-4 md:p-6 space-y-6 overflow-y-auto h-full max-w-5xl font-sans">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-[#F5F5F5] uppercase tracking-wider flex items-center space-x-2">
            <Box className="w-5 h-5 text-[#C5A059]" />
            <span>MAPPO Policy Weights & Checkpoint Registry</span>
          </h2>
          <p className="text-xs text-white/50 font-light mt-0.5">
            Versioned policy checkpoints, actor-critic network configurations, and weight exports.
          </p>
        </div>
      </div>

      {/* Checkpoints List */}
      <div className="space-y-4">
        {checkpoints.map((ckpt) => (
          <div
            key={ckpt.id}
            className="p-5 rounded-sm bg-[#121212] border border-white/10 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 font-mono text-xs"
          >
            <div className="space-y-1">
              <div className="flex items-center space-x-3">
                <span className="font-bold text-sm text-[#F5F5F5]">{ckpt.name}</span>
                <span className="px-2 py-0.5 rounded-sm text-[9px] font-bold uppercase tracking-widest bg-[#C5A059]/10 text-[#E8D09E] border border-[#C5A059]/30">
                  {ckpt.version}
                </span>
              </div>
              <p className="text-[11px] text-white/50 font-sans">
                Iteration: {ckpt.iteration} • Episodes: {ckpt.episodes} • Saved:{' '}
                {new Date(ckpt.created_at).toLocaleTimeString()}
              </p>
            </div>

            <div className="flex items-center space-x-6 text-white/80">
              <div>
                <span className="text-white/40 text-[9px] uppercase tracking-widest block">Mean Reward</span>
                <span className="font-bold text-[#E8D09E] text-sm">{ckpt.mean_reward}</span>
              </div>

              <div>
                <span className="text-white/40 text-[9px] uppercase tracking-widest block">Search Coverage</span>
                <span className="font-bold text-[#C5A059] text-sm">{ckpt.mean_coverage}%</span>
              </div>

              <button
                onClick={() => handleExportJSON(ckpt)}
                className="px-4 py-2 rounded-sm bg-[#C5A059] hover:bg-[#d4b06a] text-black font-sans font-bold uppercase tracking-widest text-xs flex items-center space-x-1.5 transition-colors shadow-md shadow-[#C5A059]/20"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Weights</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
