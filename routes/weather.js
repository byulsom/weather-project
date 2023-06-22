const express = require('express');
const router = express.Router();
const fetchWeatherData = require('../weather/fetchweather');


/// current weather
router.get('/', async (req, res) => {
  try {
    let { latitude, longitude } = req.query;

    // Check if latitude and longitude are provided
    if (!latitude || !longitude) {
      return res.status(400).json({ error: 'Latitude and longitude are required' });
    }

    // Trim whitespace and newline characters from latitude and longitude
    latitude = latitude.trim();
    longitude = longitude.trim();

    // Fetch weather data using fetchWeatherData function
    const weatherData = await fetchWeatherData(latitude, longitude);

    // Return the weather data in the response
    res.json(weatherData);
  } catch (error) {
    console.log('API Error:', error); // Log the error

    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
});

module.exports = router;
