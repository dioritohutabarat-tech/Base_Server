import type { Layanan, LayananFormData } from '../types';
import { STORAGE_KEYS, getItem, setItem, initializeStorage } from './dataStorage';

// Pastikan data awal sudah ada
initializeStorage();

export const layananService = {
  // Ambil semua daftar layanan
  getAll(): Layanan[] {
    return getItem<Layanan[]>(STORAGE_KEYS.LAYANAN, []);
  },

  // Ambil detail layanan berdasarkan ID
  getById(id: string): Layanan | undefined {
    const list = this.getAll();
    return list.find((item) => item.id_layanan === id);
  },

  // Generate ID baru (format: LAY-01, LAY-02, dst)
  generateNextId(): string {
    const list = this.getAll();
    if (list.length === 0) return 'LAY-01';

    const numbers = list.map((item) => {
      const match = item.id_layanan.match(/\d+/);
      return match ? parseInt(match[0], 10) : 0;
    });
    const maxNum = Math.max(...numbers, 0);
    const nextNum = maxNum + 1;
    return `LAY-${String(nextNum).padStart(2, '0')}`;
  },

  // Tambah layanan baru
  create(data: LayananFormData): Layanan {
    const list = this.getAll();
    const newLayanan: Layanan = {
      ...data,
      id_layanan: this.generateNextId(),
    };
    list.push(newLayanan);
    setItem(STORAGE_KEYS.LAYANAN, list);
    return newLayanan;
  },

  // Update data layanan
  update(id: string, data: Partial<LayananFormData>): Layanan | null {
    const list = this.getAll();
    const index = list.findIndex((item) => item.id_layanan === id);
    if (index === -1) return null;

    list[index] = {
      ...list[index],
      ...data,
    };
    setItem(STORAGE_KEYS.LAYANAN, list);
    return list[index];
  },

  // Hapus data layanan
  delete(id: string): boolean {
    const list = this.getAll();
    const filtered = list.filter((item) => item.id_layanan !== id);
    if (filtered.length === list.length) return false;

    setItem(STORAGE_KEYS.LAYANAN, filtered);
    return true;
  },
};
