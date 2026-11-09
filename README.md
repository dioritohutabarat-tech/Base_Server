# Laundry Ceria

Project dipisah menjadi `frontend` (Vite + React + Axios) dan `backend` (Express + SQLite dari ZIP referensi).

## Menjalankan frontend
```bash
cd frontend
npm install
copy .env.example .env
npm run dev
```
Frontend wajib berjalan di **http://localhost:5173**. Vite dikonfigurasi `strictPort: true`.

## Menjalankan backend
```bash
cd backend
npm install
npm start
```
Backend referensi dipertahankan seminimal mungkin. Frontend memiliki mode demo interaktif (data disimpan di localStorage) sehingga semua halaman dapat dicoba tanpa API. Axios telah disiapkan di `frontend/src/api.js`; atur `VITE_API_URL` pada `.env` untuk menghubungkan API. Endpoint referensi backend saat ini belum memasang seluruh route laundry/auth pada `server.js`, jadi integrasi data permanen memerlukan route tersebut diaktifkan dan disesuaikan.

Akun demo: masukkan email/kata sandi apa saja di halaman login, atau buat akun melalui registrasi.
