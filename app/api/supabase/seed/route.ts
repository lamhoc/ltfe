import supabaseServer from '@/lib/supabaseServer';

export const runtime = 'nodejs';

export async function POST() {
  if (!supabaseServer) {
    return Response.json({ ok: false, error: 'SUPABASE_SERVICE_ROLE_KEY not configured on server.' }, { status: 400 });
  }

  try {
    await supabaseServer.from('may_tinh').upsert([
      { ten_may: 'Máy 01', trang_thai: 'trong' },
      { ten_may: 'Máy 02', trang_thai: 'dang_su_dung' },
      { ten_may: 'Máy VIP 01', trang_thai: 'bao_tri' },
    ], { onConflict: 'ten_may' });

    await supabaseServer.from('dich_vu').upsert([
      { ten_dv: 'Mì tôm', gia: 15000, so_luong_ton: 20 },
      { ten_dv: 'Coca', gia: 12000, so_luong_ton: 30 },
      { ten_dv: 'Sting', gia: 12000, so_luong_ton: 15 },
    ], { onConflict: 'ten_dv' });

    return Response.json({ ok: true, message: 'Seed complete' });
  } catch (err: any) {
    return Response.json({ ok: false, error: String(err.message || err) }, { status: 500 });
  }
}
