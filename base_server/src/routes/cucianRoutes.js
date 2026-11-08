const express = require('express');
const router = express.Router();
const cucianController = require('../controllers/cucianController');

// '/kasir' harus di atas '/:id'
router.get('/',             cucianController.getAllCucian);
router.get('/kasir',        cucianController.getKasir);
router.post('/',            cucianController.createCucian);
router.put('/:id',          cucianController.updateCucian);
router.patch('/:id/status', cucianController.updateStatusCucian);
router.delete('/:id',       cucianController.deleteCucian);

module.exports = router;
