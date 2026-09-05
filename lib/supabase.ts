import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

export const supabase: SupabaseClient | null =
  supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

const MOCK_KEY = 'cyber_manager_mock';

async function readJson<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

type MayTinh = {
  id: number | string;
  ten_may: string;
  trang_thai: 'trong' | 'dang_su_dung' | 'bao_tri';
  tai_khoan_hien_tai?: string | null;
};

type DichVu = { id: number | string; ten_dv: string; gia: number; so_luong_ton?: number };

function readMock(): { may_tinh: MayTinh[]; dich_vu: DichVu[] } {
  try {
    const raw = globalThis?.localStorage?.getItem(MOCK_KEY);
    if (!raw) throw new Error('no mock');
    return JSON.parse(raw);
  } catch {
    const initial: { may_tinh: MayTinh[]; dich_vu: DichVu[] } = {
      may_tinh: [
        { id: 1, ten_may: 'Máy 01', trang_thai: 'trong' },
        { id: 2, ten_may: 'Máy 02', trang_thai: 'dang_su_dung', tai_khoan_hien_tai: 'user_a' },
        { id: 3, ten_may: 'Máy VIP 01', trang_thai: 'bao_tri' },
      ],
      dich_vu: [
        { id: 1, ten_dv: 'Mì tôm', gia: 15000, so_luong_ton: 20 },
        { id: 2, ten_dv: 'Coca', gia: 12000, so_luong_ton: 30 },
        { id: 3, ten_dv: 'Sting', gia: 12000, so_luong_ton: 15 },
      ],
    };
    try {
      globalThis?.localStorage?.setItem(MOCK_KEY, JSON.stringify(initial));
    } catch {}
    return initial;
  }
}

function writeMock(payload: { may_tinh?: MayTinh[]; dich_vu?: DichVu[] }) {
  const cur = readMock();
  const next = { ...cur, ...payload } as any;
  try {
    globalThis?.localStorage?.setItem(MOCK_KEY, JSON.stringify(next));
  } catch {}
}

export async function getMachines() {
  const data = await readJson<{ machines?: MayTinh[] }>('/api/machines');
  if (data && Array.isArray(data.machines)) return data.machines;
  if (supabase) {
    const { data: list, error } = await supabase.from('may_tinh').select('*').order('id', { ascending: true });
    if (error) throw error;
    return list ?? [];
  }
  return readMock().may_tinh;
}

export async function addMachine(payload: { ten_may: string }) {
  const data = await readJson<{ machine?: any }>('/api/machines');
  if (data && data.machine) return data.machine;
  const res = await fetch('/api/machines', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Failed to add machine');
  }
  const json = await res.json();
  return json.machine ?? json;
}

export async function updateMachine(id: number | string, changes: Partial<MayTinh>) {
  const res = await fetch(`/api/machines/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(changes),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Failed to update machine');
  }
  const json = await res.json();
  return json.machine ?? json;
}

export async function getServices() {
  const data = await readJson<{ services?: DichVu[] }>('/api/services');
  if (data && Array.isArray(data.services)) return data.services;
  if (supabase) {
    const { data: list, error } = await supabase.from('dich_vu').select('*').order('id', { ascending: true });
    if (error) throw error;
    return list ?? [];
  }
  return readMock().dich_vu;
}

export async function reduceServiceStock(id: number | string, qty: number) {
  const res = await fetch(`/api/services/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ qty }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Failed to reduce stock');
  }
  const json = await res.json();
  return json.service ?? json;
}

export async function createTransaction(payload: any) {
  const res = await fetch('/api/giao-dich', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Failed to create transaction');
  }
  return res.json();
}

export default {
  supabase,
  getMachines,
  addMachine,
  updateMachine,
  getServices,
  reduceServiceStock,
  createTransaction,
};
