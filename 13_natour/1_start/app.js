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
  res.status(404).json({
    status: 'fail',
    message: `No such route ${req.originalUrl} is available`,
  });
});

module.exports = app;

//!---> Here we structured our file. In above commented codes "middleware" , "router" , "route handler or controller" all of them in a single file "app.js" . But now we have created separate file router i.e. "routes file" where all the router are created , separate file for route handeler or controller i.e. "controllers" where we define all the route handlers and export them . And in app.js we will write our code related to "middleware" . And we even created our server in a separate file i.e. "server.js" .

//!--> code execution flow ==> (server.js -> request -> app.js -> routes -> controller -> response)
