const { dbRun, dbGet, dbAll } = require('../middlewares_helpers/sqlite3_helpers');

// SQLite menyimpan boolean sebagai 0/1, frontend butuh true/false
const toStaf = (r) => (r ? { ...r, aktif: r.aktif === 1 } : undefined);

const findAllStaf = async () => {
  const rows = await dbAll('SELECT * FROM staf ORDER BY id');
  return rows.map(toStaf);
};

const findStafById = async (id) => {
  if (!Number.isInteger(id)) return undefined;
  return toStaf(await dbGet('SELECT * FROM staf WHERE id = ?', [id]));
};

const findStafByUsername = async (username) => {
  return toStaf(await dbGet('SELECT * FROM staf WHERE username = ?', [username]));
};

const createStaf = async (d) => {
  const { lastID } = await dbRun(
    'INSERT INTO staf (nama, username, passwordHash, role, aktif) VALUES (?, ?, ?, ?, ?)',
    [d.nama, d.username, d.passwordHash, d.role, d.aktif ? 1 : 0]
  );
  return await findStafById(lastID);
};

const updateStaf = async (id, d) => {
  await dbRun(
    `UPDATE staf
     SET nama = ?, username = ?, passwordHash = ?, role = ?, aktif = ?
     WHERE id = ?`,
    [d.nama, d.username, d.passwordHash, d.role, d.aktif ? 1 : 0, id]
  );
  return await findStafById(id);
};

const deleteStaf = async (id) => {
  const { changes } = await dbRun('DELETE FROM staf WHERE id = ?', [id]);
  return changes > 0;
};

const isStafUsed = async (id) => {
  const r = await dbGet('SELECT COUNT(*) AS n FROM pesanan WHERE stafId = ?', [id]);
  return r.n > 0;
};

const hasOtherActiveOwner = async (id) => {
  const r = await dbGet(
    "SELECT COUNT(*) AS n FROM staf WHERE id <> ? AND role = 'owner' AND aktif = 1",
    [id]
  );
  return r.n > 0;
};

module.exports = {
  findAllStaf,
  findStafById,
  findStafByUsername,
  createStaf,
  updateStaf,
  deleteStaf,
  isStafUsed,
  hasOtherActiveOwner,
};