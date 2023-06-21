const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

const unlimitSchema = new mongoose.Schema({
  unlimitname: {
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
    enum: ['unlimit'],
    default: 'unlimit'
  },
  token: {
    type: String
  },
  tokenExp: {
    type: Number
  }
});

unlimitSchema.pre('save', async function (next) {
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

unlimitSchema.methods.comparePassword = async function (plainPassword) {
  try {
    const isMatch = await bcrypt.compare(plainPassword, this.password);
    return isMatch;
  } catch (err) {
    throw err;
  }
};

unlimitSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ unlimitId: this._id }, process.env.SECRET_KEY);
  this.token = token;
  this.tokenExp = Math.floor(Date.now() / 1000) + 15 * 60; // Token expiration time: 15 minutes
  return token;
};

unlimitSchema.methods.verifyAuthToken = async function (token) {
  try {
    const unlimit = await Unlimit.findOne({ token: token });

    if (!unlimit) {
      return false; // Token not found in the database
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    return decoded.unlimitId === unlimit._id.toString();
  } catch (err) {
    return false; // Token verification failed
  }
};


const Unlimit = mongoose.model('unlimit', unlimitSchema);

module.exports = Unlimit;
