/* const axios = require('axios');
const config = require('../config/default');

const archiveURL = 'https://archive-api.open-meteo.com/v1/archive';

const fetchHistoricalWeatherData = async (latitude, longitude, startDate, endDate) => {
  try {
    const response = await axios.get(archiveURL, {
      params: {
        latitude,
        longitude,
        start_date: startDate,
        end_date: endDate,
        daily: 'temperature_2m_mean',
        timezone: 'Europe/Berlin',
        apikey: config.weatherapi,
      },
    });

    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch historical weather data');
  }
};

module.exports = fetchHistoricalWeatherData; */