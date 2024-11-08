require('dotenv').config();
const twilio = require('twilio');

// Twilio account credentials (store these securely using environment variables)
const accountSid = process.env.TWILIO_ACCOUNT_SID;  // Your Account SID
const authToken = process.env.TWILIO_AUTH_TOKEN;    // Your Auth Token
const verifyServiceSid = process.env.TWILIO_VERIFY_SERVICE_SID;  // Verify Service SID from Twilio

const client = twilio(accountSid, authToken); 

/**
 * Send verification code to the user's phone number
 */
const sendVerificationCode = async (req, res) => { 
    const { phoneNumber } = req.body; // Phone number from the request body

    if (!phoneNumber) {
        return res.status(400).json({ error: "Phone number is required" });
    }

    try { 
        const verification = await client.verify.v2.services(verifyServiceSid)
            .verifications
            .create({ to: phoneNumber, channel: 'sms' });

        res.json({ message: 'Verification code sent', sid: verification.sid });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Verify the code entered by the user
 */
const verifyCode = async (req, res) => {
    const { phoneNumber, code } = req.body; // Phone number and code from the request body

    if (!phoneNumber || !code) {
        return res.status(400).json({ error: "Phone number and verification code are required" });
    }

    try {
        const verificationCheck = await client.verify.v2.services(verifyServiceSid)
            .verificationChecks
            .create({ to: phoneNumber, code: code });

        if (verificationCheck.status === "approved") {
            // At this point, you can add logic to store this number as verified in your database
            // For example:
            // await saveVerifiedNumber(phoneNumber);
            res.json({ message: 'Phone number verified successfully.' }); 
        } else {
            res.status(400).json({ error: 'Invalid verification code' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });   
    }
};

module.exports = {
    sendVerificationCode,
    verifyCode
};
