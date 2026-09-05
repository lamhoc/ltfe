#!/usr/bin/env node
const path = require('path');
const fs = require('fs');
const Database = require('better-sqlite3');

const dbPath = path.join(process.cwd(), 'data', 'app.db');

if (!fs.existsSync(dbPath)) {
  console.error('Local database not found at', dbPath);
  console.error('If you want to recreate DB, run the app or delete the file to let it be recreated.');
  process.exit(1);
}

const db = new Database(dbPath);

// ensure may_tinh table exists (mimic supabase schema)
db.exec(`
  CREATE TABLE IF NOT EXISTS may_tinh (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ten_may TEXT NOT NULL,
    trang_thai TEXT NOT NULL DEFAULT 'trong',
    tai_khoan_hien_tai TEXT
  );
`);

function listMachines() {
  const rows = db.prepare('SELECT id, ten_may, trang_thai, tai_khoan_hien_tai FROM may_tinh ORDER BY id').all();
  console.log('Machines:', rows.length);
  rows.forEach(r => console.log(`#${r.id} -`, r.ten_may, '-', r.trang_thai, r.tai_khoan_hien_tai || ''));
}

console.log('Before insert:');
listMachines();

const stmt = db.prepare('INSERT INTO may_tinh (ten_may, trang_thai) VALUES (?, ?)');
const info = stmt.run('Máy TEST ' + Date.now(), 'trong');
console.log('Inserted id', info.lastInsertRowid);

console.log('After insert:');
listMachines();

db.close();
