const catchAsyncError = require('../utils/catchError');
const User = require('../models/userModel');

exports.getAllUsers = catchAsyncError(async (req, res) => {
  let users = await User.find();
  res.status(200).json({
    status: 'success',
    data: {
      users: users,
    },
  });
});

exports.getUser = (req, res) => {
  res.status(500).json({
    status: 'internal server error',
    message: 'The route is not defined yet',
  });
};

exports.createUser = (req, res) => {
  res.status(500),
    json({
      status: 'internal server error',
      message: 'The route is not defined yet',
    });
};

exports.updateUser = (req, res) => {
  res.status(500),
    json({
      status: 'internal server error',
      message: 'The route is not defined yet',
    });
};

exports.deleteUser = (req, res) => {
  res.status(500),
    json({
      status: 'internal server error',
      message: 'The route is not defined yet',
    });
};
