// smsRoutes.js
const express = require('express');
const { sendSmsController } = require('../controllers/smsController');

const router = express.Router();

router.post('/send-sms', sendSmsController);

module.exports = router;
