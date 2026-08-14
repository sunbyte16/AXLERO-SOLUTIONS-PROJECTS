/**
 * SwarmRL - MAPPO Deep RL Estimated Completion & Convergence Timer
 * Calculates projected training time based on historical metric convergence rates.
 */

import React, { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  AlertCircle,
  Award,
  CheckCircle2,
  Clock,
  Flame,
  HelpCircle,
  Play,
  RotateCcw,
  Settings,
  Sparkles,
  Target,
  Timer,
  TrendingDown,
  TrendingUp,
  Zap,
} from 'lucide-react';
import { useSwarmStore } from '../../stores/useSwarmStore';

export const EstimatedCompletionTimer: React.FC = () => {
  const { trainingStatus, trainingMetricsHistory } = useSwarmStore();

  // Configurable Convergence Target Parameters
  const [targetReward, setTargetReward] = useState<number>(85);
  const [targetCoverage, setTargetCoverage] = useState<number>(90);
  const [targetMaxIterations, setTargetMaxIterations] = useState<number>(100);
  const [secsPerIteration, setSecsPerIteration] = useState<number>(2.5);
  const [showConfig, setShowConfig] = useState<boolean>(false);

  // Active Live Countdown Ticker
  const [liveCountdownSecs, setLiveCountdownSecs] = useState<number | null>(null);

  // Compute metrics history fallback if empty
  const history = useMemo(() => {
    if (trainingMetricsHistory && trainingMetricsHistory.length > 0) {
      return trainingMetricsHistory;
    }
    // Mock initial history for initial presentation
    return Array.from({ length: 15 }).map((_, i) => ({
      iteration: i * 5,
      total_episodes: (i + 1) * 12,
      total_timesteps: (i + 1) * 300,
      actor_loss: Number((0.08 - i * 0.004).toFixed(3)),
      critic_loss: Number((0.04 - i * 0.002).toFixed(3)),
      entropy: Number((0.85 - i * 0.01).toFixed(2)),
      mean_episode_reward: Number((20 + i * 4.5).toFixed(1)),
      mean_coverage: Number((40 + i * 3.2).toFixed(1)),
      collision_rate: Number((0.05 - i * 0.002).toFixed(3)),
      learning_rate: 0.0003,
      timestamp: Date.now() - (15 - i) * 12000,
    }));
  }, [trainingMetricsHistory]);

  // Historical Convergence Rate Analysis
  const convergenceStats = useMemo(() => {
    if (history.length === 0) {
      return {
        currentIteration: 0,
        currentReward: 0,
        currentCoverage: 0,
        currentLoss: 0,
        rewardRatePerIter: 1.0,
        coverageRatePerIter: 1.0,
        lossDecayPerIter: 0.001,
        remainingIterations: targetMaxIterations,
        progressPercent: 0,
        isAchieved: false,
        confidence: 'CALCULATING',
      };
    }

    const latest = history[history.length - 1];
    const currentIteration = latest.iteration || 0;
    const currentReward = latest.mean_episode_reward || 0;
    const currentCoverage = latest.mean_coverage || 0;
    const currentLoss = latest.critic_loss || 0;

    // Compare with past window (up to 10 points ago)
    const windowSize = Math.min(10, history.length - 1);
    const past = windowSize > 0 ? history[history.length - 1 - windowSize] : history[0];

    const iterDelta = Math.max(1, currentIteration - (past.iteration || 0));
    const rewardDelta = currentReward - (past.mean_episode_reward || 0);
    const coverageDelta = currentCoverage - (past.mean_coverage || 0);
    const lossDelta = (past.critic_loss || 0) - currentLoss;

    // Rates of change per iteration
    const rewardRatePerIter = Math.max(0.1, rewardDelta / iterDelta);
    const coverageRatePerIter = Math.max(0.1, coverageDelta / iterDelta);
    const lossDecayPerIter = lossDelta / iterDelta;

    // Check if target achieved
    const isAchieved = currentReward >= targetReward && currentCoverage >= targetCoverage;

    // Remaining required iterations to reach targets
    const rewardRemaining = Math.max(0, targetReward - currentReward);
    const coverageRemaining = Math.max(0, targetCoverage - currentCoverage);

    const itersForReward = Math.ceil(rewardRemaining / rewardRatePerIter);
    const itersForCoverage = Math.ceil(coverageRemaining / coverageRatePerIter);
    const itersToMax = Math.max(0, targetMaxIterations - currentIteration);

    let remainingIterations = 0;
    if (!isAchieved) {
      const targetItersNeeded = Math.max(itersForReward, itersForCoverage);
      remainingIterations = Math.min(itersToMax > 0 ? itersToMax : targetItersNeeded, targetItersNeeded);
    }

    // Overall convergence progress percentage (weighted 60% reward, 40% coverage)
    const rewardProgress = Math.min(100, Math.max(0, (currentReward / targetReward) * 100));
    const coverageProgress = Math.min(100, Math.max(0, (currentCoverage / targetCoverage) * 100));
    const progressPercent = Math.round(rewardProgress * 0.6 + coverageProgress * 0.4);

    // Confidence Assessment
    let confidence: 'HIGH' | 'MEDIUM' | 'LOW' | 'CONVERGED' = 'MEDIUM';
    if (isAchieved) {
      confidence = 'CONVERGED';
    } else if (rewardRatePerIter > 1.0 && lossDecayPerIter > 0) {
      confidence = 'HIGH';
    } else if (rewardRatePerIter > 0.3) {
      confidence = 'MEDIUM';
    } else {
      confidence = 'LOW';
    }

    return {
      currentIteration,
      currentReward,
      currentCoverage,
      currentLoss,
      rewardRatePerIter,
      coverageRatePerIter,
      lossDecayPerIter,
      remainingIterations,
      progressPercent,
      isAchieved,
      confidence,
    };
  }, [history, targetReward, targetCoverage, targetMaxIterations]);

  // Total projected seconds remaining
  const estimatedSeconds = useMemo(() => {
    return Math.max(0, convergenceStats.remainingIterations * secsPerIteration);
  }, [convergenceStats.remainingIterations, secsPerIteration]);

  // Sync live countdown with computed estimated seconds
  useEffect(() => {
    setLiveCountdownSecs(estimatedSeconds);
  }, [estimatedSeconds]);

  // Live countdown ticker when training is active
  useEffect(() => {
    if (trainingStatus !== 'TRAINING' || liveCountdownSecs === null || liveCountdownSecs <= 0) {
      return;
    }

    const interval = setInterval(() => {
      setLiveCountdownSecs((prev) => (prev && prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [trainingStatus, liveCountdownSecs]);

  // Helper time formatter
  const formatTime = (totalSecs: number) => {
    if (totalSecs <= 0) return '00m 00s';
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = Math.floor(totalSecs % 60);

    if (hrs > 0) {
      return `${hrs.toString().padStart(2, '0')}h ${mins.toString().padStart(2, '0')}m ${secs.toString().padStart(2, '0')}s`;
    }
    return `${mins.toString().padStart(2, '0')}m ${secs.toString().padStart(2, '0')}s`;
  };

  // Projected Completion Time Clock String
  const projectedTimeFormatted = useMemo(() => {
    if (convergenceStats.isAchieved || (liveCountdownSecs ?? 0) <= 0) {
      return 'Target Achieved';
    }
    const futureDate = new Date(Date.now() + (liveCountdownSecs ?? 0) * 1000);
    return futureDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  }, [convergenceStats.isAchieved, liveCountdownSecs]);

  return (
    <div className="bg-[#121212] border border-white/10 rounded-sm shadow-2xl p-5 space-y-4 font-sans">
      {/* Timer Header & Status Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-sm bg-[#C5A059]/10 border border-[#C5A059]/30 flex items-center justify-center text-[#C5A059]">
            <Timer className={`w-5 h-5 ${trainingStatus === 'TRAINING' ? 'animate-pulse text-[#E8D09E]' : ''}`} />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-bold text-xs text-[#F5F5F5] uppercase tracking-wider">
                Estimated Training Completion
              </h3>
              <span
                className={`px-1.5 py-0.2 rounded-sm text-[9px] font-mono font-bold uppercase ${
                  convergenceStats.confidence === 'CONVERGED'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : convergenceStats.confidence === 'HIGH'
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                    : convergenceStats.confidence === 'MEDIUM'
                    ? 'bg-[#C5A059]/10 text-[#E8D09E] border border-[#C5A059]/30'
                    : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                }`}
              >
                {convergenceStats.confidence === 'CONVERGED'
                  ? 'Target Reached'
                  : `Confidence: ${convergenceStats.confidence}`}
              </span>
            </div>
            <p className="text-[11px] text-white/50 font-light mt-0.5">
              Projected completion based on real-time MAPPO reward and loss convergence rates
            </p>
          </div>
        </div>

        {/* Toggle Target Criteria Settings */}
        <button
          onClick={() => setShowConfig(!showConfig)}
          className={`px-3 py-1.5 rounded-sm border font-mono text-xs uppercase tracking-wider flex items-center space-x-1.5 transition-all cursor-pointer ${
            showConfig
              ? 'bg-[#C5A059] text-black font-bold border-[#C5A059]'
              : 'bg-white/5 border-white/10 hover:border-[#C5A059]/50 text-white/70 hover:text-white'
          }`}
        >
          <Settings className="w-3.5 h-3.5" />
          <span>Convergence Target</span>
        </button>
      </div>

      {/* Target Config Drawer */}
      {showConfig && (
        <div className="bg-[#0A0A0A] border border-[#C5A059]/40 p-4 rounded-sm space-y-4 animate-in fade-in duration-200 font-mono text-xs">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <span className="font-bold text-xs text-[#C5A059] uppercase tracking-wider flex items-center space-x-1.5">
              <Target className="w-4 h-4" />
              <span>Convergence Target Criteria</span>
            </span>
            <span className="text-[10px] text-white/40">Adjust parameters to recalculate ETA</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Target Reward Slider */}
            <div className="space-y-1 bg-[#121212] p-2.5 rounded-sm border border-white/5">
              <div className="flex justify-between text-[11px]">
                <span className="text-white/60">Target Reward</span>
                <span className="text-[#C5A059] font-bold">{targetReward} pts</span>
              </div>
              <input
                type="range"
                min="40"
                max="150"
                step="5"
                value={targetReward}
                onChange={(e) => setTargetReward(Number(e.target.value))}
                className="w-full accent-[#C5A059] cursor-pointer"
              />
            </div>

            {/* Target Coverage Slider */}
            <div className="space-y-1 bg-[#121212] p-2.5 rounded-sm border border-white/5">
              <div className="flex justify-between text-[11px]">
                <span className="text-white/60">Target Coverage</span>
                <span className="text-[#C5A059] font-bold">{targetCoverage}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="100"
                step="5"
                value={targetCoverage}
                onChange={(e) => setTargetCoverage(Number(e.target.value))}
                className="w-full accent-[#C5A059] cursor-pointer"
              />
            </div>

            {/* Max Iteration Bound */}
            <div className="space-y-1 bg-[#121212] p-2.5 rounded-sm border border-white/5">
              <div className="flex justify-between text-[11px]">
                <span className="text-white/60">Max Iterations</span>
                <span className="text-white font-bold">{targetMaxIterations}</span>
              </div>
              <input
                type="range"
                min="30"
                max="300"
                step="10"
                value={targetMaxIterations}
                onChange={(e) => setTargetMaxIterations(Number(e.target.value))}
                className="w-full accent-[#C5A059] cursor-pointer"
              />
            </div>

            {/* Time per Iteration */}
            <div className="space-y-1 bg-[#121212] p-2.5 rounded-sm border border-white/5">
              <div className="flex justify-between text-[11px]">
                <span className="text-white/60">Step Pace</span>
                <span className="text-emerald-400 font-bold">{secsPerIteration.toFixed(1)}s / step</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="10.0"
                step="0.5"
                value={secsPerIteration}
                onChange={(e) => setSecsPerIteration(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
        {/* Estimated Time Remaining Clock */}
        <div className="bg-[#0A0A0A] p-4 rounded-sm border border-white/10 relative overflow-hidden flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-white/40 uppercase tracking-wider font-bold">
              Time Remaining (ETA)
            </span>
            <Clock className="w-4 h-4 text-[#C5A059]" />
          </div>

          <div>
            <div className="text-2xl font-bold text-[#F5F5F5] tracking-tight">
              {convergenceStats.isAchieved ? (
                <span className="text-emerald-400 flex items-center space-x-1 text-xl">
                  <CheckCircle2 className="w-5 h-5 inline" />
                  <span>00m 00s</span>
                </span>
              ) : (
                formatTime(liveCountdownSecs ?? estimatedSeconds)
              )}
            </div>
            <div className="text-[10px] text-white/50 mt-1 flex items-center justify-between">
              <span>Projected Finish:</span>
              <span className="text-[#E8D09E] font-bold">{projectedTimeFormatted}</span>
            </div>
          </div>

          {trainingStatus === 'TRAINING' && !convergenceStats.isAchieved && (
            <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden mt-1">
              <div className="bg-[#C5A059] h-full w-1/3 animate-pulse"></div>
            </div>
          )}
        </div>

        {/* Projected Iterations Needed */}
        <div className="bg-[#0A0A0A] p-4 rounded-sm border border-white/10 flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-white/40 uppercase tracking-wider font-bold">
              Est. Iterations Left
            </span>
            <Activity className="w-4 h-4 text-[#E8D09E]" />
          </div>

          <div>
            <div className="text-2xl font-bold text-[#F5F5F5]">
              {convergenceStats.isAchieved ? (
                <span className="text-emerald-400">0</span>
              ) : (
                <span>{convergenceStats.remainingIterations} <span className="text-xs text-white/40 font-normal">iters</span></span>
              )}
            </div>
            <div className="text-[10px] text-white/50 mt-1 flex items-center justify-between">
              <span>Current Progress:</span>
              <span className="text-white font-bold">
                Iteration #{convergenceStats.currentIteration} / {targetMaxIterations}
              </span>
            </div>
          </div>
        </div>

        {/* Convergence Velocity (Reward Slope) */}
        <div className="bg-[#0A0A0A] p-4 rounded-sm border border-white/10 flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-white/40 uppercase tracking-wider font-bold">
              Convergence Velocity
            </span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>

          <div>
            <div className="text-xl font-bold text-emerald-400">
              +{convergenceStats.rewardRatePerIter.toFixed(2)}{' '}
              <span className="text-xs text-white/40 font-normal">pts / iter</span>
            </div>
            <div className="text-[10px] text-white/50 mt-1 flex items-center justify-between">
              <span>Coverage Slope:</span>
              <span className="text-white font-bold">
                +{convergenceStats.coverageRatePerIter.toFixed(1)}% / iter
              </span>
            </div>
          </div>
        </div>

        {/* Target Progress Percentage */}
        <div className="bg-[#0A0A0A] p-4 rounded-sm border border-white/10 flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-white/40 uppercase tracking-wider font-bold">
              Overall Convergence
            </span>
            <Sparkles className="w-4 h-4 text-[#C5A059]" />
          </div>

          <div>
            <div className="text-2xl font-bold text-[#F5F5F5]">
              {convergenceStats.progressPercent}%
            </div>

            {/* Custom Bar */}
            <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden mt-2">
              <div
                className="bg-gradient-to-r from-[#C5A059] to-emerald-400 h-full transition-all duration-500"
                style={{ width: `${convergenceStats.progressPercent}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Target Achievement Alert Banner */}
      {convergenceStats.isAchieved && (
        <div className="bg-emerald-950/60 border border-emerald-500/50 p-3 rounded-sm flex items-center justify-between text-xs font-mono text-emerald-300 animate-in fade-in">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              <strong>MAPPO Policy Converged!</strong> Target reward ({targetReward} pts) and coverage ({targetCoverage}%) reached at Iteration #{convergenceStats.currentIteration}.
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
