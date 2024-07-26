const http = require("http");
const url = require("url");
const fs = require("fs");

//!==> "__dirname" is a node variable which is predefned inside node, and it gives us the perfect location or path of file in which we are currently working. Suppose we are working inside directory named "basics" so using "__dirname" will return us "C:\Desktop\node\basics" . And it applies for any folder.
//!==> We want to read the file only once, when "/api" request is called at the beginning, after that we dont want to read the file again and again, so we are reading the file outside the callBack function of "server", because "server callback function" will be called again again each time user sends request again and again , and json data will be read again and again.
const data = fs.readFileSync(`${__dirname}/6_dev_data/data.json`, "utf-8");
const dataObj = JSON.parse(data);

const overviewTemplate = fs.readFileSync(
    `${__dirname}/templates/overview.html`,
    "utf-8"
);
const productTemplate = fs.readFileSync(
    `${__dirname}/templates/product.html`,
    "utf-8"
);
const cardTemplate = fs.readFileSync(
    `${__dirname}/templates/card.html`,
    "utf-8"
);

//!==> This function will replace the "template placeholder" with the actal data of an object, it accepts two arguments, they are template where placeholder will be replaced, and the object whose data is used to replace in the template. And finally it will return the object.
const replaceTemplate = (template, item) => {
    // let output = template.replace("{%PRODUCTNAME%}" , item.productName);
    //!==> upper line is pure string replacement, but below we are using "regular expression" where /{%PRODUCTNAME%}/g means all those variables showuld be replaced globally whoce name is  {%PRODUCTNAME%} .
    let output = template.replace(/{%PRODUCTNAME%}/g, item.productName);
    output = output.replace(/{%IMAGE%}/g, item.image);
    output = output.replace(/{%QUANTITY%}/g, item.quantity);
    output = output.replace(/{%PRICE%}/g, item.price);
    output = output.replace(/{%ID%}/g, item.id);
    output = output.replace(/{%FROM%}/g , item.from);
    output = output.replace(/{%DESCRIPTION%}/g , item.description);
    output = output.replace(/{%NUTRIENTS%}/g , item.nutrients)
    if (!item.organic)
        //!==> this one is to replace and add class name
        output = output.replace(/{%NOT_ORGANIC%}/g, "not-organic");
    return output; //!==> After finally replacing "template placeholder" with original data, we will now return the "cardTemplate" with original data for each object.
};

const server = http.createServer((req, res) => {
    const {query , pathname} = url.parse(req.url , true);
    // const pathname = req.url;
    //!====================================== Overview page ======================================
    if (pathname === "/" || pathname === "/overview") {
        //!==> this cardHTMl variable will store a html data of all the json data, with the help of map.
        const cardHTML = dataObj
            .map((prod) => replaceTemplate(cardTemplate, prod))
            .join(""); //!==> The join method converts an array into a single string, by joining the data inside array with the argument passed inside "join()" method. In this case we are joining array data with nothing.

        const output = overviewTemplate.replace("{%PRODUCT_CARDS%}", cardHTML); //!Finally after obtaining the cardTemplate of all the json data, we will now use that template inside "overviewTemplate" by replacing "{%PRODUCT_CARDS%}" with "cardHTML" as shown above. As "{%PRODUCT_CARDS%}" is also a template placeholder or dummy data.

        res.writeHead(200, {
            "Content-type": "text/html",
        }); //!==> Here we are verifying to the user, that request was successful by passing "200" , and the header data, where we are explaining that the response send by the server is  a html file.
        res.end(output);
        //!====================================== Product page ======================================
    } else if (pathname === "/product") {
        res.writeHead(200 , {
            "Content-type" : "text/html"
        });
        const product = dataObj.find((item)=>item.id===Number(query.id))
        const output = replaceTemplate(productTemplate , product);
        res.end(output);
        //!====================================== API page ======================================
    } else if (pathname === "/api") {
        // fs.readFile(`${__dirname}/6_dev_data/data.json`, "utf-8", (err, data) => {
        res.writeHead(200, {
            //!==> 200 status code shows that the response is successfully delieverd without any error.
            "Content-type": "application/json", //!==> This header data show what type of data will be displayed in the screen as a response i.e. "json" data.
        });
        res.end(data);
        // });
        //!====================================== Error page ======================================
    } else {
        res.writeHead(404, {
            "Content-type": "text/html",
        });
        res.end("<h1>Page not found</h1>");
    }
});

server.listen(8000, "127.0.0.1", () => {
    console.log("Starting the server at port 8000");
});
