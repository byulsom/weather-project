const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

const companySchema = new mongoose.Schema({
  companyname: {
    type: String,
    required: true
  },
  email: {
    type: String,
    match: [
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      'Please add a valid email address.'
    ],
    required: [true, 'Please enter an email address'],
    unique: true,
    lowercase: true,
    dropDups: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['company'],
    default: 'company'
  },
  token: {
    type: String
  },
  tokenExp: {
    type: Number
  }
});

companySchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
    next();
  } catch (err) {
    return next(err);
  }
});

companySchema.methods.comparePassword = async function (plainPassword) {
  try {
    const isMatch = await bcrypt.compare(plainPassword, this.password);
    return isMatch;
  } catch (err) {
    throw err;
  }
};

companySchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ companyId: this._id }, process.env.SECRET_KEY);
  this.token = token;
  this.tokenExp = Math.floor(Date.now() / 1000) + 15 * 60; // Token expiration time: 15 minutes
  return token;
};

companySchema.methods.verifyAuthToken = async function (token) {
  try {
    const company = await Company.findOne({ token: token });

    if (!company) {
      return false; // Token not found in the database
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    return decoded.companyId === company._id.toString();
  } catch (err) {
    return false; // Token verification failed
  }
};


const Company = mongoose.model('company', companySchema);

module.exports = Company;
