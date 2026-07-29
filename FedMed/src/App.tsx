import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { DashboardOverview } from './components/DashboardOverview';
import { HospitalNodeManager } from './components/HospitalNodeManager';
import { FLTrainingEngine } from './components/FLTrainingEngine';
import { PrivacyEncryptionPanel } from './components/PrivacyEncryptionPanel';
import { MRIViewer } from './components/MRIViewer';
import { AuditLogsViewer } from './components/AuditLogsViewer';
import { SettingsPanel } from './components/SettingsPanel';
import { AiInsightsModal } from './components/AiInsightsModal';
import { LoginForm } from './components/LoginForm';
import { SignupForm } from './components/SignupForm';
import { LandingPage } from './components/LandingPage';
import { DashboardFooter } from './components/DashboardFooter';

import {
  NavigationTab,
  OverviewMetrics,
  HospitalNode,
  RoundMetric,
  AuditLogItem,
  PrivacyStatusResponse,
  MedicalScan,
} from './types';

import {
  fetchOverviewMetrics,
  fetchHospitalNodes,
  registerHospitalNode,
  revokeHospitalNode,
  fetchFLRounds,
  triggerFLRound,
  updateFLConfig,
  fetchPrivacyStatus,
  fetchAuditLogs,
  fetchMedicalScans,
  login,
  register,
  logout,
  getCurrentUser,
} from './services/api';

type AuthView = 'landing' | 'login' | 'signup' | 'dashboard';

