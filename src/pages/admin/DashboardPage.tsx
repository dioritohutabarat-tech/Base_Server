import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Shirt,
  Clock,
  AlertCircle,
  Coins,
  PlusCircle,
  ArrowRight,
  CheckCircle2,
  Layers,
  Sparkles,
} from 'lucide-react';
import { pelangganService, adminService } from '../../services';
import type { DashboardStats, PelangganWithDetails, StatusCucian, StatusBayar } from '../../types';
import { formatRupiah, formatTanggal } from '../../utils/crypto';

export const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalMasuk: 0,
    belumSelesai: 0,
    belumBayar: 0,
    selesai: 0,
    totalPendapatan: 0,
  });
  const [recentOrders, setRecentOrders] = useState<PelangganWithDetails[]>([]);
  const currentAdmin = adminService.getCurrentAdmin();

  const loadData = () => {
    setStats(pelangganService.getDashboardStats());
    const all = pelangganService.getAllWithDetails();
    setRecentOrders(all.slice(0, 5)); // 5 cucian terbaru
  };

  useEffect(() => {
    loadData();
  }, []);

  // Update status langsung dari tabel dashboard
  const handleStatusChange = (id: string, newStatus: StatusCucian) => {
    pelangganService.updateStatus(id, newStatus);
    loadData();
  };

  const handleBayarChange = (id: string, newBayar: StatusBayar) => {
    pelangganService.updateStatus(id, undefined, newBayar);
    loadData();
  };

  // Status color badge helper
  const getStatusBadge = (status: StatusCucian) => {
    switch (status) {
      case 'diterima':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'dicuci':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'disetrika':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'siap diambil':
        return 'bg-teal-100 text-teal-800 border-teal-200';
      case 'selesai':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Selamat Datang */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-600 rounded-2xl p-6 text-white shadow-lg shadow-blue-600/15 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center space-x-2 text-blue-100 text-xs font-semibold uppercase tracking-wider mb-1">
            <span>Dashboard Operasional</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight">
            Selamat Datang, {currentAdmin?.nama || 'Admin'}!
          </h1>
          <p className="text-blue-100 text-sm mt-0.5">
            Berikut ringkasan operasional dan cucian aktif di Ceria Laundry hari ini.
          </p>
        </div>

        <Link
          to="/admin/pelanggan?action=new"
          className="inline-flex items-center px-4 py-2.5 bg-white text-blue-700 hover:bg-blue-50 font-bold rounded-xl shadow-md text-sm transition-all shrink-0"
        >
          <PlusCircle className="w-4 h-4 mr-2" />
          Tambah Cucian Baru
        </Link>
      </div>

      {/* Grid Metrik Ringkas Dashboard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Cucian Masuk */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold shrink-0">
            <Shirt className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Cucian Masuk
            </p>
            <h3 className="text-2xl font-black text-slate-900 mt-0.5">
              {stats.totalMasuk} <span className="text-xs font-normal text-slate-500">Nota</span>
            </h3>
          </div>
        </div>

        {/* Belum Selesai (Dalam Proses) */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Belum Selesai (Proses)
            </p>
            <h3 className="text-2xl font-black text-amber-600 mt-0.5">
              {stats.belumSelesai} <span className="text-xs font-normal text-slate-500">Order</span>
            </h3>
          </div>
        </div>

        {/* Belum Bayar */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold shrink-0">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Belum Bayar (Piutang)
            </p>
            <h3 className="text-2xl font-black text-rose-600 mt-0.5">
              {stats.belumBayar} <span className="text-xs font-normal text-slate-500">Nota</span>
            </h3>
          </div>
        </div>

        {/* Total Pendapatan Lunas */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold shrink-0">
            <Coins className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Pendapatan Terbayar
            </p>
            <h3 className="text-xl font-black text-emerald-700 mt-0.5">
              {formatRupiah(stats.totalPendapatan)}
            </h3>
          </div>
        </div>
      </div>

      {/* Tabel Cucian Terbaru dengan Aksi Cepat */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">5 Transaksi Cucian Terbaru</h2>
            <p className="text-xs text-slate-500">Status dan pembayaran dapat diubah langsung</p>
          </div>
          <Link
            to="/admin/pelanggan"
            className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center transition-colors"
          >
            Lihat Semua Cucian <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase tracking-wider font-semibold">
                <th className="py-3 px-4">No. Nota</th>
                <th className="py-3 px-4">Pelanggan</th>
                <th className="py-3 px-4">Layanan</th>
                <th className="py-3 px-4">Berat/Jumlah</th>
                <th className="py-3 px-4">Total</th>
                <th className="py-3 px-4">Status Cucian</th>
                <th className="py-3 px-4">Status Bayar</th>
                <th className="py-3 px-4 text-right">Kasir</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    Belum ada data cucian masuk.
                  </td>
                </tr>
              ) : (
                recentOrders.map((order) => (
                  <tr key={order.id_pelanggan} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-blue-600">
                      {order.id_pelanggan}
                      <span className="block font-normal text-[10px] text-slate-400">
                        {formatTanggal(order.tanggal_masuk)}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900">
                      {order.nama}
                      <span className="block font-normal text-[10px] text-slate-500">
                        {order.no_hp}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700">
                      {order.layanan?.nama_layanan || 'Layanan Umum'}
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 font-medium">
                      {order.berat} {order.layanan?.satuan || 'kg'}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {formatRupiah(order.total_harga)}
                    </td>
                    {/* Quick status cucian select */}
                    <td className="py-3.5 px-4">
                      <select
                        value={order.status_cucian}
                        onChange={(e) =>
                          handleStatusChange(order.id_pelanggan, e.target.value as StatusCucian)
                        }
                        className={`text-[11px] font-bold rounded-lg px-2 py-1 border outline-none cursor-pointer capitalize ${getStatusBadge(
                          order.status_cucian
                        )}`}
                      >
                        <option value="diterima">diterima</option>
                        <option value="dicuci">dicuci</option>
                        <option value="disetrika">disetrika</option>
                        <option value="siap diambil">siap diambil</option>
                        <option value="selesai">selesai</option>
                      </select>
                    </td>
                    {/* Quick status bayar toggle */}
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() =>
                          handleBayarChange(
                            order.id_pelanggan,
                            order.status_bayar === 'lunas' ? 'belum' : 'lunas'
                          )
                        }
                        className={`inline-flex items-center text-[11px] font-bold px-2 py-1 rounded-lg border cursor-pointer transition-colors ${
                          order.status_bayar === 'lunas'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                            : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                        }`}
                        title="Klik untuk mengubah status pembayaran"
                      >
                        {order.status_bayar === 'lunas' ? (
                          <>
                            <CheckCircle2 className="w-3 h-3 mr-1" /> Lunas
                          </>
                        ) : (
                          <>
                            <AlertCircle className="w-3 h-3 mr-1" /> Belum
                          </>
                        )}
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-right text-slate-500 font-medium">
                      {order.admin?.nama || 'Admin'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Navigasi Pintas Administrasi */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          to="/admin/layanan"
          className="p-5 bg-white rounded-2xl border border-slate-200 hover:border-blue-300 shadow-xs flex items-center justify-between group transition-all"
        >
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Kelola Tarif & Layanan</h3>
              <p className="text-xs text-slate-500">Atur jenis layanan, harga perkilo, dan estimasi waktu</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
        </Link>

        <Link
          to="/admin/pengguna"
          className="p-5 bg-white rounded-2xl border border-slate-200 hover:border-blue-300 shadow-xs flex items-center justify-between group transition-all"
        >
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Kelola Staf & Kasir</h3>
              <p className="text-xs text-slate-500">Tambah akun kasir baru dan kelola kredensial login</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
        </Link>
      </div>
    </div>
  );
};
