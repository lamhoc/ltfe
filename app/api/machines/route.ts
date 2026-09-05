import supabaseServer from '@/lib/supabaseServer';

export const runtime = 'nodejs';

export async function GET() {
  if (!supabaseServer) {
    return Response.json({ ok: false, error: 'Supabase server client not configured.' }, { status: 500 });
  }

  const { data, error } = await supabaseServer.from('may_tinh').select('*').order('id', { ascending: true });

  if (error) {
    return Response.json({ ok: false, error: error.message }, { status: 500 });
  }

  return Response.json({ machines: data ?? [] });
}

export async function POST(request: Request) {
  if (!supabaseServer) {
    return Response.json({ ok: false, error: 'Supabase server client not configured.' }, { status: 500 });
  }

  const body = await request.json();
  const ten_may = String(body.ten_may ?? '').trim();

  if (!ten_may) {
    return Response.json({ ok: false, error: 'Tên máy không được để trống.' }, { status: 400 });
  }

  const { data, error } = await supabaseServer
    .from('may_tinh')
    .insert([{ ten_may, trang_thai: 'trong', tai_khoan_hien_tai: null }])
    .select();

  if (error) {
    return Response.json({ ok: false, error: error.message }, { status: 500 });
  }

  return Response.json({ ok: true, machine: data?.[0] ?? null });
}
