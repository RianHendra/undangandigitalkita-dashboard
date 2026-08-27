import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Calendar, MessageSquare, Settings, LogOut, ExternalLink, Menu, X, CheckCircle, XCircle, Clock, TrendingUp } from 'lucide-react';

import Tamu from './Tamu';
import Rsvp from './Rsvp';
// import Pengaturan from './Pengaturan';

export default function Dashboard() {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState('overview');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // State untuk data statistik RSVP dari Google Sheets
  const [rsvpStatsList, setRsvpStatsList] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);

  // Ganti dengan URL Web App Apps Script Anda
  const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbw79k158qMN7B33Uw3dJuic654ArSVsG___TJt2004PRX-jLA7HvALkpp4NTm4svCs/exec';

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(SCRIPT_URL);
        if (response.ok) {
          const data = await response.json();
          setRsvpStatsList(data);
        }
      } catch (err) {
        console.error('Gagal memuat statistik:', err);
      } finally {
        setLoadingStats(false);
      }
    };
    fetchStats();
  }, []);

  // Hitung statistik otomatis dari data
  const totalRsvp = rsvpStatsList.length;
  const hadirCount = rsvpStatsList.filter(item => item.status.toLowerCase().includes('hadir') && !item.status.toLowerCase().includes('tidak')).length;
  const tidakHadirCount = rsvpStatsList.filter(item => item.status.toLowerCase().includes('tidak')).length;
  const belumKonfirmasiCount = totalRsvp - (hadirCount + tidakHadirCount);

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      
      {/* Mobile Top Navbar */}
      <div className="md:hidden bg-white border-b border-slate-200 px-4 py-3 flex justify-between items-center sticky top-0 z-30">
        <div>
          <span className="text-[10px] font-bold text-rose-600 tracking-widest uppercase">Platform</span>
          <h2 className="text-base font-bold text-slate-800">Undangan Kita</h2>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-slate-600">
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-slate-200 p-6 flex flex-col justify-between transition-transform duration-300 ease-in-out md:static md:translate-x-0
        ${isMobileMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}
      `}>
        <div>
          <div className="hidden md:block mb-8">
            <span className="text-xs font-bold text-rose-600 tracking-widest uppercase">Platform</span>
            <h2 className="text-lg font-bold text-slate-800">Undangan Kita</h2>
          </div>

          <nav className="space-y-1 mt-6 md:mt-0">
            <button
              onClick={() => { setActiveMenu('overview'); setIsMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all cursor-pointer ${activeMenu === 'overview' ? 'bg-rose-50 text-rose-600' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <Calendar size={18} /> Ringkasan
            </button>
            <button
              onClick={() => { setActiveMenu('tamu'); setIsMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all cursor-pointer ${activeMenu === 'tamu' ? 'bg-rose-50 text-rose-600' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <Users size={18} /> Data Tamu & Link
            </button>
            <button
              onClick={() => { setActiveMenu('rsvp'); setIsMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all cursor-pointer ${activeMenu === 'rsvp' ? 'bg-rose-50 text-rose-600' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <MessageSquare size={18} /> RSVP & Ucapan
            </button>
            {/* <button
              onClick={() => { setActiveMenu('pengaturan'); setIsMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all cursor-pointer ${activeMenu === 'pengaturan' ? 'bg-rose-50 text-rose-600' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <Settings size={18} /> Pengaturan
            </button> */}
          </nav>
        </div>

        <button onClick={handleLogout} className="flex items-center gap-2 px-3 py-2.5 text-red-600 hover:bg-red-50 rounded-xl font-medium text-sm transition-all w-full mt-6 cursor-pointer">
          <LogOut size={18} /> Keluar
        </button>
      </aside>

      {isMobileMenuOpen && (
        <div onClick={() => setIsMobileMenuOpen(false)} className="fixed inset-0 bg-black/20 z-30 md:hidden" />
      )}

      {/* Konten Utama */}
      <main className="flex-1 p-4 sm:p-6 md:p-10 overflow-y-auto">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Halo, Ery & Amel 👋</h1>
            <p className="text-slate-500 text-sm">Kelola seluruh kebutuhan undangan digital Anda di sini.</p>
          </div>
          <a
            href="https://www.undangandigitalkita.my.id/erydanamel"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 px-4 py-2 rounded-xl text-sm font-medium shadow-sm transition-all w-full sm:w-auto"
          >
            <span>Lihat Website</span>
            <ExternalLink size={16} />
          </a>
        </header>

        {/* Render Konten Halaman */}
        {activeMenu === 'overview' && (
          <div className="space-y-6">
            
            {/* Kartu Statistik Dinamis */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Total Respon RSVP</p>
                  <h3 className="text-3xl font-bold text-slate-800 mt-2">
                    {loadingStats ? '...' : totalRsvp}
                  </h3>
                </div>
                <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center">
                  <TrendingUp size={24} />
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-emerald-600 text-xs font-semibold uppercase tracking-wider">Akan Hadir</p>
                  <h3 className="text-3xl font-bold text-slate-800 mt-2">
                    {loadingStats ? '...' : hadirCount}
                  </h3>
                </div>
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                  <CheckCircle size={24} />
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-rose-600 text-xs font-semibold uppercase tracking-wider">Tidak Hadir</p>
                  <h3 className="text-3xl font-bold text-slate-800 mt-2">
                    {loadingStats ? '...' : tidakHadirCount}
                  </h3>
                </div>
                <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center">
                  <XCircle size={24} />
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-amber-600 text-xs font-semibold uppercase tracking-wider">Lainnya / Pending</p>
                  <h3 className="text-3xl font-bold text-slate-800 mt-2">
                    {loadingStats ? '...' : belumKonfirmasiCount}
                  </h3>
                </div>
                <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center">
                  <Clock size={24} />
                </div>
              </div>

            </div>

            {/* Quick Summary Preview Box */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-800 text-base">Aktivitas & Ucapan Terbaru</h3>
              {loadingStats ? (
                <p className="text-sm text-slate-400">Memuat data terbaru...</p>
              ) : rsvpStatsList.length > 0 ? (
                <div className="space-y-3">
                  {rsvpStatsList.slice(0, 3).map((item, idx) => (
                    <div key={idx} className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                      <div>
                        <span className="font-semibold text-slate-800 text-sm">{item.nama}</span>
                        <span className="text-xs text-slate-500 ml-2">({item.status})</span>
                        <p className="text-xs text-slate-600 italic mt-0.5">"{item.ucapan || 'Tidak ada ucapan'}"</p>
                      </div>
                      <span className="text-[11px] text-slate-400">{item.waktu}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-400">Belum ada data ucapan yang masuk.</p>
              )}
            </div>

          </div>
        )}

        {activeMenu === 'tamu' && <Tamu />}
        {activeMenu === 'rsvp' && <Rsvp />}
        {activeMenu === 'pengaturan' && <Pengaturan />}
      </main>
    </div>
  );
}