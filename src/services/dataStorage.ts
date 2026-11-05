import type { Layanan, Admin, Pelanggan } from '../types';

// Key Penyimpanan localStorage
export const STORAGE_KEYS = {
  LAYANAN: 'ceria_laundry_layanan',
  ADMIN: 'ceria_laundry_admin',
  PELANGGAN: 'ceria_laundry_pelanggan',
  CURRENT_ADMIN: 'ceria_laundry_current_admin',
};

// Data Profil Usaha Ceria Laundry
export const PROFIL_USAHA = {
  nama: 'Ceria Laundry',
  tagline: 'Bersih, Wangi, Rapi, & Tepat Waktu',
  deskripsi: 'Solusi terbaik untuk perawatan pakaian Anda di Medan. Kami menggunakan deterjen berkualitas, mesin modern, serta setrika uap berstandar profesional.',
  alamat: 'Jl. Pulau Nias No. 2A, samping Klinik Helvetia, Medan',
  jamBuka: 'Senin - Sabtu: 07.30 - 20.00 WIB | Minggu: 08.30 - 17.00 WIB',
  whatsapp: '6281260889911', // Format internasional untuk wa.me
  whatsappDisplay: '0812-6088-9911',
  email: 'halo@cerialaundry.com',
};

// Data Dummy Awal: Layanan (4 Layanan Lengkap)
const INITIAL_LAYANAN: Layanan[] = [
  {
    id_layanan: 'LAY-01',
    nama_layanan: 'Cuci Kiloan Reguler',
    harga: 7000,
    satuan: 'kg',
    estimasi_durasi: '2 Hari',
  },
  {
    id_layanan: 'LAY-02',
    nama_layanan: 'Cuci + Setrika Uap',
    harga: 9000,
    satuan: 'kg',
    estimasi_durasi: '2 Hari',
  },
  {
    id_layanan: 'LAY-03',
    nama_layanan: 'Setrika Uap Saja',
    harga: 6000,
    satuan: 'kg',
    estimasi_durasi: '1 Hari',
  },
  {
    id_layanan: 'LAY-04',
    nama_layanan: 'Selimut / Bed Cover',
    harga: 25000,
    satuan: 'pcs',
    estimasi_durasi: '3 Hari',
  },
];

// Data Dummy Awal: Admin (Password di-hash SHA-256)
// admin123 -> 240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9
// kasir123 -> 825656c1d735d45d6560ee8ff7ad1f1e737c0303ecaa68a5734dfeb4ecb0e8b8
const INITIAL_ADMIN: Admin[] = [
  {
    id_admin: 'ADM-01',
    nama: 'Bambang Sudibyo',
    username: 'admin',
    password: '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', // password: admin123
    no_hp: '081260881122',
    posisi: 'Owner / Supervisor',
  },
  {
    id_admin: 'ADM-02',
    nama: 'Dewi Lestari',
    username: 'kasir',
    password: '825656c1d735d45d6560ee8ff7ad1f1e737c0303ecaa68a5734dfeb4ecb0e8b8', // password: kasir123
    no_hp: '085377889900',
    posisi: 'Kasir & Front Office',
  },
];

// Data Dummy Awal: 5 Pelanggan dengan berbagai status
const INITIAL_PELANGGAN: Pelanggan[] = [
  {
    id_pelanggan: 'CL-0001',
    nama: 'Budi Santoso',
    no_hp: '081234567890',
    alamat: 'Jl. Thamrin No. 12, Medan',
    id_layanan: 'LAY-02', // Cuci + Setrika
    berat: 3.5,
    total_harga: 31500, // 3.5 * 9000
    tanggal_masuk: '2026-11-03T09:15:00',
    status_cucian: 'selesai',
    status_bayar: 'lunas',
    id_admin: 'ADM-01',
  },
  {
    id_pelanggan: 'CL-0002',
    nama: 'Siti Aminah',
    no_hp: '085278901234',
    alamat: 'Jl. Krakatau No. 45, Helvetia',
    id_layanan: 'LAY-01', // Cuci Kiloan
    berat: 5,
    total_harga: 35000, // 5 * 7000
    tanggal_masuk: '2026-11-03T14:30:00',
    status_cucian: 'siap diambil',
    status_bayar: 'lunas',
    id_admin: 'ADM-02',
  },
  {
    id_pelanggan: 'CL-0003',
    nama: 'Ahmad Fauzi',
    no_hp: '081399887766',
    alamat: 'Jl. Perintis Kemerdekaan No. 8',
    id_layanan: 'LAY-03', // Setrika Saja
    berat: 2,
    total_harga: 12000, // 2 * 6000
    tanggal_masuk: '2026-11-04T10:00:00',
    status_cucian: 'disetrika',
    status_bayar: 'belum',
    id_admin: 'ADM-01',
  },
  {
    id_pelanggan: 'CL-0004',
    nama: 'Rina Kartika',
    no_hp: '087812345678',
    alamat: 'Jl. Gatot Subroto No. 20',
    id_layanan: 'LAY-04', // Selimut / Bed Cover
    berat: 2, // 2 pcs
    total_harga: 50000, // 2 * 25000
    tanggal_masuk: '2026-11-04T16:20:00',
    status_cucian: 'dicuci',
    status_bayar: 'lunas',
    id_admin: 'ADM-02',
  },
  {
    id_pelanggan: 'CL-0005',
    nama: 'Dedi Kurniawan',
    no_hp: '082165432109',
    alamat: 'Jl. Diponegoro No. 15',
    id_layanan: 'LAY-02', // Cuci + Setrika
    berat: 4,
    total_harga: 36000, // 4 * 9000
    tanggal_masuk: '2026-11-05T08:45:00',
    status_cucian: 'diterima',
    status_bayar: 'belum',
    id_admin: 'ADM-01',
  },
];

// Inisialisasi Storage jika belum ada data sebelumnya
export function initializeStorage(): void {
  if (typeof window === 'undefined') return;

  if (!localStorage.getItem(STORAGE_KEYS.LAYANAN)) {
    localStorage.setItem(STORAGE_KEYS.LAYANAN, JSON.stringify(INITIAL_LAYANAN));
  }
  if (!localStorage.getItem(STORAGE_KEYS.ADMIN)) {
    localStorage.setItem(STORAGE_KEYS.ADMIN, JSON.stringify(INITIAL_ADMIN));
  }
  if (!localStorage.getItem(STORAGE_KEYS.PELANGGAN)) {
    localStorage.setItem(STORAGE_KEYS.PELANGGAN, JSON.stringify(INITIAL_PELANGGAN));
  }
}

// Helper umum untuk membaca dari localStorage
export function getItem<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Gagal membaca key ${key} dari localStorage:`, error);
    return defaultValue;
  }
}

// Helper umum untuk menulis ke localStorage
export function setItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Gagal menyimpan key ${key} ke localStorage:`, error);
  }
}
