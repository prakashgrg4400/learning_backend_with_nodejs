//======================================= Basics of ecpress =========================================
// const express = require('express');// importing express library .

// const app = express() ; // express is a function , which when called returns us a list of useful properties and function inside an object, which is then stores inside "app" variable.

//--> for handeling "routes" in nodejs , we did multiple condition stuffs inside callback function of "createServer" , but here its easy.
//--> get() method is saying that the request is "get" , and the path is the "root" path , and the callback function will be triggered each time we visit this path. we used "re.statusCode = 400" previously, but we can directly set it using status() method. The "express" library provides us with more functionality than node. The "send function" is similar to "end()" , which is used to send data to the client.
// app.get("/" , (req , res)=>{
//     // res.status(200).send("Hello from the server side , I am Prakash Gurung");
//     res.status(200).json({message:"I am a student" , app:"Natours"});
// })

// app.post("/" , (req , res)=>{
//     res.send("this is my post request");
// })
// const port = 3000

//--> In node to create a server, we needed to import "http" , than use createServer() method and put callback function inside it and listen to the server, which was created by "http.createServer()" , but here we just have to listen to the server in similar manner.
// app.listen(port , ()=>{
//     console.log(`Starting server at port ${port}`);
// })

//!===========================================Lets start building "Ntour" API========================================================

// const fs = require('fs');
// const express = require('express');
// const morgan = require('morgan'); // this package shows us the details of a request such as request method, url where request is send ,status code ,time taken , length of content.

// const app = express();

// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
// ); // change json into javascript data type

//------------------------------------ middlewares ----------------------------------------------------

// app.use(morgan('dev'));
// app.use(express.json()); // "use()" method is used to add "middleWare" in out project. Express.json() is a middleware function which converts the json data into javascript object format in the middle of request and response, and makes the data available to "req.body" in the response side.

//--> below is a custom made middleware. All the middle ware have access to "request object","response object" and "next method" .And it is compulspry to use "next()" method to pass the handler to the next middleware, or our code will get stuck. All of these middlewares are executed between request and response i.e. Each time a request is made on any url these custom middleware will be executed automatically for every request in the pattern in which the code is written. And finally "route handeler" is executed. A "routte handeler" is also a type of middleware function, which is not triggered each we make a request. But is triggered when we make request to their respective "routes" .
// app.use((req, res, next) => {
//   console.log('Hello from middleware');
//   next();
// });
// app.use((req, res, next) => {
//   console.log('Hello from second middleware');
//   next();
// });
// app.use((req, res, next) => {
//   req.Mytime = new Date().toISOString(); // here we are adding our own new property inside request object.
//   next();
// });

// ------------------------------------- route handeler -------------------------------------------
// const getAllTours = (req, res) => {
//   console.log(req.Mytime); // this is a proof that middleware are executed in first come first serve pattern.
//   res.status(200).json({
//     // doing simple "reponse formatting" , by adding our own data i.e. "status" and "result" .
//     status: 'success',
//     result: tours.length,
//     data: {
//       tours: tours,
//     },
//   });
// };

// const getTour = (req, res) => {
//   // console.log(req.params); // the path variables or parameters are stored inside "req.params"
//   const id = Number(req.params.id); // by default id is in string, or  (req.params.id*1) does the same trick as Number().

//   const tour = tours.find((el) => el.id === id); // searching the tour whose id is equal to path variable .

//   if (!tour) {
//     // Condition if id is not found inside "tours" .
//     return res.status(404).json({
//       status: 'fail',
//       message: 'Invalid id',
//     });
//   }

//   res.status(200).json({
//     status: 'success',
//     data: {
//       tour: tour,
//     },
//   });
// };

// const createTour = (req, res) => {
// console.log(req.body); // without adding middleware , the body property will return us "undefined" otherwise it will provide us the new data entered buy the user.
// res.end("done");

// Now we knoe the new data created by the client resides inside req.body, and that data is handeled by the middleware which sits between client and server. It also helps us in modifying the data as shown below.
// const tourId = tours[tours.length - 1].id + 1;
// const newTour = Object.assign({ id: tourId }, req.body); //merging two objects into single object.
// tours.push(newTour);

//--> here we could have read the file synchronously but we are not, it is because this callback function is being executed by event loop, and if we had read the file synchronously, than it will had blocked the event loop.
//   fs.writeFile(
//     `${__dirname}/dev-data/data/tours-simple.json`,
//     JSON.stringify(tours),
//     (err) => {
//       res.status(201).json(newTour); // 201 status code is for creating new data .
//     }
//   );
// };

// const updateTour = (req, res) => {
//   if (req.params.id >= tours.length) {
//     return res.status(404).json({
//       status: 'fail',
//       message: 'Invalid id',
//     });
//   }

//   res.status(200).json({
//     status: 'success',
//     data: {
//       tour: '<Your updated tour herer>',
//     },
//   });
// };

// const deleteTour = (req, res) => {
//   if (req.params.id * 1 >= tours.length) {
//     return res.status(404).json({
//       status: 'fail',
//       message: 'invalid id',
//     });
//   }
//   res.status(204).json({
//     status: 'success',
//     data: null,
//   });
// };

