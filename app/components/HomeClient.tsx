"use client"

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

type User = {
  id: number;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  studentId?: string;
  className?: string;
};

export default function HomeClient({ user }: { user: User | null }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
      router.refresh();
    } catch (err) {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  if (!user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-sky-50 via-white to-violet-50 px-4 py-10">
        <div className="w-full max-w-3xl rounded-[32px] border border-slate-200 bg-white/80 p-8 shadow-2xl backdrop-blur-xl md:p-12">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-sky-600">Trang chủ</p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
            Chào mừng bạn đến với hệ thống tài khoản
          </h1>
          <p className="mt-4 text-lg text-slate-600">
            Hãy đăng nhập để quản lý thông tin cá nhân, đổi mật khẩu và cập nhật hồ sơ nhanh chóng.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/login" className="rounded-full bg-sky-600 px-6 py-3 font-semibold text-white transition hover:bg-sky-700">
              Đăng nhập
            </Link>
            <Link href="/register" className="rounded-full border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50">
              Đăng ký
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-10 text-slate-800">
      <div className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-600">Thông tin cá nhân</p>
            <h1 className="mt-1 text-2xl font-bold text-slate-900">Xin chào, {user.name}</h1>
            <p className="mt-1 text-sm text-slate-600">{user.email}</p>
          </div>

          <div className="flex gap-3">
            <Link href="/profile" className="rounded-xl border border-slate-300 px-4 py-2 font-medium text-slate-700 hover:bg-slate-50">
              Chỉnh sửa hồ sơ
            </Link>
            <button onClick={handleLogout} disabled={loading} className="rounded-xl bg-slate-900 px-4 py-2 font-medium text-white hover:bg-slate-700 disabled:opacity-50">
              {loading ? 'Đang đăng xuất...' : 'Đăng xuất'}
            </button>
          </div>
        </div>

        <div className="mt-6 space-y-4 rounded-2xl bg-slate-50 p-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <span className="text-slate-500">Số điện thoại</span>
            <strong className="text-lg font-semibold text-slate-900">{user.phone || '—'}</strong>
          </div>

          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <span className="text-slate-500">MSSV</span>
            <strong className="text-lg font-semibold text-slate-900">{user.studentId || '—'}</strong>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-500">Lớp</span>
            <strong className="text-lg font-semibold text-slate-900">{user.className || '—'}</strong>
          </div>
        </div>
      </div>
    </main>
  );
}
