'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    balance: '0',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function onChange(key: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = { ...form, balance: Number(form.balance || 0) };
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Đăng ký thất bại.');
        return;
      }

      router.push('/dashboard');
      router.refresh();
    } catch (err) {
      setError('Không thể thực hiện đăng ký.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-10">
      <div className="mx-auto max-w-2xl rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">
        <div className="mb-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-violet-600">
            Join us
          </p>
          <h1 className="mt-3 text-3xl font-bold text-slate-900">Đăng ký tài khoản</h1>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-5 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-slate-700">Tên đăng nhập (email)</label>
            <input value={form.email} onChange={(e) => onChange('email', e.target.value)} type="email" className="w-full rounded-xl border border-slate-300 px-4 py-3" required />
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-slate-700">Họ tên</label>
            <input value={form.name} onChange={(e) => onChange('name', e.target.value)} className="w-full rounded-xl border border-slate-300 px-4 py-3" required />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Mật khẩu</label>
            <input type="password" value={form.password} onChange={(e) => onChange('password', e.target.value)} className="w-full rounded-xl border border-slate-300 px-4 py-3" required />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Xác nhận mật khẩu</label>
            <input type="password" value={form.confirmPassword} onChange={(e) => onChange('confirmPassword', e.target.value)} className="w-full rounded-xl border border-slate-300 px-4 py-3" required />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Số điện thoại</label>
            <input value={form.phone} onChange={(e) => onChange('phone', e.target.value)} className="w-full rounded-xl border border-slate-300 px-4 py-3" />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Số dư khởi tạo (VND)</label>
            <input value={form.balance} onChange={(e) => onChange('balance', e.target.value)} type="number" className="w-full rounded-xl border border-slate-300 px-4 py-3" />
          </div>

          {error ? (
            <div className="md:col-span-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </div>
          ) : null}

          <div className="md:col-span-2">
            <button type="submit" disabled={loading} className="w-full rounded-xl bg-violet-600 px-4 py-3 font-semibold text-white hover:bg-violet-700 disabled:cursor-not-allowed disabled:bg-violet-300">
              {loading ? 'Đang đăng ký...' : 'Đăng ký'}
            </button>
          </div>
        </form>

        <div className="mt-6 flex items-center justify-between text-sm text-slate-600">
          <span>Đã có tài khoản?</span>
          <Link href="/login" className="font-semibold text-violet-600 hover:text-violet-700">
            Đăng nhập
          </Link>
        </div>
      </div>
    </main>
  );
}
