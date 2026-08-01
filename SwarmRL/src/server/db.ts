/**
 * SwarmRL - SQLite Database Layer (better-sqlite3)
 * Manages users table, sessions, and connection lifecycle.
 */

import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import bcrypt from 'bcryptjs';

const DATA_DIR = path.resolve(process.cwd(), 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const DB_PATH = path.join(DATA_DIR, 'swarmrl.db');

export const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'user',
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
`);

export interface UserRow {
  id: number;
  name: string;
  email: string;
  password_hash: string;
  role: string;
  created_at: string;
  updated_at: string;
}

export interface PublicUser {
  id: number;
  name: string;
  email: string;
  role: string;
  created_at: string;
}

export function toPublicUser(row: UserRow): PublicUser {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    role: row.role,
    created_at: row.created_at,
  };
}

const findUserByEmailStmt = db.prepare(
  'SELECT * FROM users WHERE email = ?'
);
const findUserByIdStmt = db.prepare(
  'SELECT * FROM users WHERE id = ?'
);
const createUserStmt = db.prepare(`
  INSERT INTO users (name, email, password_hash, role)
  VALUES (?, ?, ?, ?)
  RETURNING *
`);

export function findUserByEmail(email: string): UserRow | undefined {
  return findUserByEmailStmt.get(email.toLowerCase().trim()) as
    | UserRow
    | undefined;
}

export function findUserById(id: number): UserRow | undefined {
  return findUserByIdStmt.get(id) as UserRow | undefined;
}

export async function createUser(params: {
  name: string;
  email: string;
  password: string;
  role?: string;
}): Promise<PublicUser> {
  const { name, email, password, role = 'user' } = params;
  const normalizedEmail = email.toLowerCase().trim();
  const trimmedName = name.trim();

  if (!trimmedName || !normalizedEmail || !password) {
    throw new Error('Name, email, and password are required.');
  }
  if (password.length < 6) {
    throw new Error('Password must be at least 6 characters long.');
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
    throw new Error('Please provide a valid email address.');
  }

  const existing = findUserByEmail(normalizedEmail);
  if (existing) {
    throw new Error('An account with this email already exists.');
  }

  const saltRounds = 12;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const row = createUserStmt.get(
    trimmedName,
    normalizedEmail,
    passwordHash,
    role
  ) as UserRow;

  return toPublicUser(row);
}

export async function verifyPassword(
  plain: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}
