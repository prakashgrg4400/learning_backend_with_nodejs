const EventEmitter = require("events");
const http = require("http");

const myEmitter = new EventEmitter();

//!==> previously we create a server by passing a callback function inside "createServer((req,res)=>{..})", but now that same work can be done using listener i.e. "on function" . The working mechanism is same.
const server = http.createServer();

//!==> when request "event" is triggerrd , than this listener will automatically call the callback function inside them.
server.on("request" , (req , res)=>{
    console.log("first");
    res.end("response on behalf of listener");
})
server.on("request" , (req , res)=>{
    console.log("second");
})
server.on("close" , ()=>{
    console.log("server closed");
})

//!==> starting the server, the callback function is optional. 
server.listen(8000 , "127.0.0.1" , ()=>{
    console.log("listening to the server....");
})
