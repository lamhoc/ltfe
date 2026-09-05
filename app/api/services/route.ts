import supabaseServer from '@/lib/supabaseServer';

export const runtime = 'nodejs';

export async function GET() {
  if (!supabaseServer) {
    return Response.json({ ok: false, error: 'Supabase server client not configured.' }, { status: 500 });
  }

  const { data, error } = await supabaseServer.from('dich_vu').select('*').order('id', { ascending: true });

  if (error) {
    return Response.json({ ok: false, error: error.message }, { status: 500 });
  }

  return Response.json({ services: data ?? [] });
}
