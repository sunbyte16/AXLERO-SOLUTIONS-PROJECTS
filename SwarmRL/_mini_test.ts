import express from 'express';
import http from 'http';
import cookieParser from 'cookie-parser';

async function startServer() {
  const app = express();
  const server = http.createServer(app);
  app.use(express.json());
  app.use(cookieParser());
  app.get('/health', (req, res) => res.json({ ok: true, hi: 'from-test' }));
  app.get('/', (req, res) => res.type('html').send('<title>Hello</title><h1>Hi</h1>'));
  const count = server.listenerCount('request');
  console.log('request listener count:', count);
  const wss = new (await import('ws')).WebSocketServer({ noServer: true });
  server.on('upgrade', (request, socket, head) => {
    const url = request.url || '';
    if (url.startsWith('/ws')) {
      wss.handleUpgrade(request, socket, head, (ws) => wss.emit('connection', ws, request));
    } else {
      socket.destroy();
    }
  });
  server.listen(3000, '0.0.0.0', () => console.log('listening 3000'));
}
startServer();
