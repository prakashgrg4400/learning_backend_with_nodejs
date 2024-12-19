//!===> Here our function "func" is an asynchronous function which will return promise, so we are using catch to consume the error promises . The reason we are returning another function is that , A route controller must be a function, Than only express will automatically call that function when a user enters or request at that particular route . So we are returning this function as a controller function .

module.exports = (func) => {
  return (req, res, next) => {
    func(req, res, next).catch(next); // This line of code is equivalent to "func(req , res , next).catch(err=>next(err))" , which will automatically trigger the Global Error Handler Middleware and this global middleware will handle the rest of the error.
  };
};
