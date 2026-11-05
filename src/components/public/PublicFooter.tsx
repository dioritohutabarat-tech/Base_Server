import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, MapPin, Clock, Phone, MessageCircle, Heart, Lock } from 'lucide-react';
import { PROFIL_USAHA } from '../../services';

export const PublicFooter: React.FC = () => {
  const waUrl = `https://wa.me/${PROFIL_USAHA.whatsapp}?text=Halo%20${encodeURIComponent(
    PROFIL_USAHA.nama
  )},%20saya%20ingin%20bertanya%20seputar%20layanan%20laundry.`;

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Kolom 1: Profil Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-md shadow-blue-500/20">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="text-xl font-black text-white tracking-tight">
                {PROFIL_USAHA.nama}
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {PROFIL_USAHA.deskripsi}
            </p>
            <div className="pt-2">
              <span className="inline-flex items-center text-[11px] font-bold text-blue-400 bg-blue-950/80 border border-blue-800 px-3 py-1 rounded-full">
                {PROFIL_USAHA.tagline}
              </span>
            </div>
          </div>

          {/* Kolom 2: Kontak & Lokasi */}
          <div className="space-y-3">
            <h4 className="text-white font-extrabold text-sm uppercase tracking-wider">
              Lokasi Outlet
            </h4>
            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="flex items-start space-x-2.5">
                <MapPin className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span>{PROFIL_USAHA.alamat}</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{PROFIL_USAHA.whatsappDisplay}</span>
              </div>
            </div>
          </div>

          {/* Kolom 3: Jam Operasional */}
          <div className="space-y-3">
            <h4 className="text-white font-extrabold text-sm uppercase tracking-wider">
              Jam Operasional
            </h4>
            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex items-start space-x-2.5">
                <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white">Senin - Sabtu:</p>
                  <p className="text-slate-400">07.30 - 20.00 WIB</p>
                </div>
              </div>
              <div className="flex items-start space-x-2.5 pl-6.5">
                <div>
                  <p className="font-semibold text-white">Minggu:</p>
                  <p className="text-slate-400">08.30 - 17.00 WIB</p>
                </div>
              </div>
            </div>
          </div>

          {/* Kolom 4: Navigasi Cepat */}
          <div className="space-y-3">
            <h4 className="text-white font-extrabold text-sm uppercase tracking-wider">
              Menu Cepat
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/" className="text-slate-400 hover:text-white transition-colors">
                  &bull; Beranda Utama
                </Link>
              </li>
              <li>
                <Link
                  to="/cek-status"
                  className="text-blue-400 hover:text-blue-300 font-bold transition-colors"
                >
                  &bull; Cek Status Cucian Online
                </Link>
              </li>
              <li>
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 hover:text-emerald-300 flex items-center transition-colors"
                >
                  &bull; Hubungi via WhatsApp
                  <MessageCircle className="w-3 h-3 ml-1" />
                </a>
              </li>
              <li className="pt-2">
                <Link
                  to="/admin/login"
                  className="inline-flex items-center text-slate-400 hover:text-white transition-colors"
                >
                  <Lock className="w-3 h-3 mr-1 text-slate-500" />
                  Masuk Panel Admin / Staf
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Hak Cipta & Info Tugas */}
        <div className="pt-8 border-t border-slate-800 text-center text-xs text-slate-500 flex flex-col sm:flex-row justify-between items-center gap-2">
          <p>
            &copy; {new Date().getFullYear()} {PROFIL_USAHA.nama}. Hak Cipta Dilindungi.
          </p>
          <p className="flex items-center">
            Dibuat dengan <Heart className="w-3.5 h-3.5 text-rose-500 mx-1 fill-rose-500" /> untuk
            Tugas Proyek PBAD Sistem Informasi Laundry.
          </p>
        </div>
      </div>
    </footer>
  );
};
