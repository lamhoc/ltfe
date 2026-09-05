"use client";
import React, { useState } from 'react';
import { addMachine } from '../../lib/supabase';

export default function AddMachineModal({onClose, onAdded}:{onClose:()=>void; onAdded:()=>void}){
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(){
    setLoading(true);
    await addMachine({ ten_may: name }).catch(()=>{});
    setLoading(false);
    onAdded();
    onClose();
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40">
      <div className="bg-white p-4 rounded w-96">
        <h3 className="font-semibold">Thêm máy mới</h3>
        <input value={name} onChange={(e)=>setName(e.target.value)} placeholder="Tên máy" className="w-full p-2 border rounded my-2" />
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-3 py-1">Hủy</button>
          <button onClick={submit} disabled={!name||loading} className="px-3 py-1 bg-blue-600 text-white rounded">{loading? '...' : 'Thêm'}</button>
        </div>
      </div>
    </div>
  )
}
