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

//===========================================Lets start building "Ntour" API========================================================

const fs = require('fs');
const express = require('express');
const morgan = require('morgan');// this package shows us the details of a request such as request method, url where request is send ,status code ,time taken , length of content.

const app = express();

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
); // change json into javascript data type

//------------------------------------ middlewares ----------------------------------------------------

app.use(morgan('dev'));
app.use(express.json()); // "use()" method is used to add "middleWare" in out project. Express.json() is a middleware function which converts the json data into javascript object format in the middle of request and response, and makes the data available to "req.body" in the response side.

//--> below is a custom made middleware. All the middle ware have access to "request object","response object" and "next method" .And it is compulspry to use "next()" method to pass the handler to the next middleware, or our code will get stuck. All of these middlewares are executed between request and response i.e. Each time a request is made on any url these custom middleware will be executed automatically for every request in the pattern in which the code is written. And finally "route handeler" is executed. A "routte handeler" is also a type of middleware function, which is not triggered each we make a request. But is triggered when we make request to their respective "routes" . 
app.use((req,res,next)=>{
  console.log("Hello from middleware");
  next(); 
})
app.use((req,res,next)=>{
  console.log("Hello from second middleware");
  next(); 
})
app.use((req,res,next)=>{
  req.Mytime = new Date().toISOString();// here we are adding our own new property inside request object.
  next(); 
})

// ------------------------------------- route handeler -------------------------------------------
const getAllTours = (req, res) => {
  console.log(req.Mytime);// this is a proof that middleware are executed in first come first serve pattern.
  res.status(200).json({
    // doing simple "reponse formatting" , by adding our own data i.e. "status" and "result" .
    status: 'success',
    result: tours.length,
    data: {
      tours: tours,
    },
  });
};

const getTour = (req, res) => {
  // console.log(req.params); // the path variables or parameters are stored inside "req.params"
  const id = Number(req.params.id); // by default id is in string, or  (req.params.id*1) does the same trick as Number().

  const tour = tours.find((el) => el.id === id); // searching the tour whose id is equal to path variable .

  if (!tour) {
    // Condition if id is not found inside "tours" .
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid id',
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour: tour,
    },
  });
};

const createTour = (req, res) => {
  // console.log(req.body); // without adding middleware , the body property will return us "undefined" otherwise it will provide us the new data entered buy the user.
  // res.end("done");

  // Now we knoe the new data created by the client resides inside req.body, and that data is handeled by the middleware which sits between client and server. It also helps us in modifying the data as shown below.
  const tourId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: tourId }, req.body); //merging two objects into single object.
  tours.push(newTour);

  //--> here we could have read the file synchronously but we are not, it is because this callback function is being executed by event loop, and if we had read the file synchronously, than it will had blocked the event loop.
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json(newTour); // 201 status code is for creating new data .
    }
  );
};

const updateTour = (req, res) => {
  if (req.params.id >= tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid id',
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour: '<Your updated tour herer>',
    },
  });
};

const deleteTour = (req, res) => {
  if (req.params.id * 1 >= tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'invalid id',
    });
  }
  res.status(204).json({
    status: 'success',
    data: null,
  });
};

//--------------------------------- routes ------------------------------------------------
//   /api/v1/tours/:id/:x/:y --> if you want to add multiple variable in url
//   /api/v1/tours/:id/:name? --> if you want optional parameters add "?" after the name of variable , default name = undefined
// app.get('/api/v1/tours', getAllTours);//--> the second parameter in get() method is called route handler.
// app.get('/api/v1/tours/:id', getTour);
// app.post('/api/v1/tours', createTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);

// above 5 line of code , can be more organized by usign route() method as shown below. Working mechanish is same .
app.route('/api/v1/tours').get(getAllTours).post(createTour);

app
  .route('/api/v1/tours/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

const port = 3000;

app.listen(port, () => {
  console.log(`Starting the server at port ${port}`);
});
