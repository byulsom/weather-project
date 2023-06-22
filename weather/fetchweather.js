const axios = require('axios');
const config = require('../config/default');
const WeatherData = require('../models/weather');
const mongoose = require('mongoose');
const weatherURL = 'https://api.openweathermap.org/data/2.5/weather';

const fetchWeatherData = async (latitude, longitude) => {
  try {
    const response = await axios.get(weatherURL, {
      params: {
        lat: latitude,
        lon: longitude,
        APPID: config.weatherapi,
        units: 'metric',
      },
    });

    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch weather data');
  }
};


module.exports = fetchWeatherData;