import React, { useState, useEffect } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  X,
  ShieldCheck,
  Lock,
  Briefcase,
} from 'lucide-react';
import { adminService } from '../../services';
import type { Admin, AdminFormData } from '../../types';

export const AdminManagePage: React.FC = () => {
  const [adminList, setAdminList] = useState<Admin[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const currentAdmin = adminService.getCurrentAdmin();

  const [formData, setFormData] = useState<AdminFormData>({
    nama: '',
    username: '',
    password: '',
    no_hp: '',
    posisi: 'Kasir & Front Office',
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const refreshData = () => {
    setAdminList(adminService.getAll());
  };

  useEffect(() => {
    refreshData();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.nama.trim()) {
      errors.nama = 'Nama lengkap wajib diisi';
    }

    if (!formData.username.trim()) {
      errors.username = 'Username wajib diisi';
    } else {
      // Cek apakah username sudah dipakai oleh orang lain
      const existing = adminList.find(
        (a) =>
          a.username.toLowerCase() === formData.username.trim().toLowerCase() &&
          a.id_admin !== editingId
      );
      if (existing) {
        errors.username = 'Username sudah digunakan oleh akun lain';
      }
    }

    // Password wajib jika tambah baru
    if (!editingId && !formData.password) {
      errors.password = 'Password wajib diisi untuk akun baru';
    } else if (formData.password && formData.password.length < 5) {
      errors.password = 'Password minimal 5 karakter';
    }

    const cleanHp = formData.no_hp.replace(/\D/g, '');
    if (!cleanHp) {
      errors.no_hp = 'Nomor HP wajib diisi';
    } else if (cleanHp.length < 10 || cleanHp.length > 15) {
      errors.no_hp = 'Nomor HP tidak valid (10-15 digit)';
    }

    if (!formData.posisi.trim()) {
      errors.posisi = 'Posisi / jabatan wajib diisi';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const openAddModal = () => {
    setEditingId(null);
    setFormData({
      nama: '',
      username: '',
      password: '',
      no_hp: '',
      posisi: 'Kasir & Front Office',
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const openEditModal = (item: Admin) => {
    setEditingId(item.id_admin);
    setFormData({
      nama: item.nama,
      username: item.username,
      password: '', // Kosongkan, hanya diisi jika ingin mengganti password
      no_hp: item.no_hp,
      posisi: item.posisi,
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      if (editingId) {
        await adminService.update(editingId, formData);
      } else {
        await adminService.create(formData);
      }
      refreshData();
      setIsModalOpen(false);
    } catch {
      alert('Gagal menyimpan data admin.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (id: string, nama: string) => {
    if (adminList.length <= 1) {
      alert('Tidak dapat menghapus admin terakhir. Minimal harus ada 1 akun admin aktif.');
      return;
    }

    if (id === currentAdmin?.id_admin) {
      if (
        !window.confirm(
          `PERINGATAN: Anda sedang menghapus akun Anda sendiri (${nama}). Anda akan otomatis ter-logout dari sistem!`
        )
      ) {
        return;
      }
    } else {
      if (!window.confirm(`Yakin ingin menghapus data admin "${nama}" (${id})?`)) {
        return;
      }
    }

    adminService.delete(id);
    refreshData();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Kelola Akun Admin & Karyawan
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manajemen hak akses, kasir penerima cucian, dan keamanan kredensial sistem
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md shadow-blue-600/30 text-xs transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          Tambah Admin/Kasir
        </button>
      </div>

      {/* Info Keamanan Box */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl flex items-start space-x-3 text-xs text-blue-900">
        <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <h4 className="font-bold">Keamanan Enkripsi Password (Demo):</h4>
          <p className="text-blue-800 text-[11px] mt-0.5">
            Password setiap akun diproses melalui fungsi kriptografi satu arah (hashing SHA-256)
            sebelum disimpan ke storage, sehingga tidak tersimpan dalam bentuk teks biasa (plain-text).
          </p>
        </div>
      </div>

      {/* Tabel Data Admin */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                <th className="py-3.5 px-4">ID Admin</th>
                <th className="py-3.5 px-4">Nama Lengkap</th>
                <th className="py-3.5 px-4">Username</th>
                <th className="py-3.5 px-4">Posisi / Jabatan</th>
                <th className="py-3.5 px-4">Nomor HP</th>
                <th className="py-3.5 px-4">Status Password</th>
                <th className="py-3.5 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {adminList.map((item) => {
                const isCurrent = item.id_admin === currentAdmin?.id_admin;
                return (
                  <tr key={item.id_admin} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-blue-700">
                      {item.id_admin}
                      {isCurrent && (
                        <span className="ml-2 text-[10px] bg-blue-100 text-blue-800 font-bold px-1.5 py-0.5 rounded">
                          Akun Anda
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">{item.nama}</td>
                    <td className="py-3.5 px-4 text-slate-600 font-mono">@{item.username}</td>
                    <td className="py-3.5 px-4 text-slate-700 font-medium">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px]">
                        <Briefcase className="w-3 h-3 mr-1 text-slate-400" />
                        {item.posisi}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">{item.no_hp}</td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                        <Lock className="w-2.5 h-2.5 mr-1" />
                        Terenkripsi SHA-256
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center space-x-1.5">
                        <button
                          onClick={() => openEditModal(item)}
                          className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                          title="Ubah Data Admin"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id_admin, item.nama)}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Hapus Akun"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Form Tambah / Edit Admin */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">
                  {editingId ? `Ubah Data Akun (${editingId})` : 'Tambah Akun Admin/Staf'}
                </h3>
                <p className="text-xs text-slate-500">
                  {editingId
                    ? 'Kosongkan kolom password jika tidak ingin mengganti password lama'
                    : 'Kredensial baru untuk kasir atau pengelola laundry'}
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
              {/* Nama Lengkap */}
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Nama Lengkap <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="nama"
                  value={formData.nama}
                  onChange={handleInputChange}
                  placeholder="Contoh: Rahmat Hidayat"
                  className={`w-full px-3 py-2 bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    formErrors.nama ? 'border-rose-400' : 'border-slate-200'
                  }`}
                />
                {formErrors.nama && (
                  <p className="text-rose-500 text-[11px] mt-1">{formErrors.nama}</p>
                )}
              </div>

              {/* Username & Posisi */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Username <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    placeholder="Contoh: rahmat"
                    className={`w-full px-3 py-2 bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono ${
                      formErrors.username ? 'border-rose-400' : 'border-slate-200'
                    }`}
                  />
                  {formErrors.username && (
                    <p className="text-rose-500 text-[11px] mt-1">{formErrors.username}</p>
                  )}
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Posisi / Jabatan
                  </label>
                  <select
                    name="posisi"
                    value={formData.posisi}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Kasir & Front Office">Kasir & Front Office</option>
                    <option value="Owner / Supervisor">Owner / Supervisor</option>
                    <option value="Operator Cuci & Setrika">Operator Cuci & Setrika</option>
                  </select>
                </div>
              </div>

              {/* Nomor Handphone */}
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Nomor HP/WA <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  name="no_hp"
                  value={formData.no_hp}
                  onChange={handleInputChange}
                  placeholder="Contoh: 081260889900"
                  className={`w-full px-3 py-2 bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    formErrors.no_hp ? 'border-rose-400' : 'border-slate-200'
                  }`}
                />
                {formErrors.no_hp && (
                  <p className="text-rose-500 text-[11px] mt-1">{formErrors.no_hp}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  {editingId ? 'Password Baru (Opsional)' : 'Password Akun'}{' '}
                  {!editingId && <span className="text-rose-500">*</span>}
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder={
                    editingId
                      ? 'Biarkan kosong jika tidak ingin mengubah password'
                      : 'Minimal 5 karakter'
                  }
                  className={`w-full px-3 py-2 bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    formErrors.password ? 'border-rose-400' : 'border-slate-200'
                  }`}
                />
                {formErrors.password && (
                  <p className="text-rose-500 text-[11px] mt-1">{formErrors.password}</p>
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
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md shadow-blue-600/30 transition-all cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting
                    ? 'Menyimpan...'
                    : editingId
                    ? 'Simpan Perubahan'
                    : 'Tambah Admin'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
