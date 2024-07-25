//!==================== asynchronous way or non-blocking way ==================
//!===>  Here readFile is asynchronous, so it will not block the code below, but will run in the background and when the execution is finished or reading of file is finished in the backgorund than it will automatically call the callback function . But whatever we are doing below is callback hell, and we will deal with it later using "promise" or "async or await" .
const fs = require("fs");

fs.readFile("./3_txt_files/index.txt", "utf-8", (err, data1) => {
    if (err) {
        return console.log("Opps!!! Something went wrong");
    }
    fs.readFile(`./3_txt_files/${data1}.txt`, "utf-8", (err, data2) => {
        fs.readFile("./3_txt_files/extra.txt", "utf-8", (err, data3) => {
            fs.writeFile(
                "./3_txt_files/output.txt",
                `${data2}\n${data3}`,
                "utf-8",
                (err) => {
                    console.log("Data is written successfully");
                }
            );
        });
    });
});

console.log("Starting of asynchronous task");
