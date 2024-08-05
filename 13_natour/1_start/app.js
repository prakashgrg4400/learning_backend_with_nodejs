const express = require('express');// importing express library .

const app = express() ; // express is a function , which when called returns us a list of useful properties and function inside an object, which is then stores inside "app" variable.

//--> for handeling "routes" in nodejs , we did multiple condition stuffs inside callback function of "createServer" , but here its easy.
//--> get() method is saying that the request is "get" , and the path is the "root" path , and the callback function will be triggered each time we visit this path. we used "re.statusCode = 400" previously, but we can directly set it using status() method. The "express" library provides us with more functionality than node. The "send function" is similar to "end()" , which is used to send data to the client.
app.get("/" , (req , res)=>{
    // res.status(200).send("Hello from the server side , I am Prakash Gurung");
    res.status(200).json({message:"I am a student" , app:"Natours"});
})

app.post("/" , (req , res)=>{
    res.send("this is my post request");
})
const port = 3000

//--> In node to create a server, we needed to import "http" , than use createServer() method and put callback function inside it and listen to the server, which was created by "http.createServer()" , but here we just have to listen to the server in similar manner.
app.listen(port , ()=>{
    console.log(`Starting server at port ${port}`);
})