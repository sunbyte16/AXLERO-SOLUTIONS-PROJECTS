/**
 * SwarmRL - MAPPO Deep RL Training Center & Learning Curves View
 */

import React from 'react';
import {
  Award,
  Brain,
  Download,
  Flame,
  LineChart as LineChartIcon,
  Pause,
  Play,
  RotateCcw,
  Sparkles,
  Zap,
} from 'lucide-react';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useSwarmStore } from '../../stores/useSwarmStore';
import { EstimatedCompletionTimer } from '../training/EstimatedCompletionTimer';

export const MappoTrainingView: React.FC = () => {
  const {
    trainingStatus,
    trainingMetricsHistory,
    curriculumLevel,
    setCurriculumLevel,
    addLog,
    checkpoints,
  } = useSwarmStore();

  const handleStartTraining = () => {
    fetch('/api/v1/training/start', { method: 'POST' }).catch((err) => console.error(err));
    addLog('MAPPO', 'TRAINING', 'MAPPO Deep Reinforcement Learning update loop started.');
  };

  const handlePauseTraining = () => {
    fetch('/api/v1/training/pause', { method: 'POST' }).catch((err) => console.error(err));
    addLog('INFO', 'TRAINING', 'MAPPO Training loop paused.');
  };

  // Mock initial training history if empty
  const chartData =
    trainingMetricsHistory.length > 0
      ? trainingMetricsHistory
      : Array.from({ length: 15 }).map((_, i) => ({
          iteration: i * 5,
          actor_loss: Number((0.08 - i * 0.004).toFixed(3)),
          critic_loss: Number((0.04 - i * 0.002).toFixed(3)),
          entropy: Number((0.85 - i * 0.01).toFixed(2)),
          mean_episode_reward: Number((20 + i * 4.5).toFixed(1)),
          mean_coverage: Number((40 + i * 3.2).toFixed(1)),
        }));

  return (
    <div className="p-4 md:p-6 space-y-6 overflow-y-auto h-full font-sans">
      {/* Header Banner */}
      <div className="bg-[#121212] border border-white/10 p-5 rounded-sm shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-11 h-11 rounded-sm bg-gradient-to-tr from-[#C5A059] to-[#E8D09E] flex items-center justify-center text-black font-bold shadow-md shadow-[#C5A059]/20">
            <Brain className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#F5F5F5] uppercase tracking-wider flex items-center space-x-2">
              <span>MAPPO Training Control Center</span>
              <span className="px-2 py-0.5 rounded-sm text-[9px] font-mono bg-[#C5A059]/10 text-[#E8D09E] border border-[#C5A059]/30">
                Centralized Critic + Decentralized Actors
              </span>
            </h2>
            <p className="text-xs text-white/50 font-light mt-0.5">
              Multi-Agent Proximal Policy Optimization for Cooperative Drone Search
            </p>
          </div>
        </div>

        {/* Start / Pause Controls */}
        <div className="flex items-center space-x-3">
          <button
            onClick={trainingStatus === 'TRAINING' ? handlePauseTraining : handleStartTraining}
            className={`px-5 py-2.5 rounded-sm font-bold text-xs uppercase tracking-widest flex items-center space-x-2 shadow-lg transition-all ${
              trainingStatus === 'TRAINING'
                ? 'bg-amber-500 hover:bg-amber-400 text-black'
                : 'bg-[#C5A059] hover:bg-[#d4b06a] text-black shadow-[#C5A059]/20'
            }`}
          >
            {trainingStatus === 'TRAINING' ? (
              <>
                <Pause className="w-4 h-4 fill-current" />
                <span>Pause MAPPO Update</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Start MAPPO Updates</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Estimated Completion & Convergence Rate Timer */}
      <EstimatedCompletionTimer />

      {/* Learning Curves Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mean Episode Reward Curve */}
        <div className="bg-[#121212] border border-white/10 p-5 rounded-sm shadow-2xl space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-xs text-[#F5F5F5] uppercase tracking-wider flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-[#C5A059]" />
              <span>Mean Swarm Reward Curve (Convergence)</span>
            </h3>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#E8D09E]">Reward Optimization</span>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
                <XAxis dataKey="iteration" stroke="#737373" fontSize={11} />
                <YAxis stroke="#737373" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#121212',
                    borderColor: '#262626',
                    borderRadius: '4px',
                    fontSize: '12px',
                    color: '#F5F5F5',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="mean_episode_reward"
                  stroke="#C5A059"
                  strokeWidth={2.5}
                  dot={false}
                  name="Mean Reward"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Actor & Critic Loss Curves */}
        <div className="bg-[#121212] border border-white/10 p-5 rounded-sm shadow-2xl space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-xs text-[#F5F5F5] uppercase tracking-wider flex items-center space-x-2">
              <LineChartIcon className="w-4 h-4 text-[#E8D09E]" />
              <span>Actor & Critic Loss Functions</span>
            </h3>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#E8D09E]">Surrogate & Value Loss</span>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
                <XAxis dataKey="iteration" stroke="#737373" fontSize={11} />
                <YAxis stroke="#737373" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#121212',
                    borderColor: '#262626',
                    borderRadius: '4px',
                    fontSize: '12px',
                    color: '#F5F5F5',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Line
                  type="monotone"
                  dataKey="actor_loss"
                  stroke="#E8D09E"
                  strokeWidth={2}
                  dot={false}
                  name="Actor Loss"
                />
                <Line
                  type="monotone"
                  dataKey="critic_loss"
                  stroke="#C5A059"
                  strokeWidth={2}
                  dot={false}
                  name="Critic Loss"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
