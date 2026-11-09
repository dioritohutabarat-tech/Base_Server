CREATE TABLE IF NOT EXISTS test_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO test_logs DEFAULT VALUES;

CREATE TABLE IF NOT EXISTS layanan (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  nama         TEXT    NOT NULL,
  deskripsi    TEXT    NOT NULL DEFAULT '',
  harga        INTEGER NOT NULL,
  satuan       TEXT    NOT NULL CHECK (satuan IN ('kg', 'pcs')),
  perJumlah    INTEGER NOT NULL DEFAULT 1,
  estimasiHari INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS pelanggan (
  id      INTEGER PRIMARY KEY AUTOINCREMENT,
  nama    TEXT NOT NULL,
  telepon TEXT NOT NULL UNIQUE,
  alamat  TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS staf (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  nama         TEXT    NOT NULL,
  username     TEXT    NOT NULL UNIQUE,
  passwordHash TEXT    NOT NULL,
  role         TEXT    NOT NULL CHECK (role IN ('owner', 'staf')),
  aktif        INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS pesanan (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  pelangganId  INTEGER NOT NULL REFERENCES pelanggan(id),
  layananId    INTEGER NOT NULL REFERENCES layanan(id),
  jumlah       REAL    NOT NULL,
  hargaSatuan  INTEGER NOT NULL,
  totalHarga   INTEGER NOT NULL,
  statusCucian TEXT    NOT NULL,
  statusBayar  TEXT    NOT NULL,
  tanggalMasuk TEXT    NOT NULL,
  stafId       INTEGER NOT NULL REFERENCES staf(id)
);

CREATE TABLE IF NOT EXISTS app_meta (
  key   TEXT PRIMARY KEY,
  value TEXT
);

/* ---------- Data awal (hanya dijalankan sekali) ---------- */

INSERT INTO layanan (nama, deskripsi, harga, satuan, perJumlah, estimasiHari)
SELECT column1, column2, column3, column4, column5, column6 FROM (VALUES
  ('Cuci Kering',    'Pakaian dicuci dan dikeringkan.',  20000, 'kg', 8, 3),
  ('Cuci + Setrika', 'Pakaian dicuci dan disetrika.',    35000, 'kg', 8, 2),
  ('Setrika saja',   'Khusus setrika untuk pakaian yang sudah bersih dan hanya perlu dirapikan.', 15000, 'kg', 1, 1),
  ('Express',        'Cocok untuk pakaian harian secara instan.', 10000, 'kg', 1, 4)
)
WHERE NOT EXISTS (SELECT 1 FROM app_meta WHERE key = 'seeded');

INSERT INTO pelanggan (nama, telepon, alamat)
SELECT column1, column2, column3 FROM (VALUES
  ('Budi Santoso',   '081234567890', 'Jl. Merdeka No. 10'),
  ('Siti Aminah',    '085278901234', 'Jl. Melati No. 5'),
  ('Ahmad Fauzi',    '081399887766', 'Jl. Kenanga No. 22'),
  ('Rina Kartika',   '087812345678', 'Jl. Mawar No. 8'),
  ('Dedi Kurniawan', '082165432109', 'Jl. Anggrek No. 14')
)
WHERE NOT EXISTS (SELECT 1 FROM app_meta WHERE key = 'seeded');

INSERT INTO staf (nama, username, passwordHash, role, aktif)
SELECT column1, column2, column3, column4, column5 FROM (VALUES
  ('Briant David',  'briant',  '$2b$10$TAVWzSYilFU93eWr/fZrluW2M10PhQ2OJDW2Cdd1qa7reF8hIGJs.', 'owner', 1),
  ('Lestari Ceria', 'lestari', '$2b$10$jy3rCY1lxQFliTwdMuVok.hazJlZrwZK8i0r5V9423/ahX5nWG.8y', 'staf',  1)
)
WHERE NOT EXISTS (SELECT 1 FROM app_meta WHERE key = 'seeded');

INSERT INTO pesanan (pelangganId, layananId, jumlah, hargaSatuan, totalHarga, statusCucian, statusBayar, tanggalMasuk, stafId)
SELECT column1, column2, column3, column4, column5, column6, column7, column8, column9 FROM (VALUES
  (1, 1, 3.5, 9000,  31500, 'selesai',      'lunas', '2026-11-03T02:15:00.000Z', 1),
  (2, 2, 5,   7000,  35000, 'siap_diambil', 'lunas', '2026-11-03T07:30:00.000Z', 2),
  (3, 3, 2,   6000,  12000, 'disetrika',    'belum', '2026-11-04T03:00:00.000Z', 1),
  (4, 4, 2,   25000, 50000, 'dicuci',       'lunas', '2026-11-04T09:20:00.000Z', 2),
  (5, 1, 4,   9000,  36000, 'diterima',     'belum', '2026-11-05T01:45:00.000Z', 1)
)
WHERE NOT EXISTS (SELECT 1 FROM app_meta WHERE key = 'seeded');

INSERT OR IGNORE INTO app_meta (key, value) VALUES ('seeded', '1');
