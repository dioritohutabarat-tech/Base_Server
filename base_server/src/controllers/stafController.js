const bcrypt = require('bcryptjs');
const stafModel = require('../models/stafModel');
const { tanpaPassword } = require('../middlewares_helpers/auth');
const { success, fail } = require('../middlewares_helpers/response');

const ROLE = ['owner', 'staf'];

/* GET /api/staf */
const getAllStaf = async (req, res) => {
  try {
    const data = (await stafModel.findAllStaf()).map(tanpaPassword);
    success(res, 200, 'Berhasil mengambil semua staf', data);
  } catch (error) {
    console.error('[getAllStaf]', error);
    fail(res, 500, 'Server Error', error.message);
  }
};

/* POST /api/staf */
const createStaf = async (req, res) => {
  try {
    const { nama, username, password, role } = req.body ?? {};
    const user = String(username ?? '').trim().toLowerCase();

    if (!String(nama ?? '').trim() || user.length < 3 || String(password ?? '').length < 6 || !ROLE.includes(role)) {
      return fail(res, 400, 'Nama, username (min. 3 karakter), password (min. 6 karakter), dan role wajib diisi dengan benar');
    }
    if (await stafModel.findStafByUsername(user)) {
      return fail(res, 409, 'Username sudah dipakai');
    }

    const baru = await stafModel.createStaf({
      nama: String(nama).trim(),
      username: user,
      passwordHash: await bcrypt.hash(String(password), 10),
      role,
      aktif: true,
    });
    success(res, 201, 'Akun staf berhasil dibuat', tanpaPassword(baru));
  } catch (error) {
    console.error('[createStaf]', error);
    fail(res, 500, 'Server Error', error.message);
  }
};

/* PUT /api/staf/:id */
const updateStaf = async (req, res) => {
  try {
    const target = await stafModel.findStafById(Number(req.params.id));
    if (!target) return fail(res, 404, 'Akun tidak ditemukan');

    const { nama, username, password, role, aktif } = req.body ?? {};
    const user = String(username ?? '').trim().toLowerCase();

    if (!String(nama ?? '').trim() || user.length < 3 || !ROLE.includes(role) || typeof aktif !== 'boolean') {
      return fail(res, 400, 'Nama, username, role, dan status aktif wajib diisi dengan benar');
    }
    if (password && String(password).length < 6) {
      return fail(res, 400, 'Password baru minimal 6 karakter');
    }
    const lain = await stafModel.findStafByUsername(user);
    if (lain && lain.id !== target.id) {
      return fail(res, 409, 'Username sudah dipakai');
    }

    const kehilanganOwner = target.role === 'owner' && target.aktif && (role !== 'owner' || !aktif);
    if (kehilanganOwner && !(await stafModel.hasOtherActiveOwner(target.id))) {
      return fail(res, 400, 'Harus ada minimal satu owner yang aktif');
    }

    const hasil = await stafModel.updateStaf(target.id, {
      nama: String(nama).trim(),
      username: user,
      passwordHash: password ? await bcrypt.hash(String(password), 10) : target.passwordHash,
      role,
      aktif,
    });
    success(res, 200, 'Akun staf berhasil diupdate', tanpaPassword(hasil));
  } catch (error) {
    console.error('[updateStaf]', error);
    fail(res, 500, 'Server Error', error.message);
  }
};

/* DELETE /api/staf/:id */
const deleteStaf = async (req, res) => {
  try {
    const pengguna = res.locals.user;
    const target = await stafModel.findStafById(Number(req.params.id));
    if (!target) return fail(res, 404, 'Akun tidak ditemukan');
    if (target.id === pengguna.id) {
      return fail(res, 400, 'Akun yang sedang dipakai tidak bisa dihapus');
    }
    if (await stafModel.isStafUsed(target.id)) {
      return fail(res, 409, 'Staf ini sudah memproses transaksi. Nonaktifkan saja akunnya.');
    }
    await stafModel.deleteStaf(target.id);
    success(res, 200, 'Akun staf berhasil dihapus');
  } catch (error) {
    console.error('[deleteStaf]', error);
    fail(res, 500, 'Server Error', error.message);
  }
};

module.exports = { getAllStaf, createStaf, updateStaf, deleteStaf };