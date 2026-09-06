import React, { useState, useEffect } from "react";
import {
  Users,
  Plus,
  Copy,
  Search,
  Check,
  Trash2,
  MessageCircle,
  FileText,
  Send,
  Save,
  RefreshCw,
  Pencil, X
} from "lucide-react";
import Swal from 'sweetalert2';

export default function Tamu() {
 const [tamuList, setTamuList] = useState([]);
  const [loading, setLoading] = useState(true);

  const [newGuestName, setNewGuestName] = useState("");
  const [newGuestPhone, setNewGuestPhone] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saveStatus, setSaveStatus] = useState(false);

  // URL Web App khusus DATA TAMU (terpisah dari RSVP)
  const SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbw79k158qMN7B33Uw3dJuic654ArSVsG___TJt2004PRX-jLA7HvALkpp4NTm4svCs/exec";

  // Ambil data tamu
  const fetchTamuData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${SCRIPT_URL}?action=tamu`);
      const textResponse = await response.text(); // Ambil dulu sebagai teks untuk dicek

      // Cek apakah respons dari Apps Script benar-benar JSON atau error HTML
      if (textResponse.startsWith("[")) {
        const data = JSON.parse(textResponse);
        setTamuList(Array.isArray(data) ? data : []);
      } else {
        console.error("Format data bukan JSON:", textResponse);
        setTamuList([]);
      }
    } catch (err) {
      console.error("Gagal mengambil data tamu:", err);
      setTamuList([]); // Tetap set array kosong agar tidak error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTamuData();
  }, []);

  const defaultTemplate = `Assalamu’alaikum Wr. Wb.

Yth. Ibu/Bapak/Saudara/i *{nama}*,

Dengan penuh kebahagiaan, kami mengundang Ibu/Bapak/Saudara/i untuk hadir di acara *Resepsi Pernikahan Ery & Amel*. 💍✨

📅 Minggu, 13 September 2026
🕘 Pukul 09.00 WITA – selesai
📍 Rumah Mempelai Pria
Jl. Antasan Kecil Barat Gg. Ibu RT.13 No.59 (Kampung Arab, Samping SDN Pasar Lama 6)

Untuk informasi lengkap mengenai acara dan konfirmasi kehadiran, silakan buka undangan digital berikut:

{link}

Terima kasih atas perhatian dan doanya. 🙏

