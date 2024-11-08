// server/controllers/emailController.js

const sendEmail = require('../utils/emailService');
 
// Controller function to handle email sending
const sendEmailController = async (req, res) => {
    const { to, subject, text } = req.body;  
  
    try {
        const response = await sendEmail(to, subject, text); 
        res.status(200).json({ message: 'Email sent successfully', response }); 
    } catch (error) {
        res.status(500).json({ message: 'Failed to send email', error: error.message });
    }
};

module.exports = { sendEmailController };   
 