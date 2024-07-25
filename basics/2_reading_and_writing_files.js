const fs = require("fs"); //! Here "fs" means file system. It is module in nodejs which helps us to read, write and delete text in a file. The require function is similar to import, which imports "fs" or "file system" module .
// console.log(fs);


//!              fs.readFileSync("file path namefrom where you want to read data" , "encoding techinque")
const fileData = fs.readFileSync("./2_txt_files/prakash.txt" , "utf-8");
console.log(fileData);
//! "utf-8" is encoding technique, which converts the "text" into "8-bit binary format", so computer can understand it, and decodes it when user tries to read the file and displays in the form of the text in screen.


//!              fs.writeFileSync("file path name where you want to write data" , "Th data you want to write") .
fs.writeFileSync("./2_txt_files/output.txt" , `This is my extra layer of protection "${fileData}"`);
console.log("File writting completed successfully");

//!================================== single threaded==========================
//!==> nodejs is single-threaded.
//!==> single-threaded means in a program , there is only one worker, and that worker handle all the task. So if there is 10 users, than until the work of first user is completed successfully by the worker the remaining 9 users will have to wait which is tedious.If you are confused, than we can take an example:- Suppose there is a cake shop, and there is only one worker in that cake shop. so all the customer is handeled by that single worker. Whcih means if the worker is dealing with a single customer than the remaining customer should wait, same concept is applied in single-thread. So there for to escape this we will use "asynchronous" to help the big task complete in the background, and other small task to be performed by the worker, think like big task is done by machine, and that machine is asychronous.
//!==> multi-threaded means there are multiple workers , so each user will have their own thread or worker to serve them, which will make the work smooth as compared to single-threaded.
//!==> In next file we will learn about "asynchronous" more. 

//!==== >  Above way of reading and writing file is "synchronous way" or "blocking way" , as it blocks the code written below until the current code is executed. Same concept goes for single thread

