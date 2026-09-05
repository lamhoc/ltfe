"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<any[]>([]);

  async function load() {
    const res = await fetch('/api/profile', { cache: 'no-store' });
    const data = await res.json();
    setAccounts(data.user ? [data.user] : []);
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">Quản lý tài khoản</p>
            <h1 className="text-3xl font-bold text-slate-900">Tài khoản người dùng</h1>
          </div>
          <Link href="/dashboard" className="rounded-xl border border-slate-300 bg-white px-4 py-2 font-medium text-slate-700 hover:bg-slate-50">
            Về dashboard
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {accounts.map((user) => (
            <div key={user.id} className="rounded-2xl bg-white p-5 shadow">
              <h3 className="text-xl font-bold text-slate-900">{user.name}</h3>
              <div className="mt-4 space-y-2 text-sm text-slate-600">
                <p>Email: {user.email}</p>
                <p>Số điện thoại: {user.phone || '—'}</p>
                <p>Số dư: <span className="font-semibold text-emerald-700">{Number(user.balance ?? 0).toLocaleString('vi-VN')} VND</span></p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
