import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Clock } from 'lucide-react';
import { layananService } from '../../services';
import type { Layanan, LayananFormData } from '../../types';
import { formatRupiah } from '../../utils/crypto';

export const LayananPage: React.FC = () => {
  const [layananList, setLayananList] = useState<Layanan[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState<LayananFormData>({
    nama_layanan: '',
    harga: 7000,
    satuan: 'kg',
    estimasi_durasi: '2 Hari',
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const refreshData = () => {
    setLayananList(layananService.getAll());
  };

  useEffect(() => {
    refreshData();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'harga' ? parseInt(value, 10) || 0 : value,
    }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    if (!formData.nama_layanan.trim()) {
      errors.nama_layanan = 'Nama layanan wajib diisi';
    }
    if (formData.harga <= 0) {
      errors.harga = 'Harga harus lebih dari 0';
    }
    if (!formData.estimasi_durasi.trim()) {
      errors.estimasi_durasi = 'Estimasi durasi wajib diisi';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const openAddModal = () => {
    setEditingId(null);
    setFormData({
      nama_layanan: '',
      harga: 7000,
      satuan: 'kg',
      estimasi_durasi: '2 Hari',
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const openEditModal = (item: Layanan) => {
    setEditingId(item.id_layanan);
    setFormData({
      nama_layanan: item.nama_layanan,
      harga: item.harga,
      satuan: item.satuan,
      estimasi_durasi: item.estimasi_durasi,
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (editingId) {
      layananService.update(editingId, formData);
    } else {
      layananService.create(formData);
    }

    refreshData();
    setIsModalOpen(false);
  };

  const handleDelete = (id: string, nama: string) => {
    if (window.confirm(`Yakin ingin menghapus layanan "${nama}" (${id})?`)) {
      layananService.delete(id);
      refreshData();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Kelola Paket & Layanan</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Daftar harga dan estimasi durasi pencucian yang dapat dipilih pelanggan
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md shadow-blue-600/30 text-xs transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          Tambah Layanan Baru
        </button>
      </div>

      {/* Grid Kartu / Tabel Layanan */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {layananList.map((item) => (
          <div
            key={item.id_layanan}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow relative"
          >
            <div>
              <div className="flex justify-between items-start mb-3">
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 bg-blue-50 text-blue-700 rounded-lg border border-blue-200">
                  {item.id_layanan}
                </span>
                <span className="text-xs font-semibold text-slate-500 flex items-center">
                  <Clock className="w-3.5 h-3.5 mr-1 text-slate-400" />
                  {item.estimasi_durasi}
                </span>
              </div>
              <h3 className="font-extrabold text-slate-900 text-base mb-1">
                {item.nama_layanan}
              </h3>
              <p className="text-2xl font-black text-blue-700 mb-4">
                {formatRupiah(item.harga)}
                <span className="text-xs font-medium text-slate-500"> / {item.satuan}</span>
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-2">
              <button
                onClick={() => openEditModal(item)}
                className="px-3 py-1.5 bg-amber-50 text-amber-700 hover:bg-amber-100 rounded-xl font-bold text-xs flex items-center transition-colors cursor-pointer"
              >
                <Edit2 className="w-3.5 h-3.5 mr-1" />
                Ubah
              </button>
              <button
                onClick={() => handleDelete(item.id_layanan, item.nama_layanan)}
                className="px-3 py-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-xl font-bold text-xs flex items-center transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5 mr-1" />
                Hapus
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Form Tambah/Ubah Layanan */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">
                  {editingId ? `Ubah Layanan (${editingId})` : 'Tambah Layanan Baru'}
                </h3>
                <p className="text-xs text-slate-500">Isi parameter layanan dan tarif per satuan</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Nama Layanan <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="nama_layanan"
                  value={formData.nama_layanan}
                  onChange={handleInputChange}
                  placeholder="Contoh: Cuci Kering Kilat"
                  className={`w-full px-3 py-2 bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    formErrors.nama_layanan ? 'border-rose-400' : 'border-slate-200'
                  }`}
                />
                {formErrors.nama_layanan && (
                  <p className="text-rose-500 text-[11px] mt-1">{formErrors.nama_layanan}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Harga (Rp) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="harga"
                    step="500"
                    min="500"
                    value={formData.harga || ''}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      formErrors.harga ? 'border-rose-400' : 'border-slate-200'
                    }`}
                  />
                  {formErrors.harga && (
                    <p className="text-rose-500 text-[11px] mt-1">{formErrors.harga}</p>
                  )}
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Satuan Hitung
                  </label>
                  <select
                    name="satuan"
                    value={formData.satuan}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="kg">Per Kilogram (kg)</option>
                    <option value="pcs">Per Buah (pcs)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Estimasi Durasi Pengerjaan <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="estimasi_durasi"
                  value={formData.estimasi_durasi}
                  onChange={handleInputChange}
                  placeholder="Contoh: 1 Hari, 2 Hari, atau 6 Jam (Express)"
                  className={`w-full px-3 py-2 bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    formErrors.estimasi_durasi ? 'border-rose-400' : 'border-slate-200'
                  }`}
                />
                {formErrors.estimasi_durasi && (
                  <p className="text-rose-500 text-[11px] mt-1">{formErrors.estimasi_durasi}</p>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md shadow-blue-600/30 transition-all cursor-pointer"
                >
                  {editingId ? 'Simpan Perubahan' : 'Tambah Layanan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
