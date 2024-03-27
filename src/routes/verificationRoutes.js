const express = require('express');
const router = express.Router();
const verificationController = require('../controllers/verificationController');

router.post('/verify-email', verificationController.verifyEmail);

module.exports = router;
