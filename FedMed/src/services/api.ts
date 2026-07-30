import {
  OverviewMetrics,
  HospitalNode,
  RoundMetric,
  AuditLogItem,
  PrivacyStatusResponse,
  MedicalScan,
} from '../types';

export async function fetchOverviewMetrics(): Promise<OverviewMetrics> {
  const res = await fetch('/api/overview');
  if (!res.ok) throw new Error('Failed to fetch overview metrics');
  return res.json();
}

export async function fetchHospitalNodes(): Promise<{ hospitals: HospitalNode[] }> {
  const res = await fetch('/api/hospitals');
  if (!res.ok) throw new Error('Failed to fetch hospital nodes');
  return res.json();
}

export async function registerHospitalNode(data: Partial<HospitalNode>): Promise<HospitalNode> {
  const res = await fetch('/api/hospitals', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to register hospital node');
  return res.json();
}

export async function revokeHospitalNode(id: string): Promise<{ message: string }> {
  const res = await fetch(`/api/hospitals/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to revoke hospital node');
  return res.json();
}

export async function fetchFLRounds(): Promise<{
  currentRound: number;
  totalRounds: number;
  activeStrategy: string;
  targetEpsilon: number;
  learningRate: number;
  minClients: number;
  history: RoundMetric[];
}> {
  const res = await fetch('/api/fl/rounds');
  if (!res.ok) throw new Error('Failed to fetch FL rounds');
  return res.json();
}

export async function triggerFLRound(): Promise<{
  round: number;
  newMetric: RoundMetric;
  message: string;
}> {
  const res = await fetch('/api/fl/trigger-round', { method: 'POST' });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to trigger FL round');
  }
  return res.json();
}

export async function updateFLConfig(config: {
  strategy?: string;
  totalRounds?: number;
  targetEpsilon?: number;
  learningRate?: number;
  minClients?: number;
}): Promise<{ message: string }> {
  const res = await fetch('/api/fl/config', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(config),
  });
  if (!res.ok) throw new Error('Failed to update FL config');
  return res.json();
}

export async function fetchPrivacyStatus(): Promise<PrivacyStatusResponse> {
  const res = await fetch('/api/privacy/status');
  if (!res.ok) throw new Error('Failed to fetch privacy status');
  return res.json();
}

export async function fetchAuditLogs(): Promise<{ logs: AuditLogItem[] }> {
  const res = await fetch('/api/audit-logs');
  if (!res.ok) throw new Error('Failed to fetch audit logs');
  return res.json();
}

export async function fetchMedicalScans(): Promise<{ scans: MedicalScan[] }> {
  const res = await fetch('/api/medical/scans');
  if (!res.ok) throw new Error('Failed to fetch medical scans');
  return res.json();
}

export async function generateAiRoundAnalysis(): Promise<{ analysis: string }> {
  const res = await fetch('/api/ai/analyze-round', { method: 'POST' });
  if (!res.ok) throw new Error('Failed to generate AI analysis');
  return res.json();
}

// Authentication API functions
export async function login(email: string, password: string): Promise<{
  message: string;
  user: { id: number; email: string; fullName: string; role: string };
  token: string;
}> {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
    credentials: 'include',
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Login failed');
  }
  return res.json();
}

export async function register(email: string, password: string, fullName: string): Promise<{
  message: string;
  user: { id: number; email: string; fullName: string; role: string };
  token: string;
}> {
  const res = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, fullName }),
    credentials: 'include',
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Registration failed');
  }
  return res.json();
}

export async function logout(): Promise<{ message: string }> {
  const res = await fetch('/api/auth/logout', {
    method: 'POST',
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Logout failed');
  return res.json();
}

export async function getCurrentUser(): Promise<{
  user: { id: number; email: string; fullName: string; role: string };
}> {
  const res = await fetch('/api/auth/me', {
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to get current user');
  return res.json();
}
