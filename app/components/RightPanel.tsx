"use client";
import React, { useEffect, useState } from 'react';
import { getServices, reduceServiceStock, createTransaction } from '../../lib/supabase';

export default function RightPanel({ machines, onRefresh }:{machines:any[]; onRefresh:()=>void}){
  const [services, setServices] = useState<any[]>([]);
  const [selectedMachine, setSelectedMachine] = useState<string | number | null>(machines?.[0]?.id ?? null);
  const [selectedService, setSelectedService] = useState<number | null>(null);
  const [qty, setQty] = useState<number>(1);

  useEffect(()=>{ getServices().then(s=>setServices(s as any[])).catch(()=>{}); },[]);

  async function addToMachine(){
    if (!selectedMachine || !selectedService) return;
    await reduceServiceStock(selectedService, qty).catch(()=>{});
    await createTransaction({ machine_id: selectedMachine, service_id: selectedService, qty, at: new Date().toISOString() });
    onRefresh();
  }

  return (
    <aside className="w-80 p-4 bg-white rounded shadow">
      <h3 className="font-semibold mb-2">Gọi dịch vụ / Bán hàng nhanh</h3>
      <div className="space-y-2">
        <label className="text-xs">Chọn máy</label>
        <select value={String(selectedMachine ?? '')} onChange={(e)=>setSelectedMachine(e.target.value)} className="w-full p-2 border rounded">
          {machines.map(m=>(<option key={m.id} value={m.id}>{m.ten_may} ({m.trang_thai})</option>))}
        </select>

        <label className="text-xs">Chọn món</label>
        <select value={String(selectedService ?? '')} onChange={(e)=>setSelectedService(Number(e.target.value))} className="w-full p-2 border rounded">
          <option value="">-- Chọn --</option>
          {services.map(s=>(<option key={s.id} value={s.id}>{s.ten_dv} - {s.gia} VND</option>))}
        </select>

        <label className="text-xs">Số lượng</label>
        <input type="number" value={qty} onChange={(e)=>setQty(Number(e.target.value))} className="w-full p-2 border rounded" />

        <button onClick={addToMachine} className="w-full bg-blue-600 text-white p-2 rounded">Thêm vào hóa đơn máy</button>
      </div>

      <hr className="my-4" />
      <h3 className="font-semibold mb-2">Nạp tiền nhanh</h3>
      <div className="space-y-2">
        <input placeholder="Tài khoản hoặc máy" className="w-full p-2 border rounded" />
        <input placeholder="Số tiền" className="w-full p-2 border rounded" />
        <button className="w-full bg-green-600 text-white p-2 rounded">Nạp tiền</button>
      </div>
    </aside>
  )
}
