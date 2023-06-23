const axios = require('axios');
const config = require('../config/pvwatt');
const pvwattURL = 'https://developer.nrel.gov/api/pvwatts/v8.json';

// Function to fetch solar data from the PVWatt API
async function fetchPVWattData(latitude, longitude) {
  try {
    const response = await axios.get(pvwattURL, {
      params: {
        lat: latitude,
        lon: longitude,
        api_key: config.pvwattApiKey,
        // Additional parameters can be added here if required
      },
    });

    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch PVWatt data');
  }
}

// Function to calculate the rate of PV/Watts per day
function calculatePVWattsRate(
  totalCapacity,
  averageSolarIrradiance,
  cloudCover,
  systemLoss = 14, // Default system loss percentage of 14%
  powerPeak,
  orientation,
  tilt,
  area,
  longitude,
  latitude
) {
  // Calculate effective solar irradiance
  const effectiveSolarIrradiance = averageSolarIrradiance * (100 - cloudCover) / 100;

  // Calculate daily energy production in kWh
  const dailyEnergyProduction = effectiveSolarIrradiance * totalCapacity;

  // Apply system loss
  const adjustedEnergyProduction = dailyEnergyProduction * (100 - systemLoss) / 100;

  // Adjust energy production based on power peak, orientation, tilt, and area
  const adjustedEnergyProductionWithParams =
    adjustedEnergyProduction *
    (powerPeak / 100) *
    (area / 1000);

  // Calculate rate of PV/Watts per day
  const ratePVWattsPerDay = adjustedEnergyProductionWithParams / totalCapacity;

  return ratePVWattsPerDay;
}

module.exports = {
  fetchPVWattData,
  calculatePVWattsRate,
};
