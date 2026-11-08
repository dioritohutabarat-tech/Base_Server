const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { wajibLogin } = require('../middlewares_helpers/auth');

router.post('/login', authController.login);
router.get('/me',     wajibLogin, authController.me);

module.exports = router;
