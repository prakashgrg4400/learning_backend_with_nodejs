// All the logic related to the authentication will be handeled here in this file.
const User = require('../models/userModel');
const catchAsyncError = require('../utils/catchError');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/appError');
const { promisify } = require('util');

//==> A utility function which will create JWT token for use.
const createToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

//==> Below controller will create a new user in the database , when a user sends a post request at /signup route. If the user is successfully created , then it will send the response to the user with the status code 201 and the newly created user in the response. Otherwise it will send the error to the user using our custom global error handler middleware . First catchAsyncError will catch the error and then it will pass the error to the global error handler middleware. It will do the work of try catch block. So instead os using try catch block in each controller , we are using this catchAsyncError function to catch the error and pass it to the global error handler middleware.
exports.signup = catchAsyncError(async (req, res, next) => {
  // const newUser = await User.create(req.body);
  //==> It is better to store the data in database using below step, it is because if you directly use req.body , than the user might send extra data which than can be stored inside the database. So it is better to store the data in database by selecting only the required fields.
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    passwordChangedAt: req.body.passwordChangedAt,
  });

  //==> Here we are using "jsonwebtoken" package to create a token for the user. Since this controller handles for signing the new users, so we are not really authenticating the user here. We are just creating a token for the user , so that the user can use this token to access the protected routes. We are using the "sign()" method of jwt to create a token for the user. The first parameter is the payload , which is the data that we want to store in the token. We are storing the user id in the token. The second parameter is the secret key , which is used to sign the token. The third parameter is the options , which is an object. WE are using an option called "expiresIn" , which is the time after which the token will expire. We are storing the token in a variable called "token". We are sending the token in the response to the user. We are also sending the newly created user in the response. We are sending the status code 201 , which means that the user is successfully created.
  // const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET_KEY, {
  //   expiresIn: process.env.JWT_EXPIRES_IN,
  // });
  const token = createToken(newUser._id);
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

exports.login = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  //==> checking if user has entered data for both field .
  if (!email || !password) {
    next(new AppError('Email and Password field is required', 400));
  }

  //==> fetching data from the database based on user email , and including the "password" field with the help of "select" method, where "+" sign means include this field in the output, as it was excluded in the "userModal" section, So other client wont be able to see the password  on the client side .
  const user = await User.findOne({ email: email }).select('+password'); // if email is valid fetching all the data related to that email

  //==> checking if database stored password and the password entered by the user is same or not .
  // let result = await user.validatePassword(password, user.password); //!==> If user doesnt exist, than this line of code will not run and we will get error, so we will directly use it as shown below . Now even if user doent exist , we will get proper error message, and if user exist, than we will validate the password as shown below .

  // if (!user || !result) {
  if (!user || !(await user.validatePassword(password, user.password))) {
    // if either email, or password do not match than this error will befired
    next(new AppError('Email or Password doesnt match the credentials', 401));
  }

  // ==> After all the credentials are matched, we will create a "JWT" token and pass it to the client as shown below .
  const token = createToken(user._id);

  res.status(200).json({
    status: 'success',
    token: token,
  });
});

// ==> below controller will checki if the user is valid or not , before fetching for the tours.
exports.protect = catchAsyncError(async (req, res, next) => {
  //!==> To check if the user is valid or not, first we will check if the client has used jwt token or not as shown below . To sent a JWT token from the client side in a proper manner, we use "Authorization" : "Bearer jwt_token_of_user" in the headers field . And to access those header data we will use req.headers.
  console.log(req.headers);
  let token;

  //!==> Checking if client has send the "JWT" token in the headers or not .
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1]; //! if jwt token is send from client, than storing the jwt token.
    console.log('Token ==> ', token);
  }

  //!==> In case if the client is not sending the jwt token, than they are not valid user, so we will not send data to the client instead we will send an error message appropriate for the unauthorized user.
  if (!token) {
    return next(
      new AppError(
        'Unauthorized user , You must have a valid token to access the data',
        401,
      ),
    ); //!==> 401 refers to the unauthorized user.
  }

  //!====> Verification of the token .
  // let decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  let decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET_KEY); // promisify accepts a function and when that function is called, it retuns a promise.
  console.log(decoded);

  //!====> Verification of the user .
  const currentUser = await User.findById(decoded.id);
  // console.log('User ==> ', currentUser);
  if (!currentUser) {
    return next(
      new AppError('The user having this token is not available!!!', 401),
    );
  }

  //!====> verification of the user after the password is changed
  if (currentUser.isPasswordChanged(decoded.iat)) {
    return next(
      new AppError('Old token , Your password is changed recently', 401),
    );
  }

  //!==> Give access to the protected routes
  req.user = currentUser;

  next();
});
