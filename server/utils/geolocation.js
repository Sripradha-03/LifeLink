const axios = require('axios');

// Calculate distance between two coordinates using Haversine formula
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  return distance;
};

// Get coordinates from address using Nominatim (OpenStreetMap)
const geocodeAddress = async (address, city, state, country = 'India') => {
  try {
    const query = `${address}, ${city}, ${state}, ${country}`;
    const response = await axios.get('https://nominatim.openstreetmap.org/search', {
      params: {
        q: query,
        format: 'json',
        limit: 1
      },
      headers: {
        'User-Agent': 'Lifelink-App'
      }
    });

    if (response.data && response.data.length > 0) {
      return {
        latitude: parseFloat(response.data[0].lat),
        longitude: parseFloat(response.data[0].lon)
      };
    }
    return null;
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
};

// Find nearest donors within radius (in km)
const findNearestDonors = (donors, requestLat, requestLon, radius = 50) => {
  return donors
    .filter(donor => {
      if (!donor.latitude || !donor.longitude) return false;
      const distance = calculateDistance(
        parseFloat(donor.latitude),
        parseFloat(donor.longitude),
        parseFloat(requestLat),
        parseFloat(requestLon)
      );
      return distance <= radius;
    })
    .map(donor => {
      const distance = calculateDistance(
        parseFloat(donor.latitude),
        parseFloat(donor.longitude),
        parseFloat(requestLat),
        parseFloat(requestLon)
      );
      return {
        ...donor.toJSON(),
        distance: distance.toFixed(2)
      };
    })
    .sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
};

module.exports = {
  calculateDistance,
  geocodeAddress,
  findNearestDonors
};

