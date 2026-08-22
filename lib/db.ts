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
    address TEXT DEFAULT '',
    studentId TEXT DEFAULT '',
    className TEXT DEFAULT '',
    createdAt TEXT NOT NULL
  );
`);

export type UserRecord = {
  id: number;
  name: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  studentId: string;
  className: string;
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
      `SELECT id, name, email, password, phone, address, studentId, className, createdAt FROM users WHERE id = ? LIMIT 1`
    )
    .get(id) as UserRecord | undefined;
}

export function getPublicUserById(id: number): Omit<UserRecord, "password"> | undefined {
  return db
    .prepare(
      `SELECT id, name, email, phone, address, studentId, className, createdAt FROM users WHERE id = ? LIMIT 1`
    )
    .get(id) as Omit<UserRecord, "password"> | undefined;
}

export function createUser({
  name,
  email,
  password,
  phone = "",
  address = "",
  studentId = "",
  className = "",
}: {
  name: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
  studentId?: string;
  className?: string;
}) {
  const now = new Date().toISOString();
  const result = db
    .prepare(
      `INSERT INTO users (name, email, password, phone, address, studentId, className, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .run(name.trim(), email.trim().toLowerCase(), password, phone.trim(), address.trim(), studentId.trim(), className.trim(), now);

  return Number(result.lastInsertRowid);
}

export function updateUserById(
  id: number,
  payload: {
    name?: string;
    phone?: string;
    address?: string;
    studentId?: string;
    className?: string;
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
    studentId: payload.studentId ?? existing.studentId,
    className: payload.className ?? existing.className,
  };

  db.prepare(
    `UPDATE users SET name = ?, phone = ?, address = ?, studentId = ?, className = ? WHERE id = ?`
  ).run(next.name, next.phone, next.address, next.studentId, next.className, id);

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
