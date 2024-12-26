const mongoose = require('mongoose');
const validatorPKG = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A user must have name'],
  },
  email: {
    type: String,
    required: [true, 'A user must have an email address'],
    unique: true,
    lowercase: true,
    validate: [validatorPKG.isEmail, 'Enter a valid email'],
  },
  photo: String,
  password: {
    type: String,
    required: [true, 'Password is required'],
    minLength: [8, 'Password must be at least 8 characters.'],
  },
  confirmPassword: {
    type: String,
    required: [true, 'Please confirm your password'],
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
