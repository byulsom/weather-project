/* const fetchHistoricalWeatherData = require('../weather/history');
const express = require('express');
const router = express.Router();

// history
router.get('/', async (req, res) => {
  try {
    const { latitude, longitude, startDate, endDate } = req.query;

    // Check if latitude, longitude, start date, and end date are provided
    if (!latitude || !longitude || !startDate || !endDate) {
      return res.status(400).json({ error: 'Latitude, longitude, start date, and end date are required' });
    }

    // Fetch historical weather data using fetchHistoricalWeatherData function
    const historyData = await fetchHistoricalWeatherData(latitude, longitude, startDate, endDate);

    // Return the historical weather data in the response
    res.json(historyData);
  } catch (error) {
    console.log('API Error:', error); // Log the error

    res.status(500).json({ error: 'Failed to fetch historical weather data' });
  }
});

module.exports = router;
 */