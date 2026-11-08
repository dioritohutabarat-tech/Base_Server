const { dbRun, dbGet, dbAll } = require('../middlewares_helpers/sqlite3_helpers');

// Query dasar: pesanan + pelanggan + layanan + staf dalam satu baris
const SELECT_PESANAN = `
  SELECT p.id, p.pelangganId, p.layananId, p.jumlah, p.hargaSatuan, p.totalHarga,
         p.statusCucian, p.statusBayar, p.tanggalMasuk, p.stafId,
         pl.nama AS pelNama, pl.telepon AS pelTelepon, pl.alamat AS pelAlamat,
         l.nama AS layNama, l.deskripsi AS layDeskripsi, l.harga AS layHarga,
         l.satuan AS laySatuan, l.perJumlah AS layPerJumlah, l.estimasiHari AS layEstimasiHari,
         s.nama AS stafNama
  FROM pesanan p
  JOIN pelanggan pl ON pl.id = p.pelangganId
  JOIN layanan l    ON l.id  = p.layananId
  JOIN staf s       ON s.id  = p.stafId`;

// Bentuk baris datar -> bentuk Cucian yang dipakai frontend
const toPesanan = (r) => {
  if (!r) return undefined;
  return {
    id: r.id,
    nota: `CL-${String(r.id).padStart(4, '0')}`,
    pelangganId: r.pelangganId,
    layananId: r.layananId,
    jumlah: r.jumlah,
    hargaSatuan: r.hargaSatuan,
    totalHarga: r.totalHarga,
    statusCucian: r.statusCucian,
    statusBayar: r.statusBayar,
    tanggalMasuk: r.tanggalMasuk,
    stafId: r.stafId,
    pelanggan: {
      id: r.pelangganId,
      nama: r.pelNama,
      telepon: r.pelTelepon,
      alamat: r.pelAlamat,
    },
    layanan: {
      id: r.layananId,
      nama: r.layNama,
      deskripsi: r.layDeskripsi,
      harga: r.layHarga,
      satuan: r.laySatuan,
      perJumlah: r.layPerJumlah,
      estimasiHari: r.layEstimasiHari,
    },
    staf: { id: r.stafId, nama: r.stafNama },
  };
};

const findAllPesanan = async () => {
  const rows = await dbAll(`${SELECT_PESANAN} ORDER BY p.tanggalMasuk DESC, p.id DESC`);
  return rows.map(toPesanan);
};

const findPesananById = async (id) => {
  if (!Number.isInteger(id)) return undefined;
  return toPesanan(await dbGet(`${SELECT_PESANAN} WHERE p.id = ?`, [id]));
};

// Nota berformat CL-0005 -> id 5
const findPesananByNota = async (nota) => {
  const m = /^CL-(\d+)$/i.exec(String(nota ?? '').trim());
  if (!m) return undefined;
  return await findPesananById(Number(m[1]));
};

const createPesanan = async (d) => {
  const { lastID } = await dbRun(
    `INSERT INTO pesanan
       (pelangganId, layananId, jumlah, hargaSatuan, totalHarga,
        statusCucian, statusBayar, tanggalMasuk, stafId)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      d.pelangganId, d.layananId, d.jumlah, d.hargaSatuan, d.totalHarga,
      d.statusCucian, d.statusBayar, d.tanggalMasuk, d.stafId,
    ]
  );
  return await findPesananById(lastID);
};

const updatePesanan = async (id, d) => {
  await dbRun(
    `UPDATE pesanan
     SET pelangganId = ?, layananId = ?, jumlah = ?, hargaSatuan = ?, totalHarga = ?,
         statusCucian = ?, statusBayar = ?, tanggalMasuk = ?, stafId = ?
     WHERE id = ?`,
    [
      d.pelangganId, d.layananId, d.jumlah, d.hargaSatuan, d.totalHarga,
      d.statusCucian, d.statusBayar, d.tanggalMasuk, d.stafId, id,
    ]
  );
  return await findPesananById(id);
};

// Hanya field yang dikirim yang diubah (yang undefined dibiarkan)
const updateStatus = async (id, statusCucian, statusBayar) => {
  await dbRun(
    `UPDATE pesanan
     SET statusCucian = COALESCE(?, statusCucian),
         statusBayar  = COALESCE(?, statusBayar)
     WHERE id = ?`,
    [statusCucian ?? null, statusBayar ?? null, id]
  );
};

const deletePesanan = async (id) => {
  const { changes } = await dbRun('DELETE FROM pesanan WHERE id = ?', [id]);
  return changes > 0;
};

module.exports = {
  findAllPesanan,
  findPesananById,
  findPesananByNota,
  createPesanan,
  updatePesanan,
  updateStatus,
  deletePesanan,
};