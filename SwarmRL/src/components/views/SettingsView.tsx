/**
 * SwarmRL - System Settings & Reward Engineering Tuning View
 */

import React, { useState } from 'react';
import { Settings, Sliders, Zap } from 'lucide-react';
import { useSwarmStore } from '../../stores/useSwarmStore';
import { DEFAULT_PHYSICS_LIMITS } from '../../simulation/physics';
import { DEFAULT_REWARD_WEIGHTS } from '../../simulation/rewards';

export const SettingsView: React.FC = () => {
  const { addLog } = useSwarmStore();
  const [rewardWeights, setRewardWeights] = useState(DEFAULT_REWARD_WEIGHTS);
  const [physicsLimits, setPhysicsLimits] = useState(DEFAULT_PHYSICS_LIMITS);

  const handleSaveRewards = () => {
    fetch('/api/v1/simulation/config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rewardWeights }),
    }).catch((err) => console.error(err));

    addLog('SUCCESS', 'SYSTEM', 'Reward Engineering weights successfully updated.');
  };

  return (
    <div className="p-4 md:p-6 space-y-6 overflow-y-auto h-full max-w-4xl font-sans">
      <div>
        <h2 className="text-lg font-bold text-[#F5F5F5] uppercase tracking-wider flex items-center space-x-2">
          <Settings className="w-5 h-5 text-[#C5A059]" />
          <span>System Settings & MAPPO Reward Engineering</span>
        </h2>
        <p className="text-xs text-white/50 font-light mt-0.5">
          Tune reward function hyperparameters, physics speed ceilings, and streaming frequency.
        </p>
      </div>

      {/* Reward Engineering Weights */}
      <div className="bg-[#121212] border border-white/10 p-5 rounded-sm space-y-4 shadow-2xl">
        <h3 className="text-xs font-semibold text-[#F5F5F5] uppercase tracking-wider flex items-center space-x-2">
          <Zap className="w-4 h-4 text-[#C5A059]" />
          <span>MAPPO Reward Component Weights</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
          <div>
            <label className="text-white/50 block mb-1 uppercase text-[10px] tracking-wider">
              Exploration Reward: {rewardWeights.exploration}
            </label>
            <input
              type="range"
              min={1}
              max={20}
              step={0.5}
              value={rewardWeights.exploration}
              onChange={(e) =>
                setRewardWeights({ ...rewardWeights, exploration: Number(e.target.value) })
              }
              className="w-full accent-[#C5A059]"
            />
          </div>

          <div>
            <label className="text-white/50 block mb-1 uppercase text-[10px] tracking-wider">
              Collision Penalty: {rewardWeights.collision_penalty}
            </label>
            <input
              type="range"
              min={-150}
              max={-10}
              step={5}
              value={rewardWeights.collision_penalty}
              onChange={(e) =>
                setRewardWeights({ ...rewardWeights, collision_penalty: Number(e.target.value) })
              }
              className="w-full accent-[#C5A059]"
            />
          </div>

          <div>
            <label className="text-white/50 block mb-1 uppercase text-[10px] tracking-wider">
              Cooperation Reward: {rewardWeights.cooperation}
            </label>
            <input
              type="range"
              min={0}
              max={10}
              step={0.2}
              value={rewardWeights.cooperation}
              onChange={(e) =>
                setRewardWeights({ ...rewardWeights, cooperation: Number(e.target.value) })
              }
              className="w-full accent-[#C5A059]"
            />
          </div>

          <div>
            <label className="text-white/50 block mb-1 uppercase text-[10px] tracking-wider">
              Efficiency Reward: {rewardWeights.efficiency}
            </label>
            <input
              type="range"
              min={0}
              max={5}
              step={0.1}
              value={rewardWeights.efficiency}
              onChange={(e) =>
                setRewardWeights({ ...rewardWeights, efficiency: Number(e.target.value) })
              }
              className="w-full accent-[#C5A059]"
            />
          </div>
        </div>

        <button
          onClick={handleSaveRewards}
          className="px-5 py-2.5 rounded-sm bg-[#C5A059] hover:bg-[#d4b06a] text-black font-bold uppercase tracking-widest text-xs transition-colors shadow-lg shadow-[#C5A059]/20"
        >
          Apply Reward Weights
        </button>
      </div>
    </div>
  );
};
