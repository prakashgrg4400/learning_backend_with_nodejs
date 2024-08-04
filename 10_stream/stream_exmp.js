//============================ stream ===========================
//--> Stream is process of reading and writing huge file piece by piece. Here suppose we have a large file, and we want to read that file. If we use stream to read the file than we will divide the data inside that file into multiple pieces and starting reading the file piece by piece without reading the whole file directly. This way memory will be used for only those pieces of data which are being read, and less memory will be consumed.
let fs = require("fs") ;
let http = require("http");

const server = http.createServer();

//======================== method 1(without using stream) ============================
//--> While reading the file asynchronusly using "fs.readFile()" , it will first read the whole file, after successfullly reading the whole it will store the whole content inside "data" variable, and we will show it to the user as a response by using res.end.
// server.on("request" , (req,res)=>{
//     fs.readFile("./streamFile.txt" , (err , data)=>{//! first whole file is read.
//         if(err)("Error reading file");
//          res.end(data);//! After successfully reading the file , the data is displayed.
//     })
// })

//====================== method 2(using stream) ======================================
// server.on("request" , (req , res)=>{
//     //-< creatinf "read stream". This stream has three events. they are "data" , "end" and "error" . The data event is triggered till there is piece of content in the file. The end event is triggered , when we have read a file completely piece by piece. And finally the error event is triggered, when there is error in reading file
//     const readable = fs.createReadStream(`${__dirname}/streamFile.txt`);

//     readable.on("data" , chunk=>{
//         res.write(chunk);// write method is providing response to the user by sending the data piee by piece .
//     })//!--> while reading a file chunk by chnukusing "data" event , it is important to use "end" event to, so that node knows when to stop, after a file is read successfully.

//     readable.on("end" , ()=>{
//         res.end();
//     })

//     //-> handeling error, in read stream using "error" event.
//     readable.on("error" , err=>{
//         console.log(err);
//         err.statusCode = 500 ;
//         res.end("file not found");
//     })
//     //->  Using this method is better than "method 1" , as it saves more memory compared to "method 1" . But there is a issue here i.e.  the speed of reading the file by the disk is faster, so data is read faster but the response of writing data is slow. This problem is called "Backpresser" , where reading of data is faster but writing is slower. So to solve this problem we will use "method 3" .
// })

//========================= method 3 (using pipe() method) =========================
server.on("request" , (req , res)=>{
    const readable = fs.createReadStream(`${__dirname}/streamFile.txt`);
    readable.pipe(res) ;//--> the pipe() method acceps whole response object as argument as does all the response work of "method 2" internally.
})
//--> The "backpresser" problem is solved by the "pipe()" method, As it balances the speed of reading and writing. In  "pipe()" method , internally it is doing all the work of "method 2" plus maintaining the speed of reading the file, and writing the file as a response to the user .



server.listen(8000 , "127.0.0.1" , ()=>{
    console.log("Starting the server .....");
})