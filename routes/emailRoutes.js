// server/routes/testEmail.js

const express = require('express');
const sendEmail = require('../utils/emailService');

const router = express.Router();

router.post('/send-email', async (req, res) => {
    const { to } = req.body;
    const subject = 'Test Email';
    const text = 'This is a test email to check functionality.';

    try {
        await sendEmail(to, subject, text);
        res.status(200).json({ message: 'Test email sent successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to send test email', error: error.message });
    }
});

module.exports = router;
