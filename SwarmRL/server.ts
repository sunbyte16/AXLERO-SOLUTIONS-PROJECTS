/**
 * SwarmRL - Authoritative Express + WebSocket Server
 * With SQLite Authentication (JWT + HTTP cookies)
 */

import 'dotenv/config';
import express from 'express';
import http from 'http';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { WebSocketServer, WebSocket } from 'ws';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';

import { MappoEngine } from './src/rl/mappo';
import { TrainingOrchestrator } from './src/rl/trainer';
import { SimulationEngine } from './src/simulation/engine';
import {
  createUser,
  findUserByEmail,
  findUserById,
  toPublicUser,
  verifyPassword,
} from './src/server/db';

const JWT_SECRET =
  process.env.JWT_SECRET ||
  'swarmrl-dev-secret-change-me-in-production-please-2026';
const JWT_EXPIRES_IN = '7d';
const AUTH_COOKIE = 'swarmrl_token';

type AuthPayload = { userId: number; email: string; role: string };

function signToken(payload: AuthPayload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

function verifyToken(token: string): AuthPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AuthPayload;
  } catch {
    return null;
  }
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload & { id: number };
    }
  }
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT || 3000);
  const server = http.createServer(app);

  app.use(express.json({ limit: '1mb' }));
  app.use(cookieParser());

  function authRequired(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    const token =
      (req.cookies && req.cookies[AUTH_COOKIE]) ||
      (req.headers.authorization?.startsWith('Bearer ')
        ? req.headers.authorization.slice(7)
        : '');

    if (!token) {
      res.status(401).json({ error: 'Authentication required.' });
      return;
    }
    const payload = verifyToken(token);
    if (!payload) {
      res.status(401).json({ error: 'Invalid or expired session.' });
      return;
    }
    req.user = { id: payload.userId, ...payload };
    next();
  }

  app.post('/api/v1/auth/register', async (req, res) => {
    try {
      const { name, email, password } = req.body || {};
      const user = await createUser({ name, email, password });
      const token = signToken({
        userId: user.id,
        email: user.email,
        role: user.role,
      });
      res.cookie(AUTH_COOKIE, token, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      res.status(201).json({ user, token });
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Registration failed.' });
    }
  });

  app.post('/api/v1/auth/login', async (req, res) => {
    try {
      const { email, password } = req.body || {};
      if (!email || !password) {
        res.status(400).json({ error: 'Email and password are required.' });
        return;
      }
      const row = findUserByEmail(email);
      if (!row) {
        res.status(401).json({ error: 'Invalid email or password.' });
        return;
      }
      const ok = await verifyPassword(password, row.password_hash);
      if (!ok) {
        res.status(401).json({ error: 'Invalid email or password.' });
        return;
      }
      const user = toPublicUser(row);
      const token = signToken({
        userId: user.id,
        email: user.email,
        role: user.role,
      });
      res.cookie(AUTH_COOKIE, token, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      res.json({ user, token });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Login failed.' });
    }
  });

  app.post('/api/v1/auth/logout', (_req, res) => {
    res.clearCookie(AUTH_COOKIE);
    res.json({ ok: true });
  });

  app.get('/api/v1/auth/me', authRequired, (req, res) => {
    const row = findUserById(req.user!.id);
    if (!row) {
      res.status(404).json({ error: 'User not found.' });
      return;
    }
    res.json({ user: toPublicUser(row) });
  });

  // Instantiate Authoritative Simulation Engine & MAPPO Trainer
  const simEngine = new SimulationEngine();
  const mappoEngine = new MappoEngine();
  const trainer = new TrainingOrchestrator(simEngine, mappoEngine);

  // Set up Simulation WebSocket Server
  const wss = new WebSocketServer({ noServer: true });
  const clients = new Set<WebSocket>();

  wss.on('connection', (ws) => {
    clients.add(ws);

    ws.send(
      JSON.stringify({
        type: 'INIT_STATE',
        config: simEngine.getConfig(),
        obstacles: simEngine.getObstacles(),
        curriculumLevel: simEngine.getCurriculumManager().getLevel(),
      })
    );

    ws.on('message', (msg) => {
      try {
        const payload = JSON.parse(msg.toString());
        if (payload.type === 'START_SIM') {
          simEngine.reset();
        } else if (payload.type === 'PAUSE_SIM') {
          // pause state
        } else if (payload.type === 'SET_CONFIG') {
          simEngine.setConfig(payload.config);
        } else if (payload.type === 'SET_SWARM_SIZE') {
          simEngine.setConfig({ num_agents: payload.num_agents });
        } else if (payload.type === 'START_TRAINING') {
          trainer.startTraining();
        } else if (payload.type === 'PAUSE_TRAINING') {
          trainer.pauseTraining();
        }
      } catch (err) {
        console.error('WS Message parsing error:', err);
      }
    });

    ws.on('close', () => {
      clients.delete(ws);
    });
  });

  // Keep last simulation update message in memory for REST polling fallback
  let lastUpdateData: any = null;

  // Authoritative 20Hz Simulation Loop (50ms)
  setInterval(() => {
    // Generate policy actions for agents if not crashed
    const agents = Array.from(simEngine.getAgents().values());
    const actionsMap: Record<string, [number, number, number]> = {};

    for (const agent of agents) {
      if (agent.status !== 'COLLIDED') {
        const obs = simEngine.getObservation(agent.agent_id);
        const { action } = mappoEngine.getActor().predict(obs);
        actionsMap[agent.agent_id] = action;
      }
    }

    // Step simulation
    const { states, rewards, metrics, collisions } = simEngine.step(actionsMap);

    lastUpdateData = {
      type: 'SIMULATION_UPDATE',
      agents: Array.from(states.values()),
      obstacles: simEngine.getObstacles(),
      metrics,
      collisions,
      trainingStatus: trainer.getStatus(),
      trainingHistory: trainer.getMetricsHistory(),
      checkpoints: trainer.getCheckpoints(),
    };

    // Broadcast to all connected WebSockets
    const updateMessage = JSON.stringify(lastUpdateData);

    for (const client of clients) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(updateMessage);
      }
    }
  }, 50);

  // REST API ROUTES
  app.get('/api/v1/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'SwarmRL Multi-Agent DRL Platform',
      version: '1.0.0',
      uptime: process.uptime(),
      clientsConnected: clients.size,
    });
  });

  app.get('/api/v1/simulation/state', (req, res) => {
    if (lastUpdateData) {
      res.json(lastUpdateData);
    } else {
      res.json({
        agents: Array.from(simEngine.getAgents().values()),
        obstacles: simEngine.getObstacles(),
        config: simEngine.getConfig(),
        coverage: simEngine.getCoverageData(),
      });
    }
  });

  app.post('/api/v1/simulation/reset', authRequired, (req, res) => {
    simEngine.reset();
    res.json({ status: 'success', message: 'Simulation reset complete.' });
  });

  app.post('/api/v1/simulation/config', authRequired, (req, res) => {
    simEngine.setConfig(req.body);
    res.json({ status: 'success', config: simEngine.getConfig() });
  });

  app.get('/api/v1/training/status', authRequired, (req, res) => {
    res.json({
      status: trainer.getStatus(),
      history: trainer.getMetricsHistory(),
      checkpoints: trainer.getCheckpoints(),
    });
  });

  app.post('/api/v1/training/start', authRequired, (req, res) => {
    trainer.startTraining();
    res.json({ status: 'started' });
  });

  app.post('/api/v1/training/pause', authRequired, (req, res) => {
    trainer.pauseTraining();
    res.json({ status: 'paused' });
  });

  app.get('/api/v1/models', authRequired, (req, res) => {
    res.json(trainer.getCheckpoints());
  });

  // Vite Integration in Development / Static Files in Production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: {
          port: Number(process.env.HMR_PORT) || 24679,
        },
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    app.use('*', async (req, res, next) => {
      const url = req.originalUrl;
      if (url.startsWith('/api') || url.startsWith('/ws')) return next();
      try {
        const indexPath = path.resolve(process.cwd(), 'index.html');
        let template = fs.readFileSync(indexPath, 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e) {
        vite.ssrFixStacktrace(e);
        next(e);
      }
    });
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // Simulation WebSocket Upgrade Handler on /ws
  server.on('upgrade', (request, socket, head) => {
    const url = request.url || '';
    if (url.startsWith('/ws')) {
      wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
      });
      return;
    }
  });

  server.listen(PORT, '0.0.0.0', () => {
    console.log(
      `[SwarmRL Engine] Server listening at http://0.0.0.0:${PORT}`
    );
    console.log(
      `[SwarmRL DB]     SQLite store ready at data/swarmrl.db`
    );
  });
}

startServer();
