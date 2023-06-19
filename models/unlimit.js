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

unlimitSchema.methods.generateToken = async function () {
  try {
    const unlimit = this;
    // jsonwebtoken을 사용해서 토큰 생성
    const token = jwt.sign({ unlimitId: unlimit._id }, secretKey);

    unlimit.token = token;
    await unlimit.save(); // Save the updated document without a callback
    return unlimit;
  } catch (err) {
    throw err;
  }
};




const Unlimit = mongoose.model('Unlimit', unlimitSchema);

module.exports = Unlimit;