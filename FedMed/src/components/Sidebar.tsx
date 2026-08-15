import React from 'react';
import {
  LayoutDashboard,
  Building2,
  Cpu,
  ShieldAlert,
  Eye,
  FileCheck2,
  Settings,
} from 'lucide-react';
import { NavigationTab } from '../types';

interface SidebarProps {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  activeHospitalsCount: number;
  auditLogsCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  activeHospitalsCount,
  auditLogsCount,
}) => {
  const navItems = [
    {
      id: 'overview' as NavigationTab,
      label: 'Command Center',
      icon: LayoutDashboard,
    },
    {
      id: 'hospitals' as NavigationTab,
      label: 'Hospital Nodes',
      icon: Building2,
      badge: `${activeHospitalsCount} Online`,
    },
    {
      id: 'fl-engine' as NavigationTab,
      label: 'Model Registry',
      icon: Cpu,
    },
    {
      id: 'privacy' as NavigationTab,
      label: 'Privacy Engine',
      icon: ShieldAlert,
    },
    {
      id: 'mri-viewer' as NavigationTab,
      label: '3D Medical Viewer',
      icon: Eye,
      badge: 'MONAI 3D',
    },
    {
      id: 'audit-logs' as NavigationTab,
      label: 'Audit Vault',
      icon: FileCheck2,
      badge: auditLogsCount ? `${auditLogsCount}` : undefined,
    },
    {
      id: 'settings' as NavigationTab,
      label: 'System Settings',
      icon: Settings,
    },
  ];

  return (
    <aside className="w-full md:w-64 bg-slate-950/70 border-r border-slate-800 flex flex-col shrink-0">
      <div className="p-4 flex-1 space-y-1">
        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3 mb-3">
          Federated Engine Navigation
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer ${
                isActive
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-[0_0_12px_rgba(6,182,212,0.15)]'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[9px] font-mono px-2 py-0.5 rounded-full ${
                    isActive
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                      : 'bg-slate-900 text-slate-400 border border-slate-800'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Privacy Budget Glass Panel */}
      <div className="p-4 border-t border-slate-800">
        <div className="glass-panel rounded-xl p-4 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Privacy Budget</span>
            <span className="text-[11px] text-emerald-400 font-mono font-bold">ε = 0.42</span>
          </div>
          <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
            <div className="h-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)] w-[42%]"></div>
          </div>
          <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 font-mono">
            <span>HIPAA Compliant</span>
            <span className="text-cyan-400">δ = 1e-5</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

