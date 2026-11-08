const pesananModel = require('../models/pesananModel');
const { success, fail } = require('../middlewares_helpers/response');

/* GET /api/lacak/:nota */
const lacakNota = async (req, res) => {
  try {
    const nota = String(req.params.nota).trim().toUpperCase();
    if (!/^CL-\d{4,}$/.test(nota)) {
      return fail(res, 400, 'Format nota tidak valid, contoh: CL-0001');
    }

    const p = await pesananModel.findPesananByNota(nota);
    if (!p) return fail(res, 404, 'Nota tidak ditemukan');

    const estimasi = new Date(p.tanggalMasuk);
    estimasi.setDate(estimasi.getDate() + p.layanan.estimasiHari);

    success(res, 200, 'Berhasil melacak nota', {
      nota: p.nota,
      layanan: p.layanan.nama,
      jumlah: p.jumlah,
      satuan: p.layanan.satuan,
      totalHarga: p.totalHarga,
      statusCucian: p.statusCucian,
      statusBayar: p.statusBayar,
      tanggalMasuk: p.tanggalMasuk,
      estimasiSelesai: estimasi.toISOString(),
    });
  } catch (error) {
    console.error('[lacakNota]', error);
    fail(res, 500, 'Server Error', error.message);
  }
};

module.exports = { lacakNota };