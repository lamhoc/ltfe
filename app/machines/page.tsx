"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function MachinesPage() {
  const [machines, setMachines] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  async function load() {
    const res = await fetch('/api/machines', { cache: 'no-store' });
    const data = await res.json();
    setMachines(data.machines ?? []);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleAdd() {
    if (!name.trim()) return;
    setLoading(true);
    await fetch('/api/machines', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ten_may: name.trim() }),
    });
    setName('');
    setLoading(false);
    await load();
  }

  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-600">Quản lý máy</p>
            <h1 className="text-3xl font-bold text-slate-900">Danh sách máy</h1>
          </div>
          <Link href="/dashboard" className="rounded-xl border border-slate-300 bg-white px-4 py-2 font-medium text-slate-700 hover:bg-slate-50">
            Về dashboard
          </Link>
        </div>

        <div className="rounded-3xl bg-white p-5 shadow">
          <div className="flex gap-3">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Tên máy mới"
              className="flex-1 rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
            />
            <button onClick={handleAdd} disabled={loading || !name.trim()} className="rounded-xl bg-sky-600 px-5 py-3 font-semibold text-white disabled:opacity-50">
              {loading ? 'Đang thêm...' : 'Thêm máy'}
            </button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {machines.map((machine) => (
            <div key={machine.id} className="rounded-2xl bg-white p-5 shadow">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-900">{machine.ten_may}</h3>
                <span className={`rounded-full px-2 py-1 text-xs font-semibold ${
                  machine.trang_thai === 'trong' ? 'bg-emerald-100 text-emerald-700' :
                  machine.trang_thai === 'dang_su_dung' ? 'bg-red-100 text-red-700' : 'bg-gray-200 text-gray-700'
                }`}>
                  {machine.trang_thai === 'trong' ? 'Trống' : machine.trang_thai === 'dang_su_dung' ? 'Đang sử dụng' : 'Bảo trì'}
                </span>
              </div>
              <p className="mt-3 text-sm text-slate-600">Tài khoản hiện tại: {machine.tai_khoan_hien_tai || '—'}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
