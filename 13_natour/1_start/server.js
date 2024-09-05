const app = require('./app');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config({ path: './config.env' }); 


const db = process.env.DATABASE.replace('<PW>', process.env.DATABASE_PASSWORD);

mongoose 
  .connect(db, {

  })
  .then((con) => {
    // console.log(con.connections);
    console.log('connection successfull');
  });





const port = process.env.PORT || 3000; // this is how we use "environment variable" .

app.listen(port, () => {
  console.log(`Starting the server at port ${port}`);
});


