import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, ArrowRight, AlertCircle } from 'lucide-react';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setErrorMsg('');

    // Validasi kredensial khusus
    if (username === 'erydanamel' && password === '12345') {
      navigate('/dashboard');
    } else {
      setErrorMsg('Username atau password salah!');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
        
        {/* Header Title */}
        <div className="text-center mb-8">
          <span className="bg-rose-50 text-rose-600 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
            Undangan Digital Kita
          </span>
          <h1 className="text-2xl font-bold text-slate-800 mt-3">Dashboard Pelanggan</h1>
          <p className="text-slate-500 text-sm mt-1">Masuk untuk mengelola undangan pernikahan Anda</p>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="mb-6 bg-rose-50 border border-rose-200 text-rose-700 p-3.5 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle size={16} className="shrink-0 text-rose-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form Login */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Username / Email</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <User size={18} />
              </span>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Masukkan username"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Lock size={18} />
              </span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-rose-600 hover:bg-rose-700 text-white font-medium py-2.5 rounded-xl transition-all shadow-lg shadow-rose-600/20 flex items-center justify-center gap-2 text-sm cursor-pointer"
          >
            <span>Masuk ke Dashboard</span>
            <ArrowRight size={16} />
          </button>
        </form>

      

        {/* Footer info */}
        <div className="mt-6 text-center text-xs text-slate-400">
          &copy; 2026 Undangan Digital Kita. All rights reserved.
        </div>
      </div>
    </div>
  );
}