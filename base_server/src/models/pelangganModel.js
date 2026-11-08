const { dbRun, dbGet } = require('../middlewares_helpers/sqlite3_helpers');

const findOrCreatePelanggan = async (nama, telepon, alamat) => {
  const { changes } = await dbRun(
    'UPDATE pelanggan SET nama = ?, alamat = ? WHERE telepon = ?',
    [nama, alamat, telepon]
  );
  if (changes === 0) {
    await dbRun(
      'INSERT INTO pelanggan (nama, telepon, alamat) VALUES (?, ?, ?)',
      [nama, telepon, alamat]
    );
  }
  return await dbGet('SELECT * FROM pelanggan WHERE telepon = ?', [telepon]);
};

module.exports = { findOrCreatePelanggan };