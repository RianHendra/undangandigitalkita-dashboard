import React, { useState, useEffect } from 'react';
import { Users, Plus, Copy, Search, Check, Trash2, MessageCircle, FileText, Send, Save } from 'lucide-react';

export default function Tamu() {
  const [tamuList, setTamuList] = useState([
    { id: 1, name: 'Rian Hendra Saputra', phone: '087716555618' },
  
  ]);

  const [newGuestName, setNewGuestName] = useState('');
  const [newGuestPhone, setNewGuestPhone] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saveStatus, setSaveStatus] = useState(false);

  // Default template awal jika belum pernah disimpan
  const defaultTemplate = 
`Assalamu’alaikum Wr. Wb.

Yth. Ibu/Bapak/Saudara/i *{nama}*,

Dengan penuh kebahagiaan, kami mengundang Ibu/Bapak/Saudara/i untuk hadir di acara *Akad Pernikahan Ery & Amel*. 💍✨

📅 Sabtu, 05 September 2026
🕘 Pukul 09.00 WITA – selesai
📍 Rumah Mempelai Wanita
Jl. Sungai Andai Komplek PWI Blok E No. 121

Untuk informasi lengkap mengenai acara, lokasi, dan konfirmasi kehadiran, silakan buka undangan digital berikut:

{link}

Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Ibu/Bapak/Saudara/i *{nama}* berkenan hadir dan memberikan doa restu untuk kedua mempelai.

Terima kasih atas perhatian dan doanya. 🙏

Wassalamu’alaikum Wr. Wb.`;

  // Ambil template tersimpan dari localStorage saat pertama kali load
  const [waTemplate, setWaTemplate] = useState(() => {
    const savedTemplate = localStorage.getItem('custom_wa_template');
    return savedTemplate !== null ? savedTemplate : defaultTemplate;
  });

  // Fungsi menyimpan template ke localStorage
  const handleSaveTemplate = (e) => {
    e.preventDefault();
    localStorage.setItem('custom_wa_template', waTemplate);
    setSaveStatus(true);
    setTimeout(() => setSaveStatus(false), 2500);
  };

  // Helper membuat link undangan personal
  const getPersonalLink = (name) => {
    return `https://www.undangandigitalkita.my.id/erydanamel/akad?to=${encodeURIComponent(name)}`;
  };

  // Helper menyusun pesan lengkap
  const generateMessage = (name) => {
    const link = getPersonalLink(name);
    return waTemplate
      .replace(/{nama}/g, name)
      .replace(/{link}/g, link);
  };

  // Fungsi Tambah Tamu
  const handleAddGuest = (e) => {
    e.preventDefault();
    if (!newGuestName.trim()) return;

    const newGuest = {
      id: Date.now(),
      name: newGuestName.trim(),
      phone: newGuestPhone.trim(),
    };

    setTamuList([newGuest, ...tamuList]);
    setNewGuestName('');
    setNewGuestPhone('');
    setIsModalOpen(false);
  };

  // Fungsi Hapus Tamu
  const handleDelete = (id) => {
    setTamuList(tamuList.filter(tamu => tamu.id !== id));
  };

  // Salin Link saja
  const handleCopyLinkOnly = (name, id) => {
    const link = getPersonalLink(name);
    navigator.clipboard.writeText(link);
    setCopiedId(`link-${id}`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Salin Teks Pesan WA Lengkap
  const handleCopyFullMessage = (name, id) => {
    const message = generateMessage(name);
    navigator.clipboard.writeText(message);
    setCopiedId(`msg-${id}`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Kirim WhatsApp Langsung
  const handleSendWhatsapp = (name, phone) => {
    const message = generateMessage(name);
    const encodedMessage = encodeURIComponent(message);
    const waUrl = phone 
      ? `https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${encodedMessage}`
      : `https://wa.me/?text=${encodedMessage}`;
    window.open(waUrl, '_blank');
  };

  const filteredTamu = tamuList.filter(tamu =>
    tamu.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Header & Tombol Tambah */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Data Tamu & Link Personal</h1>
          <p className="text-slate-500 text-sm">Kelola daftar tamu, buat link unik, dan sesuaikan template pesan WhatsApp</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-rose-600 hover:bg-rose-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 transition-all shadow-sm cursor-pointer"
        >
          <Plus size={16} /> Tambah Tamu Baru
        </button>
      </div>

      {/* Box Template Pesan Custom WhatsApp yang bisa di-save */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
            <FileText size={18} className="text-rose-600" />
            <span>Format Teks Pesan WhatsApp Klien (Custom)</span>
          </div>
          <span className="text-xs text-slate-400">
            Gunakan <code className="text-rose-600 bg-rose-50 px-1 py-0.5 rounded font-mono">{"{nama}"}</code> & <code className="text-rose-600 bg-rose-50 px-1 py-0.5 rounded font-mono">{"{link}"}</code>
          </span>
        </div>

        <textarea
          rows={7}
          value={waTemplate}
          onChange={(e) => setWaTemplate(e.target.value)}
          className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-sans text-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-500"
          placeholder="Tulis format teks undangan Anda di sini..."
        />

        <div className="flex items-center justify-between pt-1">
          <span className="text-xs text-slate-400">
            *Perubahan teks bisa diubah sesuai kebutuhan. Gunakan tombol "Simpan Template" untuk menyimpan format pesan yang telah diedit.
          </span>
          <button
            onClick={handleSaveTemplate}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${saveStatus ? 'bg-emerald-600 text-white' : 'bg-slate-800 hover:bg-slate-900 text-white'}`}
          >
            {saveStatus ? <Check size={14} /> : <Save size={14} />}
            <span>{saveStatus ? 'Template Tersimpan!' : 'Simpan Template'}</span>
          </button>
        </div>
      </div>

      {/* Modal Tambah Tamu */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Tambah Tamu Undangan</h3>
            <form onSubmit={handleAddGuest} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nama Lengkap / Gelar</label>
                <input
                  type="text"
                  required
                  value={newGuestName}
                  onChange={(e) => setNewGuestName(e.target.value)}
                  placeholder="Contoh: Rian Hendra, S.Kom"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nomor WhatsApp (Opsional)</label>
                <input
                  type="text"
                  value={newGuestPhone}
                  onChange={(e) => setNewGuestPhone(e.target.value)}
                  placeholder="Contoh: 081234567890"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl text-sm font-medium cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-sm font-medium shadow-sm cursor-pointer"
                >
                  Simpan Tamu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tabel Tamu */}
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
          <span className="text-xs text-slate-400 font-medium">Total: {filteredTamu.length} Tamu</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-200 text-slate-500 font-semibold">
                <th className="p-4">Nama Tamu</th>
                <th className="p-4">Link Personal</th>
                <th className="p-4 text-center">Aksi Cepat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredTamu.length > 0 ? (
                filteredTamu.map((tamu) => (
                  <tr key={tamu.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4">
                      <div className="font-semibold text-slate-800">{tamu.name}</div>
                      {tamu.phone && <div className="text-xs text-slate-400">{tamu.phone}</div>}
                    </td>
                    <td className="p-4 text-slate-400 text-xs font-mono">
                      .../erydanamel/akad?to={encodeURIComponent(tamu.name)}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2">
                        
                        {/* Tombol Salin Link */}
                        <button
                          onClick={() => handleCopyLinkOnly(tamu.name, tamu.id)}
                          className={`px-3 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${copiedId === `link-${tamu.id}` ? 'bg-emerald-50 border-emerald-300 text-emerald-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                          title="Salin URL Link Saja"
                        >
                          {copiedId === `link-${tamu.id}` ? <Check size={14} /> : <Copy size={14} />}
                          <span>{copiedId === `link-${tamu.id}` ? 'Tersalin' : 'Salin Link'}</span>
                        </button>

                        {/* Tombol Salin Pesan Lengkap */}
                        <button
                          onClick={() => handleCopyFullMessage(tamu.name, tamu.id)}
                          className={`px-3 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${copiedId === `msg-${tamu.id}` ? 'bg-emerald-50 border-emerald-300 text-emerald-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                          title="Salin Pesan Berdasarkan Template Klien"
                        >
                          {copiedId === `msg-${tamu.id}` ? <Check size={14} /> : <MessageCircle size={14} className="text-emerald-600" />}
                          <span>{copiedId === `msg-${tamu.id}` ? 'Teks Tersalin!' : 'Salin Pesan WA'}</span>
                        </button>

                        {/* Tombol Kirim WhatsApp */}
                        <button
                          onClick={() => handleSendWhatsapp(tamu.name, tamu.phone)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
                          title="Kirim WhatsApp Langsung"
                        >
                          <Send size={14} />
                          <span className="hidden sm:inline">Kirim WA</span>
                        </button>

                        {/* Tombol Hapus */}
                        <button
                          onClick={() => handleDelete(tamu.id)}
                          className="p-1.5 hover:bg-rose-50 text-rose-500 rounded-lg transition-all cursor-pointer"
                          title="Hapus Tamu"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="p-8 text-center text-slate-400 text-sm">
                    Tidak ada data tamu yang ditemukan.
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