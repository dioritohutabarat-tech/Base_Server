# Sistem Informasi Ceria Laundry 🧺✨
**Tugas Proyek Kuliah PBAD (Pengembangan Berbasis Antarmuka & Data)**

Aplikasi web sistem informasi manajemen dan pelacakan laundry modern, dirancang khusus untuk mengatasi permasalahan nota kertas manual yang mudah hilang/tertukar dan mempermudah pelanggan memantau progres cucian secara *real-time*.

---

## 🏢 Profil & Konteks Usaha
- **Nama Usaha**: Ceria Laundry
- **Lokasi**: Jl. Pulau Nias No. 2A, samping Klinik Helvetia, Medan
- **Jam Operasional**: 
  - Senin – Sabtu: 07.30 – 20.00 WIB
  - Minggu: 08.30 – 17.00 WIB
- **Kontak WhatsApp**: 0812-6088-9911
- **Masalah Bisnis yang Diselesaikan**:
  1. Pencatatan manual menggunakan nota kertas rentan basah, sobek, hilang, atau tertukar.
  2. Pelanggan seringkali harus menelepon atau datang langsung ke outlet hanya untuk menanyakan apakah pakaian sudah selesai dicuci.
  3. Kesulitan staf/kasir dalam merekap piutang dan total pendapatan harian.

---

## 🚀 Fitur Utama

### 1. Halaman Publik (Pelanggan)
- **Beranda Interaktif**: Profil usaha Ceria Laundry, keunggulan 1 nota = 1 mesin, daftar paket layanan dan harga transparan, info lokasi outlet dan integrasi Google Maps, jam buka operasional, dan tombol WhatsApp instan.
- **Cek Status Cucian Online**:
  - Pelanggan cukup memasukkan **Nomor Nota** (contoh: `CL-0001`) dan **4 digit terakhir nomor HP**.
  - **Visual Progress Tracker**: Tahapan status cucian (*Diterima* ➜ *Dicuci* ➜ *Disetrika* ➜ *Siap Diambil* ➜ *Selesai*).
  - Rincian lengkap: jenis layanan, berat/jumlah, total harga, status pembayaran (*Lunas* / *Belum Lunas*), dan notifikasi kesiapan pengambilan.
  - Tersedia tombol *1-Click Demo Dummy* agar penguji/dosen dapat langsung mencoba tanpa mengetik manual.

### 2. Halaman Panel Admin (Staf & Manajemen)
- **Akses Terproteksi (Protected Route)**: Hanya admin/kasir yang telah login yang dapat mengakses panel admin (`/admin/*`).
- **Keamanan Kredensial**: Password admin dienkripsi satu arah dengan hash **SHA-256** (bukan teks polos).
- **Dashboard Ringkas**:
  - Statistik *real-time*: Total Cucian Masuk, Cucian Sedang Diproses, Cucian Belum Bayar (Piutang), dan Total Pendapatan Terbayar.
  - Tabel 5 transaksi terbaru dengan tombol *quick update* status cucian dan status bayar langsung.
- **Kelola Transaksi Cucian (Pelanggan)**:
  - Tambah transaksi: Penomoran nota otomatis (`CL-0001`, `CL-0002`, dst.).
  - **Kalkulasi Otomatis**: `total_harga = berat × harga layanan`.
  - Validasi ketat: nomor HP valid dan berat > 0.
  - Ubah data, update status bertahap, dan hapus cucian.
  - Filter status cucian & filter status pembayaran.
  - Pencarian instan (nama pelanggan, nomor nota, atau no HP).
  - **Modal Nota Resmi**: Format nota struk Ceria Laundry siap cetak (*print-ready*).
- **Kelola Paket Layanan**: Tambah, ubah, dan hapus tarif layanan, satuan (kg / pcs), dan estimasi waktu.
- **Kelola Admin & Karyawan**: Tambah kasir/admin baru, ubah peran, ubah password ber-hash, dan proteksi akun admin terakhir.

---

