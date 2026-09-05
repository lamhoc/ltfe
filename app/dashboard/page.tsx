"use client";
import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import StatCards from '../components/StatCards';
import MachineCard from '../components/MachineCard';
import RightPanel from '../components/RightPanel';
import AddMachineModal from '../components/AddMachineModal';
import { getMachines, updateMachine, getServices } from '../../lib/supabase';

export default function DashboardPage(){
  const [machines, setMachines] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAdd, setShowAdd] = useState(false);

  async function load(){
    setLoading(true);
    const m = await getMachines().catch(()=>[] as any[]);
    setMachines(m || []);
    setLoading(false);
  }

  useEffect(()=>{ load(); },[]);

  function computeStats(){
    const total = machines.length;
    const empty = machines.filter(m=>m.trang_thai==='trong').length;
    const active = machines.filter(m=>m.trang_thai==='dang_su_dung').length;
    const maintain = machines.filter(m=>m.trang_thai==='bao_tri').length;
    return [
      { label: 'Trống / Tổng máy', value: `${empty} / ${total}` },
      { label: 'Máy đang sử dụng', value: String(active) },
      { label: 'Máy bảo trì', value: String(maintain) },
      { label: 'Doanh thu ca hiện tại', value: '0 VND' },
    ];
  }

  async function handleAction(action:string, machine:any){
    if(action==='open'){
      await updateMachine(machine.id, { trang_thai: 'dang_su_dung', tai_khoan_hien_tai: 'guest' });
    } else if(action==='pay'){
      await updateMachine(machine.id, { trang_thai: 'trong', tai_khoan_hien_tai: null });
    } else if(action==='maintain'){
      await updateMachine(machine.id, { trang_thai: 'bao_tri', tai_khoan_hien_tai: null });
    } else if(action==='switch'){
      // simple switch: mark as empty
      await updateMachine(machine.id, { trang_thai: 'trong', tai_khoan_hien_tai: null });
    }
    await load();
  }

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar name="Quản lý" />
      <main className="flex-1 p-6">
        <div className="mb-4">
          <h1 className="text-2xl font-bold">Dashboard Quản lý Tiệm Net</h1>
          <p className="text-sm text-gray-600">Tổng quan hoạt động và quản lý máy</p>
        </div>

        <StatCards stats={computeStats()} onAdd={()=>setShowAdd(true)} />

        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2">
            <div className="grid grid-cols-3 gap-4">
              {loading ? <div>Loading...</div> : machines.map((m)=>(
                <MachineCard key={m.id} machine={m} onAction={handleAction} />
              ))}
            </div>
          </div>

          <div>
            <RightPanel machines={machines} onRefresh={load} />
          </div>
        </div>
      </main>

      {showAdd && <AddMachineModal onClose={()=>setShowAdd(false)} onAdded={load} />}
    </div>
  )
}
