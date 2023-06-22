const express = require('express');
const router = express.Router();
const axios = require('axios');
const config = require('../config/default');
const { calculatePVWattsRate } = require('../util/calculate');

// Define the route for calculating the rate of PV/Watts per day
router.get('/', async (req, res) => {
  // Extract the necessary parameters from the request query
  const {
    totalCapacity,
    averageSolarIrradiance,
    cloudCover,
    systemLoss,
    powerPeak,
    orientation,
    tilt,
    area,
    longitude,
    latitude,
  } = req.query;

  try {
    // Make the API call to fetch the real solar data
    const response = await axios.get(config.pvwattUrl, {
      params: {
        lat: latitude,
        lon: longitude,
        // Additional parameters for the PVWatt API can be added here
      },
    });

    // Extract the necessary solar data from the response
    const { data } = response;

    // Extract the relevant data from the PVWatt API response and pass it to the calculation function
    const pvWattRate = calculatePVWattsRate(
      totalCapacity,
      data.ghi,
      cloudCover,
      systemLoss,
      powerPeak,
      orientation,
      tilt,
      area,
      longitude,
      latitude
    );

    // Return the calculated rate in the response
    res.json({ pvWattRate });
  } catch (error) {
    console.error('Error fetching PVWatt data:', error);
    res.status(500).json({ message: 'Error fetching PVWatt data' });
  }
});

module.exports = router;
