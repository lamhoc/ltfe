import { supabase } from '@/lib/supabase';
import supabaseServer from '@/lib/supabaseServer';

export const runtime = 'nodejs';

export async function GET() {
  const client = supabaseServer ?? supabase;

  if (!client) {
    return Response.json({ ok: false, message: 'Supabase client not configured (missing env variables).' }, { status: 500 });
  }

  try {
    const [{ data: machines, error: mErr }, { data: services, error: sErr }] = await Promise.all([
      client.from('may_tinh').select('*').limit(10),
      client.from('dich_vu').select('*').limit(10),
    ]);

    return Response.json({ ok: true, machines: machines ?? null, services: services ?? null, errors: { mErr: mErr?.message ?? null, sErr: sErr?.message ?? null }, using: supabaseServer ? 'service' : 'anon' });
  } catch (err) {
    return Response.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
