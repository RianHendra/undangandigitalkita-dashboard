import React, { useState } from 'react';
import { Save, CheckCircle2 } from 'lucide-react';

export default function Pengaturan() {
  const [formData, setFormData] = useState({
    groom: 'Ery',
    bride: 'Amel',
    slug: 'erydanamel',
    date: '2026-10-15',
  });

  const [isSaved, setIsSaved] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = (e) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Pengaturan Undangan</h1>
        <p className="text-slate-500 text-sm">Sesuaikan informasi mempelai, tanggal acara, dan detail slug URL</p>
      </div>

      {isSaved && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-emerald-800 flex items-center gap-3 text-sm">
          <CheckCircle2 size={20} className="text-emerald-600 shrink-0" />
          <span>Perubahan berhasil disimpan! Data telah diperbarui.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
        <h3 className="font-bold text-slate-800 text-base pb-3 border-b border-slate-100">Informasi Utama Mempelai</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nama Pengantin Pria</label>
            <input 
              type="text" 
              name="groom"
              value={formData.groom}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nama Pengantin Wanita</label>
            <input 
              type="text" 
              name="bride"
              value={formData.bride}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500" 
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">URL Slug Undangan</label>
            <input 
              type="text" 
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 font-mono text-xs text-slate-600" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Tanggal Acara Utama</label>
            <input 
              type="date" 
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 text-slate-600" 
            />
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button 
            type="submit"
            className="bg-rose-600 hover:bg-rose-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 transition-all shadow-md shadow-rose-600/20 cursor-pointer"
          >
            <Save size={16} /> Simpan Perubahan
          </button>
        </div>
      </form>
    </div>
  );
}