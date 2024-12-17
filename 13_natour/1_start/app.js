const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const express = require('express');
const morgan = require('morgan'); // show us information related to request.
const app = express();

//------------------------------------ middlewares ----------------------------------------------------
//--> All the middlewares will be written in this file .
console.log(process.env.NODE_ENV);

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());

app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  console.log('Hello from middleware');
  next();
});

app.use((req, res, next) => {
  console.log('Hello from second middleware');
  next();
});

app.use((req, res, next) => {
  req.Mytime = new Date().toISOString();
  next();
});

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// Handeling the undefined routes, which are not defined in our middleware function .
// The middleware will execute from top to bottom , and if line 34 and 35 are not able to get the routes, entered by user than it is not a valid route and than the middleware below will be executed which will handle all the remaining undefined routes .
app.all('*', (req, res, next) => {
  // all ==> It represents all the http request i.e. "get" , "post" , "delete" etc .
  // res.status(404).json({
  //   status: 'fail',
  //   message: `No such route ${req.originalUrl} is available`,
  // });

  //============ Using global error handler middleware ==========
  const err = new Error(`No such route ${req.originalUrl} is available`); // this error message will be stored inside "message" property i.e. err.message .
  err.statusCode = 404;
  err.status = 'fail';

  next(err); // Since we are passing argument inside "next()" function , so it will directly call the "global error middleware function" and it will escape all the middleware function in between the "global middleware" function and itself, if there is any middleware remaining in between them which is yet to be executed.
});

// ========================== Implementing a Global Error Handeling Middleware ==================
//==> If you define four parameters in a middleware function, than express will automatically understand that it is a global error handeling middleware function .
//==> Now we will use this global error middleware to do error handeling for all the node code. So to call this middleware, we just have to call "next()" function and pass the "error" argument inside that "next()" function i.e. next(err_obj) . After doing this express will automatically understand that , we are trying to call the global error handler middleware, and express will skip all the middleware function if there is a middleware function remaining in the middleware stack to be executed, and directly jump towards the global error handler middleware as shown above .
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500; // 500 ==> internal server error
  err.status = err.status || 'Error';

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
});

module.exports = app;

//!---> Here we structured our file. In above commented codes "middleware" , "router" , "route handler or controller" all of them in a single file "app.js" . But now we have created separate file router i.e. "routes file" where all the router are created , separate file for route handeler or controller i.e. "controllers" where we define all the route handlers and export them . And in app.js we will write our code related to "middleware" . And we even created our server in a separate file i.e. "server.js" .

//!--> code execution flow ==> (server.js -> request -> app.js -> routes -> controller -> response)
