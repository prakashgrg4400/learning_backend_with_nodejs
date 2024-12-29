// All the logic related to the authentication will be handeled here in this file.
const User = require('../models/userModel');
const catchAsyncError = require('../utils/catchError');
const jwt = require('jsonwebtoken');

//==> Below controller will create a new user in the database , when a user sends a post request at /signup route. If the user is successfully created , then it will send the response to the user with the status code 201 and the newly created user in the response. Otherwise it will send the error to the user using our custom global error handler middleware . First catchAsyncError will catch the error and then it will pass the error to the global error handler middleware. It will do the work of try catch block. So instead os using try catch block in each controller , we are using this catchAsyncError function to catch the error and pass it to the global error handler middleware.
exports.signup = catchAsyncError(async (req, res, next) => {
  // const newUser = await User.create(req.body);
  //==> It is better to store the data in database using below step, it is because if you directly use req.body , than the user might send extra data which than can be stored inside the database. So it is better to store the data in database by selecting only the required fields.
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
  });

  //==> Here we are using "jsonwebtoken" package to create a token for the user. Since this controller handles for signing the new users, so we are not really authenticating the user here. We are just creating a token for the user , so that the user can use this token to access the protected routes. We are using the "sign()" method of jwt to create a token for the user. The first parameter is the payload , which is the data that we want to store in the token. We are storing the user id in the token. The second parameter is the secret key , which is used to sign the token. The third parameter is the options , which is an object. WE are using an option called "expiresIn" , which is the time after which the token will expire. We are storing the token in a variable called "token". We are sending the token in the response to the user. We are also sending the newly created user in the response. We are sending the status code 201 , which means that the user is successfully created.
  const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  //==> jwt is created by the combination of encoded(header)+encoded(payload)+signature . The signature is by applying an encoding algorithm on "encoded(header)"+"encoded(payload)"+"secret key" .
  //!==> You can go to "jwt.io" website to decode the jwt token. You can paste the jwt token in the website and it will decode the token for you. You can see the header , payload and signature of the token.

  res.status(201).json({
    status: 'success',
    token: token,
    data: {
      user: newUser,
    },
  });
});
