const pesananModel = require('../models/pesananModel');
const pelangganModel = require('../models/pelangganModel');
const layananModel = require('../models/layananModel');
const stafModel = require('../models/stafModel');
const { success, fail } = require('../middlewares_helpers/response');

const STATUS_CUCIAN = ['diterima', 'dicuci', 'disetrika', 'siap_diambil', 'selesai'];
const STATUS_BAYAR = ['belum', 'lunas'];

const teks = (v) => (typeof v === 'string' ? v.trim() : '');

/* Validasi body. Mengembalikan { error } atau { input } */
const bacaInput = async (b, penggunaId) => {
  const d = b ?? {};

  const nama = teks(d.nama);
  const telepon = teks(d.telepon).replace(/[^\d+]/g, '');
  const alamat = teks(d.alamat);
  if (!nama || !alamat) return { error: 'Nama dan alamat wajib diisi' };
  if (telepon.length < 8) return { error: 'Nomor HP tidak valid' };

  const layanan = await layananModel.findLayananById(Number(d.layananId));
  if (!layanan) return { error: 'Jenis layanan tidak valid' };

  const jumlah = Number(d.jumlah);
  if (!(jumlah > 0) || (layanan.satuan === 'pcs' && !Number.isInteger(jumlah))) {
    return { error: 'Berat atau jumlah tidak valid' };
  }

  const statusCucian = d.statusCucian ?? 'diterima';
  const statusBayar = d.statusBayar ?? 'belum';
  if (!STATUS_CUCIAN.includes(statusCucian) || !STATUS_BAYAR.includes(statusBayar)) {
    return { error: 'Status tidak valid' };
  }

  const tanggal = d.tanggalMasuk ? new Date(String(d.tanggalMasuk)) : new Date();
  if (Number.isNaN(tanggal.getTime())) return { error: 'Waktu masuk tidak valid' };

  const stafId = d.stafId ? Number(d.stafId) : penggunaId;
  const kasir = await stafModel.findStafById(stafId);
  if (!kasir || !kasir.aktif) return { error: 'Kasir pemroses tidak valid' };

  return {
    input: {
      nama, telepon, alamat, layanan, jumlah,
      statusCucian, statusBayar,
      tanggalMasuk: tanggal.toISOString(),
      stafId,
    },
  };
};

/* GET /api/cucian */
const getAllCucian = async (req, res) => {
  try {
    const data = await pesananModel.findAllPesanan();
    success(res, 200, 'Berhasil mengambil semua transaksi', data);
  } catch (error) {
    console.error('[getAllCucian]', error);
    fail(res, 500, 'Server Error', error.message);
  }
};

/* GET /api/cucian/kasir */
const getKasir = async (req, res) => {
  try {
    const aktif = (await stafModel.findAllStaf()).filter((s) => s.aktif);
    const data = aktif.map((s) => ({ id: s.id, nama: s.nama, role: s.role }));
    success(res, 200, 'Berhasil mengambil daftar kasir', data);
  } catch (error) {
    console.error('[getKasir]', error);
    fail(res, 500, 'Server Error', error.message);
  }
};

/* POST /api/cucian */
const createCucian = async (req, res) => {
  try {
    const { error, input } = await bacaInput(req.body, res.locals.user.id);
    if (error) return fail(res, 400, error);

    const pel = await pelangganModel.findOrCreatePelanggan(input.nama, input.telepon, input.alamat);
    const created = await pesananModel.createPesanan({
      pelangganId: pel.id,
      layananId: input.layanan.id,
      jumlah: input.jumlah,
      hargaSatuan: input.layanan.harga,
      totalHarga: Math.round((input.layanan.harga * input.jumlah) / input.layanan.perJumlah),
      statusCucian: input.statusCucian,
      statusBayar: input.statusBayar,
      tanggalMasuk: input.tanggalMasuk,
      stafId: input.stafId,
    });
    success(res, 201, 'Transaksi berhasil dibuat', created);
  } catch (error) {
    console.error('[createCucian]', error);
    fail(res, 500, 'Server Error', error.message);
  }
};

/* PUT /api/cucian/:id */
const updateCucian = async (req, res) => {
  try {
    const p = await pesananModel.findPesananById(Number(req.params.id));
    if (!p) return fail(res, 404, 'Transaksi tidak ditemukan');

    const { error, input } = await bacaInput(req.body, res.locals.user.id);
    if (error) return fail(res, 400, error);

    const pel = await pelangganModel.findOrCreatePelanggan(input.nama, input.telepon, input.alamat);
    const hargaSatuan = input.layanan.id !== p.layananId ? input.layanan.harga : p.hargaSatuan;

    const updated = await pesananModel.updatePesanan(p.id, {
      pelangganId: pel.id,
      layananId: input.layanan.id,
      jumlah: input.jumlah,
      hargaSatuan,
      totalHarga: Math.round((hargaSatuan * input.jumlah) / input.layanan.perJumlah),
      statusCucian: input.statusCucian,
      statusBayar: input.statusBayar,
      tanggalMasuk: input.tanggalMasuk,
      stafId: input.stafId,
    });
    success(res, 200, 'Transaksi berhasil diupdate', updated);
  } catch (error) {
    console.error('[updateCucian]', error);
    fail(res, 500, 'Server Error', error.message);
  }
};

/* PATCH /api/cucian/:id/status */
const updateStatusCucian = async (req, res) => {
  try {
    const p = await pesananModel.findPesananById(Number(req.params.id));
    if (!p) return fail(res, 404, 'Transaksi tidak ditemukan');

    const { statusCucian, statusBayar } = req.body ?? {};
    if (statusCucian !== undefined && !STATUS_CUCIAN.includes(statusCucian)) {
      return fail(res, 400, 'Status cucian tidak valid');
    }
    if (statusBayar !== undefined && !STATUS_BAYAR.includes(statusBayar)) {
      return fail(res, 400, 'Status bayar tidak valid');
    }

    await pesananModel.updateStatus(p.id, statusCucian, statusBayar);
    success(res, 200, 'Status berhasil diupdate', await pesananModel.findPesananById(p.id));
  } catch (error) {
    console.error('[updateStatusCucian]', error);
    fail(res, 500, 'Server Error', error.message);
  }
};

/* DELETE /api/cucian/:id */
const deleteCucian = async (req, res) => {
  try {
    const p = await pesananModel.findPesananById(Number(req.params.id));
    if (!p) return fail(res, 404, 'Transaksi tidak ditemukan');

    await pesananModel.deletePesanan(p.id);
    success(res, 200, 'Transaksi berhasil dihapus');
  } catch (error) {
    console.error('[deleteCucian]', error);
    fail(res, 500, 'Server Error', error.message);
  }
};

module.exports = {
  getAllCucian,
  getKasir,
  createCucian,
  updateCucian,
  updateStatusCucian,
  deleteCucian,
};