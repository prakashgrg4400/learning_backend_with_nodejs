const app = require('./app');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config({ path: './config.env' }); 


const db = process.env.DATABASE.replace('<PW>', process.env.DATABASE_PASSWORD);
console.log(db);
mongoose 
  .connect(db, {

  })
  .then((con) => {
    // console.log(con.connections);
    console.log('connection successfull');
  });

//!====> Creating schema for tours using mongoose .
const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'], // first parameter is saying you cannot leave this field empty, second is error message.
    unique: true,// all names must be unique otherwise , we will get error.
  },
  rating: {
    type: Number,
    default: 4,
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price'],
  },
});

//!====> Creating modal for tour
const Tour = mongoose.model('Tour', tourSchema);

//!====> Inserting data using tour modal .
const testTour = new Tour({
  name: 'Prakash Gurung',
  // rating: 4.8,
  price: 99,
});

//==> After connecting to the database , creating schema , than creating model of that schema, we insert data as shown above. Now we will save the data as shown below in database using "save()" method, which returns us  a promise.
testTour
  .save()
  .then((document) => {
    console.log(document);
  })
  .catch((error) => {
    console.log(error);
  });


const port = process.env.PORT || 3000; // this is how we use "environment variable" .

app.listen(port, () => {
  console.log(`Starting the server at port ${port}`);
});


