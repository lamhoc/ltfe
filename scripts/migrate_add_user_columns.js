#!/usr/bin/env node
const path = require('path');
const fs = require('fs');
const Database = require('better-sqlite3');

const dbPath = path.join(process.cwd(), 'data', 'app.db');

if (!fs.existsSync(dbPath)) {
  console.error('Database file not found at', dbPath);
  process.exit(1);
}

const db = new Database(dbPath);

try {
  const cols = db.prepare("PRAGMA table_info('users')").all();
  const names = cols.map(c => c.name);

  if (!names.includes('balance')) {
    console.log('Adding column `balance` to users...');
    db.prepare("ALTER TABLE users ADD COLUMN balance INTEGER DEFAULT 0").run();
    console.log('Added `balance`.');
  } else {
    console.log('Column `balance` already exists.');
  }

  if (!names.includes('address')) {
    console.log('Adding column `address` to users...');
    db.prepare("ALTER TABLE users ADD COLUMN address TEXT DEFAULT ''").run();
    console.log('Added `address`.');
  } else {
    console.log('Column `address` already exists.');
  }

  console.log('Migration completed.');
} catch (err) {
  console.error('Migration failed:', err);
  process.exit(2);
} finally {
  db.close();
}
