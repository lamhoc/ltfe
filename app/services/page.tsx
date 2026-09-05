"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function ServicesPage() {
  const [services, setServices] = useState<any[]>([]);

  async function load() {
    const res = await fetch('/api/services', { cache: 'no-store' });
    const data = await res.json();
    setServices(data.services ?? []);
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-600">Quản lý dịch vụ</p>
            <h1 className="text-3xl font-bold text-slate-900">Dịch vụ & F&B</h1>
          </div>
          <Link href="/dashboard" className="rounded-xl border border-slate-300 bg-white px-4 py-2 font-medium text-slate-700 hover:bg-slate-50">
            Về dashboard
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {services.map((service) => (
            <div key={service.id} className="rounded-2xl bg-white p-5 shadow">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-900">{service.ten_dv}</h3>
                <span className="rounded-full bg-violet-100 px-2 py-1 text-xs font-semibold text-violet-700">
                  {service.so_luong_ton ?? 0} còn
                </span>
              </div>
              <p className="mt-3 text-lg font-semibold text-sky-700">{Number(service.gia ?? 0).toLocaleString('vi-VN')} VND</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
