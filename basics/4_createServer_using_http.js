//! http is a module used to create server.
const http = require("http");

//! "createServer(callback_function)" is a function which is used to create server, and accepts callback as a function. Here user send request to the is handeled by the "req" object , and response is handeled by the "res" object.
const server = http.createServer((req , res)=>{
   res.end("Welcome to my server");
});

//! After successfully creating a server, we need to run the server, so for that we will run the server in our localhost i.e. 127.0.0.1  in the port 8000. When the server is successfully launched, the callback function in the "listen()" method will be automatically called in the terminal.
server.listen(8000 , '127.0.0.1' , ()=>{
    console.log("Server start")
})