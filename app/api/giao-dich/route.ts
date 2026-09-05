import supabaseServer from '@/lib/supabaseServer';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  if (!supabaseServer) {
    return Response.json({ ok: false, error: 'Supabase server client not configured.' }, { status: 500 });
  }

  const body = await request.json();
  const payload = {
    machine_id: body.machine_id ?? null,
    service_id: body.service_id ?? null,
    qty: Number(body.qty ?? 0),
    at: body.at ?? new Date().toISOString(),
    amount: body.amount ?? null,
  };

  if (!payload.machine_id || !payload.service_id) {
    return Response.json({ ok: false, error: 'Thiếu máy hoặc dịch vụ.' }, { status: 400 });
  }

  const { data, error } = await supabaseServer.from('giao_dich').insert([payload]).select();

  if (error) {
    return Response.json({ ok: false, error: error.message }, { status: 500 });
  }

  return Response.json({ ok: true, transaction: data?.[0] ?? null });
}
