const express = require('express');
const router = express.Router();
const { fetchPVWattData, calculatePVWattsRate } = require('../util/calculate');

// Define the route for calculating the rate of PV/Watts per day
router.get('/', async (req, res) => {
  // Extract the latitude and longitude from the request query parameters
  const { latitude, longitude } = req.query;

  try {
    // Call the fetchPVWattData function to get solar data
    const data = await fetchPVWattData(latitude, longitude);

    // Extract necessary data from the response
    const {
      totalCapacity,
      averageSolarIrradiance,
      cloudCover,
      powerPeak,
      orientation,
      tilt,
      area,
    } = data;

    // Calculate the rate of PV/Watts per day
    const rate = calculatePVWattsRate(
      totalCapacity,
      averageSolarIrradiance,
      cloudCover,
      undefined, // Use the default system loss value
      powerPeak,
      orientation,
      tilt,
      area,
      longitude,
      latitude
    );

    // Return the calculated rate in the response
    res.json({ rate });
  } catch (error) {
    console.error('Error calculating PVWatt rate:', error);
    res.status(500).json({ message: 'Error calculating PVWatt rate' });
  }
});

module.exports = router;
