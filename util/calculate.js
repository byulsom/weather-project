
const pvwattURL = 'https://api/solar/data_query/v2.json?api_key=Z79DK4CI8qnJ9WgMJF9gKbIyhgDFOcKNB0tvMdsy';

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
    const adjustedEnergyProductionWithParams = adjustedEnergyProduction * (powerPeak / 100) *
      getOrientationFactor(orientation) * getInclinationFactor(tilt) * (area / 1000);
  
    // Calculate rate of PV/Watts per day
    const ratePVWattsPerDay = adjustedEnergyProductionWithParams / totalCapacity;
  
    return ratePVWattsPerDay;
  }
  

  
  module.exports = { calculatePVWattsRate };
  