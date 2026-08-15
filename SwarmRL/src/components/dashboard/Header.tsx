/**
 * SwarmRL - Application Header Bar
 */

import React from 'react';
import {
  Activity,
  Award,
  Bot,
  Pause,
  Play,
  RotateCcw,
  ShieldCheck,
  Wind,
  Zap,
} from 'lucide-react';
import { useSwarmStore } from '../../stores/useSwarmStore';
import { CurriculumLevel } from '../../types';

export const Header: React.FC = () => {
  const {
    config,
    metrics,
    isSimPaused,
    setSimPaused,
    setSwarmSize,
    curriculumLevel,
    setCurriculumLevel,
    trainingStatus,
    addLog,
  } = useSwarmStore();

  const handleSwarmSizeChange = (size: number) => {
    setSwarmSize(size);
    addLog('INFO', 'SIMULATION', `Swarm size updated to ${size} autonomous agents.`);
  };

  const handleCurriculumChange = (level: CurriculumLevel) => {
    setCurriculumLevel(level);
    addLog('MAPPO', 'TRAINING', `Curriculum difficulty manually adjusted to Level ${level}.`);
  };

  const missionStatus = metrics.total_collisions > 0 ? 'Attention Required' : 'Nominal';

  return (
    <header className="border-b border-white/10 px-4 py-4 md:px-6 md:py-5 select-none">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex min-w-0 items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#C5A059] via-[#E5C98A] to-[#F6E1B5] shadow-[0_18px_40px_rgba(197,160,89,0.25)]">
            <Bot className="h-6 w-6 text-black" />
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-[#C5A059]/30 bg-[#C5A059]/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.28em] text-[#F0D8A1]">
                SwarmRL Command
              </span>
              <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.24em] text-emerald-300">
                Live Operations
              </span>
            </div>

            <div className="mt-2 flex flex-wrap items-end gap-x-3 gap-y-1">
              <h1 className="text-xl font-semibold tracking-tight text-white md:text-2xl">
                Autonomous Swarm Mission Control
              </h1>
              <span className="text-xs uppercase tracking-[0.28em] text-white/45">
                Version 1.0 MAPPO
              </span>
            </div>

            <p className="mt-1 max-w-2xl text-sm leading-6 text-[#9FB0CA]">
              Professional command surface for multi-agent disaster response simulation, telemetry oversight, and reinforcement learning operations.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 xl:min-w-[520px]">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.24em] text-white/40">
              <Activity className="h-3.5 w-3.5 text-[#C5A059]" />
              Coverage
            </div>
            <div className="mt-2 text-2xl font-semibold text-white">
              {metrics.map_coverage_percent.toFixed(1)}%
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.24em] text-white/40">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-300" />
              Mission
            </div>
            <div className="mt-2 text-sm font-semibold text-white">{missionStatus}</div>
            <div className="mt-1 text-xs text-white/45">{metrics.total_collisions} total collisions</div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.24em] text-white/40">
              <Wind className="h-3.5 w-3.5 text-sky-300" />
              Wind
            </div>
            <div className="mt-2 text-sm font-semibold text-white">
              {config.wind.strength.toFixed(1)} m/s
            </div>
            <div className="mt-1 text-xs text-white/45">Heading {config.wind.direction.toFixed(0)} deg</div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.24em] text-white/40">
              <Zap className="h-3.5 w-3.5 text-violet-300" />
              Training
            </div>
            <div className="mt-2 text-sm font-semibold text-white">
              {trainingStatus === 'TRAINING' ? 'Policy Learning' : trainingStatus}
            </div>
            <div className="mt-1 text-xs text-white/45">Reward {metrics.avg_reward.toFixed(2)}</div>
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="glass-panel rounded-2xl p-1">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="px-3 py-2 text-[11px] uppercase tracking-[0.24em] text-white/45">
                Swarm Size
              </span>
              {[1, 5, 10, 25, 50].map((size) => (
                <button
                  key={size}
                  onClick={() => handleSwarmSizeChange(size)}
                  className={`rounded-xl px-3 py-2 text-xs font-semibold transition-all ${
                    config.num_agents === size
                      ? 'bg-[#C5A059] text-black shadow-[0_10px_24px_rgba(197,160,89,0.28)]'
                      : 'text-white/60 hover:bg-white/6 hover:text-white'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="glass-panel rounded-2xl p-1">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="flex items-center gap-2 px-3 py-2 text-[11px] uppercase tracking-[0.24em] text-white/45">
                <Award className="h-3.5 w-3.5 text-[#E8D09E]" />
                Curriculum
              </span>
              {([1, 2, 3, 4, 5] as CurriculumLevel[]).map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => handleCurriculumChange(lvl)}
                  className={`rounded-xl px-3 py-2 text-xs font-semibold transition-all ${
                    curriculumLevel === lvl
                      ? 'bg-white text-[#09111f]'
                      : 'text-white/60 hover:bg-white/6 hover:text-white'
                  }`}
                >
                  L{lvl}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div
            className={`flex items-center gap-2 rounded-full border px-3.5 py-2 text-[11px] uppercase tracking-[0.26em] ${
              trainingStatus === 'TRAINING'
                ? 'border-[#C5A059]/35 bg-[#C5A059]/10 text-[#F0D8A1]'
                : 'border-white/10 bg-white/[0.03] text-white/55'
            }`}
          >
            <span
              className={`h-2 w-2 rounded-full ${
                trainingStatus === 'TRAINING' ? 'bg-[#C5A059] animate-pulse' : 'bg-white/35'
              }`}
            />
            {trainingStatus === 'TRAINING' ? 'MAPPO Training Active' : 'Inference Mode'}
          </div>

          <button
            onClick={() => {
              setSimPaused(!isSimPaused);
              addLog('INFO', 'SIMULATION', isSimPaused ? 'Simulation resumed.' : 'Simulation paused.');
            }}
            className={`inline-flex items-center gap-2 rounded-2xl border px-4 py-3 text-xs font-semibold uppercase tracking-[0.24em] transition-all ${
              isSimPaused
                ? 'border-[#C5A059] bg-[#C5A059] text-black hover:bg-[#d4b06a]'
                : 'border-white/15 bg-white/[0.04] text-white hover:bg-white/[0.08]'
            }`}
          >
            {isSimPaused ? <Play className="h-4 w-4 fill-current" /> : <Pause className="h-4 w-4 fill-current" />}
            {isSimPaused ? 'Resume Simulation' : 'Pause Simulation'}
          </button>

          <button
            onClick={() =>
              addLog('INFO', 'SYSTEM', 'Mission control refresh requested from executive dashboard.')
            }
            className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-xs font-semibold uppercase tracking-[0.24em] text-white/75 transition-all hover:bg-white/[0.08] hover:text-white"
          >
            <RotateCcw className="h-4 w-4" />
            Refresh View
          </button>
        </div>
      </div>
    </header>
  );
};
