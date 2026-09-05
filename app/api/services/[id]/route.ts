import supabaseServer from '@/lib/supabaseServer';

export const runtime = 'nodejs';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!supabaseServer) {
    return Response.json({ ok: false, error: 'Supabase server client not configured.' }, { status: 500 });
  }

  const { id } = await params;
  const body = await request.json();
  const qty = Number(body.qty ?? 0);

  if (!Number.isFinite(qty) || qty <= 0) {
    return Response.json({ ok: false, error: 'Số lượng không hợp lệ.' }, { status: 400 });
  }

  const { data: current, error: currentErr } = await supabaseServer.from('dich_vu').select('*').eq('id', Number(id)).limit(1).single();

  if (currentErr || !current) {
    return Response.json({ ok: false, error: currentErr?.message ?? 'Không tìm thấy dịch vụ.' }, { status: 404 });
  }

  const newQty = Math.max((Number(current.so_luong_ton ?? 0) - qty), 0);

  const { data, error } = await supabaseServer
    .from('dich_vu')
    .update({ so_luong_ton: newQty })
    .eq('id', Number(id))
    .select();

  if (error) {
    return Response.json({ ok: false, error: error.message }, { status: 500 });
  }

  return Response.json({ ok: true, service: data?.[0] ?? null });
}
