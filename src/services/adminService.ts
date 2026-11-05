import type { Admin, AdminFormData } from '../types';
import { STORAGE_KEYS, getItem, setItem, initializeStorage } from './dataStorage';
import { hashPassword } from '../utils/crypto';

// Inisialisasi storage
initializeStorage();

export const adminService = {
  // Ambil semua daftar admin
  getAll(): Admin[] {
    return getItem<Admin[]>(STORAGE_KEYS.ADMIN, []);
  },

  // Ambil admin berdasarkan ID
  getById(id: string): Admin | undefined {
    const list = this.getAll();
    return list.find((item) => item.id_admin === id);
  },

  // Ambil admin berdasarkan username
  getByUsername(username: string): Admin | undefined {
    const list = this.getAll();
    return list.find((item) => item.username.toLowerCase() === username.toLowerCase());
  },

  // Generate ID baru (format: ADM-01, ADM-02, dst)
  generateNextId(): string {
    const list = this.getAll();
    if (list.length === 0) return 'ADM-01';

    const numbers = list.map((item) => {
      const match = item.id_admin.match(/\d+/);
      return match ? parseInt(match[0], 10) : 0;
    });
    const maxNum = Math.max(...numbers, 0);
    const nextNum = maxNum + 1;
    return `ADM-${String(nextNum).padStart(2, '0')}`;
  },

  // Tambah admin baru dengan password ter-hash
  async create(data: AdminFormData): Promise<Admin> {
    const list = this.getAll();
    const hashedPassword = await hashPassword(data.password);
    const newAdmin: Admin = {
      ...data,
      id_admin: this.generateNextId(),
      password: hashedPassword,
    };
    list.push(newAdmin);
    setItem(STORAGE_KEYS.ADMIN, list);
    return newAdmin;
  },

  // Update data admin (jika password kosong, gunakan password lama)
  async update(id: string, data: Partial<AdminFormData>): Promise<Admin | null> {
    const list = this.getAll();
    const index = list.findIndex((item) => item.id_admin === id);
    if (index === -1) return null;

    let updatedPassword = list[index].password;
    if (data.password && data.password.trim() !== '') {
      updatedPassword = await hashPassword(data.password);
    }

    list[index] = {
      ...list[index],
      ...data,
      password: updatedPassword,
    };
    setItem(STORAGE_KEYS.ADMIN, list);

    // Update current_admin jika admin yang sedang login diedit
    const currentAdmin = this.getCurrentAdmin();
    if (currentAdmin && currentAdmin.id_admin === id) {
      setItem(STORAGE_KEYS.CURRENT_ADMIN, list[index]);
    }

    return list[index];
  },

  // Hapus data admin
  delete(id: string): boolean {
    const list = this.getAll();
    const filtered = list.filter((item) => item.id_admin !== id);
    if (filtered.length === list.length) return false;

    setItem(STORAGE_KEYS.ADMIN, filtered);

    // Jika admin yang dihapus adalah yang sedang login, logout
    const currentAdmin = this.getCurrentAdmin();
    if (currentAdmin && currentAdmin.id_admin === id) {
      this.logout();
    }

    return true;
  },

  // Proses Autentikasi / Login Admin
  async login(username: string, plainPassword: string): Promise<{ success: boolean; admin?: Admin; message: string }> {
    const admin = this.getByUsername(username);
    if (!admin) {
      return { success: false, message: 'Username tidak ditemukan' };
    }

    const hashedPassword = await hashPassword(plainPassword);
    if (admin.password !== hashedPassword) {
      return { success: false, message: 'Password salah' };
    }

    // Simpan sesi login di localStorage
    setItem(STORAGE_KEYS.CURRENT_ADMIN, admin);
    return { success: true, admin, message: 'Login berhasil' };
  },

  // Logout admin
  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_ADMIN);
    }
  },

  // Cek admin yang sedang aktif/login
  getCurrentAdmin(): Admin | null {
    return getItem<Admin | null>(STORAGE_KEYS.CURRENT_ADMIN, null);
  },

  // Cek apakah admin sudah terotentikasi
  isAuthenticated(): boolean {
    return this.getCurrentAdmin() !== null;
  },
};
