const mongoose = require('mongoose');

const cronjobDataSchema = new mongoose.Schema({
  latitude: {
    type: String,
    required: true,
  },
  longitude: {
    type: String,
    required: true,
  },
});

const CronJobData = mongoose.model('CronJobData', cronjobDataSchema);

module.exports = CronJobData;
