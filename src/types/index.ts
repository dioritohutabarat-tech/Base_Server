// Status Cucian sesuai spesifikasi
export type StatusCucian = 'diterima' | 'dicuci' | 'disetrika' | 'siap diambil' | 'selesai';

// Status Bayar sesuai spesifikasi
export type StatusBayar = 'lunas' | 'belum';

// Satuan Layanan
export type SatuanLayanan = 'kg' | 'pcs';

// Entitas Layanan
export interface Layanan {
  id_layanan: string;
  nama_layanan: string;
  harga: number;
  satuan: SatuanLayanan;
  estimasi_durasi: string;
}

// Entitas Admin
export interface Admin {
  id_admin: string;
  nama: string;
  username: string;
  password: string; // Hashed password (SHA-256)
  no_hp: string;
  posisi: string;
}

// Entitas Pelanggan (1 baris = 1 transaksi cucian masuk)
export interface Pelanggan {
  id_pelanggan: string; // Nomor nota (misal: CL-0001)
  nama: string;
  no_hp: string;
  alamat: string;
  id_layanan: string; // Foreign Key ke Layanan
  berat: number;
  total_harga: number;
  tanggal_masuk: string; // Format ISO string atau YYYY-MM-DD HH:mm
  status_cucian: StatusCucian;
  status_bayar: StatusBayar;
  id_admin: string; // Foreign Key ke Admin (kasir pemroses)
}

// Data relasi gabungan untuk kemudahan rendering pada UI/tabel
export interface PelangganWithDetails extends Pelanggan {
  layanan?: Layanan;
  admin?: Admin;
}

// Tipe form input untuk Pelanggan
export type PelangganFormData = Omit<Pelanggan, 'id_pelanggan' | 'total_harga'>;

// Tipe form input untuk Layanan
export type LayananFormData = Omit<Layanan, 'id_layanan'>;

// Tipe form input untuk Admin
export type AdminFormData = Omit<Admin, 'id_admin'>;

// Ringkasan statistik untuk dashboard admin
export interface DashboardStats {
  totalMasuk: number;
  belumSelesai: number;
  belumBayar: number;
  selesai: number;
  totalPendapatan: number;
}
