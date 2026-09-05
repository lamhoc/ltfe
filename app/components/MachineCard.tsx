"use client";
import React from 'react';

function formatStatus(status: string) {
  const map: Record<string, string> = {
    trong: 'Trống',
    dang_su_dung: 'Đang sử dụng',
    bao_tri: 'Bảo trì',
  };
  return map[status] ?? status.replace(/_/g, ' ');
}

export default function MachineCard({machine, onAction}:{machine:any; onAction:(action:string,machine:any)=>void}){
  const status = machine.trang_thai;
  const color = status === 'trong' ? 'bg-green-100 text-green-700' : status === 'dang_su_dung' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600';

  return (
    <div className="p-4 bg-white rounded shadow">
      <div className="flex justify-between items-start gap-4">
        <div className="min-w-0 flex-1">
          <div className="font-semibold text-lg truncate">{machine.ten_may}</div>
          <div className={`mt-1 inline-block px-2 py-0.5 rounded text-sm ${color}`}>{formatStatus(status)}</div>
          {machine.tai_khoan_hien_tai && <div className="mt-2 text-xs text-gray-600">{machine.tai_khoan_hien_tai} • 45 phút</div>}
        </div>
        <div className="flex flex-col gap-2">
          <button onClick={()=>onAction('open',machine)} className="px-2 py-1 bg-blue-600 text-white rounded text-sm">Mở máy</button>
          <button onClick={()=>onAction('switch',machine)} className="px-2 py-1 bg-yellow-500 text-white rounded text-sm">Đổi máy</button>
          <button onClick={()=>onAction('pay',machine)} className="px-2 py-1 bg-green-600 text-white rounded text-sm">Thanh toán</button>
          <button onClick={()=>onAction('maintain',machine)} className="px-2 py-1 bg-gray-500 text-white rounded text-sm">Bảo trì</button>
        </div>
      </div>
    </div>
  )
}
