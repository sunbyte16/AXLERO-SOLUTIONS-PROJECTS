/**
 * SwarmRL - Authenticated Dashboard (existing shell wrapped as a route)
 */

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { useSwarmStore } from './stores/useSwarmStore';
import { useAuth } from './lib/AuthContext';
import { Header } from './components/dashboard/Header';
import { Sidebar } from './components/dashboard/Sidebar';

import { MainDashboardView } from './components/views/MainDashboardView';
import { SimulatorView } from './components/views/SimulatorView';
import { MappoTrainingView } from './components/views/MappoTrainingView';
import { AgentsView } from './components/views/AgentsView';
import { EnvironmentView } from './components/views/EnvironmentView';
import { AnalyticsView } from './components/views/AnalyticsView';
import { ModelsView } from './components/views/ModelsView';
import { LogsView } from './components/views/LogsView';
import { SettingsView } from './components/views/SettingsView';

export default function DashboardApp() {
  const {
    activeTab,
    updateSimData,
    updateTrainingMetrics,
    updateCheckpoints,
    addLog,
  } = useSwarmStore();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    let ws: WebSocket | null = null;
    let reconnectTimeout: any = null;
    let pollInterval: any = null;
    let isWsConnected = false;

    const startPolling = () => {
      if (pollInterval) return;
      pollInterval = setInterval(async () => {
        if (isWsConnected) return;
        try {
          const res = await fetch('/api/v1/simulation/state', {
            credentials: 'include',
          });
          if (res.ok) {
            const data = await res.json();
            if (data.agents) {
              updateSimData(
                data.agents || [],
                data.obstacles || [],
                data.metrics || {},
                data.collisions || []
              );

              if (data.trainingHistory && data.trainingStatus) {
                updateTrainingMetrics(
                  data.trainingHistory,
                  data.trainingStatus
                );
              }

              if (data.checkpoints) {
                updateCheckpoints(data.checkpoints);
              }
            }
          }
        } catch (e) {
          // Ignore transient polling errors
        }
      }, 100);
    };

    const stopPolling = () => {
      if (pollInterval) {
        clearInterval(pollInterval);
        pollInterval = null;
      }
    };

    const connectWS = () => {
      try {
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const wsUrl = `${protocol}//${window.location.host}/ws`;

        ws = new WebSocket(wsUrl);

        ws.onopen = () => {
          isWsConnected = true;
          stopPolling();
          addLog(
            'SUCCESS',
            'WEBSOCKET',
            'Real-time telemetry WebSocket stream connected.'
          );
        };

        ws.onmessage = (evt) => {
          try {
            const data = JSON.parse(evt.data);

            if (data.type === 'SIMULATION_UPDATE') {
              updateSimData(
                data.agents || [],
                data.obstacles || [],
                data.metrics || {},
                data.collisions || []
              );

              if (data.trainingHistory && data.trainingStatus) {
                updateTrainingMetrics(
                  data.trainingHistory,
                  data.trainingStatus
                );
              }

              if (data.checkpoints) {
                updateCheckpoints(data.checkpoints);
              }
            }
          } catch (err) {
            // Ignore parse errors
          }
        };

        ws.onclose = () => {
          isWsConnected = false;
          startPolling();
          reconnectTimeout = setTimeout(connectWS, 3000);
        };

        ws.onerror = () => {
          isWsConnected = false;
          startPolling();
        };
      } catch (err) {
        isWsConnected = false;
        startPolling();
      }
    };

    connectWS();

    return () => {
      if (ws) ws.close();
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
      stopPolling();
    };
  }, []);

  async function handleLogout() {
    try {
      await logout();
    } finally {
      navigate('/', { replace: true });
    }
  }

  const userBadge = user ? (
    <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/30 px-3 py-2">
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#c5a059] to-[#3f6fff] text-xs font-semibold text-[#0b0f17]">
        {user.name
          .split(' ')
          .map((p) => p[0])
          .slice(0, 2)
          .join('')
          .toUpperCase()}
      </div>
      <div className="hidden leading-tight sm:block">
        <p className="text-xs font-semibold text-[#f5f7fb]">{user.name}</p>
        <p className="text-[10px] text-[#8da2c0]">{user.email}</p>
      </div>
      <button
        onClick={handleLogout}
        className="ml-1 inline-flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-[#b8c6df] transition hover:border-[#f87171]/30 hover:bg-[#f87171]/10 hover:text-[#fecaca]"
        aria-label="Sign out"
        title="Sign out"
      >
        <LogOut className="h-4 w-4" />
      </button>
    </div>
  ) : null;

  return (
    <div className="app-shell relative min-h-screen overflow-hidden px-3 py-3 text-[#F5F5F5] md:px-5 md:py-5">
      <style>{`
        .dashboard-header-row { position: relative; }
        .dashboard-user-badge {
          position: absolute;
          top: 18px;
          right: 24px;
          z-index: 5;
        }
        @media (max-width: 1279px) {
          .dashboard-user-badge { top: 14px; right: 16px; }
        }
      `}</style>
      <div className="glass-panel-strong relative z-10 flex h-[calc(100vh-1.5rem)] min-h-[720px] flex-col overflow-hidden rounded-[28px] border border-white/10">
        <div className="dashboard-header-row">
          <Header />
          <div className="dashboard-user-badge">{userBadge}</div>
        </div>

        <div className="flex flex-1 overflow-hidden p-2 md:p-3">
          <div className="flex flex-1 overflow-hidden rounded-[22px] border border-white/8 bg-black/10">
            <Sidebar />

            <main className="relative flex-1 overflow-hidden rounded-[20px] bg-transparent">
              {activeTab === 'dashboard' && <MainDashboardView />}
              {activeTab === 'simulator' && <SimulatorView />}
              {activeTab === 'training' && <MappoTrainingView />}
              {activeTab === 'agents' && <AgentsView />}
              {activeTab === 'environment' && <EnvironmentView />}
              {activeTab === 'analytics' && <AnalyticsView />}
              {activeTab === 'models' && <ModelsView />}
              {activeTab === 'logs' && <LogsView />}
              {activeTab === 'settings' && <SettingsView />}
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
