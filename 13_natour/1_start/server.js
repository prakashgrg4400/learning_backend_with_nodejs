// "dotenv" is a package , whcich we need to install in order to add our manual environment variables to the list of node environment variable. Other wise we wont be able to add our environment variable which we created in "config.env" by just creating a file which store environment variable. We need something that connects this file "config.env" and node , and that is done by this package called "dotenv"
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' }); // here we are specifying the path of our environment variable, so it will be added to the node environment variable. The file which stores environment variable have extension as ".env" as seen in "config.env" .

const app = require('./app');

//====================================== environment variable ==============================
//--> environment variable are global variables which determines in which environment our "node" or "express" app is working on i.e. "development environment" or "production environment" and many more. Environmet variable are also used for configuration purpose.

// By default express sets the environment variable to "development mode" , so we will get development from below line of code in console.
// console.log(app.get('env')); // this will show us the value environment variable inside express i.e. "development"

console.log(process.env); // Node js have multiple environment variable inside its process core module, which works internally . We can see all the environment variable present inside node , by using "process.env" which will return us an object containing all the environment variable inside node.

const port = process.env.PORT || 3000; // this is how we use "environment variable" .

app.listen(port, () => {
  console.log(`Starting the server at port ${port}`);
});

// "NODE_ENV=development npm run start" , if you type this in terminal than terminal will throw error, because here we are setting environmetn variable and our pc doesnt recognize this comman "NODE_ENV" , so to support that we will use "cross-env" package. And after installing just use "cross-env NODE_ENV=development npm run start"; But if you type this command directly it will not run as it is not installed globally, to be able to run that command you need to install it globally, but there is another way i.e. by configuring our package.json file . the setting looks like this:-ED
// {
// "start:dev": "cross-env NODE_ENV=development nodemon server.js",
// "start:prod": "cross-env NODE_ENV=production nodemon server.js"
// }

// NOw use "npm run start:dev" , and it will run the server in the development mode, where our "morgan" package is set to run.
// "npm run start:prod" , now if you will use this than the server will run in production mode , where "morgan" package will not run, you cann= view the code in "app.js" .
//!  There is "PORT" environment variable which you might have to modify in "postman app" .


//===================== following packages are needed for configuring prettier and eslint ==========================
//! npm i eslint prettier eslint-config-prettier eslint-plugin-prettier eslint-config-airbnb eslint-plugin-node eslint-plugin-import eslint-plugin-jsx-a11y eslint-plugin-react --save-dev
//--> eslint-config-prettier ==> to prevent eslint from formatting the code ,  and set prettier as default formatter
//--> eslint-plugin-prettier ==> to show error if code is not formatted
//--> eslint-config-airbnb ==> to create a consistent javascript code.
