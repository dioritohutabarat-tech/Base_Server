const express = require('express');
const router = express.Router();
const stafController = require('../controllers/stafController');

router.get('/',       stafController.getAllStaf);
router.post('/',      stafController.createStaf);
router.put('/:id',    stafController.updateStaf);
router.delete('/:id', stafController.deleteStaf);

module.exports = router;