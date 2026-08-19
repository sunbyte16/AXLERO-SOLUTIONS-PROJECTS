import initSqlJs from 'sql.js';
import bcrypt from 'bcrypt';
import fs from 'fs';
import path from 'path';

let db: any = null;
let SQL: any = null;

export async function initializeDatabase() {
  SQL = await initSqlJs();
  
  const dbPath = path.join(process.cwd(), 'fedmed.db');
  let dbBuffer: Buffer | null = null;
  
  if (fs.existsSync(dbPath)) {
    dbBuffer = fs.readFileSync(dbPath);
    db = new SQL.Database(dbBuffer);
  } else {
    db = new SQL.Database();
    createTables();
    saveDatabase();
  }
  
  return db;
}

function createTables() {
  // Users table
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      full_name TEXT NOT NULL,
      role TEXT DEFAULT 'user',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      last_login DATETIME
    )
  `);

  // Sessions table
  db.run(`
    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      user_id INTEGER NOT NULL,
      token TEXT NOT NULL,
      expires_at DATETIME NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);
}

function saveDatabase() {
  const dbPath = path.join(process.cwd(), 'fedmed.db');
  const data = db.export();
  const buffer = Buffer.from(data);
  fs.writeFileSync(dbPath, buffer);
}

export function getDatabase() {
  if (!db) {
    throw new Error('Database not initialized. Call initializeDatabase() first.');
  }
  return db;
}

export async function createUser(email: string, password: string, fullName: string) {
  const hashedPassword = await bcrypt.hash(password, 10);
  
  try {
    const stmt = db.prepare('INSERT INTO users (email, password, full_name) VALUES (?, ?, ?)');
    stmt.run([email, hashedPassword, fullName]);
    stmt.free();
    saveDatabase();
    
    const userStmt = db.prepare('SELECT id, email, full_name, role, created_at FROM users WHERE email = ?');
    const user = userStmt.getAsObject([email]);
    userStmt.free();
    
    return {
      id: Number(user.id),
      email: String(user.email),
      full_name: String(user.full_name),
      role: String(user.role || 'user'),
      created_at: String(user.created_at)
    };
  } catch (error: any) {
    if (error.message && error.message.includes('UNIQUE')) {
      throw new Error('Email already exists');
    }
    throw error;
  }
}

export async function validateUser(email: string, password: string) {
  const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
  const user = stmt.getAsObject([email]);
  stmt.free();
  
  if (!user || !user.id || !user.password) {
    return null;
  }
  
  const isValid = await bcrypt.compare(password, String(user.password));
  if (!isValid) {
    return null;
  }
  
  // Update last login
  const updateStmt = db.prepare('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?');
  updateStmt.run([user.id]);
  updateStmt.free();
  saveDatabase();
  
  return {
    id: Number(user.id),
    email: String(user.email),
    fullName: String(user.full_name),
    role: String(user.role || 'user'),
    createdAt: String(user.created_at)
  };
}

export function createSession(userId: number, token: string, expiresAt: Date) {
  const sessionId = Math.random().toString(36).substring(2) + Date.now().toString(36);
  
  const stmt = db.prepare('INSERT INTO sessions (id, user_id, token, expires_at) VALUES (?, ?, ?, ?)');
  stmt.run([sessionId, userId, token, expiresAt.toISOString()]);
  stmt.free();
  saveDatabase();
  
  return sessionId;
}

export function validateSession(token: string) {
  const stmt = db.prepare(`
    SELECT s.id as session_id, s.user_id, u.email, u.full_name, u.role 
    FROM sessions s 
    JOIN users u ON s.user_id = u.id 
    WHERE s.token = ? AND s.expires_at > CURRENT_TIMESTAMP
  `);
  const session = stmt.getAsObject([token]);
  stmt.free();
  
  if (!session || !session.session_id) {
    return null;
  }
  
  return {
    id: String(session.session_id),
    userId: Number(session.user_id),
    email: String(session.email),
    fullName: String(session.full_name),
    role: String(session.role || 'user')
  };
}

export function deleteSession(token: string) {
  const stmt = db.prepare('DELETE FROM sessions WHERE token = ?');
  stmt.run([token]);
  stmt.free();
  saveDatabase();
}

export function cleanupExpiredSessions() {
  const stmt = db.prepare('DELETE FROM sessions WHERE expires_at < CURRENT_TIMESTAMP');
  stmt.run();
  stmt.free();
  saveDatabase();
}
