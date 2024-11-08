// smsController.js
const { sendSMS } = require('../utils/smsService');

const sendSmsController = async (req, res) => {
  const { to, body } = req.body;

  if (!to || !body) {
    return res.status(400).json({ error: 'To and body fields are required.' });
  }

  try {
    const messageSid = await sendSMS(to, body);
    return res.status(200).json({ message: 'SMS sent successfully!', messageSid });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = { sendSmsController };