## 🛠️ Arsitektur & Teknologi
- **Framework**: [React 19](https://react.dev/) + [Vite](https://vite.dev/)
- **Bahasa**: [TypeScript](https://www.typescriptlang.org/) (Strict typing untuk semua entitas data)
- **Routing**: [React Router DOM v7](https://reactrouter.com/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) (Desain modern, responsif mobile, palet dominan biru & putih)
- **Ikon**: [Lucide React](https://lucide.dev/)
- **Penyimpanan Data**: `localStorage` dibungkus dalam lapisan **Service Layer** terpisah (`layananService`, `adminService`, `pelangganService`), sehingga sewaktu-waktu sangat mudah dihubungkan ke backend database (MySQL / PostgreSQL / Firebase) tanpa mengubah kode antarmuka.

---

## 📂 Struktur Folder Proyek
```text
laundry_projectt/
├── public/
│   └── favicon.svg           # Ikon favicon Ceria Laundry
├── src/
│   ├── components/
│   │   ├── admin/            # AdminLayout, ProtectedRoute
│   │   └── public/           # PublicNavbar, PublicFooter, PublicLayout
│   ├── pages/
│   │   ├── admin/            # LoginPage, DashboardPage, PelangganPage, LayananPage, AdminManagePage
│   │   └── public/           # HomePage, CekStatusPage
│   ├── services/
│   │   ├── dataStorage.ts    # Key localStorage, initial seed data dummy & profile
│   │   ├── layananService.ts # Service CRUD Layanan
│   │   ├── adminService.ts   # Service CRUD Admin & Login Auth
│   │   ├── pelangganService.ts # Service CRUD Cucian, kalkulasi, tracking
│   │   └── index.ts          # Barrel export service
│   ├── types/
│   │   └── index.ts          # Interface TypeScript (Pelanggan, Layanan, Admin, dll)
│   ├── utils/
│   │   └── crypto.ts         # SHA-256 Hashing, formatRupiah, formatTanggal
│   ├── App.tsx               # Konfigurasi Rute & Navigasi
│   ├── index.css             # Konfigurasi Tailwind & print style
│   └── main.tsx              # Entry point aplikasi
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## 🔑 Akun Admin Demo untuk Pengujian
Untuk mempermudah dosen atau penguji mencoba panel admin, data akun dummy telah diinisialisasi otomatis:

| Posisi / Peran | Username | Password Demo | Status Enkripsi |
| :--- | :--- | :--- | :--- |
| **Owner / Supervisor** | `admin` | `admin123` | SHA-256 Hashed |
| **Kasir & Front Office** | `kasir` | `kasir123` | SHA-256 Hashed |

> *Catatan: Di halaman login admin (`/admin/login`), terdapat tombol "Akun Demo untuk Pengujian" yang dapat diklik untuk mengisi username & password secara otomatis.*

---

## 📋 Data Contoh (Dummy) untuk Uji Cek Status Pelanggan
Kunjungi menu **Cek Status Cucian** (`/cek-status`) dan uji dengan kombinasi data berikut:

1. **Nota**: `CL-0001` &bull; **4 Digit No HP**: `7890` (Pelanggan: Budi Santoso &bull; Status: Selesai &bull; Lunas)
2. **Nota**: `CL-0002` &bull; **4 Digit No HP**: `1234` (Pelanggan: Siti Aminah &bull; Status: Siap Diambil &bull; Lunas)
3. **Nota**: `CL-0003` &bull; **4 Digit No HP**: `7766` (Pelanggan: Ahmad Fauzi &bull; Status: Disetrika &bull; Belum Lunas)
4. **Nota**: `CL-0004` &bull; **4 Digit No HP**: `5678` (Pelanggan: Rina Kartika &bull; Status: Dicuci &bull; Lunas)
5. **Nota**: `CL-0005` &bull; **4 Digit No HP**: `2109` (Pelanggan: Dedi Kurniawan &bull; Status: Diterima &bull; Belum Lunas)

---

## 💻 Panduan Menjalankan Proyek di Komputer Lokal

### 1. Prasyarat
Pastikan komputer telah terinstal:
- [Node.js](https://nodejs.org/) (versi 18 ke atas disarankan)
- NPM atau PNPM

### 2. Instalasi Dependensi
Buka terminal pada folder proyek ini, lalu jalankan:
```bash
npm install
```

### 3. Menjalankan Server Pengembangan (Dev Server)
```bash
npm run dev
```
Setelah dijalankan, buka browser di alamat yang muncul di terminal (biasanya `http://localhost:5173/`).

### 4. Build untuk Produksi
Untuk memastikan tipe TypeScript valid dan membuat bundle produksi:
```bash
npm run build
```
Hasil build siap saji akan disimpan di folder `dist/`.
