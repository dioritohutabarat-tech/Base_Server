import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Sparkles, Search, MessageCircle, Lock, Menu, X } from 'lucide-react';
import { PROFIL_USAHA } from '../../services';

export const PublicNavbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const waUrl = `https://wa.me/${PROFIL_USAHA.whatsapp}?text=Halo%20${encodeURIComponent(
    PROFIL_USAHA.nama
  )},%20saya%20ingin%20bertanya%20seputar%20layanan%20laundry.`;

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo Brand */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-700 to-blue-500 text-white flex items-center justify-center font-black text-base shadow-md shadow-blue-500/25 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-slate-900 text-lg sm:text-xl tracking-tight block">
                {PROFIL_USAHA.nama}
              </span>
              <span className="text-[10px] text-blue-600 font-semibold tracking-wider uppercase block -mt-0.5">
                Bersih &bull; Rapi &bull; Cepat
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `px-3.5 py-2 rounded-xl text-xs font-bold transition-colors ${
                  isActive
                    ? 'text-blue-700 bg-blue-50'
                    : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
                }`
              }
            >
              Beranda
            </NavLink>

            <a
              href="/#layanan"
              className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-blue-600 hover:bg-slate-50 transition-colors"
            >
              Layanan & Tarif
            </a>

            <a
              href="/#lokasi"
              className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-blue-600 hover:bg-slate-50 transition-colors"
            >
              Lokasi & Jam Buka
            </a>

            <NavLink
              to="/cek-status"
              className={({ isActive }) =>
                `px-3.5 py-2 rounded-xl text-xs font-bold inline-flex items-center transition-colors ${
                  isActive
                    ? 'text-blue-700 bg-blue-50'
                    : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
                }`
              }
            >
              <Search className="w-3.5 h-3.5 mr-1.5 text-blue-600" />
              Cek Status Cucian
            </NavLink>
          </nav>

          {/* CTA Buttons: WhatsApp & Login Admin */}
          <div className="hidden md:flex items-center space-x-2.5">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all"
            >
              <MessageCircle className="w-3.5 h-3.5 mr-1.5" />
              WhatsApp
            </a>

            <Link
              to="/admin/login"
              className="inline-flex items-center px-3.5 py-2 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 font-bold text-xs rounded-xl transition-all"
              title="Akses Staf & Kasir"
            >
              <Lock className="w-3.5 h-3.5 mr-1 text-slate-500" />
              Masuk Admin
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex md:hidden items-center space-x-2">
            <NavLink
              to="/cek-status"
              className="p-2 bg-blue-50 text-blue-600 rounded-xl text-xs font-bold flex items-center"
            >
              <Search className="w-4 h-4" />
            </NavLink>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 pt-3 pb-6 space-y-2 shadow-lg animate-fadeIn">
          <NavLink
            to="/"
            end
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2.5 rounded-xl text-sm font-bold text-slate-800 hover:bg-blue-50 hover:text-blue-600"
          >
            Beranda
          </NavLink>
          <a
            href="/#layanan"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2.5 rounded-xl text-sm font-bold text-slate-800 hover:bg-blue-50 hover:text-blue-600"
          >
            Layanan & Harga
          </a>
          <a
            href="/#lokasi"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2.5 rounded-xl text-sm font-bold text-slate-800 hover:bg-blue-50 hover:text-blue-600"
          >
            Lokasi & Jam Buka
          </a>
          <NavLink
            to="/cek-status"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2.5 rounded-xl text-sm font-bold text-blue-700 bg-blue-50"
          >
            Cek Status Cucian Online
          </NavLink>

          <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-2">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center py-2.5 bg-emerald-600 text-white font-bold text-xs rounded-xl"
            >
              <MessageCircle className="w-4 h-4 mr-1.5" />
              WhatsApp
            </a>
            <Link
              to="/admin/login"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center py-2.5 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl"
            >
              <Lock className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
              Login Admin
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
