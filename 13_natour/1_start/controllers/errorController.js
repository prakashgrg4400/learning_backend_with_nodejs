//!===> In a middleware function, if we pass four arguments, than express will automatically understands that its a global error handler middleware. And it can be called by passing an error object argument inside "next()" function

module.exports = (err, req, res, next) => {
  console.log(err.stack); // the stack property stores all the information about the error, like what triggered the error and its details.

  err.statusCode = err.statusCode || 500; // 500 ==> internal server error
  err.status = err.status || 'Error';

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};
