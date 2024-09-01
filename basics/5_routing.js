const http = require("http");//! http module will help us create server
// const url = require("url")

//!==>creating server.
const server = http.createServer((req , res)=>{
    // console.log(req.url);
    let pathname = req.url; //! This req.url will store the route path information applied in the browser. For eg:- In the url "http://127.0.0.1:8000/overview" , "req.url" will store "overview" . There can be any name instead of "overview" in "http://127.0.0.1:8000/overview"
    if(pathname==="/" || pathname==="/overview")
    {
        //!==> Displaying different response for different routes as shown below.
        res.end("This page displays overview");
    }else if(pathname==="/product")
    {
        res.end("This page displays the detail of product");
    }else{
        //!==> Here the first argument in "writeHead()" is used to show the status of page. You can handle the status code as per your need. And the second parameter is for the "header" , which will store the information about the response given by the user in server to the user request.
        res.writeHead(404 , {
            "Content-type":"text/html", //! this determines that the reponse given by the server is "html" data.
            "my-own-header":"trial page"//!  this header data is just to show data you can add your own custom header data.
        });
        // res.writeHead(404) // ==> It will also display the error message in the console.
        res.end("<h1>Page not found</h1>");
    }
})


//!==> creating a place to run the server i.e.  port=8000  , localhost=127.0.0.1  and the callback function will display message in terminal when our server starts running. Meaning where server runs successfuly, than this callback function will be called automatically.
server.listen(8000 , "127.0.0.1" , ()=>{
    console.log("Starting server at port 8000")
})