// const getAllUsers = (req, res) => {
//   res.status(500).json({
//     status: 'internal server error',
//     message: 'The route is not defined',
//   });
// };
// const getUser = (req, res) => {
//   res.status(500).json({
//     status: 'interna server error',
//     message: 'The route is not defined yet',
//   });
// };
// const createUser = (req, res) => {
//   res.status(500),
//     json({
//       status: 'internal server error',
//       message: 'The route is not defined yet',
//     });
// };
// const updateUser = (req, res) => {
//   res.status(500),
//     json({
//       status: 'internal server error',
//       message: 'The route is not defined yet',
//     });
// };
// const deleteUser = (req, res) => {
//   res.status(500),
//     json({
//       status: 'internal server error',
//       message: 'The route is not defined yet',
//     });
// };

//--------------------------------- routes ------------------------------------------------
//   /api/v1/tours/:id/:x/:y --> if you want to add multiple variable in url
//   /api/v1/tours/:id/:name? --> if you want optional parameters add "?" after the name of variable , default name = undefined
// app.get('/api/v1/tours', getAllTours);//--> the second parameter in get() method is called route handler.
// app.get('/api/v1/tours/:id', getTour);
// app.post('/api/v1/tours', createTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);

// above 5 line of code , can be more organized by usign route() method as shown below. Working mechanish is same .
// app.route('/api/v1/tours').get(getAllTours).post(createTour);

// app
//   .route('/api/v1/tours/:id')
//   .get(getTour)
//   .patch(updateTour)
//   .delete(deleteTour);

// app.route('/api/v1/users').get(getAllUsers).post(createUser);

// app
//   .route('/api/v1/users/:id')
//   .patch(updateUser)
//   .delete(deleteUser)
//   .get(getUser);

//-----> creating router to handle a set of paths, by mounting the route in the base path as shown below.
//--> Previously we used the express to single handedly handle all routes, but thet will make the code hard to read. So we will create multiple routes which will handle their specific routes. And finally mount the routes in the app.
//--> tourRoute and userRouter and middleware functions. So we use them with middleware.
// const tourRouter = express.Router();// this will return a middleware funtion i.e. router.
// const userRouter = express.Router();

//--> using router to handle multiple routes, as shown a single router is handeling two different paths i.e. "/" and "/:id".
// tourRouter.route('/').get(getAllTours).post(createTour);

// tourRouter
//   .route('/:id')
//   .get(getTour)
//   .patch(updateTour)
//   .delete(deleteTour);

//   userRouter.route('/').get(getAllUsers).post(createUser);

//   userRouter
//   .route('/:id')
//   .patch(updateUser)
//   .delete(deleteUser)
//   .get(getUser);

// app.use('/api/v1/tours', tourRouter);// Mounting the middleware function in middleware.
// app.use('/api/v1/users', userRouter);

// const port = 3000;

// app.listen(port, () => {
//   console.log(`Starting the server at port ${port}`);
// });

//!============================================= above code and below code is same ===============================================
//!--> the only difference is that below code is organized with a better file structure .
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const express = require('express');
const morgan = require('morgan');// show us information related to request.
const app = express();

//------------------------------------ middlewares ----------------------------------------------------
//--> All the middlewares will be written in this file .
console.log(process.env.NODE_ENV);// even though we configured the environment variables in "server.js" , we can get access in all the other files too , it is because node uses the same process for all the files.
if(process.env.NODE_ENV === "development")
{
  app.use(morgan('dev'));// Here we are specifying a task, that it should be executed when we are in "development environment" , if we are in production environment than this task will not be executed.
}

app.use(express.json());
app.use(express.static(`${__dirname}/public`))// To read a static file in express.js we use "express.static(file_path)" middleware function, which deals with reading static file. here "file_path" means the folder which stores all our static file but not the path of a static file. In this project our static files are in "public" folder, so we give this pathname to "static()" middleware function. Suppose you are searching for "/overview.html" , first express checks whether this path is defined in router or not. If it is not defined than it reads the "express.static()" middleware function and makes the folder whose path is written inside "static()" as a root path, and automatically searches for the static files i.e. html,css,js,images and renders them in the client side. Remember this middleware function only reads the "static file" , but not the folders. 
// So if you use any of this path , than express is smart enough to read these files from "public" folder automatically. The path are:- "/overview.html"  ,  "/tour.html" , "/css/style.css" , "/img/favicon.png" and so on.  But if use folder name like "/img" , than you will not get anything as "/img" is not static file but it is a folde and the middleware function "express.static()" only reads static file. 

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

module.exports = app ;

//!---> Here we structured our file. In above commented codes "middleware" , "router" , "route handler or controller" all of them in a single file "app.js" . But now we have created separate file router i.e. "routes file" where all the router are created , separate file for route handeler or controller i.e. "controllers" where we define all the route handlers and export them . And in app.js we will write our code related to "middleware" . And we even created our server in a separate file i.e. "server.js" .

//!--> code execution flow ==> (server.js -> request -> app.js -> routes -> controller -> response) 
