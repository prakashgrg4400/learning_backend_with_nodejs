//!===> In a middleware function, if we pass four arguments, than express will automatically understands that its a global error handler middleware. And it can be called by passing an error object argument inside "next()" function

const AppError = require('../utils/appError');

//==> During development phase we need send more details about the errors, so it will be easy for developers to understand the source of error.
function developmentErrorHandler(err, res) {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: err.stack,
    error: err,
  });
}

//==> During production , the client uses the application, so we need to send more standard error with less description about the error .
function producitonErrorHandler(err, res) {
  //==> Checking whether the error is programming error or operational(error occured due to wrong input or data) .
  if (err.isOperational) {
    // Handeling error caused by user because of invalid input , routes etc .
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    // Handeking error caused by programming logic .
    // log the error , to get more information about the error, without letting the user know about the error .
    console.error('Error ==> ', err);

    // sending generic message , i.e. standard message .
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong',
    });
  }
}

function handleCastError(err) {
  return new AppError(`Invalid ${err.path} : ${err.value}`, 400);
}

module.exports = (err, req, res, next) => {
  // console.log(err.stack); // the stack property stores all the information about the error, like what triggered the error and its details.

  err.statusCode = err.statusCode || 500; // 500 ==> internal server error
  err.status = err.status || 'Error';

  if (process.env.NODE_ENV === 'development') {
    developmentErrorHandler(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    console.log('stack ==> ', err.stack);
    if (err.name === 'CastError') {
      error = handleCastError(err);
      //   res.status(error.statusCode).json({
      //     status: 'fail',
      //     message: error.message,
      //   });
    }
    producitonErrorHandler(error, res);
  }
};
