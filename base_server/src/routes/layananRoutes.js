const express = require('express');
const router = express.Router();
const layananController = require('../controllers/layananController');
const { wajibLogin, wajibOwner } = require('../middlewares_helpers/auth');

router.get('/',       layananController.getAllLayanan);
router.post('/',      wajibLogin, wajibOwner, layananController.createLayanan);
router.put('/:id',    wajibLogin, wajibOwner, layananController.updateLayanan);
router.delete('/:id', wajibLogin, wajibOwner, layananController.deleteLayanan);

module.exports = router;