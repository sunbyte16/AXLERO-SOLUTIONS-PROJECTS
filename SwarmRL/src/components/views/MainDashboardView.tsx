/**
 * SwarmRL - Main Dashboard View
 */

import React from 'react';
import {
  Activity,
  AlertTriangle,
  Bot,
  Brain,
  CheckCircle2,
  Globe,
  Layers,
  ShieldCheck,
  TrendingUp,
  Wind,
  Zap,
} from 'lucide-react';
import { useSwarmStore } from '../../stores/useSwarmStore';
import { Scene3D } from '../three/Scene3D';
import { TelemetryHUD } from '../dashboard/TelemetryHUD';

export const MainDashboardView: React.FC = () => {
  const { metrics, config, agents, trainingMetricsHistory, trainingStatus, setActiveTab } =
    useSwarmStore();

  const activeAgentsCount = agents.filter((a) => a.status !== 'COLLIDED').length;
  const readiness = config.num_agents > 0 ? (activeAgentsCount / config.num_agents) * 100 : 0;
  const latestTrainingMetric = trainingMetricsHistory[trainingMetricsHistory.length - 1];
  const lowBatteryCount = agents.filter((agent) => agent.battery < 30).length;
  const topAgents = [...agents]
    .sort((a, b) => b.current_reward - a.current_reward)
    .slice(0, 8);

  const kpiCards = [
    {
      title: 'Mission Coverage',
      value: `${metrics.map_coverage_percent.toFixed(1)}%`,
      meta: `${metrics.explored_cells} / ${metrics.total_cells} cells explored`,
      tone: 'text-[#F0D8A1]',
      icon: Layers,
    },
    {
      title: 'Fleet Readiness',
      value: `${readiness.toFixed(0)}%`,
      meta: `${activeAgentsCount} active of ${config.num_agents} deployed drones`,
      tone: 'text-emerald-300',
      icon: Bot,
    },
    {
      title: 'Safety Signal',
      value: metrics.total_collisions > 0 ? `${metrics.total_collisions}` : 'Clear',
      meta:
        metrics.total_collisions > 0
          ? `Collision rate ${metrics.collision_rate.toFixed(3)} per step`
          : 'No collision events currently recorded',
      tone: metrics.total_collisions > 0 ? 'text-rose-300' : 'text-emerald-300',
      icon: metrics.total_collisions > 0 ? AlertTriangle : ShieldCheck,
    },
    {
      title: 'Policy Performance',
      value: metrics.avg_reward.toFixed(2),
      meta:
        trainingStatus === 'TRAINING'
          ? 'Policy learning is actively running'
          : 'Model is currently serving inference',
      tone: 'text-violet-300',
      icon: Brain,
    },
  ];

  const missionHighlights = [
    {
      label: 'Simulation Throughput',
      value: `${metrics.fps.toFixed(0)} FPS`,
      icon: Activity,
      accent: 'text-sky-300',
    },
    {
      label: 'Cooperation Index',
      value: metrics.cooperation_index.toFixed(2),
      icon: TrendingUp,
      accent: 'text-emerald-300',
    },
    {
      label: 'Wind Conditions',
      value: `${config.wind.strength.toFixed(1)} m/s`,
      icon: Wind,
      accent: 'text-cyan-300',
    },
    {
      label: 'Low Battery Drones',
      value: `${lowBatteryCount}`,
      icon: Zap,
      accent: lowBatteryCount > 0 ? 'text-amber-300' : 'text-emerald-300',
    },
  ];

  return (
    <div className="h-full overflow-y-auto px-4 py-5 font-sans md:px-6 md:py-6">
      <div className="space-y-6">
        <section className="glass-panel-strong overflow-hidden rounded-[28px] border border-white/10">
          <div className="grid gap-6 px-6 py-6 lg:grid-cols-[1.6fr_1fr] lg:px-8 lg:py-8">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#C5A059]/20 bg-[#C5A059]/10 px-3 py-1.5 text-[11px] uppercase tracking-[0.26em] text-[#F0D8A1]">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Executive Overview
              </div>

              <h2 className="mt-4 max-w-3xl text-3xl font-semibold tracking-tight text-white md:text-4xl">
                Mission operations, simulation telemetry, and RL performance in one professional workspace.
              </h2>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-[#9FB0CA] md:text-base">
                SwarmRL consolidates live disaster-scene visualization, drone fleet health, training metrics, and operational oversight into a polished control plane built for fast analysis.
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {missionHighlights.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.label}
                      className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4"
                    >
                      <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.24em] text-white/45">
                        <Icon className={`h-3.5 w-3.5 ${item.accent}`} />
                        {item.label}
                      </div>
                      <div className="mt-3 text-2xl font-semibold text-white">{item.value}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.26em] text-white/40">Training Snapshot</p>
                  <h3 className="mt-2 text-lg font-semibold text-white">MAPPO Status</h3>
                </div>
                <div className="rounded-2xl bg-violet-400/10 p-3 text-violet-300">
                  <Brain className="h-5 w-5" />
                </div>
              </div>

              <div className="mt-5 space-y-4">
                <div className="rounded-2xl border border-white/10 bg-[#08111f] px-4 py-3">
                  <p className="text-[11px] uppercase tracking-[0.24em] text-white/40">Mode</p>
                  <p className="mt-2 text-base font-semibold text-white">
                    {trainingStatus === 'TRAINING' ? 'Training Active' : trainingStatus}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
                    <p className="text-[11px] uppercase tracking-[0.24em] text-white/40">Episodes</p>
                    <p className="mt-2 text-xl font-semibold text-white">
                      {latestTrainingMetric ? latestTrainingMetric.total_episodes : 0}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
                    <p className="text-[11px] uppercase tracking-[0.24em] text-white/40">Mean Reward</p>
                    <p className="mt-2 text-xl font-semibold text-white">
                      {latestTrainingMetric
                        ? latestTrainingMetric.mean_episode_reward.toFixed(2)
                        : metrics.avg_reward.toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl border border-[#C5A059]/15 bg-[#C5A059]/10 px-4 py-4">
                  <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.24em] text-[#F0D8A1]">
                    <TrendingUp className="h-3.5 w-3.5" />
                    Learning Progress
                  </div>
                  <p className="mt-2 text-sm leading-6 text-[#EEE4CC]">
                    {latestTrainingMetric
                      ? `Coverage benchmark ${latestTrainingMetric.mean_coverage.toFixed(1)}% with collision rate ${latestTrainingMetric.collision_rate.toFixed(3)}.`
                      : 'Training history will populate here once the MAPPO loop begins collecting optimization metrics.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {kpiCards.map((card) => {
            const Icon = card.icon;
            return (
              <div key={card.title} className="metric-card rounded-[24px] p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.26em] text-white/40">
                      {card.title}
                    </p>
                    <p className={`mt-3 text-3xl font-semibold ${card.tone}`}>{card.value}</p>
                    <p className="mt-2 text-sm leading-6 text-[#91A5C6]">{card.meta}</p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">
                    <Icon className={`h-5 w-5 ${card.tone}`} />
                  </div>
                </div>
              </div>
            );
          })}
        </section>

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.65fr_0.95fr]">
          <div className="glass-panel-strong overflow-hidden rounded-[28px]">
            <div className="flex flex-col gap-4 border-b border-white/10 px-5 py-4 md:flex-row md:items-center md:justify-between md:px-6">
              <div>
                <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.26em] text-white/40">
                  <Globe className="h-4 w-4 text-[#C5A059]" />
                  3D Mission Space
                </div>
                <h3 className="mt-2 text-lg font-semibold text-white">
                  Interactive disaster-response simulator viewport
                </h3>
              </div>

              <button
                onClick={() => setActiveTab('simulator')}
                className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-xs font-semibold uppercase tracking-[0.24em] text-white/80 transition-all hover:bg-white/[0.08] hover:text-white"
              >
                <Globe className="h-4 w-4 text-[#C5A059]" />
                Open Simulator
              </button>
            </div>

            <div className="relative h-[520px] overflow-hidden">
              <Scene3D />
              <TelemetryHUD />
            </div>
          </div>

          <div className="glass-panel-strong flex flex-col rounded-[28px] p-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <p className="text-[11px] uppercase tracking-[0.26em] text-white/40">Top Agents</p>
                <h3 className="mt-2 text-lg font-semibold text-white">Live swarm telemetry</h3>
              </div>
              <div className="rounded-2xl bg-[#C5A059]/10 p-3 text-[#E8D09E]">
                <Bot className="h-5 w-5" />
              </div>
            </div>

            <div className="mt-4 space-y-3 overflow-y-auto pr-1">
              {topAgents.length > 0 ? (
                topAgents.map((agent, index) => (
                  <div
                    key={agent.agent_id}
                    className="rounded-2xl border border-white/10 bg-[#08111f] px-4 py-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="rounded-full border border-white/10 px-2 py-1 text-[10px] uppercase tracking-[0.22em] text-white/45">
                            #{index + 1}
                          </span>
                          <span className="font-semibold text-white">{agent.agent_id}</span>
                        </div>
                        <p className="mt-2 text-xs uppercase tracking-[0.2em] text-white/40">
                          {agent.status}
                        </p>
                      </div>

                      <span
                        className={`mt-1 h-2.5 w-2.5 rounded-full ${
                          agent.status === 'COLLIDED' ? 'bg-rose-400' : 'bg-emerald-400'
                        }`}
                      />
                    </div>

                    <div className="mt-4 grid grid-cols-3 gap-3 text-xs">
                      <div>
                        <p className="text-white/40">Altitude</p>
                        <p className="mt-1 font-semibold text-white">{agent.position.y.toFixed(1)} m</p>
                      </div>
                      <div>
                        <p className="text-white/40">Battery</p>
                        <p className="mt-1 font-semibold text-white">{agent.battery.toFixed(0)}%</p>
                      </div>
                      <div>
                        <p className="text-white/40">Reward</p>
                        <p className="mt-1 font-semibold text-[#F0D8A1]">
                          {agent.current_reward.toFixed(1)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] px-4 py-10 text-center text-sm text-[#91A5C6]">
                  Live agent telemetry will appear here as soon as simulation updates are received.
                </div>
              )}
            </div>

            <button
              onClick={() => setActiveTab('agents')}
              className="mt-4 inline-flex items-center justify-center gap-2 rounded-2xl bg-[#C5A059] px-4 py-3 text-xs font-bold uppercase tracking-[0.24em] text-black transition-colors hover:bg-[#d4b06a]"
            >
              Inspect All Agents
            </button>
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-3">
          <div className="metric-card rounded-[24px] p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-emerald-400/10 p-3 text-emerald-300">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.26em] text-white/40">Operational Safety</p>
                <h3 className="mt-1 text-lg font-semibold text-white">Fleet protection overview</h3>
              </div>
            </div>
            <p className="mt-4 text-sm leading-6 text-[#91A5C6]">
              Monitor active drone ratio, collision behavior, and environmental stress to keep missions stable under changing field conditions.
            </p>
          </div>

          <div className="metric-card rounded-[24px] p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-sky-400/10 p-3 text-sky-300">
                <Globe className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.26em] text-white/40">Environment</p>
                <h3 className="mt-1 text-lg font-semibold text-white">Simulation envelope</h3>
              </div>
            </div>
            <p className="mt-4 text-sm leading-6 text-[#91A5C6]">
              {config.width}m x {config.length}m x {config.height}m scene with {config.obstacle_density.toLowerCase()} obstacle density and {config.lidar_rays} lidar rays per drone.
            </p>
          </div>

          <div className="metric-card rounded-[24px] p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-violet-400/10 p-3 text-violet-300">
                <Brain className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.26em] text-white/40">Optimization</p>
                <h3 className="mt-1 text-lg font-semibold text-white">Learning pipeline</h3>
              </div>
            </div>
            <p className="mt-4 text-sm leading-6 text-[#91A5C6]">
              {latestTrainingMetric
                ? `Current run processed ${latestTrainingMetric.total_timesteps} timesteps with actor loss ${latestTrainingMetric.actor_loss.toFixed(3)} and critic loss ${latestTrainingMetric.critic_loss.toFixed(3)}.`
                : 'Activate the training workflow to begin collecting policy optimization, entropy, and coverage convergence signals.'}
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};
