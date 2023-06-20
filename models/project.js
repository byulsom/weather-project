const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  projectname: {
    type: String,
    required: true,
  },
  products: [
    {
      productname: {
        type: String,
        required: true,
      },
      location: {
        lat: {
          type: String,
          required: true,
        },
        lon: {
          type: String,
          required: true,
        },
      },
    },
  ],
  userid: {
    type: String,  // Change the type to String
    required: true,
  },
  postedAt: {
    type: Date,
    required: true,
  },
  active: {
    type: Boolean,
    default: true,
  },
});

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;