// smsService.js
const twilio = require('twilio');

// Replace with your Twilio credentials
const accountSid = 'AC3ca46b1605aeb5904a61ffdb12de87a9';
const authToken = '7540483eeeb068688a9c92ca4d999b38';
const client = twilio(accountSid, authToken);

const sendSMS = async (to, body) => {
  try {
    const message = await client.messages.create({
      body,
      from: '+18647351412', // Replace with your Twilio number
      to,
    });
    return message.sid;
  } catch (error) {
    throw new Error('Failed to send SMS: ' + error.message);
  }
};

module.exports = { sendSMS };
