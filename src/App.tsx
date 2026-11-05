import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Komponen Tata Letak
import { PublicLayout } from './components/public/PublicLayout';
import { AdminLayout } from './components/admin/AdminLayout';
import { ProtectedRoute } from './components/admin/ProtectedRoute';

// Halaman Publik
import { HomePage } from './pages/public/HomePage';
import { CekStatusPage } from './pages/public/CekStatusPage';

// Halaman Admin
import { LoginPage } from './pages/admin/LoginPage';
import { DashboardPage } from './pages/admin/DashboardPage';
import { PelangganPage } from './pages/admin/PelangganPage';
import { LayananPage } from './pages/admin/LayananPage';
import { AdminManagePage } from './pages/admin/AdminManagePage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rute Publik (Menggunakan PublicLayout: Navbar & Footer Ceria Laundry) */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/cek-status" element={<CekStatusPage />} />
        </Route>

        {/* Rute Login Admin */}
        <Route path="/admin/login" element={<LoginPage />} />

        {/* Rute Panel Admin Terproteksi (Hanya bisa diakses setelah login) */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="pelanggan" element={<PelangganPage />} />
          <Route path="layanan" element={<LayananPage />} />
          <Route path="pengguna" element={<AdminManagePage />} />
        </Route>

        {/* Fallback ke Beranda jika URL tidak ditemukan */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
