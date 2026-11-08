const jwt = require('jsonwebtoken');
const stafModel = require('../models/stafModel');
const { fail } = require('./response');

const SECRET = process.env.JWT_SECRET ?? 'dev-secret-ganti-saat-deploy';

const buatToken = (staf) => jwt.sign({ id: staf.id }, SECRET, { expiresIn: '8h' });

const tanpaPassword = ({ passwordHash, ...sisanya }) => sisanya;

const wajibLogin = async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return fail(res, 401, 'Silakan login terlebih dahulu');
  }

  let id;
  try {
    id = jwt.verify(header.slice(7), SECRET).id;
  } catch {
    return fail(res, 401, 'Sesi tidak valid atau sudah berakhir');
  }

  try {
    const user = await stafModel.findStafById(id);
    if (!user || !user.aktif) {
      return fail(res, 401, 'Akun tidak aktif atau tidak ditemukan');
    }
    res.locals.user = user;
    next();
  } catch (error) {
    console.error('[wajibLogin]', error);
    fail(res, 500, 'Server Error', error.message);
  }
};

const wajibOwner = (req, res, next) => {
  if (res.locals.user.role !== 'owner') {
    return fail(res, 403, 'Hanya owner yang boleh melakukan ini');
  }
  next();
};

module.exports = { buatToken, tanpaPassword, wajibLogin, wajibOwner };