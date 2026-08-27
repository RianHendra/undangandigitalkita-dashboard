import React, { useState, useEffect } from 'react';
import { Download, CheckCircle, XCircle, Search, RefreshCw, AlertCircle } from 'lucide-react';

export default function Rsvp() {
  const [rsvpList, setRsvpList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Masukkan Web App URL Google Apps Script Anda di sini
  const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbw79k158qMN7B33Uw3dJuic654ArSVsG___TJt2004PRX-jLA7HvALkpp4NTm4svCs/exec';

  const fetchRsvpData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(SCRIPT_URL);
      if (!response.ok) throw new Error('Gagal mengambil data dari Google Sheets');
      const data = await response.json();
      setRsvpList(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRsvpData();
  }, []);

  // Filter pencarian berdasarkan nama tamu
  const filteredRsvp = rsvpList.filter(item => 
    item.nama.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Simulasi Export CSV / Excel
  const handleExport = () => {
    alert('Simulasi: Data RSVP berhasil di-export ke format CSV/Excel!');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">RSVP & Ucapan Tamu</h1>
          <p className="text-slate-500 text-sm">Data masuk secara otomatis dari Google Sheets</p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button 
            onClick={fetchRsvpData}
            className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-3 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition-all shadow-sm cursor-pointer"
            title="Refresh Data"
          >
            <RefreshCw size={16} className={loading ? "animate-spin text-rose-600" : ""} />
            <span>Refresh</span>
          </button>
          <button 
            onClick={handleExport}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition-all shadow-sm cursor-pointer flex-1 sm:flex-none justify-center"
          >
            <Download size={16} /> Export
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 text-rose-800 flex items-center gap-3 text-sm">
          <AlertCircle size={20} className="text-rose-600 shrink-0" />
          <span>Gagal memuat data: {error}. Pastikan URL Apps Script sudah benar.</span>
        </div>
      )}

      {/* Tabel RSVP */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search size={16} />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama tamu..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>
          <span className="text-xs text-slate-400 font-medium">Total Masuk: {rsvpList.length}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-200 text-slate-500 font-semibold">
                <th className="p-4">Nama Tamu</th>
                <th className="p-4">Status Kehadiran</th>
                <th className="p-4">Jumlah Hadir</th>
                <th className="p-4">Ucapan & Doa</th>
                <th className="p-4">Waktu</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-slate-400 text-sm">
                    Memuat data dari Google Sheets...
                  </td>
                </tr>
              ) : filteredRsvp.length > 0 ? (
                filteredRsvp.map((item, index) => (
                  <tr key={index} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 font-medium">{item.nama}</td>
                    <td className="p-4">
                      {item.status.toLowerCase().includes('hadir') && !item.status.toLowerCase().includes('tidak') ? (
                        <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-semibold">
                          <CheckCircle size={14} /> {item.status}
                        </span>
                      ) : item.status.toLowerCase().includes('tidak') ? (
                        <span className="inline-flex items-center gap-1.5 bg-rose-50 text-rose-700 px-3 py-1 rounded-full text-xs font-semibold">
                          <XCircle size={14} /> {item.status}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-xs font-semibold">
                          {item.status || 'Belum Konfirmasi'}
                        </span>
                      )}
                    </td>
                    <td className="p-4">{item.jumlah ? `${item.jumlah} Orang` : '-'}</td>
                    <td className="p-4 text-slate-500 italic max-w-xs truncate">"{item.ucapan || '-'}"</td>
                    <td className="p-4 text-slate-400 text-xs">{item.waktu}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-slate-400 text-sm">
                    Belum ada data RSVP yang masuk dari Google Sheets.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}