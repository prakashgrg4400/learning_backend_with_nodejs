const fs = require("fs");
const crypto = require("crypto");
process.env.UV_THREADPOOL_SIZE = 4; // using this we can manipulate how many threads we want inside our thread pool. we can increase the number of thread or decrease the number of thread in threadpool.

const start = Date.now();

setTimeout(() => {
    console.log("set time out executed");
}, 0);

setImmediate(() => {
    console.log("setImmediate is executed");
});

fs.readFile("./text.txt", () => {
    console.log("read file completed");
    console.log("=========================");

    setTimeout(() => console.log("1st timeout"), 0);
    setTimeout(() => console.log("2nd setTimeout"), 3000);
    setImmediate(() => console.log("3rd setImmediate"));

    process.nextTick(() => {
        console.log("This is next tick");
    });


    // encrypting is a heavy task, so event loop will offload this task to the threadpool, where thre four threads will handle these four task at the same time.
    crypto.pbkdf2("password", "salt", 100000, 1024, "sha512", () => {
        console.log(Date.now() - start, "password encrypted");
    });
    crypto.pbkdf2("password", "salt", 100000, 1024, "sha512", () => {
        console.log(Date.now() - start, "password encrypted");
    });
    crypto.pbkdf2("password", "salt", 100000, 1024, "sha512", () => {
        console.log(Date.now() - start, "password encrypted");
    });
    crypto.pbkdf2("password", "salt", 100000, 1024, "sha512", () => {
        console.log(Date.now() - start, "password encrypted");
    });

    console.log("proof above four encryption is performed by threadpool and event loop is execution this code.")
    
});
console.log("This is the first one to be executed");
// first top level code will be executed all the codes except callback functions and ascyn task.
// now the callback codes will be sent to event loop, and event loop will handle the code inside callback function. 
