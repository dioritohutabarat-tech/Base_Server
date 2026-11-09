const layananModel = require('../models/layananModel');
const { success, fail } = require('../middlewares_helpers/response');

const PESAN_INVALID = 'Nama, harga, satuan, dan estimasi hari wajib diisi dengan benar';

const bacaInput = (b) => {
  if (!b) return null;
  const nama = typeof b.nama === 'string' ? b.nama.trim() : '';
  const deskripsi = typeof b.deskripsi === 'string' ? b.deskripsi.trim() : '';
  const harga = Number(b.harga);
  const perJumlah = Number(b.perJumlah ?? 1);
  const estimasiHari = Number(b.estimasiHari);
  const satuan = b.satuan;

  if (!nama || !(harga > 0)) return null;
  if (!Number.isInteger(perJumlah) || perJumlah < 1) return null;
  if (!Number.isInteger(estimasiHari) || estimasiHari < 1) return null;
  if (satuan !== 'kg' && satuan !== 'pcs') return null;

  return { nama, deskripsi, harga, satuan, perJumlah, estimasiHari };
};

/* GET /api/layanan */
const getAllLayanan = async (req, res) => {
  try {
    const data = await layananModel.findAllLayanan();
    success(res, 200, 'Berhasil mengambil semua layanan', data);
  } catch (error) {
    console.error('[getAllLayanan]', error);
    fail(res, 500, 'Server Error', error.message);
  }
};

/* POST /api/layanan */
const createLayanan = async (req, res) => {
  try {
    const input = bacaInput(req.body);
    if (!input) return fail(res, 400, PESAN_INVALID);

    const created = await layananModel.createLayanan(input);
    success(res, 201, 'Layanan berhasil dibuat', created);
  } catch (error) {
    console.error('[createLayanan]', error);
    fail(res, 500, 'Server Error', error.message);
  }
};

/* PUT /api/layanan/:id */
const updateLayanan = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!(await layananModel.findLayananById(id))) {
      return fail(res, 404, 'Layanan tidak ditemukan');
    }
    const input = bacaInput(req.body);
    if (!input) return fail(res, 400, PESAN_INVALID);

    const updated = await layananModel.updateLayanan(id, input);
    success(res, 200, 'Layanan berhasil diupdate', updated);
  } catch (error) {
    console.error('[updateLayanan]', error);
    fail(res, 500, 'Server Error', error.message);
  }
};

/* DELETE /api/layanan/:id */
const deleteLayanan = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!(await layananModel.findLayananById(id))) {
      return fail(res, 404, 'Layanan tidak ditemukan');
    }
    if (await layananModel.isLayananUsed(id)) {
      return fail(res, 409, 'Layanan sudah dipakai pesanan, tidak bisa dihapus');
    }
    await layananModel.deleteLayanan(id);
    success(res, 200, 'Layanan berhasil dihapus');
  } catch (error) {
    console.error('[deleteLayanan]', error);
    fail(res, 500, 'Server Error', error.message);
  }
};

module.exports = { getAllLayanan, createLayanan, updateLayanan, deleteLayanan };