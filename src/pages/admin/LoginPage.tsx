import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Sparkles, Lock, User, AlertCircle, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { adminService, PROFIL_USAHA } from '../../services';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Jika sudah login, langsung arahkan ke dashboard
  if (adminService.isAuthenticated()) {
    navigate('/admin/dashboard', { replace: true });
  }

  // Tentukan redirect setelah login berhasil
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/admin/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!username.trim() || !password) {
      setErrorMessage('Username dan password wajib diisi.');
      return;
    }

    setIsLoading(true);
    try {
      const result = await adminService.login(username.trim(), password);
      if (result.success) {
        navigate(from, { replace: true });
      } else {
        setErrorMessage(result.message);
      }
    } catch {
      setErrorMessage('Terjadi kesalahan saat memproses login.');
    } finally {
      setIsLoading(false);
    }
  };

  // Helper cepat untuk mengisi akun demo untuk dosen/penguji
  const fillDemoAccount = (u: string, p: string) => {
    setUsername(u);
    setPassword(p);
    setErrorMessage('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-blue-100/60 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Tombol Kembali ke Beranda */}
        <div className="mb-4">
          <Link
            to="/"
            className="inline-flex items-center text-xs font-semibold text-blue-700 hover:text-blue-900 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-1" />
            Kembali ke Halaman Publik
          </Link>
        </div>

        {/* Card Login */}
        <div className="bg-white rounded-3xl shadow-xl border border-blue-100 p-8">
          {/* Header Card */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-gradient-to-tr from-blue-600 to-blue-500 text-white rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg shadow-blue-500/25">
              <Sparkles className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              {PROFIL_USAHA.nama}
            </h1>
            <p className="text-xs text-blue-600 font-semibold tracking-wide uppercase mt-1">
              Portal Akses Staf & Manajemen
            </p>
          </div>

          {/* Alert Error */}
          {errorMessage && (
            <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start space-x-2.5 text-xs text-rose-800 animate-fadeIn">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Form Login */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Masukkan username"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md shadow-blue-600/30 transition-all text-sm flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? (
                <span>Memproses Verifikasi...</span>
              ) : (
                <span>Masuk ke Panel Admin</span>
              )}
            </button>
          </form>

          {/* Catatan Keamanan Password */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <div className="flex items-center space-x-2 text-[11px] text-slate-500 mb-3">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span>
                <strong>Keamanan:</strong> Password disimpan dalam bentuk hash SHA-256 (bukan teks polos).
              </span>
            </div>

            {/* Tombol Akun Demo Cepat */}
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
              <span className="block font-bold text-slate-700 mb-1.5 text-[11px] uppercase tracking-wider">
                Akun Demo untuk Pengujian:
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => fillDemoAccount('admin', 'admin123')}
                  className="px-2.5 py-1.5 bg-white border border-slate-300 hover:border-blue-400 rounded-lg text-left text-slate-700 hover:text-blue-700 font-medium transition-all text-xs"
                >
                  <p className="font-bold text-[11px]">Owner / Admin</p>
                  <p className="text-[10px] text-slate-500">admin / admin123</p>
                </button>
                <button
                  type="button"
                  onClick={() => fillDemoAccount('kasir', 'kasir123')}
                  className="px-2.5 py-1.5 bg-white border border-slate-300 hover:border-blue-400 rounded-lg text-left text-slate-700 hover:text-blue-700 font-medium transition-all text-xs"
                >
                  <p className="font-bold text-[11px]">Kasir Staf</p>
                  <p className="text-[10px] text-slate-500">kasir / kasir123</p>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
