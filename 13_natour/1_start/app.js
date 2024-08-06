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

const app = express();

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
); // change json into javascript data type

app.use(express.json()); // "use()" method is used to add "middleWare" in out project. Express.json() is a middleware function which converts the json data into javascript object format in the middle.

app.get('/api/v1/tours', (req, res) => {
  //--> the second parameter in get() method is called route handler.
  res.status(200).json({
    // doing simple "reponse formatting" , by adding our own data i.e. "status" and "result" .
    status: 'success',
    result: tours.length,
    data: {
      tours: tours,
    },
  });
});

//   /api/v1/tours/:id/:x/:y --> if you want to add multiple variable in url
//   /api/v1/tours/:id/:name? --> if you want optional parameters add "?" after the name of variable , default name = undefined
app.get('/api/v1/tours/:id', (req, res) => {
  // console.log(req.params); // the path variables or parameters are stored inside "req.params" 
  const id = Number(req.params.id);// by default id is in string, or  (req.params.id*1) does the same trick as Number().

  const tour = tours.find((el) => el.id === id);// searching the tour whose id is equal to path variable .

  if (!tour) {// Condition if id is not found inside "tours" .
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
});

app.post('/api/v1/tours', (req, res) => {
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
});

const port = 3000;

app.listen(port, () => {
  console.log(`Starting the server at port ${port}`);
});
