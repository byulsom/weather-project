const express = require('express');
const router = express.Router();
const { updateCronJob } = require('../weather/cronjob');
const CronJobData = require('../models/cronjob');

// cronjob
router.post('/', async (req, res) => {
  // Retrieve latitude and longitude from the request body
  const { latitude, longitude } = req.body;

  try {
    // Create a new instance of CronJobData
    const cronJobData = new CronJobData({
      latitude,
      longitude,
    });

    // Save the user request data to the CronJobData collection
    await cronJobData.save();

    // Process the user request and update the cron job
    updateCronJob(latitude, longitude);

    // Send a response indicating success
    res.send('Cron job updated successfully');
  } catch (error) {
    // Handle any errors that occur during the saving process
    console.error('Failed to save user request data:', error);
    res.status(500).send('Failed to update cron job');
  }
});

module.exports = router;
