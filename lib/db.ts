import path from "node:path";
import fs from "node:fs";
import Database from "better-sqlite3";

const dataDir = path.join(process.cwd(), "data");
fs.mkdirSync(dataDir, { recursive: true });

const dbPath = path.join(dataDir, "app.db");
const db = new Database(dbPath);

db.pragma("journal_mode = WAL");

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    phone TEXT DEFAULT '',
    balance INTEGER DEFAULT 0,
    address TEXT DEFAULT '',
    createdAt TEXT NOT NULL
  );
`);

export type UserRecord = {
  id: number;
  name: string;
  email: string;
  password: string;
  phone: string;
  balance: number;
  address: string;
  createdAt: string;
};

export function getUserByEmail(email: string): UserRecord | undefined {
  return db
    .prepare(
      `SELECT * FROM users WHERE lower(email) = lower(?) LIMIT 1`
    )
    .get(email.trim()) as UserRecord | undefined;
}

export function getUserById(id: number): UserRecord | undefined {
  return db
    .prepare(
      `SELECT id, name, email, password, phone, balance, address, createdAt FROM users WHERE id = ? LIMIT 1`
    )
    .get(id) as UserRecord | undefined;
}

export function getPublicUserById(id: number): Omit<UserRecord, "password"> | undefined {
  return db
    .prepare(
      `SELECT id, name, email, phone, balance, address, createdAt FROM users WHERE id = ? LIMIT 1`
    )
    .get(id) as Omit<UserRecord, "password"> | undefined;
}

export function createUser({
  name,
  email,
  password,
  phone = "",
  address = "",
  balance = 0,
}: {
  name: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
  balance?: number;
}) {
  const now = new Date().toISOString();
  const result = db
    .prepare(
      `INSERT INTO users (name, email, password, phone, balance, address, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)`
    )
    .run(name.trim(), email.trim().toLowerCase(), password, phone.trim(), balance, address.trim(), now);

  return Number(result.lastInsertRowid);
}

export function updateUserById(
  id: number,
  payload: {
    name?: string;
    phone?: string;
    address?: string;
    balance?: number;
  },
) {
  const existing = db
    .prepare(`SELECT * FROM users WHERE id = ? LIMIT 1`)
    .get(id) as UserRecord | undefined;

  if (!existing) return null;

  const next = {
    name: payload.name ?? existing.name,
    phone: payload.phone ?? existing.phone,
    address: payload.address ?? existing.address,
    balance: payload.balance ?? existing.balance,
  };

  db.prepare(
    `UPDATE users SET name = ?, phone = ?, address = ?, balance = ? WHERE id = ?`
  ).run(next.name, next.phone, next.address, next.balance, id);

  return getUserById(id);
}

export function updatePasswordById(id: number, passwordHash: string) {
  db.prepare(`UPDATE users SET password = ? WHERE id = ?`).run(passwordHash, id);
  return true;
}

export function getDb() {
  return db;
}

export default db;
