import supabaseServer from '@/lib/supabaseServer';
import { updateUserById, getUserById } from '@/lib/db';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const accountId = Number(body.accountId || 0);
    const amount = Number(body.amount || 0);

    if (!accountId || !amount) {
      return Response.json({ ok: false, error: 'accountId and amount required' }, { status: 400 });
    }

    if (supabaseServer) {
      // update on Supabase
      const { data: account, error: selErr } = await supabaseServer.from('tai_khoan').select('*').eq('id', accountId).single();
      if (selErr) return Response.json({ ok: false, error: selErr.message }, { status: 400 });
      const newBalance = (account.balance ?? 0) + amount;
      const { error: updErr } = await supabaseServer.from('tai_khoan').update({ balance: newBalance }).eq('id', accountId);
      if (updErr) return Response.json({ ok: false, error: updErr.message }, { status: 500 });
      return Response.json({ ok: true, balance: newBalance });
    }

    // fallback to local sqlite
    const user = getUserById(accountId);
    if (!user) return Response.json({ ok: false, error: 'local user not found' }, { status: 404 });
    const updated = updateUserById(accountId, { balance: (user.balance ?? 0) + amount });
    return Response.json({ ok: true, balance: updated?.balance ?? null });
  } catch (err: any) {
    return Response.json({ ok: false, error: String(err.message || err) }, { status: 500 });
  }
}
