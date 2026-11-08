const { dbGet } = require('../middlewares_helpers/sqlite3_helpers');
const { findAllPesanan } = require('./pesananModel');

const getRingkasan = async () => {
  const r = await dbGet(`
    SELECT COUNT(*) AS totalCucian,
           COALESCE(SUM(CASE WHEN statusCucian <> 'selesai' THEN 1 ELSE 0 END), 0) AS belumSelesai,
           COALESCE(SUM(CASE WHEN statusBayar = 'belum' THEN 1 ELSE 0 END), 0) AS belumBayar,
           COALESCE(SUM(CASE WHEN statusBayar = 'lunas' THEN totalHarga ELSE 0 END), 0) AS pendapatan
    FROM pesanan`);
  const terbaru = (await findAllPesanan()).slice(0, 5);
  return { ...r, terbaru };
};

module.exports = { getRingkasan };