const express = require('express');
const router = express.Router();
const lacakController = require('../controllers/lacakController');

router.get('/:nota', lacakController.lacakNota);

module.exports = router;z