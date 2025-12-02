const twilio = require('twilio');
require('dotenv').config();

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const sendSMS = async (to, message) => {
  try {
    let fromNumber = process.env.TWILIO_PHONE_NUMBER;
    if (!fromNumber.startsWith('+')) {
      fromNumber = `+91${fromNumber}`; // Assuming India, or use a default country code
    }
    console.log(`Sending SMS from: ${fromNumber}`);

    // Sanitize number: remove spaces, dashes, parentheses
    let toNumber = to.toString().replace(/[\s\-\(\)]/g, '');

    if (!toNumber.startsWith('+')) {
      toNumber = `+91${toNumber}`;
    }

    const result = await client.messages.create({
      body: message,
      from: fromNumber,
      to: toNumber
    });
    return { success: true, sid: result.sid };
  } catch (error) {
    console.error('Twilio SMS Error:', error);
    return { success: false, error: error.message };
  }
};

const sendEmergencyBloodRequest = async (donorMobile, requestDetails) => {
  const message = `Emergency Blood Request
  
Patient: ${requestDetails.patientName}
Blood Group: ${requestDetails.bloodGroup}
Hospital: ${requestDetails.hospitalName}
Location: ${requestDetails.city}
Units: ${requestDetails.unitsRequired}

Reply ACCEPT or REJECT.
Request ID: ${requestDetails.id}

- Lifelink`;

  return await sendSMS(donorMobile, message);
};

module.exports = {
  sendSMS,
  sendEmergencyBloodRequest
};

