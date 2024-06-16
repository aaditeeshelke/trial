const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  mobile: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    required: true
  },
  lastLogin: {
    type: Date,
    default: null
  },
  loginTimes: [{
    type: Date,
    default: null
  }],
  logoutTimes: [{
    type: Date,
    default: null
  }]
});

module.exports = mongoose.model('User', userSchema);
