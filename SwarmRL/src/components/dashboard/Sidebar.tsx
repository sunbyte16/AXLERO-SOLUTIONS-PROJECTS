/**
 * SwarmRL - Sidebar Navigation Component
 */

import React from 'react';
import {
  Activity,
  BarChart3,
  Bot,
  Box,
  Brain,
  FileText,
  Flame,
  Globe,
  LayoutDashboard,
  Settings,
  Terminal,
} from 'lucide-react';
import { useSwarmStore } from '../../stores/useSwarmStore';
import { ViewTab } from '../../types';

interface NavItem {
  id: ViewTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'simulator', label: '3D Simulator', icon: Globe, badge: '3D' },
  { id: 'training', label: 'MAPPO Training', icon: Brain, badge: 'RL' },
  { id: 'agents', label: 'Swarm Agents', icon: Bot },
  { id: 'environment', label: 'Disaster Env', icon: Flame },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'models', label: 'Checkpoints', icon: Box },
  { id: 'logs', label: 'System Logs', icon: Terminal },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, metrics, trainingStatus } = useSwarmStore();

  return (
    <aside className="glass-panel m-2 flex w-[76px] shrink-0 flex-col justify-between rounded-[20px] border-white/10 select-none md:w-72">
      <div className="px-3 py-4 md:px-4 md:py-5">
        <div className="hidden md:block">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-[0.28em] text-white/40">Navigation</p>
                <h2 className="mt-2 text-sm font-semibold text-white">Mission Workspace</h2>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#C5A059]/15 text-[#E8D09E]">
                <LayoutDashboard className="h-5 w-5" />
              </div>
            </div>
            <p className="mt-2 text-xs leading-5 text-[#91A5C6]">
              Switch between operations, simulation, analytics, logs, and model control surfaces.
            </p>
          </div>
        </div>

        <div className="mt-4 space-y-1.5">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`group flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-xs font-medium uppercase tracking-[0.2em] transition-all duration-150 ${
                isActive
                  ? 'bg-gradient-to-r from-[#C5A059] via-[#E0C37E] to-[#F0D8A1] text-black shadow-[0_14px_30px_rgba(197,160,89,0.22)]'
                  : 'text-white/58 hover:bg-white/[0.05] hover:text-white'
              }`}
            >
              <Icon
                className={`h-4 w-4 shrink-0 transition-transform group-hover:scale-105 ${
                  isActive ? 'text-black' : 'text-white/50 group-hover:text-[#C5A059]'
                }`}
              />
              <div className="hidden min-w-0 flex-1 items-center md:flex">
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`ml-auto hidden rounded-full px-2 py-1 text-[9px] font-bold tracking-[0.22em] md:inline-block ${
                    isActive
                      ? 'bg-black/15 text-black'
                      : 'border border-[#C5A059]/20 bg-[#C5A059]/10 text-[#E8D09E]'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
        </div>
      </div>

      <div className="border-t border-white/10 px-3 py-4 md:px-4 md:py-5">
        <div className="hidden space-y-3 md:block">
          <div className="rounded-2xl border border-white/10 bg-[#08111f] p-4">
            <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.24em] text-white/45">
              <span>System Status</span>
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-white/40">Coverage</p>
                <p className="mt-1 font-semibold text-white">{metrics.map_coverage_percent.toFixed(1)}%</p>
              </div>
              <div>
                <p className="text-white/40">Training</p>
                <p className="mt-1 font-semibold text-white">{trainingStatus}</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#C5A059]/15 bg-[#C5A059]/8 p-4">
            <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.24em] text-[#F0D8A1]">
              <span>Server Ingress</span>
              <Activity className="h-3.5 w-3.5" />
            </div>
            <p className="mt-2 text-sm font-semibold text-white">Port 3000</p>
            <p className="mt-1 text-xs leading-5 text-[#CAB994]">Real-time WebSocket stream and REST telemetry are active.</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
