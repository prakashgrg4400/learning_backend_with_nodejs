const fs = require('fs');
const Tour = require('./../models/tourModel');

// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );

//-->Now we will use this function inside "param middleware" as a middleware function. And this will run before controller i.e. route handeler. You might have instead of doing it with middleware , we could had just create a function and called them inside every controller to check if id is valid or not. Yes you could have done that, but it will go against express working policy where working with middleware is recommended.
// exports.checkId = (req , res , next , val)=>{
//   const id = Number(req.params.id); // by default id is in string, or  (req.params.id*1) does the same trick as Number().
//     console.log(`Tour id is : ${val}`);

//   if (req.params.id * 1 >= tours.length) {
//     return res.status(404).json({
//       status: 'fail',
//       message: 'Invalid id',
//     });
//   }
//   next() ;
// }

exports.checkBody = (req , res , next)=>{
  console.log(req.body);
  if(!req.body.name || !req.body.price)
  {
    return res.status(404).json({
      status:"fail",
      message:"name or price not found"
    })
  }
  next();
}

exports.getAllTours = (req, res) => {
  console.log(req.Mytime); // this is a proof that middleware are executed in first come first serve pattern.
  res.status(200).json({
    status: 'success',
    // result: tours.length,
    data: {
      tours: tours,
    },
  });
};

exports.getTour = (req, res) => {
  // console.log(req.params); // the path variables or parameters are stored inside "req.params"
  const tour = tours.find((tour)=>tour.id===(req.params.id*1))
  res.status(200).json({
    status: 'success',
    data: {
      tour: tour,
    },
  });
};

exports.createTour = (req, res) => {
  // const tourId = tours[tours.length - 1].id + 1;
  // const newTour = Object.assign({ id: tourId }, req.body);
  // tours.push(newTour);
  
};

exports.updateTour = (req, res) => {
  // if (req.params.id >= tours.length) { // this task is done by params middleware
  //   return res.status(404).json({
  //     status: 'fail',
  //     message: 'Invalid id',
  //   });
  // }

  res.status(200).json({
    status: 'success',
    data: {
      tour: '<Your updated tour herer>',
    },
  });
};

exports.deleteTour = (req, res) => {
  // if (req.params.id * 1 >= tours.length) { // this task is done by params middleware
  //   return res.status(404).json({
  //     status: 'fail',
  //     message: 'invalid id',
  //   });
  // }
  res.status(204).json({
    status: 'success',
    data: null,
  });
};
