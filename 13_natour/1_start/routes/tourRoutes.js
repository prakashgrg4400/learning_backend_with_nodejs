const express = require('express');
const tourController = require('./../controllers/tourController');

const router = express.Router(); // this will return a middleware funtion i.e. router.

//--------------------- params middleware --------------------
//--> This middleware is found inside , "router.param" . The first parameter it accept is a "path variable" or parameter passed in the route. In this case its "id" . And the second parameter is a "middleware function" , which has access to four values. They are "req" , "res" , "next" , "val" . next functio is used to connect to the next middleware otherwise the whole code will not as expected. And the "val" stores the data of "path variable" or parameters.
// router.param("id" , (req , res , next , val)=>{
//   console.log(`Tour id is : ${val}`);
//   next();
// })
router.param('id', tourController.checkId);

router
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.createTour);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
