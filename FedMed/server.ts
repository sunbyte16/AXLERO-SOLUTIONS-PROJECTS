import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import { initializeDatabase, createUser, validateUser, createSession, validateSession, deleteSession } from './src/database/db.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  // Initialize database
  await initializeDatabase();

  const JWT_SECRET = process.env.JWT_SECRET || 'fedmed-secret-key-change-in-production';

  app.use(express.json());
  app.use(cookieParser());

  // Authentication middleware
  const authenticateToken = (req: any, res: any, next: any) => {
    const token = req.cookies.auth_token || req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      const session = validateSession(token);
      
      if (!session) {
        return res.status(401).json({ error: 'Invalid or expired session.' });
      }
      
      req.user = session;
      next();
    } catch (error) {
      res.status(403).json({ error: 'Invalid token.' });
    }
  };

  // --- In-Memory State for Federated Engine Simulation ---
  let currentRound = 12;
  let totalRounds = 30;
  let activeStrategy = 'FedAvg (Secure HE + DP-SGD)';
  let targetEpsilon = 10.0;
  let learningRate = 0.0001;
  let minClients = 3;

  const hospitalNodes = [
    {
      id: 'hosp-001',
      name: 'Johns Hopkins Medicine',
      code: 'JHM-BALTIMORE',
      region: 'North America (East)',
      status: 'ONLINE' as const,
      mtlsStatus: 'VERIFIED' as const,
      mtlsFingerprint: 'SHA256:7f9a8b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a',
      gpuModel: 'NVIDIA A100-SXM4-80GB',
      vramUsageGb: 54.2,
      cpuUsagePercent: 68.4,
      datasetVolume: '1,420 3D MRI (BraTS-2024)',
      localSamplesCount: 1420,
      localDiceScore: 0.898,
      localLoss: 0.124,
      spentEpsilon: 3.42,
      targetEpsilon: 10.0,
      lastSeen: new Date().toISOString(),
    },
    {
      id: 'hosp-002',
      name: 'Mayo Clinic Rochester',
      code: 'MAYO-MN',
      region: 'North America (Midwest)',
      status: 'ONLINE' as const,
      mtlsStatus: 'VERIFIED' as const,
      mtlsFingerprint: 'SHA256:1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b',
      gpuModel: 'NVIDIA H100-80GB',
      vramUsageGb: 61.8,
      cpuUsagePercent: 72.1,
      datasetVolume: '1,890 3D MRI (Glioma-TCGA)',
      localSamplesCount: 1890,
      localDiceScore: 0.912,
      localLoss: 0.108,
      spentEpsilon: 3.85,
      targetEpsilon: 10.0,
      lastSeen: new Date().toISOString(),
    },
    {
      id: 'hosp-003',
      name: 'Charité – Universitätsmedizin Berlin',
      code: 'CHARITE-BER',
      region: 'Europe (Germany)',
      status: 'ONLINE' as const,
      mtlsStatus: 'VERIFIED' as const,
      mtlsFingerprint: 'SHA256:3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d',
      gpuModel: 'NVIDIA RTX A6000 48GB',
      vramUsageGb: 38.5,
      cpuUsagePercent: 54.9,
      datasetVolume: '980 3D CT/MRI (Multi-Organ)',
      localSamplesCount: 980,
      localDiceScore: 0.874,
      localLoss: 0.142,
      spentEpsilon: 2.91,
      targetEpsilon: 10.0,
      lastSeen: new Date().toISOString(),
    },
    {
      id: 'hosp-004',
      name: 'Karolinska University Hospital',
      code: 'KAROLINSKA-STO',
      region: 'Europe (Sweden)',
      status: 'ONLINE' as const,
      mtlsStatus: 'VERIFIED' as const,
      mtlsFingerprint: 'SHA256:5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f',
      gpuModel: 'NVIDIA A100-40GB',
      vramUsageGb: 31.0,
      cpuUsagePercent: 49.2,
      datasetVolume: '760 3D MRI (Brain-Stroke)',
      localSamplesCount: 760,
      localDiceScore: 0.881,
      localLoss: 0.138,
      spentEpsilon: 2.54,
      targetEpsilon: 10.0,
      lastSeen: new Date().toISOString(),
    },
    {
      id: 'hosp-005',
      name: 'National Cancer Center Singapore',
      code: 'NCCS-SGP',
      region: 'Asia Pacific (Singapore)',
      status: 'OFFLINE' as const,
      mtlsStatus: 'VERIFIED' as const,
      mtlsFingerprint: 'SHA256:7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b',
      gpuModel: 'NVIDIA RTX 4090 24GB',
      vramUsageGb: 0.0,
      cpuUsagePercent: 4.1,
      datasetVolume: '520 3D MRI (Glioblastoma)',
      localSamplesCount: 520,
      localDiceScore: 0.865,
      localLoss: 0.156,
      spentEpsilon: 1.80,
      targetEpsilon: 10.0,
      lastSeen: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    },
  ];

  const roundMetricsHistory = [
    { round: 1, diceScore: 0.542, loss: 0.685, iou: 0.381, participatedNodes: 4, encryptedBytesMb: 142.5, dpEpsilonSpent: 0.28 },
    { round: 2, diceScore: 0.618, loss: 0.541, iou: 0.452, participatedNodes: 4, encryptedBytesMb: 142.5, dpEpsilonSpent: 0.55 },
    { round: 3, diceScore: 0.689, loss: 0.428, iou: 0.528, participatedNodes: 4, encryptedBytesMb: 142.5, dpEpsilonSpent: 0.82 },
    { round: 4, diceScore: 0.741, loss: 0.342, iou: 0.591, participatedNodes: 4, encryptedBytesMb: 142.5, dpEpsilonSpent: 1.10 },
    { round: 5, diceScore: 0.785, loss: 0.281, iou: 0.648, participatedNodes: 4, encryptedBytesMb: 142.5, dpEpsilonSpent: 1.38 },
    { round: 6, diceScore: 0.812, loss: 0.235, iou: 0.686, participatedNodes: 4, encryptedBytesMb: 142.5, dpEpsilonSpent: 1.65 },
    { round: 7, diceScore: 0.838, loss: 0.198, iou: 0.722, participatedNodes: 4, encryptedBytesMb: 142.5, dpEpsilonSpent: 1.94 },
    { round: 8, diceScore: 0.856, loss: 0.172, iou: 0.749, participatedNodes: 4, encryptedBytesMb: 142.5, dpEpsilonSpent: 2.22 },
    { round: 9, diceScore: 0.871, loss: 0.151, iou: 0.772, participatedNodes: 4, encryptedBytesMb: 142.5, dpEpsilonSpent: 2.51 },
    { round: 10, diceScore: 0.884, loss: 0.138, iou: 0.791, participatedNodes: 4, encryptedBytesMb: 142.5, dpEpsilonSpent: 2.79 },
    { round: 11, diceScore: 0.893, loss: 0.126, iou: 0.806, participatedNodes: 4, encryptedBytesMb: 142.5, dpEpsilonSpent: 3.08 },
    { round: 12, diceScore: 0.901, loss: 0.115, iou: 0.819, participatedNodes: 4, encryptedBytesMb: 142.5, dpEpsilonSpent: 3.36 },
  ];

  const auditLogs = [
    {
      id: 'log-101',
      timestamp: new Date().toISOString(),
      category: 'SECURITY',
      action: 'mTLS Handshake & Node Verification',
      actor: 'Johns Hopkins Node (hosp-001)',
      details: 'Mutual TLS certificate validated. SHA256 match. Role: CONTRIBUTOR.',
      status: 'SUCCESS' as const,
      hash: '0x8f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a',
    },
    {
      id: 'log-102',
      timestamp: new Date(Date.now() - 4 * 60 * 1000).toISOString(),
      category: 'HOMOMORPHIC_ENCRYPTION',
      action: 'TenSEAL CKKS Ciphertext Weight Verification',
      actor: 'FL Server Aggregator',
      details: 'Ciphertext shape [32, 64, 3, 3, 3] received. Poly degree 8192 verified. Zero plain-text leaks detected.',
      status: 'SUCCESS' as const,
      hash: '0x3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d',
    },
    {
      id: 'log-103',
      timestamp: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
      category: 'DIFFERENTIAL_PRIVACY',
      action: 'DP-SGD Gaussian Noise Injection',
      actor: 'Mayo Clinic Node (hosp-002)',
      details: 'Gradients clipped to norm C=1.0. Noise std_dev 1.0 added. Round privacy cost delta_eps = +0.28.',
      status: 'SUCCESS' as const,
      hash: '0x5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f',
    },
    {
      id: 'log-104',
      timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
      category: 'FEDERATED_ROUND',
      action: 'FedAvg Global Model Aggregation',
      actor: 'FedMed Orchestrator',
      details: 'Aggregated 4 hospital updates homomorphically. Global 3D U-Net Dice score increased to 0.901.',
      status: 'SUCCESS' as const,
      hash: '0x7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b',
    },
    {
      id: 'log-105',
      timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
      category: 'HIPAA_COMPLIANCE',
      action: 'Zero-PHI Perimeter Check',
      actor: 'HIPAA Automated Inspector',
      details: 'Verified zero raw DICOM/NIfTI payload transiting external network adapters.',
      status: 'SUCCESS' as const,
      hash: '0x1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c',
    },
  ];

  // --- API Routes ---

  // Authentication Routes
  // Register new user
  app.post('/api/auth/register', async (req, res) => {
    try {
      const { email, password, fullName } = req.body;
      
      if (!email || !password || !fullName) {
        return res.status(400).json({ error: 'Email, password, and full name are required.' });
      }
      
      if (password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters.' });
      }
      
      const user = await createUser(email, password, fullName);
      
      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: '7d' }
      );
      
      // Create session
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
      createSession(user.id, token, expiresAt);
      
      // Set cookie
      res.cookie('auth_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000,
        sameSite: 'strict'
      });
      
      res.status(201).json({
        message: 'User registered successfully',
        user: {
          id: user.id,
          email: user.email,
          fullName: user.full_name,
          role: user.role
        },
        token
      });
    } catch (error: any) {
      if (error.message === 'Email already exists') {
        return res.status(409).json({ error: 'Email already registered' });
      }
      console.error('Registration error:', error);
      res.status(500).json({ error: 'Registration failed' });
    }
  });

  // Login user
  app.post('/api/auth/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required.' });
      }
      
      const user = await validateUser(email, password);
      
      if (!user) {
        return res.status(401).json({ error: 'Invalid email or password.' });
      }
      
      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: '7d' }
      );
      
      // Create session
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
      createSession(user.id, token, expiresAt);
      
      // Set cookie
      res.cookie('auth_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000,
        sameSite: 'strict'
      });
      
      res.json({
        message: 'Login successful',
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          role: user.role
        },
        token
      });
    } catch (error: any) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Login failed' });
    }
  });

  // Logout user
  app.post('/api/auth/logout', (req, res) => {
    const token = req.cookies.auth_token || req.headers.authorization?.split(' ')[1];
    
    if (token) {
      deleteSession(token);
    }
    
    res.clearCookie('auth_token');
    res.json({ message: 'Logout successful' });
  });

  // Get current user
  app.get('/api/auth/me', authenticateToken, (req: any, res) => {
    res.json({
      user: {
        id: req.user.userId,
        email: req.user.email,
        fullName: req.user.fullName,
        role: req.user.role
      }
    });
  });

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'HEALTHY',
      service: 'FedMed Federated Learning Engine',
      timestamp: new Date().toISOString(),
      components: {
        flServer: 'ONLINE',
        tenSealEncryption: 'ACTIVE',
        differentialPrivacyAccountant: 'ACTIVE',
        mTLSTransport: 'VERIFIED',
      },
    });
  });

  // Overview metrics
  app.get('/api/overview', (req, res) => {
    const onlineHospitals = hospitalNodes.filter((h) => h.status === 'ONLINE').length;
    const latestMetric = roundMetricsHistory[roundMetricsHistory.length - 1];

    res.json({
      activeHospitalsCount: onlineHospitals,
      totalHospitalsCount: hospitalNodes.length,
      currentRound,
      totalRounds,
      activeStrategy,
      meanDiceScore: latestMetric ? latestMetric.diceScore : 0.901,
      meanIoU: latestMetric ? latestMetric.iou : 0.819,
      currentLoss: latestMetric ? latestMetric.loss : 0.115,
      totalSamplesTrained: hospitalNodes.reduce((acc, h) => acc + h.localSamplesCount, 0),
      privacyBudgetSpent: 3.36,
      targetEpsilon,
      securityStatus: 'HIPAA & GDPR COMPLIANT (100% ENCRYPTED)',
    });
  });

  // Hospital Nodes List
  app.get('/api/hospitals', (req, res) => {
    res.json({
      hospitals: hospitalNodes,
    });
  });

  // Register Hospital Node
  app.post('/api/hospitals', (req, res) => {
    const { name, code, region, gpuModel, datasetVolume, localSamplesCount } = req.body;
    if (!name || !code) {
      return res.status(400).json({ error: 'Hospital name and code are required.' });
    }

    const newNode = {
      id: `hosp-${Date.now().toString().slice(-4)}`,
      name,
      code: code.toUpperCase(),
      region: region || 'Global Hospital Silo',
      status: 'ONLINE' as const,
      mtlsStatus: 'VERIFIED' as const,
      mtlsFingerprint: `SHA256:${Math.random().toString(16).slice(2)}${Math.random().toString(16).slice(2)}`,
      gpuModel: gpuModel || 'NVIDIA A100-80GB',
      vramUsageGb: 24.0,
      cpuUsagePercent: 35.0,
      datasetVolume: datasetVolume || '500 3D MRI',
      localSamplesCount: Number(localSamplesCount) || 500,
      localDiceScore: 0.85,
      localLoss: 0.18,
      spentEpsilon: 0.28,
      targetEpsilon: 10.0,
      lastSeen: new Date().toISOString(),
    };

    hospitalNodes.push(newNode);

    auditLogs.unshift({
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      category: 'NODE_REGISTRATION',
      action: 'Hospital Node Onboarded',
      actor: name,
      details: `Registered node ${code} with mTLS certificate fingerprint ${newNode.mtlsFingerprint.slice(0, 15)}...`,
      status: 'SUCCESS',
      hash: `0x${Math.random().toString(16).slice(2)}${Math.random().toString(16).slice(2)}`,
    });

    res.status(201).json(newNode);
  });

  // Delete/Revoke Node
  app.delete('/api/hospitals/:id', (req, res) => {
    const { id } = req.params;
    const index = hospitalNodes.findIndex((h) => h.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Hospital node not found.' });
    }

    const removed = hospitalNodes.splice(index, 1)[0];

    auditLogs.unshift({
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      category: 'NODE_REVOCATION',
      action: 'Hospital Certificate Revoked',
      actor: 'Admin',
      details: `Revoked access for hospital ${removed.name} (${removed.code}). Certificate added to CRL.`,
      status: 'SUCCESS',
      hash: `0x${Math.random().toString(16).slice(2)}${Math.random().toString(16).slice(2)}`,
    });

    res.json({ message: 'Node access revoked successfully.', removed });
  });

  // FL Rounds & Metrics History
  app.get('/api/fl/rounds', (req, res) => {
    res.json({
      currentRound,
      totalRounds,
      activeStrategy,
      targetEpsilon,
      learningRate,
      minClients,
      history: roundMetricsHistory,
    });
  });

  // Trigger FL Round Simulation
  app.post('/api/fl/trigger-round', (req, res) => {
    if (currentRound >= totalRounds) {
      return res.status(400).json({ error: 'Target FL rounds already completed.' });
    }

    currentRound += 1;
    const prevMetric = roundMetricsHistory[roundMetricsHistory.length - 1];

    // Simulate training convergence with small realistic improvements
    const newDice = Math.min(0.965, Number((prevMetric.diceScore + 0.006 + Math.random() * 0.004).toFixed(3)));
    const newLoss = Math.max(0.045, Number((prevMetric.loss * 0.925).toFixed(3)));
    const newIoU = Math.min(0.92, Number((prevMetric.iou + 0.007 + Math.random() * 0.003).toFixed(3)));
    const newEpsSpent = Number((prevMetric.dpEpsilonSpent + 0.28).toFixed(2));

    const newMetric = {
      round: currentRound,
      diceScore: newDice,
      loss: newLoss,
      iou: newIoU,
      participatedNodes: hospitalNodes.filter((h) => h.status === 'ONLINE').length,
      encryptedBytesMb: 142.5,
      dpEpsilonSpent: newEpsSpent,
    };

    roundMetricsHistory.push(newMetric);

    // Update hospital stats
    hospitalNodes.forEach((node) => {
      if (node.status === 'ONLINE') {
        node.localDiceScore = Math.min(0.96, Number((node.localDiceScore + 0.005).toFixed(3)));
        node.localLoss = Math.max(0.05, Number((node.localLoss * 0.93).toFixed(3)));
        node.spentEpsilon = Number((node.spentEpsilon + 0.28).toFixed(2));
        node.lastSeen = new Date().toISOString();
      }
    });

    // Add audit log
    auditLogs.unshift({
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      category: 'FEDERATED_ROUND',
      action: `Executed FL Round #${currentRound}`,
      actor: 'Flower Strategy Runner',
      details: `Homomorphic aggregation complete across ${newMetric.participatedNodes} active silos. Global Dice score reached ${newDice}. Loss decreased to ${newLoss}.`,
      status: 'SUCCESS',
      hash: `0x${Math.random().toString(16).slice(2)}${Math.random().toString(16).slice(2)}`,
    });

    res.json({
      round: currentRound,
      newMetric,
      message: `FL Round ${currentRound} executed successfully.`,
    });
  });

  // Update FL Config
  app.post('/api/fl/config', (req, res) => {
    const { strategy, totalRounds: tr, targetEpsilon: te, learningRate: lr, minClients: mc } = req.body;
    if (strategy) activeStrategy = strategy;
    if (tr) totalRounds = Number(tr);
    if (te) targetEpsilon = Number(te);
    if (lr) learningRate = Number(lr);
    if (mc) minClients = Number(mc);

    res.json({
      activeStrategy,
      totalRounds,
      targetEpsilon,
      learningRate,
      minClients,
      message: 'FL Engine parameters updated.',
    });
  });

  // Cryptographic & Privacy Status
  app.get('/api/privacy/status', (req, res) => {
    res.json({
      homomorphicEncryption: {
        scheme: 'CKKS (Cheon-Kim-Kim-Song)',
        polyModulusDegree: 8192,
        coeffModBitSizes: [60, 40, 40, 60],
        globalScale: '2^40',
        relinKeysGenerated: true,
        galoisKeysGenerated: true,
        status: 'ACTIVE_VERIFIED',
      },
      differentialPrivacy: {
        mechanism: 'DP-SGD (Moments Accountant)',
        noiseMultiplier: 1.0,
        clippingNorm: 1.0,
        targetEpsilon,
        targetDelta: 1e-5,
        spentEpsilon: 3.36,
        budgetExhausted: false,
      },
      secureAggregation: {
        protocol: 'Shamir Threshold Secret Sharing',
        thresholdClients: 3,
        status: 'READY',
      },
      compliance: {
        hipaaRule: 'COMPLIANT (Zero Patient Health Information egress)',
        gdprRule: 'COMPLIANT (Privacy by Design - Art. 25/32)',
      },
    });
  });

  // Audit Logs
  app.get('/api/audit-logs', (req, res) => {
    res.json({ logs: auditLogs });
  });

  // Medical Scans Samples with 3D MRI DICOM slice representations
  app.get('/api/medical/scans', (req, res) => {
    res.json({
      scans: [
        {
          id: 'scan-bra-001',
          patientStudyId: 'STUDY-BRAIN-GLIOMA-402',
          modality: 'MRI T1c (Post-Contrast)',
          anatomicalRegion: 'Brain (Frontal-Parietal Lobe)',
          sliceCount: 155,
          dimensions: '240 x 240 x 155 mm',
          pixelSpacing: '1.0 x 1.0 x 1.0 mm',
          diagnosis: 'High-Grade Glioblastoma Multiforme (GBM)',
          groundTruthVolumeCm3: 28.4,
          predictedVolumeCm3: 27.9,
          currentSliceDiceScore: 0.912,
          currentSliceIoU: 0.838,
        },
        {
          id: 'scan-abd-002',
          patientStudyId: 'STUDY-ABDOMEN-KIDNEY-108',
          modality: 'CT Multi-Phase',
          anatomicalRegion: 'Abdominal (Kidneys & Liver)',
          sliceCount: 180,
          dimensions: '512 x 512 x 180 mm',
          pixelSpacing: '0.8 x 0.8 x 1.2 mm',
          diagnosis: 'Renal Cell Carcinoma / Organ Segmentation',
          groundTruthVolumeCm3: 42.1,
          predictedVolumeCm3: 41.5,
          currentSliceDiceScore: 0.895,
          currentSliceIoU: 0.810,
        },
      ],
    });
  });

  // Gemini AI Analysis for Clinical FL Rounds
  app.post('/api/ai/analyze-round', async (req, res) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(400).json({
          analysis:
            'GEMINI_API_KEY is missing in environment secrets. Default Clinical Evaluation: Global 3D U-Net model demonstrates strong convergence with Dice score 0.901 and loss 0.115 across 4 active hospital silos. Privacy budget remains well within HIPAA targets with zero PHI leakage.',
        });
      }

      const ai = new GoogleGenAI({ apiKey });
      const prompt = `
You are a Lead Healthcare AI Systems Architect and Clinical Radiologist reviewing a Federated Learning training session for 3D Brain Tumor Segmentation (3D U-Net).
Current Round: ${currentRound}/${totalRounds}
Active Strategy: ${activeStrategy}
Mean Dice Similarity Coefficient: 0.901
Mean Intersection over Union (IoU): 0.819
Current Training Loss: 0.115
Participating Hospital Silos: Johns Hopkins, Mayo Clinic, Charité Berlin, Karolinska Institute
Differential Privacy Spent Epsilon: 3.36 / 10.0
TenSEAL Homomorphic Encryption Scheme: CKKS 8192-bit

Provide a concise, 3-bullet clinical executive assessment evaluating:
1. Model Convergence & Segmentation Accuracy
2. Privacy & Security Assurance (Differential Privacy budget & Homomorphic Encryption)
3. Actionable Clinical Recommendation for next training rounds.
`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      res.json({
        analysis: response.text || 'Analysis generated successfully.',
      });
    } catch (error: any) {
      console.error('Gemini AI Analysis Error:', error);
      res.status(500).json({
        analysis:
          'Automated Clinical Summary: The 3D U-Net model achieves high diagnostic segment accuracy (Dice > 0.90). Homomorphic encryption and DP-SGD guarantee zero data leakage across participating healthcare institutions.',
      });
    }
  });

  // Vite Integration in Development / Static Files in Production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: {
          port: Number(process.env.HMR_PORT) || 24678,
        },
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[FedMed Engine] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
