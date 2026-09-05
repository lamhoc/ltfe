"use client";
import React from 'react';
import Link from 'next/link';
import { Home, Cpu, Coffee, Users, User } from 'lucide-react';

const items = [
  { href: '/dashboard', label: 'Trang chủ / Tổng quan', icon: Home },
  { href: '/machines', label: 'Quản lý máy (Client)', icon: Cpu },
  { href: '/services', label: 'Quản lý dịch vụ (F&B)', icon: Coffee },
  { href: '/accounts', label: 'Quản lý tài khoản', icon: Users },
  { href: '/profile', label: 'Hồ sơ', icon: User },
];

export default function Sidebar({ name = 'Admin' }: { name?: string }) {
  return (
    <aside className="w-64 bg-white border-r h-screen p-4 flex flex-col">
      <div className="mb-6">
        <div className="text-xl font-bold">CyberManager</div>
        <div className="text-sm text-green-600">System Online</div>
      </div>

      <nav className="flex-1">
        <ul className="space-y-2">
          {items.map(({ href, label, icon: Icon }) => (
            <li key={label}>
              <Link href={href} className="flex items-center gap-2 px-2 py-2 rounded hover:bg-gray-100 text-gray-700">
                <Icon size={16} />
                <span>{label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-4 pt-4 border-t">
        <div className="text-xs text-gray-500">Vai trò</div>
        <div className="text-sm font-semibold">Quản trị viên</div>
        <div className="text-xs text-gray-600">{name}</div>
      </div>
    </aside>
  );
}
