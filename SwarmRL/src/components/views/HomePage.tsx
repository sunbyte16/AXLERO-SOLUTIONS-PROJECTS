import React from 'react';
import { Link } from 'react-router-dom';
import {
  Activity,
  BrainCircuit,
  Radar,
  ShieldCheck,
  Sparkles,
  Users,
  Zap,
} from 'lucide-react';

export function LandingNavbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-[#050913]/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#c5a059] via-[#f0d8a1] to-[#3f6fff] shadow-[0_0_24px_rgba(197,160,89,0.35)]">
            <Activity className="h-5 w-5 text-[#07111f]" strokeWidth={2.5} />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-lg font-semibold tracking-wide text-[#f5f7fb]">
              SwarmRL
            </span>
            <span className="text-[11px] uppercase tracking-[0.2em] text-[#8da2c0]">
              Multi-Agent DRL
            </span>
          </div>
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          <a
            href="#features"
            className="text-sm text-[#b8c6df] transition hover:text-[#f0d8a1]"
          >
            Platform
          </a>
          <a
            href="#capabilities"
            className="text-sm text-[#b8c6df] transition hover:text-[#f0d8a1]"
          >
            Capabilities
          </a>
          <a
            href="#architecture"
            className="text-sm text-[#b8c6df] transition hover:text-[#f0d8a1]"
          >
            Architecture
          </a>
        </nav>
        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="hidden rounded-xl px-4 py-2 text-sm font-medium text-[#e6edf9] transition hover:bg-white/5 sm:inline-flex"
          >
            Sign In
          </Link>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-br from-[#c5a059] to-[#a47e3b] px-4 py-2 text-sm font-semibold text-[#0b0f17] shadow-[0_10px_30px_rgba(197,160,89,0.25)] transition hover:brightness-110"
          >
            Sign Up
            <Sparkles className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </header>
  );
}

export function LandingFooter() {
  return (
    <footer className="border-t border-white/5 bg-[#050913]">
      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-12 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[#c5a059] to-[#3f6fff]">
              <Activity className="h-4 w-4 text-[#07111f]" strokeWidth={2.5} />
            </div>
            <span className="font-semibold text-[#f5f7fb]">SwarmRL</span>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-[#8da2c0]">
            Multi-Agent Deep Reinforcement Learning platform for autonomous
            drone swarms, disaster response, and coverage optimization.
          </p>
        </div>
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-widest text-[#c5a059]">
            Product
          </h4>
          <ul className="mt-4 space-y-2 text-sm text-[#b8c6df]">
            <li>Live Simulator</li>
            <li>MAPPO Training</li>
            <li>Analytics</li>
            <li>Model Registry</li>
          </ul>
        </div>
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-widest text-[#c5a059]">
            Company
          </h4>
          <ul className="mt-4 space-y-2 text-sm text-[#b8c6df]">
            <li>About</li>
            <li>Research</li>
            <li>Documentation</li>
            <li>Support</li>
          </ul>
        </div>
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-widest text-[#c5a059]">
            Legal
          </h4>
          <ul className="mt-4 space-y-2 text-sm text-[#b8c6df]">
            <li>Privacy</li>
            <li>Terms</li>
            <li>Security</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/5">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 py-5 md:flex-row">
          <p className="text-xs text-[#6f839f]">
            © {new Date().getFullYear()} SwarmRL Systems. All rights reserved.
          </p>
          <p className="text-xs text-[#6f839f]">
            Created By{' '}
            <span className="font-semibold tracking-wide text-[#c5a059]">
              𝕊𝕦𝕟𝕚𝕝 𝕊𝕙𝕒𝕣𝕞𝕒
            </span>{' '}
            <span className="text-[#f87171]">❤</span>
          </p>
        </div>
      </div>
    </footer>
  );
}

export function HomePage() {
  return (
    <div className="relative min-h-screen overflow-hidden text-[#f5f7fb]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(1200px 600px at 15% -10%, rgba(63,111,255,0.22), transparent 60%), radial-gradient(1000px 520px at 85% 0%, rgba(197,160,89,0.18), transparent 55%), linear-gradient(180deg, #07111f 0%, #050913 55%, #03060c 100%)',
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.15]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
          maskImage:
            'radial-gradient(ellipse at center, rgba(0,0,0,0.9), transparent 75%)',
        }}
      />
      <LandingNavbar />

      {/* HERO */}
      <section className="relative mx-auto max-w-7xl px-6 pt-16 pb-24 lg:pt-24">
        <div className="grid items-center gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#c5a059]/30 bg-[#c5a059]/10 px-4 py-1.5 text-xs font-medium tracking-wide text-[#f0d8a1]">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#c5a059]" />
              New • Realtime MAPPO Swarm Orchestration v1.0
            </div>
            <h1 className="mt-6 text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
              Autonomous Drone Swarms,
              <span className="block bg-gradient-to-r from-[#f0d8a1] via-[#c5a059] to-[#3f6fff] bg-clip-text text-transparent">
                Trained in Realtime.
              </span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[#b8c6df]">
              SwarmRL combines a high-fidelity 3D simulator with a
              Multi-Agent PPO trainer so you can design, train, and deploy
              resilient drone swarms for coverage, disaster response, and
              logistics — all from a single, premium control plane.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                to="/register"
                className="group inline-flex items-center gap-3 rounded-2xl bg-gradient-to-br from-[#c5a059] to-[#a47e3b] px-6 py-3.5 text-base font-semibold text-[#0b0f17] shadow-[0_20px_60px_rgba(197,160,89,0.35)] transition hover:brightness-110"
              >
                Create Free Account
                <Zap className="h-5 w-5 transition group-hover:translate-x-0.5" />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-6 py-3.5 text-base font-medium text-[#f5f7fb] backdrop-blur-xl transition hover:border-[#c5a059]/40 hover:bg-white/[0.07]"
              >
                Sign In to Dashboard
              </Link>
            </div>
            <div className="mt-10 flex flex-wrap items-center gap-6 text-xs text-[#8da2c0]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-[#37d39a]" />
                SQLite + JWT Auth
              </div>
              <div className="flex items-center gap-2">
                <BrainCircuit className="h-4 w-4 text-[#c5a059]" />
                MAPPO Centralized Critic
              </div>
              <div className="flex items-center gap-2">
                <Radar className="h-4 w-4 text-[#3f6fff]" />
                Realtime 3D Simulation
              </div>
            </div>
          </div>

          {/* Hero Visual */}
          <div className="lg:col-span-5">
            <div className="relative">
              <div className="absolute -inset-6 rounded-[36px] bg-gradient-to-br from-[#3f6fff]/20 via-[#c5a059]/10 to-transparent blur-3xl" />
              <div className="relative rounded-[28px] border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.01] p-5 shadow-[0_40px_120px_rgba(0,0,0,0.55)] backdrop-blur-2xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-2.5 w-2.5 rounded-full bg-[#f87171]" />
                    <div className="h-2.5 w-2.5 rounded-full bg-[#c5a059]" />
                    <div className="h-2.5 w-2.5 rounded-full bg-[#37d39a]" />
                  </div>
                  <span className="text-[11px] uppercase tracking-[0.2em] text-[#8da2c0]">
                    Mission Control
                  </span>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  {[
                    { label: 'Active Agents', value: '24', delta: '+6' },
                    { label: 'Map Coverage', value: '78.4%', delta: '+12.1%' },
                    { label: 'Avg Reward', value: '+218.6', delta: '+9.4' },
                    { label: 'Collisions', value: '0.06%', delta: '-33%' },
                  ].map((m) => (
                    <div
                      key={m.label}
                      className="rounded-2xl border border-white/8 bg-black/30 p-4"
                    >
                      <p className="text-[11px] uppercase tracking-widest text-[#8da2c0]">
                        {m.label}
                      </p>
                      <div className="mt-2 flex items-end justify-between">
                        <p className="text-2xl font-semibold text-[#f5f7fb]">
                          {m.value}
                        </p>
                        <span className="rounded-md bg-[#37d39a]/15 px-1.5 py-0.5 text-[10px] font-medium text-[#37d39a]">
                          {m.delta}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-5 rounded-2xl border border-white/8 bg-gradient-to-br from-[#3f6fff]/15 via-transparent to-[#c5a059]/10 p-5">
                  <div className="flex items-center justify-between">
                    <p className="text-xs uppercase tracking-widest text-[#8da2c0]">
                      Coverage Grid
                    </p>
                    <span className="text-[11px] text-[#c5a059]">
                      LIVE • 20Hz
                    </span>
                  </div>
                  <div
                    className="mt-3 grid h-40 grid-cols-12 gap-1 rounded-xl"
                    style={{
                      backgroundImage:
                        'linear-gradient(135deg, rgba(63,111,255,0.18), rgba(197,160,89,0.08))',
                      padding: '8px',
                    }}
                  >
                    {Array.from({ length: 96 }).map((_, i) => {
                      const intensity = Math.abs(
                        Math.sin(i * 0.6) * Math.cos(i * 0.31)
                      );
                      return (
                        <div
                          key={i}
                          className="rounded-sm"
                          style={{
                            background:
                              intensity > 0.65
                                ? 'rgba(197,160,89,0.85)'
                                : intensity > 0.3
                                ? 'rgba(63,111,255,0.55)'
                                : 'rgba(255,255,255,0.06)',
                            boxShadow:
                              intensity > 0.65
                                ? '0 0 6px rgba(197,160,89,0.6)'
                                : undefined,
                          }}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="mx-auto max-w-7xl px-6 pb-24">
        <div className="mb-12 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-[#c5a059]">
              The Platform
            </p>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
              Everything for Swarm Intelligence,{' '}
              <span className="text-[#8da2c0]">One Control Plane.</span>
            </h2>
          </div>
          <p className="max-w-md text-[#b8c6df]">
            From the first flight to the final trained policy, SwarmRL ships
            with the data, tools, and telemetry your research team needs.
          </p>
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {[
            {
              icon: <BrainCircuit className="h-5 w-5" />,
              title: 'MAPPO Training',
              body: 'Centralized critic with decentralized actors, curriculum learning, and mixed-precision training orchestration.',
              accent: 'from-[#c5a059] to-[#a47e3b]',
            },
            {
              icon: <Radar className="h-5 w-5" />,
              title: '3D Realtime Simulator',
              body: 'Three.js powered disaster terrain, wind vectors, LiDAR sensors, and collision physics at 20Hz simulation tick.',
              accent: 'from-[#3f6fff] to-[#2b51c8]',
            },
            {
              icon: <Users className="h-5 w-5" />,
              title: 'Multi-Agent Telemetry',
              body: 'Track coverage, cooperation index, collisions, and per-agent rewards streamed live over WebSockets.',
              accent: 'from-[#37d39a] to-[#1ea67a]',
            },
            {
              icon: <Activity className="h-5 w-5" />,
              title: 'Analytics & Heatmaps',
              body: 'D3 & Recharts powered charts, coverage heatmaps, and training curves for quick research decisions.',
              accent: 'from-[#f87171] to-[#b94f4f]',
            },
            {
              icon: <ShieldCheck className="h-5 w-5" />,
              title: 'Secure Auth (SQLite3)',
              body: 'Accounts, sessions, and role-based access backed by SQLite + bcrypt + httpOnly JWT cookies.',
              accent: 'from-[#c5a059] to-[#3f6fff]',
            },
            {
              icon: <Sparkles className="h-5 w-5" />,
              title: 'Model Registry',
              body: 'Automatic checkpointing, policy snapshots, and artifact browser for versioned experiments.',
              accent: 'from-[#f0d8a1] to-[#c5a059]',
            },
          ].map((f) => (
            <div
              key={f.title}
              className="group relative overflow-hidden rounded-3xl border border-white/8 bg-gradient-to-br from-white/[0.05] to-white/[0.01] p-6 transition hover:border-[#c5a059]/30 hover:bg-white/[0.06]"
            >
              <div
                className={`absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br ${f.accent} opacity-20 blur-3xl transition group-hover:opacity-35`}
              />
              <div
                className={`relative mb-5 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br ${f.accent} text-[#0b0f17] shadow-[0_10px_30px_rgba(0,0,0,0.35)]`}
              >
                {f.icon}
              </div>
              <h3 className="text-lg font-semibold text-[#f5f7fb]">
                {f.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[#b8c6df]">
                {f.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CAPABILITIES / METRICS */}
      <section
        id="capabilities"
        className="mx-auto max-w-7xl px-6 pb-24"
      >
        <div className="rounded-[32px] border border-white/10 bg-gradient-to-br from-white/[0.06] via-white/[0.02] to-transparent p-8 shadow-[0_40px_120px_rgba(0,0,0,0.45)] backdrop-blur-xl md:p-12">
          <div className="grid items-center gap-10 md:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-[#c5a059]">
                Performance
              </p>
              <h2 className="mt-3 text-4xl font-semibold tracking-tight">
                Train thousands of episodes,
                <br className="hidden md:block" />
                <span className="bg-gradient-to-r from-[#f0d8a1] to-[#c5a059] bg-clip-text text-transparent">
                  without leaving the browser.
                </span>
              </h2>
              <p className="mt-5 text-[#b8c6df]">
                A unified simulation + training kernel means you can iterate
                on reward design, sensor suites, and curriculum without
                managing a fleet of GPUs just to prototype.
              </p>
              <ul className="mt-6 space-y-3 text-sm">
                {[
                  'Curriculum learning with 5 progressive difficulty levels',
                  'Auto-checkpoint + best-model selection by reward',
                  'Exportable policies for edge deployment',
                ].map((t) => (
                  <li key={t} className="flex items-start gap-3 text-[#e6edf9]">
                    <span className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#c5a059]/15 text-[#c5a059]">
                      <ShieldCheck className="h-3.5 w-3.5" />
                    </span>
                    {t}
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { k: 'Simulation Tick', v: '20Hz' },
                { k: 'Training Bandwidth', v: '~8k steps/s' },
                { k: 'Max Swarm Size', v: '128 Agents' },
                { k: 'Session Duration', v: '7 Days' },
              ].map((s) => (
                <div
                  key={s.k}
                  className="rounded-2xl border border-white/8 bg-black/25 p-5"
                >
                  <p className="text-xs uppercase tracking-widest text-[#8da2c0]">
                    {s.k}
                  </p>
                  <p className="mt-3 text-3xl font-semibold tracking-tight text-[#f5f7fb]">
                    {s.v}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="architecture" className="mx-auto max-w-7xl px-6 pb-28">
        <div className="relative overflow-hidden rounded-[32px] border border-[#c5a059]/20 bg-gradient-to-br from-[#c5a059]/20 via-[#3f6fff]/15 to-transparent p-10 md:p-16">
          <div className="relative z-10 grid items-center gap-8 md:grid-cols-2">
            <div>
              <h2 className="text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
                Ready to orchestrate
                <br />
                your first swarm?
              </h2>
              <p className="mt-4 max-w-lg text-[#dfe7f5]">
                Create your free account today. No credit card required. Your
                SQLite workspace is provisioned the moment you sign up.
              </p>
            </div>
            <div className="flex flex-col items-start gap-3 md:items-end">
              <Link
                to="/register"
                className="inline-flex items-center gap-3 rounded-2xl bg-[#f5f7fb] px-7 py-4 text-base font-semibold text-[#0b0f17] shadow-[0_20px_60px_rgba(245,247,251,0.25)] transition hover:bg-white"
              >
                Get Started — Sign Up
                <Zap className="h-5 w-5 text-[#c5a059]" />
              </Link>
              <Link
                to="/login"
                className="text-sm text-[#e6edf9]/80 underline-offset-4 transition hover:text-[#f0d8a1] hover:underline"
              >
                Already have an account? Sign in →
              </Link>
            </div>
          </div>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}
