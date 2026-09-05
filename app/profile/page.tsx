'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useEffect, useState } from 'react';

type User = {
  id: number;
  name: string;
  email: string;
  phone: string;
  balance: number;
};

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [fieldError, setFieldError] = useState('');
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    async function loadProfile() {
      try {
        const response = await fetch('/api/profile', { cache: 'no-store' });
        if (!response.ok) {
          router.push('/login');
          return;
        }

        const data = await response.json();
        setUser(data.user);
      } catch (error) {
        router.push('/login');
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [router]);

  async function handleSave(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    setMessage('');
    setFieldError('');

    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
      });

      const data = await response.json();
      if (!response.ok) {
        setFieldError(data.error || 'Cập nhật thất bại.');
        return;
      }

      setMessage('Cập nhật thông tin cá nhân thành công.');
      setUser(data.user);
    } catch (error) {
      setFieldError('Không thể cập nhật thông tin.');
    } finally {
      setSaving(false);
    }
  }

  async function handlePasswordChange(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage('');
    setFieldError('');
    setChangingPassword(true);

    try {
      const response = await fetch('/api/profile/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(passwordForm),
      });

      const data = await response.json();
      if (!response.ok) {
        setFieldError(data.error || 'Đổi mật khẩu thất bại.');
        return;
      }

      setMessage('Đổi mật khẩu thành công.');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      setFieldError('Không thể đổi mật khẩu.');
    } finally {
      setChangingPassword(false);
    }
  }

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-100">
        <div className="text-lg font-medium text-slate-600">Đang tải hồ sơ...</div>
      </main>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-10 text-slate-800">
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="flex flex-col gap-4 rounded-3xl bg-white p-6 shadow-lg md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-600">Profile</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">Thông tin cá nhân</h1>
          </div>

          <div className="flex gap-3">
            <Link href="/dashboard" className="rounded-xl border border-slate-300 px-4 py-2 font-medium text-slate-700 hover:bg-slate-50">
              Trang chủ
            </Link>
            <button onClick={handleLogout} className="rounded-xl bg-slate-900 px-4 py-2 font-medium text-white hover:bg-slate-700">
              Đăng xuất
            </button>
          </div>
        </div>

        {message ? (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {message}
          </div>
        ) : null}

        {fieldError ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {fieldError}
          </div>
        ) : null}

        <div className="grid gap-8 lg:grid-cols-[1.4fr_0.9fr]">
          <form onSubmit={handleSave} className="rounded-3xl bg-white p-6 shadow-lg">
            <h2 className="mb-6 text-2xl font-bold text-slate-900">Cập nhật thông tin</h2>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-slate-700">Họ tên</label>
                <input
                  value={user.name}
                  onChange={(e) => setUser({ ...user, name: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Tên đăng nhập (email)</label>
                <input value={user.email} disabled className="w-full rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 text-slate-500" />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Số điện thoại</label>
                <input
                  value={user.phone}
                  onChange={(e) => setUser({ ...user, phone: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Số dư tài khoản (VND)</label>
                <input value={user.balance ?? 0} disabled className="w-full rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 text-slate-500" />
              </div>
            </div>

            <button type="submit" disabled={saving} className="mt-6 rounded-xl bg-sky-600 px-5 py-3 font-semibold text-white hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-sky-300">
              {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
            </button>
          </form>

          <form onSubmit={handlePasswordChange} className="rounded-3xl bg-white p-6 shadow-lg">
            <h2 className="mb-6 text-2xl font-bold text-slate-900">Đổi mật khẩu</h2>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Mật khẩu hiện tại</label>
                <input type="password" value={passwordForm.currentPassword} onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })} className="w-full rounded-xl border border-slate-300 px-4 py-3" />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Mật khẩu mới</label>
                <input type="password" value={passwordForm.newPassword} onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })} className="w-full rounded-xl border border-slate-300 px-4 py-3" />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Xác nhận mật khẩu mới</label>
                <input type="password" value={passwordForm.confirmPassword} onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })} className="w-full rounded-xl border border-slate-300 px-4 py-3" />
              </div>
            </div>

            <button type="submit" disabled={changingPassword} className="mt-6 w-full rounded-xl bg-violet-600 px-5 py-3 font-semibold text-white hover:bg-violet-700 disabled:cursor-not-allowed disabled:bg-violet-300">
              {changingPassword ? 'Đang đổi...' : 'Đổi mật khẩu'}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
