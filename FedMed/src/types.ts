export type NavigationTab = 
  | 'overview'
  | 'hospitals'
  | 'fl-engine'
  | 'privacy'
  | 'mri-viewer'
  | 'audit-logs'
  | 'settings';

export interface HospitalNode {
  id: string;
  name: string;
  code: string;
  region: string;
  status: 'ONLINE' | 'TRAINING' | 'IDLE' | 'OFFLINE';
  mtlsStatus: 'VERIFIED' | 'PENDING' | 'REVOKED';
  mtlsFingerprint: string;
  gpuModel: string;
  vramUsageGb: number;
  cpuUsagePercent: number;
  datasetVolume: string;
  localSamplesCount: number;
  localDiceScore: number;
  localLoss: number;
  spentEpsilon: number;
  targetEpsilon: number;
  lastSeen: string;
}

export interface RoundMetric {
  round: number;
  diceScore: number;
  loss: number;
  iou: number;
  participatedNodes: number;
  encryptedBytesMb: number;
  dpEpsilonSpent: number;
}

export interface OverviewMetrics {
  activeHospitalsCount: number;
  totalHospitalsCount: number;
  currentRound: number;
  totalRounds: number;
  activeStrategy: string;
  meanDiceScore: number;
  meanIoU: number;
  currentLoss: number;
  totalSamplesTrained: number;
  privacyBudgetSpent: number;
  targetEpsilon: number;
  securityStatus: string;
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  category: string;
  action: string;
  actor: string;
  details: string;
  status: 'SUCCESS' | 'WARNING' | 'FAILED';
  hash: string;
}

export interface PrivacyStatusResponse {
  homomorphicEncryption: {
    scheme: string;
    polyModulusDegree: number;
    coeffModBitSizes: number[];
    globalScale: string;
    relinKeysGenerated: boolean;
    galoisKeysGenerated: boolean;
    status: string;
  };
  differentialPrivacy: {
    mechanism: string;
    noiseMultiplier: number;
    clippingNorm: number;
    targetEpsilon: number;
    targetDelta: number;
    spentEpsilon: number;
    budgetExhausted: boolean;
  };
  secureAggregation: {
    protocol: string;
    thresholdClients: number;
    status: string;
  };
  compliance: {
    hipaaRule: string;
    gdprRule: string;
  };
}

export interface MedicalScan {
  id: string;
  patientStudyId: string;
  modality: string;
  anatomicalRegion: string;
  sliceCount: number;
  dimensions: string;
  pixelSpacing: string;
  diagnosis: string;
  groundTruthVolumeCm3: number;
  predictedVolumeCm3: number;
  currentSliceDiceScore: number;
  currentSliceIoU: number;
}
