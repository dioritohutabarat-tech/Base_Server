import React, { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Shirt,
  Sparkles,
  Users,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Shield,
  Layers,
} from 'lucide-react';
import { adminService, PROFIL_USAHA } from '../../services';

// Layout utama halaman admin dengan sidebar responsif
export const AdminLayout: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const currentAdmin = adminService.getCurrentAdmin();

  const handleLogout = () => {
    if (window.confirm('Apakah Anda yakin ingin keluar dari sistem admin?')) {
      adminService.logout();
      navigate('/admin/login');
    }
  };

  const navItems = [
    {
      to: '/admin/dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      to: '/admin/pelanggan',
      label: 'Kelola Cucian',
      icon: Shirt,
    },
    {
      to: '/admin/layanan',
      label: 'Kelola Layanan',
      icon: Layers,
    },
    {
      to: '/admin/pengguna',
      label: 'Kelola Admin/Staf',
      icon: Users,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row text-slate-800">
      {/* Mobile Topbar */}
      <header className="md:hidden bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
            CL
          </div>
          <span className="font-bold text-slate-800 text-base">{PROFIL_USAHA.nama}</span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* Backdrop untuk Mobile Menu */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 z-40 md:hidden backdrop-blur-xs transition-opacity"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar Navigasi (Responsif Desktop & Mobile Drawer) */}
      <aside
        className={`fixed md:sticky top-0 left-0 bottom-0 z-50 w-64 bg-white border-r border-slate-200 flex flex-col transition-transform duration-300 ease-in-out md:translate-x-0 h-screen ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Sidebar Brand Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 to-blue-500 text-white flex items-center justify-center font-bold text-lg shadow-md shadow-blue-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-slate-900 tracking-tight leading-tight">
                {PROFIL_USAHA.nama}
              </h2>
              <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
                Panel Admin
              </span>
            </div>
          </div>
          {/* Tombol tutup di mobile */}
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="md:hidden text-slate-400 hover:text-slate-600 p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Profil Admin yang Login */}
        <div className="mx-4 my-3 p-3 bg-blue-50/70 rounded-xl border border-blue-100 flex items-center space-x-3">
          <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold text-sm">
            {currentAdmin?.nama.charAt(0) || 'A'}
          </div>
          <div className="overflow-hidden flex-1">
            <p className="text-sm font-bold text-slate-800 truncate">{currentAdmin?.nama}</p>
            <div className="flex items-center text-xs text-blue-700 font-medium">
              <Shield className="w-3 h-3 mr-1" />
              <span className="truncate">{currentAdmin?.posisi}</span>
            </div>
          </div>
        </div>

        {/* Menu Navigasi Utama */}
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`
                }
              >
                <Icon className="w-4 h-4 mr-3" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer Sidebar: Lihat Web Publik & Logout */}
        <div className="p-3 border-t border-slate-100 space-y-1">
          <Link
            to="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <span className="flex items-center">
              <ExternalLink className="w-4 h-4 mr-2 text-slate-400" />
              Lihat Web Publik
            </span>
            <span className="text-[10px] bg-slate-200 px-1.5 py-0.5 rounded text-slate-600">Tab Baru</span>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center px-3.5 py-2.5 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Keluar (Logout)
          </button>
        </div>
      </aside>

      {/* Konten Halaman Utama */}
      <main className="flex-1 min-w-0 p-4 md:p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};
