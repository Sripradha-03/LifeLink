const express = require('express');
const router = express.Router();
const axios = require('axios');

// AI Chat endpoint
router.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ message: 'Message is required' });
    }

    // Simple AI response - you can integrate with OpenAI, DeepSeek, or other AI services
    const aiResponse = await generateAIResponse(message);

    res.json({
      response: aiResponse,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('AI Chat error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

async function generateAIResponse(message) {
  const lowerMessage = message.toLowerCase();

  // Blood donation related responses
  if (lowerMessage.includes('blood group') || lowerMessage.includes('compatibility')) {
    return `Blood Group Compatibility:
- O- can donate to: All blood groups (Universal Donor)
- O+ can donate to: O+, A+, B+, AB+
- A- can donate to: A-, A+, AB-, AB+
- A+ can donate to: A+, AB+
- B- can donate to: B-, B+, AB-, AB+
- B+ can donate to: B+, AB+
- AB- can donate to: AB-, AB+
- AB+ can donate to: AB+ only (Universal Recipient)

You can receive blood from compatible groups based on your blood type.`;
  }

  if (lowerMessage.includes('donation') || lowerMessage.includes('donate')) {
    return `Blood donation is a safe process that takes about 10-15 minutes. Here's how it works:
1. Registration and health screening
2. Medical history review
3. Mini physical exam (temperature, blood pressure, hemoglobin)
4. Blood donation (10-15 minutes)
5. Refreshments and rest

You can donate whole blood every 56 days. The process is safe and helps save lives!`;
  }

  if (lowerMessage.includes('eligibility') || lowerMessage.includes('who can donate')) {
    return `To donate blood, you must:
- Be at least 18 years old (or 17 with parental consent in some states)
- Weigh at least 50 kg (110 lbs)
- Be in good general health
- Not have donated blood in the last 56 days
- Not have certain medical conditions or be on certain medications

Please consult with a healthcare professional if you have specific questions about your eligibility.`;
  }

  if (lowerMessage.includes('emergency') || lowerMessage.includes('urgent')) {
    return `For emergency blood requests:
1. Fill out the Blood Request Form on our website
2. Mark it as "Emergency"
3. Our system will automatically find nearby donors
4. Donors will receive SMS notifications
5. You'll be notified when a donor accepts

Time is critical in emergencies - our system helps connect you with donors quickly!`;
  }

  // Default response
  return `I'm here to help with questions about blood donation, blood groups, eligibility, emergency requests, and more. 

How can I assist you today? You can ask about:
- Blood group compatibility
- How to donate blood
- Eligibility requirements
- Emergency blood requests
- Finding blood banks
- Camp schedules

Or feel free to ask any other question about our Lifelink blood donation system!`;
}

module.exports = router;

