const dashboardModel = require('../models/dashboardModel');
const { success, fail } = require('../middlewares_helpers/response');

/* GET /api/dashboard */
const getRingkasan = async (req, res) => {
  try {
    const data = await dashboardModel.getRingkasan();
    success(res, 200, 'Berhasil mengambil ringkasan dashboard', data);
  } catch (error) {
    console.error('[getRingkasan]', error);
    fail(res, 500, 'Server Error', error.message);
  }
};

module.exports = { getRingkasan };