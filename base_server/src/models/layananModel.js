const { dbRun, dbGet, dbAll } = require('../middlewares_helpers/sqlite3_helpers');

const findAllLayanan = async () => {
  return await dbAll('SELECT * FROM layanan ORDER BY id');
};

const findLayananById = async (id) => {
  if (!Number.isInteger(id)) return undefined;
  return await dbGet('SELECT * FROM layanan WHERE id = ?', [id]);
};

const createLayanan = async (d) => {
  const { lastID } = await dbRun(
    `INSERT INTO layanan (nama, deskripsi, harga, satuan, perJumlah, estimasiHari)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [d.nama, d.deskripsi, d.harga, d.satuan, d.perJumlah, d.estimasiHari]
  );
  return await findLayananById(lastID);
};

const updateLayanan = async (id, d) => {
  await dbRun(
    `UPDATE layanan
     SET nama = ?, deskripsi = ?, harga = ?, satuan = ?, perJumlah = ?, estimasiHari = ?
     WHERE id = ?`,
    [d.nama, d.deskripsi, d.harga, d.satuan, d.perJumlah, d.estimasiHari, id]
  );
  return await findLayananById(id);
};

const deleteLayanan = async (id) => {
  const { changes } = await dbRun('DELETE FROM layanan WHERE id = ?', [id]);
  return changes > 0;
};

const isLayananUsed = async (id) => {
  const r = await dbGet('SELECT COUNT(*) AS n FROM pesanan WHERE layananId = ?', [id]);
  return r.n > 0;
};

module.exports = {
  findAllLayanan,
  findLayananById,
  createLayanan,
  updateLayanan,
  deleteLayanan,
  isLayananUsed,
};