"use client";
import React from 'react';
import { Plus } from 'lucide-react';

export default function StatCards({ stats, onAdd }:{ stats: { label:string; value:string }[]; onAdd: ()=>void }){
  return (
    <div className="grid grid-cols-4 gap-4 mb-6">
      {stats.map((s, idx)=>(
        <div key={idx} className="p-4 bg-white rounded shadow flex items-center justify-between gap-3">
          <div>
            <div className="text-xs text-gray-500">{s.label}</div>
            <div className="text-2xl font-bold">{s.value}</div>
          </div>
          {idx===0 && (
            <button onClick={onAdd} className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded">
              <Plus size={14}/> Thêm máy mới
            </button>
          )}
        </div>
      ))}
    </div>
  )
}
