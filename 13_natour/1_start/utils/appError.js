class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';

    Error.captureStackTrace(this, this.constructor); // here we are saying that keep track of the error of the current object i.e first argument "this" and the second argument "this.constructor" is to say that exclude the information of the "AppError" constructor in the error details, as it includes unnecessary details like the description of the error, which will make the error information longer.
  }
}

module.exports = AppError;
