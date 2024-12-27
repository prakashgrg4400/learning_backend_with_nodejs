// All the logic related to the authentication will be handeled here in this file.
const User = require('../models/userModel');
const catchAsyncError = require('../utils/catchError');

//==> Below controller will create a new user in the database , when a user sends a post request at /signup route. If the user is successfully created , then it will send the response to the user with the status code 201 and the newly created user in the response. Otherwise it will send the error to the user using our custom global error handler middleware . First catchAsyncError will catch the error and then it will pass the error to the global error handler middleware. It will do the work of try catch block. So instead os using try catch block in each controller , we are using this catchAsyncError function to catch the error and pass it to the global error handler middleware.
exports.signup = catchAsyncError(async (req, res, next) => {
  const newUser = await User.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      user: newUser,
    },
  });
});
