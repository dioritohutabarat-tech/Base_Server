import type {
  Pelanggan,
  PelangganFormData,
  PelangganWithDetails,
  StatusCucian,
  StatusBayar,
  DashboardStats,
} from '../types';
import { STORAGE_KEYS, getItem, setItem, initializeStorage } from './dataStorage';
import { layananService } from './layananService';
import { adminService } from './adminService';

// Inisialisasi storage
initializeStorage();

export const pelangganService = {
  // Ambil semua data pelanggan/cucian
  getAll(): Pelanggan[] {
    return getItem<Pelanggan[]>(STORAGE_KEYS.PELANGGAN, []);
  },

  // Ambil data pelanggan dengan relasi Layanan dan Admin
  getAllWithDetails(): PelangganWithDetails[] {
    const list = this.getAll();
    const layananList = layananService.getAll();
    const adminList = adminService.getAll();

    return list.map((pelanggan) => ({
      ...pelanggan,
      layanan: layananList.find((l) => l.id_layanan === pelanggan.id_layanan),
      admin: adminList.find((a) => a.id_admin === pelanggan.id_admin),
    }));
  },

  // Ambil detail pelanggan berdasarkan nomor nota (id_pelanggan)
  getById(id: string): Pelanggan | undefined {
    const list = this.getAll();
    return list.find((item) => item.id_pelanggan.toLowerCase() === id.toLowerCase().trim());
  },

  // Ambil detail pelanggan dengan relasi berdasarkan ID
  getByIdWithDetails(id: string): PelangganWithDetails | undefined {
    const pelanggan = this.getById(id);
    if (!pelanggan) return undefined;

    return {
      ...pelanggan,
      layanan: layananService.getById(pelanggan.id_layanan),
      admin: adminService.getById(pelanggan.id_admin),
    };
  },

  // Cek Status Cucian Publik: verifikasi nomor nota dan 4 digit terakhir nomor HP
  getByNotaAndPhone(idNota: string, last4Phone: string): PelangganWithDetails | null {
    const cleanNota = idNota.trim().toUpperCase();
    const cleanDigits = last4Phone.replace(/\D/g, '');

    if (!cleanNota || cleanDigits.length !== 4) {
      return null;
    }

    const listWithDetails = this.getAllWithDetails();
    const matched = listWithDetails.find((item) => {
      const notaMatch = item.id_pelanggan.toUpperCase() === cleanNota;
      const cleanPhone = item.no_hp.replace(/\D/g, '');
      const phoneMatch = cleanPhone.endsWith(cleanDigits);
      return notaMatch && phoneMatch;
    });

    return matched || null;
  },

  // Generate nomor nota otomatis dengan format CL-0001, CL-0002, dst.
  generateNextId(): string {
    const list = this.getAll();
    if (list.length === 0) return 'CL-0001';

    const numbers = list.map((item) => {
      const match = item.id_pelanggan.match(/\d+/);
      return match ? parseInt(match[0], 10) : 0;
    });
    const maxNum = Math.max(...numbers, 0);
    const nextNum = maxNum + 1;
    return `CL-${String(nextNum).padStart(4, '0')}`;
  },

  // Hitung total harga otomatis = berat * harga_layanan
  calculateTotalHarga(idLayanan: string, berat: number): number {
    const layanan = layananService.getById(idLayanan);
    if (!layanan) return 0;
    return Math.round(berat * layanan.harga);
  },

  // Tambah data cucian/pelanggan baru
  create(data: PelangganFormData): Pelanggan {
    const list = this.getAll();
    const id_pelanggan = this.generateNextId();
    const total_harga = this.calculateTotalHarga(data.id_layanan, data.berat);

    const newPelanggan: Pelanggan = {
      ...data,
      id_pelanggan,
      total_harga,
      tanggal_masuk: data.tanggal_masuk || new Date().toISOString(),
    };

    // Tambah ke awal list (terbaru di atas)
    list.unshift(newPelanggan);
    setItem(STORAGE_KEYS.PELANGGAN, list);
    return newPelanggan;
  },

  // Update data cucian/pelanggan
  update(id: string, data: Partial<PelangganFormData>): Pelanggan | null {
    const list = this.getAll();
    const index = list.findIndex(
      (item) => item.id_pelanggan.toLowerCase() === id.toLowerCase().trim()
    );
    if (index === -1) return null;

    const current = list[index];
    const targetLayanan = data.id_layanan || current.id_layanan;
    const targetBerat = data.berat !== undefined ? data.berat : current.berat;
    const updatedTotal = this.calculateTotalHarga(targetLayanan, targetBerat);

    list[index] = {
      ...current,
      ...data,
      total_harga: updatedTotal,
    };

    setItem(STORAGE_KEYS.PELANGGAN, list);
    return list[index];
  },

  // Update cepat status cucian dan/atau status bayar
  updateStatus(
    id: string,
    status_cucian?: StatusCucian,
    status_bayar?: StatusBayar
  ): Pelanggan | null {
    const list = this.getAll();
    const index = list.findIndex(
      (item) => item.id_pelanggan.toLowerCase() === id.toLowerCase().trim()
    );
    if (index === -1) return null;

    if (status_cucian) {
      list[index].status_cucian = status_cucian;
    }
    if (status_bayar) {
      list[index].status_bayar = status_bayar;
    }

    setItem(STORAGE_KEYS.PELANGGAN, list);
    return list[index];
  },

  // Hapus data cucian/pelanggan
  delete(id: string): boolean {
    const list = this.getAll();
    const filtered = list.filter(
      (item) => item.id_pelanggan.toLowerCase() !== id.toLowerCase().trim()
    );
    if (filtered.length === list.length) return false;

    setItem(STORAGE_KEYS.PELANGGAN, filtered);
    return true;
  },

  // Dapatkan ringkasan statistik untuk dashboard
  getDashboardStats(): DashboardStats {
    const list = this.getAll();

    const totalMasuk = list.length;
    const belumSelesai = list.filter((p) => p.status_cucian !== 'selesai').length;
    const belumBayar = list.filter((p) => p.status_bayar === 'belum').length;
    const selesai = list.filter((p) => p.status_cucian === 'selesai').length;
    const totalPendapatan = list
      .filter((p) => p.status_bayar === 'lunas')
      .reduce((sum, item) => sum + item.total_harga, 0);

    return {
      totalMasuk,
      belumSelesai,
      belumBayar,
      selesai,
      totalPendapatan,
    };
  },
};