export default function App() {
  const [authView, setAuthView] = useState<AuthView>('landing');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ id: number; email: string; fullName: string; role: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState('');

  const [activeTab, setActiveTab] = useState<NavigationTab>('overview');
  const [metrics, setMetrics] = useState<OverviewMetrics | null>(null);
  const [hospitals, setHospitals] = useState<HospitalNode[]>([]);
  const [roundsHistory, setRoundsHistory] = useState<RoundMetric[]>([]);
  const [flConfig, setFlConfig] = useState<{
    currentRound: number;
    totalRounds: number;
    activeStrategy: string;
    targetEpsilon: number;
  }>({
    currentRound: 12,
    totalRounds: 30,
    activeStrategy: 'FedAvg (Secure HE + DP-SGD)',
    targetEpsilon: 10.0,
  });
  const [privacyStatus, setPrivacyStatus] = useState<PrivacyStatusResponse | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([]);
  const [medicalScans, setMedicalScans] = useState<MedicalScan[]>([]);

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isTriggeringRound, setIsTriggeringRound] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  // Check authentication status on load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await getCurrentUser();
        setUser(response.user);
        setIsAuthenticated(true);
        setAuthView('dashboard');
      } catch (error) {
        setIsAuthenticated(false);
        setAuthView('landing');
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);

  // Load All Telemetry Data
  const loadData = useCallback(async () => {
    if (!isAuthenticated) return;
    
    setIsRefreshing(true);
    try {
      const [
        metricsRes,
        hospitalsRes,
        flRes,
        privacyRes,
        auditRes,
        scansRes,
      ] = await Promise.all([
        fetchOverviewMetrics(),
        fetchHospitalNodes(),
        fetchFLRounds(),
        fetchPrivacyStatus(),
        fetchAuditLogs(),
        fetchMedicalScans(),
      ]);

      setMetrics(metricsRes);
      setHospitals(hospitalsRes.hospitals);
      setRoundsHistory(flRes.history);
      setFlConfig({
        currentRound: flRes.currentRound,
        totalRounds: flRes.totalRounds,
        activeStrategy: flRes.activeStrategy,
        targetEpsilon: flRes.targetEpsilon,
      });
      setPrivacyStatus(privacyRes);
      setAuditLogs(auditRes.logs);
      setMedicalScans(scansRes.scans);
    } catch (err) {
      console.error('Error loading FedMed telemetry data:', err);
    } finally {
      setIsRefreshing(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
      const interval = setInterval(loadData, 10000); // Poll telemetry every 10s
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, loadData]);

  // Authentication handlers
  const handleLogin = async (email: string, password: string) => {
    setAuthError('');
    try {
      const response = await login(email, password);
      setUser(response.user);
      setIsAuthenticated(true);
      setAuthView('dashboard');
    } catch (error: any) {
      setAuthError(error.message || 'Login failed');
      throw error;
    }
  };

  const handleSignup = async (email: string, password: string, fullName: string) => {
    setAuthError('');
    try {
      const response = await register(email, password, fullName);
      setUser(response.user);
      setIsAuthenticated(true);
      setAuthView('dashboard');
    } catch (error: any) {
      setAuthError(error.message || 'Registration failed');
      throw error;
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      setIsAuthenticated(false);
      setAuthView('landing');
      setActiveTab('overview');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Handlers
  const handleRegisterNode = async (data: Partial<HospitalNode>) => {
    await registerHospitalNode(data);
    await loadData();
  };

  const handleRevokeNode = async (id: string) => {
    await revokeHospitalNode(id);
    await loadData();
  };

  const handleTriggerRound = async () => {
    setIsTriggeringRound(true);
    try {
      await triggerFLRound();
      await loadData();
    } catch (err: any) {
      alert(err.message || 'Error triggering FL round');
    } finally {
      setIsTriggeringRound(false);
    }
  };

  const handleUpdateConfig = async (config: any) => {
    await updateFLConfig(config);
    await loadData();
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Show landing page
  if (authView === 'landing') {
    return (
      <LandingPage
        onGetStarted={() => setAuthView('signup')}
        onLogin={() => setAuthView('login')}
      />
    );
  }

  // Show login form
  if (authView === 'login') {
    return (
      <LoginForm
        onLogin={handleLogin}
        onSwitchToSignup={() => setAuthView('signup')}
        isLoading={false}
        error={authError}
      />
    );
  }

  // Show signup form
  if (authView === 'signup') {
    return (
      <SignupForm
        onSignup={handleSignup}
        onSwitchToLogin={() => setAuthView('login')}
        isLoading={false}
        error={authError}
      />
    );
  }

  // Show main dashboard
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-teal-500/30 selection:text-teal-200">
      {/* Global Header */}
      <Header
        metrics={metrics}
        onRefresh={loadData}
        onOpenAiModal={() => setIsAiModalOpen(true)}
        isRefreshing={isRefreshing}
        user={user}
        onLogout={handleLogout}
      />

      <div className="flex-1 flex flex-col md:flex-row">
        {/* Navigation Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          activeHospitalsCount={hospitals.filter((h) => h.status === 'ONLINE').length}
          auditLogsCount={auditLogs.length}
        />

        {/* Main Workspace Area */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
          {activeTab === 'overview' && (
            <DashboardOverview
              metrics={metrics}
              history={roundsHistory}
              hospitals={hospitals}
              onTriggerRound={handleTriggerRound}
              isTriggeringRound={isTriggeringRound}
              onNavigateToTab={setActiveTab}
            />
          )}

          {activeTab === 'hospitals' && (
            <HospitalNodeManager
              hospitals={hospitals}
              onRegisterNode={handleRegisterNode}
              onRevokeNode={handleRevokeNode}
            />
          )}

          {activeTab === 'fl-engine' && (
            <FLTrainingEngine
              currentRound={flConfig.currentRound}
              totalRounds={flConfig.totalRounds}
              activeStrategy={flConfig.activeStrategy}
              targetEpsilon={flConfig.targetEpsilon}
              history={roundsHistory}
              onTriggerRound={handleTriggerRound}
              isTriggeringRound={isTriggeringRound}
              onUpdateConfig={handleUpdateConfig}
            />
          )}

          {activeTab === 'privacy' && (
            <PrivacyEncryptionPanel privacyStatus={privacyStatus} />
          )}

          {activeTab === 'mri-viewer' && (
            <MRIViewer scans={medicalScans} />
          )}

          {activeTab === 'audit-logs' && (
            <AuditLogsViewer logs={auditLogs} />
          )}

          {activeTab === 'settings' && <SettingsPanel />}
        </main>
      </div>

      {/* Gemini AI Clinical Analysis Modal */}
      <AiInsightsModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
      />

      {/* Dashboard Footer */}
      <DashboardFooter />
    </div>
  );
}
