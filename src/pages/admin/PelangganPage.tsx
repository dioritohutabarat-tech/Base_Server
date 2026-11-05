import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Plus,
  Search,
  Filter,
  Eye,
  Edit2,
  Trash2,
  X,
  Printer,
  CheckCircle2,
  AlertCircle,
  FileText,
  Phone,
} from 'lucide-react';
import { pelangganService, layananService, adminService, PROFIL_USAHA } from '../../services';
import type {
  PelangganWithDetails,
  StatusCucian,
  StatusBayar,
  PelangganFormData,
} from '../../types';
import { formatRupiah, formatTanggal } from '../../utils/crypto';

export const PelangganPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [dataList, setDataList] = useState<PelangganWithDetails[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterBayar, setFilterBayar] = useState<string>('all');

  // Modal State
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedPelanggan, setSelectedPelanggan] = useState<PelangganWithDetails | null>(null);

  // Form State
  const currentAdmin = adminService.getCurrentAdmin();
  const layananList = layananService.getAll();
  const adminList = adminService.getAll();

  const [formData, setFormData] = useState<PelangganFormData>({
    nama: '',
    no_hp: '',
    alamat: '',
    id_layanan: layananList[0]?.id_layanan || '',
    berat: 1,
    tanggal_masuk: new Date().toISOString().slice(0, 16), // YYYY-MM-DDTHH:mm
    status_cucian: 'diterima',
    status_bayar: 'belum',
    id_admin: currentAdmin?.id_admin || 'ADM-01',
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Muat data cucian
  const refreshData = () => {
    setDataList(pelangganService.getAllWithDetails());
  };

  useEffect(() => {
    refreshData();
    // Buka modal tambah otomatis jika URL ada query param ?action=new
    if (searchParams.get('action') === 'new') {
      openAddModal();
      setSearchParams({});
    }
  }, []);

  // Hitung otomatis total harga untuk form modal
  const calculatedTotal = useMemo(() => {
    return pelangganService.calculateTotalHarga(formData.id_layanan, formData.berat || 0);
  }, [formData.id_layanan, formData.berat]);

  // Handle Input Form Change
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === 'berat' ? parseFloat(value) || 0 : value,
    }));

    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // Validasi Form
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.nama.trim()) {
      errors.nama = 'Nama pelanggan wajib diisi';
    }

    const cleanHp = formData.no_hp.replace(/\D/g, '');
    if (!cleanHp) {
      errors.no_hp = 'Nomor HP wajib diisi';
    } else if (cleanHp.length < 10 || cleanHp.length > 15) {
      errors.no_hp = 'Nomor HP harus valid (10-15 digit angka)';
    }

    if (!formData.alamat.trim()) {
      errors.alamat = 'Alamat pelanggan wajib diisi';
    }

    if (!formData.id_layanan) {
      errors.id_layanan = 'Pilih salah satu layanan';
    }

    if (formData.berat <= 0) {
      errors.berat = 'Berat/jumlah harus lebih dari 0';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Buka Modal Tambah
  const openAddModal = () => {
    setEditingId(null);
    setFormData({
      nama: '',
      no_hp: '',
      alamat: '',
      id_layanan: layananList[0]?.id_layanan || '',
      berat: 1,
      tanggal_masuk: new Date().toISOString().slice(0, 16),
      status_cucian: 'diterima',
      status_bayar: 'belum',
      id_admin: currentAdmin?.id_admin || adminList[0]?.id_admin || 'ADM-01',
    });
    setFormErrors({});
    setIsFormModalOpen(true);
  };

  // Buka Modal Edit
  const openEditModal = (item: PelangganWithDetails) => {
    setEditingId(item.id_pelanggan);
    setFormData({
      nama: item.nama,
      no_hp: item.no_hp,
      alamat: item.alamat,
      id_layanan: item.id_layanan,
      berat: item.berat,
      tanggal_masuk: item.tanggal_masuk.slice(0, 16),
      status_cucian: item.status_cucian,
      status_bayar: item.status_bayar,
      id_admin: item.id_admin,
    });
    setFormErrors({});
    setIsFormModalOpen(true);
  };

  // Buka Modal Detail / Nota
  const openDetailModal = (item: PelangganWithDetails) => {
    setSelectedPelanggan(item);
    setIsDetailModalOpen(true);
  };

  // Submit Simpan (Tambah / Ubah)
  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (editingId) {
      pelangganService.update(editingId, formData);
    } else {
      pelangganService.create(formData);
    }

    refreshData();
    setIsFormModalOpen(false);
  };

  // Hapus Data Cucian
  const handleDelete = (id: string, nama: string) => {
    if (window.confirm(`Yakin ingin menghapus data cucian nomor nota ${id} (Pelanggan: ${nama})?`)) {
      pelangganService.delete(id);
      refreshData();
    }
  };

  // Update Status Langsung dari Tabel
  const handleQuickStatusCucian = (id: string, status: StatusCucian) => {
    pelangganService.updateStatus(id, status);
    refreshData();
  };

  const handleQuickStatusBayar = (id: string, bayar: StatusBayar) => {
    pelangganService.updateStatus(id, undefined, bayar);
    refreshData();
  };

  // Filter & Search
  const filteredData = useMemo(() => {
    return dataList.filter((item) => {
      const matchSearch =
        item.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.id_pelanggan.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.no_hp.includes(searchTerm);

      const matchStatus = filterStatus === 'all' || item.status_cucian === filterStatus;
      const matchBayar = filterBayar === 'all' || item.status_bayar === filterBayar;

      return matchSearch && matchStatus && matchBayar;
    });
  }, [dataList, searchTerm, filterStatus, filterBayar]);

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

  // Helper Cetak Nota
  const handlePrintNota = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Kelola Transaksi Cucian Pelanggan
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Mencatat cucian masuk, otomatis hitung total harga, update proses, dan cetak nota
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md shadow-blue-600/30 text-xs transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          Tambah Cucian Baru
        </button>
      </div>

      {/* Filter & Pencarian */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Input Cari */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari berdasarkan nama, nomor nota (CL-0001), atau no HP..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
          />
        </div>

        {/* Filter Status Cucian & Bayar */}
        <div className="flex flex-wrap sm:flex-nowrap gap-2 items-center">
          <div className="flex items-center space-x-1.5 text-xs text-slate-500 font-medium">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span>Filter:</span>
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Semua Status Cucian</option>
            <option value="diterima">Diterima</option>
            <option value="dicuci">Dicuci</option>
            <option value="disetrika">Disetrika</option>
            <option value="siap diambil">Siap Diambil</option>
            <option value="selesai">Selesai</option>
          </select>

          <select
            value={filterBayar}
            onChange={(e) => setFilterBayar(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Semua Pembayaran</option>
            <option value="lunas">Lunas</option>
            <option value="belum">Belum Bayar</option>
          </select>
        </div>
      </div>

      {/* Tabel Data Cucian */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                <th className="py-3.5 px-4">Nota / Tgl</th>
                <th className="py-3.5 px-4">Pelanggan</th>
                <th className="py-3.5 px-4">Layanan</th>
                <th className="py-3.5 px-4">Berat</th>
                <th className="py-3.5 px-4">Total Harga</th>
                <th className="py-3.5 px-4">Status Cucian</th>
                <th className="py-3.5 px-4">Status Bayar</th>
                <th className="py-3.5 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <FileText className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    Tidak ada data transaksi cucian yang sesuai pencarian.
                  </td>
                </tr>
              ) : (
                filteredData.map((item) => (
                  <tr key={item.id_pelanggan} className="hover:bg-slate-50/70 transition-colors">
                    {/* Nota */}
                    <td className="py-3.5 px-4">
                      <span className="font-extrabold text-blue-600 block">
                        {item.id_pelanggan}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {formatTanggal(item.tanggal_masuk)}
                      </span>
                    </td>

                    {/* Pelanggan */}
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-slate-900 block">{item.nama}</span>
                      <span className="text-[10px] text-slate-500 flex items-center">
                        <Phone className="w-2.5 h-2.5 mr-1 text-slate-400" />
                        {item.no_hp}
                      </span>
                    </td>

                    {/* Layanan */}
                    <td className="py-3.5 px-4">
                      <span className="font-medium text-slate-700 block">
                        {item.layanan?.nama_layanan || 'Layanan'}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {formatRupiah(item.layanan?.harga || 0)}/{item.layanan?.satuan || 'kg'}
                      </span>
                    </td>

                    {/* Berat */}
                    <td className="py-3.5 px-4 font-semibold text-slate-800">
                      {item.berat} {item.layanan?.satuan || 'kg'}
                    </td>

                    {/* Total Harga */}
                    <td className="py-3.5 px-4 font-extrabold text-slate-900">
                      {formatRupiah(item.total_harga)}
                    </td>

                    {/* Status Cucian - Quick select */}
                    <td className="py-3.5 px-4">
                      <select
                        value={item.status_cucian}
                        onChange={(e) =>
                          handleQuickStatusCucian(item.id_pelanggan, e.target.value as StatusCucian)
                        }
                        className={`text-[11px] font-bold rounded-lg px-2 py-1 border outline-none cursor-pointer capitalize ${getStatusBadge(
                          item.status_cucian
                        )}`}
                      >
                        <option value="diterima">diterima</option>
                        <option value="dicuci">dicuci</option>
                        <option value="disetrika">disetrika</option>
                        <option value="siap diambil">siap diambil</option>
                        <option value="selesai">selesai</option>
                      </select>
                    </td>

                    {/* Status Bayar - Quick toggle */}
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() =>
                          handleQuickStatusBayar(
                            item.id_pelanggan,
                            item.status_bayar === 'lunas' ? 'belum' : 'lunas'
                          )
                        }
                        className={`inline-flex items-center text-[11px] font-bold px-2 py-1 rounded-lg border cursor-pointer transition-colors ${
                          item.status_bayar === 'lunas'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                            : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                        }`}
                        title="Klik untuk ubah status pembayaran"
                      >
                        {item.status_bayar === 'lunas' ? (
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

                    {/* Aksi */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center space-x-1.5">
                        <button
                          onClick={() => openDetailModal(item)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                          title="Lihat / Cetak Nota"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openEditModal(item)}
                          className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                          title="Edit Cucian"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id_pelanggan, item.nama)}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Hapus Data"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL FORM: Tambah / Edit Cucian */}
      {isFormModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">
                  {editingId ? `Ubah Data Cucian (${editingId})` : 'Tambah Cucian Baru'}
                </h3>
                <p className="text-xs text-slate-500">
                  {editingId
                    ? 'Perbarui detail transaksi cucian'
                    : 'Nomor nota dan total harga akan dikalkulasi otomatis'}
                </p>
              </div>
              <button
                onClick={() => setIsFormModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmitForm} className="p-5 space-y-4 text-xs">
              {/* Nama Pelanggan */}
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Nama Pelanggan <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="nama"
                  value={formData.nama}
                  onChange={handleInputChange}
                  placeholder="Contoh: Ibu Rina / Budi Santoso"
                  className={`w-full px-3 py-2 bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    formErrors.nama ? 'border-rose-400' : 'border-slate-200'
                  }`}
                />
                {formErrors.nama && (
                  <p className="text-rose-500 text-[11px] mt-1">{formErrors.nama}</p>
                )}
              </div>

              {/* No Handphone */}
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Nomor WhatsApp / HP <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  name="no_hp"
                  value={formData.no_hp}
                  onChange={handleInputChange}
                  placeholder="Contoh: 081234567890 (Digunakan pelanggan untuk cek status)"
                  className={`w-full px-3 py-2 bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    formErrors.no_hp ? 'border-rose-400' : 'border-slate-200'
                  }`}
                />
                <p className="text-[10px] text-slate-400 mt-0.5">
                  4 digit terakhir no. HP akan digunakan pelanggan saat mengecek status cucian.
                </p>
                {formErrors.no_hp && (
                  <p className="text-rose-500 text-[11px] mt-1">{formErrors.no_hp}</p>
                )}
              </div>

              {/* Alamat */}
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Alamat Lengkap <span className="text-rose-500">*</span>
                </label>
                <textarea
                  name="alamat"
                  rows={2}
                  value={formData.alamat}
                  onChange={handleInputChange}
                  placeholder="Contoh: Jl. Krakatau No. 45, Helvetia"
                  className={`w-full px-3 py-2 bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    formErrors.alamat ? 'border-rose-400' : 'border-slate-200'
                  }`}
                />
                {formErrors.alamat && (
                  <p className="text-rose-500 text-[11px] mt-1">{formErrors.alamat}</p>
                )}
              </div>

              {/* Layanan & Berat (Grid) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Jenis Layanan <span className="text-rose-500">*</span>
                  </label>
                  <select
                    name="id_layanan"
                    value={formData.id_layanan}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {layananList.map((lay) => (
                      <option key={lay.id_layanan} value={lay.id_layanan}>
                        {lay.nama_layanan} ({formatRupiah(lay.harga)}/{lay.satuan})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Berat / Jumlah ({layananList.find((l) => l.id_layanan === formData.id_layanan)?.satuan || 'kg'}) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    name="berat"
                    value={formData.berat || ''}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      formErrors.berat ? 'border-rose-400' : 'border-slate-200'
                    }`}
                  />
                  {formErrors.berat && (
                    <p className="text-rose-500 text-[11px] mt-1">{formErrors.berat}</p>
                  )}
                </div>
              </div>

              {/* Kalkulasi Otomatis Total Harga Card */}
              <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-blue-700 font-semibold block">
                    Kalkulasi Total Otomatis:
                  </span>
                  <span className="text-xs text-slate-600">
                    {formData.berat} x{' '}
                    {formatRupiah(
                      layananList.find((l) => l.id_layanan === formData.id_layanan)?.harga || 0
                    )}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-base font-black text-blue-900">
                    {formatRupiah(calculatedTotal)}
                  </span>
                </div>
              </div>

              {/* Status Cucian & Status Bayar (Grid) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Status Cucian
                  </label>
                  <select
                    name="status_cucian"
                    value={formData.status_cucian}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 capitalize"
                  >
                    <option value="diterima">diterima</option>
                    <option value="dicuci">dicuci</option>
                    <option value="disetrika">disetrika</option>
                    <option value="siap diambil">siap diambil</option>
                    <option value="selesai">selesai</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Status Pembayaran
                  </label>
                  <select
                    name="status_bayar"
                    value={formData.status_bayar}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 capitalize"
                  >
                    <option value="belum">Belum Bayar</option>
                    <option value="lunas">Lunas</option>
                  </select>
                </div>
              </div>

              {/* Tanggal & Kasir */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Waktu Masuk
                  </label>
                  <input
                    type="datetime-local"
                    name="tanggal_masuk"
                    value={formData.tanggal_masuk}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Admin / Kasir Pemroses
                  </label>
                  <select
                    name="id_admin"
                    value={formData.id_admin}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {adminList.map((adm) => (
                      <option key={adm.id_admin} value={adm.id_admin}>
                        {adm.nama} ({adm.posisi})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsFormModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md shadow-blue-600/30 transition-all cursor-pointer"
                >
                  {editingId ? 'Simpan Perubahan' : 'Buat Transaksi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DETAIL / CETAK NOTA RESMI */}
      {isDetailModalOpen && selectedPelanggan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden print:m-0 print:border-none print:shadow-none">
            {/* Modal Actions Top Bar (hidden on print) */}
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between print:hidden">
              <span className="font-bold text-slate-800 text-xs">Nota Resmi Ceria Laundry</span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handlePrintNota}
                  className="inline-flex items-center px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-xs cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5 mr-1" />
                  Cetak Nota
                </button>
                <button
                  onClick={() => setIsDetailModalOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Konten Nota Cetak */}
            <div id="print-area" className="p-6 text-slate-800 space-y-4 text-xs">
              {/* Header Toko */}
              <div className="text-center pb-3 border-b border-dashed border-slate-300">
                <h2 className="text-lg font-black text-slate-900 tracking-tight">
                  {PROFIL_USAHA.nama}
                </h2>
                <p className="text-[11px] text-slate-600 font-medium">{PROFIL_USAHA.alamat}</p>
                <p className="text-[10px] text-slate-500">WA: {PROFIL_USAHA.whatsappDisplay}</p>
              </div>

              {/* Info Nota */}
              <div className="flex justify-between items-center text-xs">
                <div>
                  <span className="text-slate-500 block text-[10px]">Nomor Nota:</span>
                  <span className="font-black text-blue-700 text-sm">
                    {selectedPelanggan.id_pelanggan}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-slate-500 block text-[10px]">Tanggal Masuk:</span>
                  <span className="font-semibold text-slate-700">
                    {formatTanggal(selectedPelanggan.tanggal_masuk)}
                  </span>
                </div>
              </div>

              {/* Info Pelanggan */}
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Nama Pelanggan:</span>
                  <span className="font-bold text-slate-800">{selectedPelanggan.nama}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Nomor HP/WA:</span>
                  <span className="font-medium text-slate-800">{selectedPelanggan.no_hp}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Alamat:</span>
                  <span className="font-medium text-slate-800 text-right max-w-[200px] truncate">
                    {selectedPelanggan.alamat}
                  </span>
                </div>
              </div>

              {/* Detail Transaksi */}
              <div className="border-t border-b border-dashed border-slate-300 py-3 space-y-2">
                <div className="flex justify-between">
                  <span className="font-bold text-slate-700">
                    {selectedPelanggan.layanan?.nama_layanan}
                  </span>
                  <span className="font-bold text-slate-900">
                    {formatRupiah(selectedPelanggan.total_harga)}
                  </span>
                </div>
                <div className="flex justify-between text-[11px] text-slate-500">
                  <span>
                    {selectedPelanggan.berat} {selectedPelanggan.layanan?.satuan || 'kg'} x{' '}
                    {formatRupiah(selectedPelanggan.layanan?.harga || 0)}
                  </span>
                  <span>Est: {selectedPelanggan.layanan?.estimasi_durasi || '2 Hari'}</span>
                </div>
              </div>

              {/* Status & Total */}
              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Status Proses Cucian:</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${getStatusBadge(
                      selectedPelanggan.status_cucian
                    )}`}
                  >
                    {selectedPelanggan.status_cucian}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Status Pembayaran:</span>
                  <span
                    className={`font-bold ${
                      selectedPelanggan.status_bayar === 'lunas'
                        ? 'text-emerald-700'
                        : 'text-rose-600'
                    }`}
                  >
                    {selectedPelanggan.status_bayar === 'lunas' ? 'LUNAS' : 'BELUM LUNAS'}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm font-black pt-2 border-t border-slate-200">
                  <span className="text-slate-900">TOTAL PEMBAYARAN:</span>
                  <span className="text-blue-700 text-base">
                    {formatRupiah(selectedPelanggan.total_harga)}
                  </span>
                </div>
              </div>

              {/* Footer Nota */}
              <div className="pt-3 text-center border-t border-dashed border-slate-300 text-[10px] text-slate-400 space-y-1">
                <p>Simpan nota ini untuk mengambil cucian atau cek status online.</p>
                <p>Kasir Pemroses: {selectedPelanggan.admin?.nama || 'Admin'}</p>
                <p className="font-semibold text-blue-600 pt-1">Terima Kasih atas Kepercayaan Anda!</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
