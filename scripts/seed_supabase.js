const { createClient } = require('@supabase/supabase-js');
// load .env if dotenv is available, but don't crash if it's not installed
try {
  // eslint-disable-next-line global-require
  require('dotenv').config();
} catch (e) {}

// If dotenv wasn't available, attempt to read .env.local manually
if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  try {
    const fs = require('fs');
    const path = require('path');
    const envPath = path.join(process.cwd(), '.env.local');
    if (fs.existsSync(envPath)) {
      const raw = fs.readFileSync(envPath, 'utf8');
      raw.split(/\r?\n/).forEach(line => {
        const m = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
        if (m) {
          const key = m[1];
          let val = m[2] || '';
          // remove surrounding quotes
          if (val.startsWith("\'") && val.endsWith("\'")) val = val.slice(1, -1);
          if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
          if (!process.env[key]) process.env[key] = val;
        }
      });
    }
  } catch (e) {}
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !key) {
  console.error('Missing Supabase URL or key in environment. Copy .env.local.example to .env.local and set keys.');
  process.exit(1);
}

const supabase = createClient(url, key);

async function seed() {
  try {
    console.log('Seeding may_tinh...');
    await supabase.from('may_tinh').upsert([
      { ten_may: 'Máy 01', trang_thai: 'trong' },
      { ten_may: 'Máy 02', trang_thai: 'dang_su_dung' },
      { ten_may: 'Máy VIP 01', trang_thai: 'bao_tri' },
    ], { onConflict: ['ten_may'] });

    console.log('Seeding dich_vu...');
    await supabase.from('dich_vu').upsert([
      { ten_dv: 'Mì tôm', gia: 15000, so_luong_ton: 20 },
      { ten_dv: 'Coca', gia: 12000, so_luong_ton: 30 },
      { ten_dv: 'Sting', gia: 12000, so_luong_ton: 15 },
    ], { onConflict: ['ten_dv'] });

    console.log('Seed complete.');
    process.exit(0);
  } catch (err) {
    console.error('Seed failed:', err.message || err);
    process.exit(2);
  }
}

seed();
