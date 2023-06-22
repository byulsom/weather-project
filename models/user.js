const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    match: [
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      'Please add a valid email address.',
    ],
    required: [true, 'Please enter an email address'],
    unique: true,
    lowercase: true,
    dropDups: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['user'],
    default: 'user',
  },
  token: {
    type: String,
  },
  tokenExp: {
    type: Number,
  },
});

userSchema.pre('save', async function (next) {
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

userSchema.methods.comparePassword = async function (plainPassword) {
  try {
    const isMatch = await bcrypt.compare(plainPassword, this.password);
    return isMatch;
  } catch (err) {
    throw err;
  }
};

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ userId: this._id }, process.env.SECRET_KEY);
  this.token = token;
  this.tokenExp = Math.floor(Date.now() / 1000) + 15 * 60; // Token expiration time: 15 minutes
  return token;
};

userSchema.methods.verifyAuthToken = async function (token) {
  try {
    const user = await User.findOne({ token: token });

    if (!user) {
      return false; // Token not found in the database
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    return decoded.userId === user._id.toString();
  } catch (err) {
    return false; // Token verification failed
  }
};

const User = mongoose.model('User', userSchema);

module.exports = User;
