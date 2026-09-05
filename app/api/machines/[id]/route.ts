import supabaseServer from '@/lib/supabaseServer';

export const runtime = 'nodejs';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!supabaseServer) {
    return Response.json({ ok: false, error: 'Supabase server client not configured.' }, { status: 500 });
  }

  const { id } = await params;
  const body = await request.json();
  const update: Record<string, any> = {};

  if ('ten_may' in body) update.ten_may = String(body.ten_may ?? '').trim();
  if ('trang_thai' in body) update.trang_thai = String(body.trang_thai ?? 'trong');
  if ('tai_khoan_hien_tai' in body) update.tai_khoan_hien_tai = body.tai_khoan_hien_tai ?? null;

  if (Object.keys(update).length === 0) {
    return Response.json({ ok: false, error: 'Không có dữ liệu cập nhật.' }, { status: 400 });
  }

  const { data, error } = await supabaseServer
    .from('may_tinh')
    .update(update)
    .eq('id', Number(id))
    .select();

  if (error) {
    return Response.json({ ok: false, error: error.message }, { status: 500 });
  }

  return Response.json({ ok: true, machine: data?.[0] ?? null });
}
