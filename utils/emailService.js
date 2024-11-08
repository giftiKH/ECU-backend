// server/utils/emailService.js
const nodemailer = require('nodemailer');

// Configure the email transporter
const transporter = nodemailer.createTransport({
    service: 'gmail', // You can use other services like 'Yahoo', 'Outlook', etc.
    auth: {
        user: 'giftikebede21@gmail.com', // Your email address
        pass: 'ssbx kzvn pgjl borr', // Use the app password here if you have 2FA enabled
    },
    secure: false, // true for 465, false for other ports
});

const sendEmail = async (to, subject, text) => {
    const mailOptions = {
        from: 'giftikebede21@gmail.com', // Sender address
        to, // List of recipients
        subject, // Subject line
        text, // Plain text body
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
        return info;
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Failed to send email');
    }
};

module.exports = sendEmail;