Wassalamu’alaikum Wr. Wb.`;

  const [waTemplate, setWaTemplate] = useState(() => {
    return localStorage.getItem("custom_wa_template") || defaultTemplate;
  });

  const handleSaveTemplate = (e) => {
    e.preventDefault();
    localStorage.setItem("custom_wa_template", waTemplate);
    setSaveStatus(true);
    setTimeout(() => setSaveStatus(false), 2500);
  };

  const getPersonalLink = (name) => {
    return `https://www.undangandigitalkita.my.id/erydanamel/full?to=${encodeURIComponent(name)}`;
  };

  const generateMessage = (name) => {
    const link = getPersonalLink(name);
    return waTemplate.replace(/{nama}/g, name).replace(/{link}/g, link);
  };

  // Tambah tamu aman menggunakan URLSearchParams (cocok dengan e.parameter di Apps Script)
  const handleAddGuest = async (e) => {
    e.preventDefault();
    if (!newGuestName.trim()) return;

    const guestId = Date.now();
    const newGuest = {
      id: guestId,
      name: newGuestName.trim(),
      phone: newGuestPhone.trim(),
    };

    // Update state instan
    setTamuList([newGuest, ...tamuList]);
    setNewGuestName("");
    setNewGuestPhone("");
    setIsModalOpen(false);

    try {
      const formData = new URLSearchParams();
      formData.append("action", "tambah_tamu"); // <-- Penanda agar masuk ke sheet DataTamu
      formData.append("id", guestId);
      formData.append("nama", newGuest.name);
      formData.append("telepon", newGuest.phone);

      await fetch(SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData.toString(),
      });
    } catch (err) {
      console.error("Gagal menyimpan tamu:", err);
    }
  };

  const handleCopyLinkOnly = (name, index) => {
    navigator.clipboard.writeText(getPersonalLink(name));
    setCopiedId(`link-${index}`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCopyFullMessage = (name, index) => {
    navigator.clipboard.writeText(generateMessage(name));
    setCopiedId(`msg-${index}`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSendWhatsapp = (name, phone) => {
    const message = generateMessage(name);

    // Ubah phone menjadi string terlebih dahulu untuk mencegah error jika terbaca sebagai angka/kosong
    const phoneString = phone ? String(phone).replace(/[^0-9]/g, "") : "";

    // Jika angka diawali dengan '8' (karena 0 nya terlanjur hilang di sheets), kita tambahkan '0' atau '62' di depannya secara otomatis
    let formattedPhone = phoneString;
    if (formattedPhone.startsWith("8")) {
      formattedPhone = "0" + formattedPhone;
    }

    const waUrl = formattedPhone
      ? `https://wa.me/${formattedPhone.replace(/^0/, "62")}?text=${encodeURIComponent(message)}`
      : `https://wa.me/?text=${encodeURIComponent(message)}`;

    window.open(waUrl, "_blank");
  };

  const filteredTamu = tamuList.filter((tamu) =>
    tamu.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

// --- STATE TAMBAHAN UNTUK FITUR EDIT ---
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentEditTamu, setCurrentEditTamu] = useState({ id: '', name: '', phone: '' });
  const [isEditLoading, setIsEditLoading] = useState(false);

  // Ganti dengan URL Web App Google Apps Script Anda
  

  // Contoh fungsi fetch data (sesuaikan dengan fungsi yang sudah Anda punya)
  const fetchTamu = async () => {
    try {
      const res = await fetch(`${SCRIPT_URL}?action=tamu`);
      const data = await res.json();
      setTamuList(data);
    } catch (err) {
      console.error("Gagal memuat data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTamu();
  }, []);

  // Fungsi saat tombol Edit diklik
  const handleEditClick = (tamu) => {
    setCurrentEditTamu({
      id: tamu.id,
      name: tamu.name,
      phone: tamu.phone
    });
    setIsEditModalOpen(true);
  };

  // Fungsi simpan perubahan edit ke Google Apps Script (doPost)
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    setIsEditLoading(true);

    try {
      const formData = new URLSearchParams();
      formData.append('action', 'edit_tamu');
      formData.append('id', currentEditTamu.id);
      formData.append('nama', currentEditTamu.name);
      formData.append('telepon', currentEditTamu.phone);

      const response = await fetch(SCRIPT_URL, {
        method: 'POST',
        body: formData,
      });

      const result = await response.text();

      if (result.includes("Success")) {
        setIsEditModalOpen(false);
        Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: 'Data tamu berhasil diupdate.',
          timer: 2000,
          showConfirmButton: false
        });
        fetchTamu(); // Refresh data tabel
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Gagal',
          text: 'Gagal mengupdate data: ' + result,
        });
      }
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        icon: 'error',
        title: 'Kesalahan Jaringan',
        text: 'Terjadi kesalahan koneksi ke server.',
      });
    } finally {
      setIsEditLoading(false);
    }
  };

  // === FUNGSI HAPUS (DELETE) DENGAN SWEETALERT2 ===
  const handleDelete = (tamu) => {
    Swal.fire({
      title: 'Hapus Tamu?',
      text: `Apakah Anda yakin ingin menghapus "${tamu.name}" dari daftar?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626', // Warna merah untuk tombol hapus
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal'
    }).then(async (result) => {
      if (result.isConfirmed) {
        // Tampilkan loading saat proses hapus
        Swal.showLoading();

        try {
          const formData = new URLSearchParams();
          formData.append('action', 'hapus_tamu');
          formData.append('id', tamu.id);

          const response = await fetch(SCRIPT_URL, {
            method: 'POST',
            body: formData,
          });

          const resText = await response.text();

          if (resText.includes("Success")) {
            Swal.fire({
              icon: 'success',
              title: 'Terhapus!',
              text: 'Data tamu berhasil dihapus.',
              timer: 2000,
              showConfirmButton: false
            });
            fetchTamu(); // Refresh data tabel
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Gagal',
              text: 'Gagal menghapus data: ' + resText,
            });
          }
        } catch (error) {
          console.error("Error:", error);
          Swal.fire({
            icon: 'error',
            title: 'Kesalahan Jaringan',
            text: 'Terjadi kesalahan koneksi ke server.',
          });
        }
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Data Tamu & Link Personal
          </h1>
          <p className="text-slate-500 text-sm">
            Kelola daftar tamu dan generate link unik
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchTamuData}
            className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-3 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 transition-all cursor-pointer"
            title="Refresh Data Tamu"
          >
            <RefreshCw
              size={16}
              className={loading ? "animate-spin text-rose-600" : ""}
            />
            <span>Refresh</span>
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-rose-600 hover:bg-rose-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 transition-all shadow-sm cursor-pointer"
          >
            <Plus size={16} /> Tambah Tamu Baru
          </button>
        </div>
      </div>

      {/* Box Template Pesan Custom WhatsApp */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
            <FileText size={18} className="text-rose-600" />
            <span>Format Teks Pesan WhatsApp</span>
          </div>
        </div>
        <textarea
          rows={5}
          value={waTemplate}
          onChange={(e) => setWaTemplate(e.target.value)}
          className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-500"
        />
        <div className="flex justify-end">
          <button
            onClick={handleSaveTemplate}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${saveStatus ? "bg-emerald-600 text-white" : "bg-slate-800 hover:bg-slate-900 text-white"}`}
          >
            {saveStatus ? <Check size={14} /> : <Save size={14} />}
            <span>{saveStatus ? "Tersimpan!" : "Simpan Template"}</span>
          </button>
        </div>
      </div>

      {/* Modal Tambah Tamu */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl">
            <h3 className="text-lg font-bold text-slate-800 mb-4">
              Tambah Tamu Undangan
            </h3>
            <form onSubmit={handleAddGuest} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Nama Lengkap / Gelar
                </label>
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
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Nomor WhatsApp (Opsional)
                </label>
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
          <span className="text-xs text-slate-400 font-medium">
            Total: {filteredTamu.length} Tamu
          </span>
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
              {loading ? (
                <tr>
                  <td
                    colSpan="3"
                    className="p-8 text-center text-slate-400 text-sm"
                  >
                    Memuat data tamu...
                  </td>
                </tr>
              ) : filteredTamu.length > 0 ? (
                filteredTamu.map((tamu, index) => (
                  <tr
                    key={index}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="p-4">
                      <div className="font-semibold text-slate-800">
                        {tamu.name}
                      </div>
                      {tamu.phone && (
                        <div className="text-xs text-slate-400">
                          {tamu.phone}
                        </div>
                      )}
                    </td>
                    <td className="p-4 text-slate-400 text-xs font-mono">
                      .../erydanamel/full?to={encodeURIComponent(tamu.name)}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2">
                        {/* Tombol Salin Link */}
                        <button
                          onClick={() => handleCopyLinkOnly(tamu.name, index)}
                          className={`px-3 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${copiedId === `link-${index}` ? "bg-emerald-50 border-emerald-300 text-emerald-700" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"}`}
                        >
                          {copiedId === `link-${index}` ? (
                            <Check size={14} />
                          ) : (
                            <Copy size={14} />
                          )}
                          <span>
                            {copiedId === `link-${index}`
                              ? "Tersalin"
                              : "Salin Link"}
                          </span>
                        </button>

                        {/* Tombol Salin Pesan */}
                        <button
                          onClick={() =>
                            handleCopyFullMessage(tamu.name, index)
                          }
                          className={`px-3 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${copiedId === `msg-${index}` ? "bg-emerald-50 border-emerald-300 text-emerald-700" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"}`}
                        >
                          {copiedId === `msg-${index}` ? (
                            <Check size={14} />
                          ) : (
                            <MessageCircle
                              size={14}
                              className="text-emerald-600"
                            />
                          )}
                          <span>
                            {copiedId === `msg-${index}`
                              ? "Tersalin!"
                              : "Salin Pesan"}
                          </span>
                        </button>

                        {/* Tombol Kirim WA */}
                        <button
                          onClick={() =>
                            handleSendWhatsapp(tamu.name, tamu.phone)
                          }
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
                        >
                          <Send size={14} />
                          <span className="hidden sm:inline">Kirim WA</span>
                        </button>

                        {/* === TAMBAHAN TOMBOL EDIT DI SINI === */}
                        <button
                          onClick={() => handleEditClick(tamu, index)}
                          className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer"
                          title="Edit Data"
                        >
                          <Pencil size={14} className="text-blue-600" />
                          <span className="hidden sm:inline">Edit</span>
                        </button>

                        {/* Tombol Hapus (Delete) */}
                      <button
                        onClick={() => handleDelete(tamu)}
                        className="px-3 py-1.5 rounded-lg border border-red-100 bg-red-50 text-red-600 hover:bg-red-100 text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer"
                        title="Hapus Data"
                      >
                        <Trash2 size={14} />
                        <span className="hidden sm:inline">Hapus</span>
                      </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="3"
                    className="p-8 text-center text-slate-400 text-sm"
                  >
                    Belum ada data tamu. Silakan tambah tamu baru.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      
      {/* --- MODAL EDIT POPUP --- */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-lg font-semibold text-slate-800">Edit Data Tamu</h3>
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 pt-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Nama Tamu</label>
                <input
                  type="text"
                  required
                  value={currentEditTamu.name}
                  onChange={(e) => setCurrentEditTamu({ ...currentEditTamu, name: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Nomor Telepon / WhatsApp</label>
                <input
                  type="text"
                  required
                  value={currentEditTamu.phone}
                  onChange={(e) => setCurrentEditTamu({ ...currentEditTamu, phone: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isEditLoading}
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium shadow-sm disabled:opacity-50"
                >
                  {isEditLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
 
  );
}
