const axios = require('axios');
const cron = require('node-cron');
const config = require('../config/default');
const WeatherData = require('../models/weather');
const mongoose = require('mongoose');


const searchURL = 'https://nominatim.openstreetmap.org/search';
const reverseURL = 'https://nominatim.openstreetmap.org/reverse';
const weatherURL = 'https://api.openweathermap.org/data/2.5/weather';

const fetchGeo = async (input) => {
  try {
    const response = await axios.get(searchURL, {
      params: {
        q: input,
        format: 'json',
      },
    });

    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch geographic data');
  }
};

const fetchLocation = async (latitude, longitude) => {
  try {
    const response = await axios.get(reverseURL, {
      params: {
        lat: latitude,
        lon: longitude,
        zoom: 14,
        format: 'json',
      },
    });

    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch location data');
  }
};

const fetchWeatherData = async (latitude, longitude) => {
  try {
    const response = await axios.get(weatherURL, {
      params: {
        lat: latitude,
        lon: longitude,
        APPID: config.apiKey,
        units: 'metric',
      },
    });

    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch weather data');
  }
};


///cronjob
const schedule = '* 1 1 * *';

const cronJob = async () => {
  try {
    const locations = [
      { latitude: 51.570689, longitude: -0.142993 },
      { latitude: 52.458684, longitude: 13.395950 },
      // Add more latitude and longitude
    ];

    for (const location of locations) {
      const { latitude, longitude } = location;

      // Fetch weather data
      const weatherData = await fetchWeatherData(latitude, longitude);

      // Create a new WeatherData document
      const newWeatherData = new WeatherData({
        city: weatherData.name,
        temperature: weatherData.main.temp,
        description: weatherData.weather[0].description,
        location: {
          lat: latitude.toString(),
          lon: longitude.toString(),
        },
      });

      // Save the WeatherData document to the database
      await newWeatherData.save();

      // Log the saved weather data
      console.log('Weather data saved:', newWeatherData);
    }

    // Add a log statement to indicate the cron job execution
    console.log('Cron job executed successfully');
  } catch (error) {
    console.error('Failed to fetch weather data:', error);
  }
};

// Schedule the cron job
cron.schedule(schedule, cronJob);

module.exports = {
  fetchGeo,
  fetchLocation,
  fetchWeatherData,
};
