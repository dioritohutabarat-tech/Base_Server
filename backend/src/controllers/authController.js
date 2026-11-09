const bcrypt = require('bcryptjs');
const stafModel = require('../models/stafModel');
const { buatToken, tanpaPassword } = require('../middlewares_helpers/auth');
const { success, fail } = require('../middlewares_helpers/response');

/* POST /api/auth/login */
const login = async (req, res) => {
  try {
    const { username, password } = req.body ?? {};
    const user = await stafModel.findStafByUsername(
      String(username ?? '').trim().toLowerCase()
    );
    const cocok = user
      ? await bcrypt.compare(String(password ?? ''), user.passwordHash)
      : false;

    if (!user || !cocok) return fail(res, 401, 'Username atau password salah');
    if (!user.aktif) return fail(res, 403, 'Akun ini dinonaktifkan');

    success(res, 200, 'Login berhasil', {
      token: buatToken(user),
      staf: tanpaPassword(user),
    });
  } catch (error) {
    console.error('[login]', error);
    fail(res, 500, 'Server Error', error.message);
  }
};

/* GET /api/auth/me */
const me = (req, res) => {
  success(res, 200, 'Berhasil mengambil data akun', tanpaPassword(res.locals.user));
};

module.exports = { login, me };