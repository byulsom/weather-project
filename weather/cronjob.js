const cron = require('node-cron');
const axios = require('axios');
const fetchWeatherData = require('./fetchweather');
const moment = require('moment');
const CronJobData = require('../models/cronjob');
const WeatherData = require('../models/weather');


const userRequests = [];

const cronJob = async (latitude, longitude) => {
  try {
    console.log('Cron job started:');

    // Fetch weather data for the specified location
    const weatherData = await fetchWeatherData(latitude, longitude, moment());

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

    // Add a log statement to indicate the cron job execution
    console.log('Cron job executed successfully:');

    // Create a new CronJobData document to store the temperature and city
    const cronJobData = new CronJobData({
      latitude: latitude.toString(),
      longitude: longitude.toString(),
      temperature: weatherData.main.temp,
      city: weatherData.name,
    });

    // Save the CronJobData document to the database
    await cronJobData.save();

    // Log the saved cron job data
    console.log('Cron job data saved:', cronJobData);
  } catch (error) {
    console.error('Failed to fetch weather data:', error);
  }
};

// Function to update cron job when a user requests a specific location
const updateCronJob = (latitude, longitude) => {
  // Check if the cron job is already running
  if (!cronTask.running) {
    cronTask.start();
  }

  // Add the user request to the userRequests array
  userRequests.push({ latitude, longitude });
};

const cronTask = cron.schedule('0 0 * * *', () => {
  // Process each user request
  userRequests.forEach((request) => {
    const { latitude, longitude } = request;
    cronJob(latitude, longitude);
  });

  // Clear the userRequests array after processing all requests
  userRequests.length = 0;
});

module.exports = {
  cronJob,
  updateCronJob,
  cronTask // Export the cronTask if you need to control the cron job externally
};
