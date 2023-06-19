const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  username: {
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
    enum: ['user'],
    default: 'user'
  },
  token: {
    type: String
  },
  tokenExp: {
    type: Number
  },
  active: {
    type: Boolean,
    default: true,
  }

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

userSchema.methods.comparePassword = async function (enteredPassword) {
  try {
    return await bcrypt.compare(enteredPassword, this.password);
  } catch (err) {
    throw new Error(err);
  }
};


userSchema.methods.generateToken = function (cb) {
  const user = this;
  // jsonwebtoken을 사용해서 토큰 생성
  const token = jwt.sign(user._id.toHexString(), "createToken");

  user.token = token;
  user.save(function (err, user) {
    if (err) {
      return cb(err); // Pass the error to the callback
    }
    cb(null, user);
  });
};



const User = mongoose.model('User', userSchema);

module.exports = User;