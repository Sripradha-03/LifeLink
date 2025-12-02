const axios = require('axios');

async function testFullFlow() {
    try {
        console.log('Simulating User Request...');
        // Assuming the user registered as a donor in Shivamogga with A+ blood
        const response = await axios.post('http://localhost:5000/api/blood-requests', {
            patientName: "Test Patient",
            bloodGroup: "B+",
            mobile: "9876543210",
            pincode: "577201",
            state: "Karnataka",
            city: "Shivamogga",
            area: "Test Area",
            hospitalName: "Test Hospital",
            requesterName: "Tester",
            isEmergency: true
        });

        console.log('Response Status:', response.status);
        console.log('Matching Donors Count:', response.data.matchingDonors.length);

        if (response.data.matchingDonors.length > 0) {
            response.data.matchingDonors.forEach(d => {
                console.log(`Matched Donor: ${d.name}, Mobile: ${d.mobile}`);
            });
        } else {
            console.log('No donors matched. Check if donor is Approved and Active.');
        }

    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
    }
}

testFullFlow();
