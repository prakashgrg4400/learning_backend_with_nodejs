const http = require('http');
const url = require('url');
const fs = require('fs');
const slugify = require('slugify');
const replaceTemplate = require('./modules/replaceTemplate');
//!==> "__dirname" is a node variable which is predefned inside node, and it gives us the perfect location or path of file in which we are currently working. Suppose we are working inside directory named "basics" so using "__dirname" will return us "C:\Desktop\node\basics" . And it applies for any folder.
//!==> We want to read the file only once, when "/api" request is called at the beginning, after that we dont want to read the file again and again, so we are reading the file outside the callBack function of "server", because "server callback function" will be called again again each time user sends request again and again , and json data will be read again and again.
const data = fs.readFileSync(`${__dirname}/6_dev_data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

//===> Below 2 line code is just to show that how we use third party libraries using documentation.
const slug = dataObj.map((el) => slugify(el.productName, { lower: true }));
console.log(slug);

const overviewTemplate = fs.readFileSync(
    `${__dirname}/templates/overview.html`,
    'utf-8'
);
const productTemplate = fs.readFileSync(
    `${__dirname}/templates/product.html`,
    'utf-8'
);
const cardTemplate = fs.readFileSync(
    `${__dirname}/templates/card.html`,
    'utf-8'
);

//=================================================================================================================================
//!==> This function will replace the "template placeholder" with the actal data of an object, it accepts two arguments, they are template where placeholder will be replaced, and the object whose data is used to replace in the template. And finally it will return the object.
// const replaceTemplate = (template, item) => {
//     // let output = template.replace("{%PRODUCTNAME%}" , item.productName);
//     //!==> upper line is pure string replacement, but below we are using "regular expression" where /{%PRODUCTNAME%}/g means all those variables showuld be replaced globally whoce name is  {%PRODUCTNAME%} .
//     let output = template.replace(/{%PRODUCTNAME%}/g, item.productName);
//     output = output.replace(/{%IMAGE%}/g, item.image);
//     output = output.replace(/{%QUANTITY%}/g, item.quantity);
//     output = output.replace(/{%PRICE%}/g, item.price);
//     output = output.replace(/{%ID%}/g, item.id);
//     output = output.replace(/{%FROM%}/g , item.from);
//     output = output.replace(/{%DESCRIPTION%}/g , item.description);
//     output = output.replace(/{%NUTRIENTS%}/g , item.nutrients)
//     if (!item.organic)
//         //!==> this one is to replace and add class name
//     output = output.replace(/{%NOT_ORGANIC%}/g, "not-organic");
//     return output; //!==> After finally replacing "template placeholder" with original data, we will now return the "cardTemplate" with original data for each object.
// };
//=================================================================================================================================

const server = http.createServer((req, res) => {
    //!==> req.url will store the pathname in our link, such as search parameters, so to destructure those pathname and search parameters, we use "url.parse" where "url" is a module which we imported ande parse function breaks down the data present inside "req.url" . The second parameter indicates that the parsed data(breaked down data) i.e. search parameter should be in javascript object format. By default the search parameter are in string format.
    const { query, pathname } = url.parse(req.url, true);
    // const pathname = req.url;
    //!====================================== Overview page ======================================
    if (pathname === '/' || pathname === '/overview') {
        //!==> this cardHTMl variable will store a html data of all the json data, with the help of map.
        const cardHTML = dataObj
            .map((prod) => replaceTemplate(cardTemplate, prod))
            .join(''); //!==> The join method converts an array into a single string, by joining the data inside array with the argument passed inside "join()" method. In this case we are joining array data with nothing.

        const output = overviewTemplate.replace('{%PRODUCT_CARDS%}', cardHTML); //!Finally after obtaining the cardTemplate of all the json data, we will now use that template inside "overviewTemplate" by replacing "{%PRODUCT_CARDS%}" with "cardHTML" as shown above. As "{%PRODUCT_CARDS%}" is also a template placeholder or dummy data.

        res.writeHead(200, {
            'Content-type': 'text/html',
        }); //!==> Here we are verifying to the user, that request was successful by passing "200" , and the header data, where we are explaining that the response send by the server is  a html file.
        res.end(output);
        //!====================================== Product page ======================================
    } else if (pathname === '/product') {
        res.writeHead(200, {
            'Content-type': 'text/html',
        });
        const product = dataObj.find((item) => item.id === Number(query.id)); //!Selecting product whose id is eqal to search parameters.
        const output = replaceTemplate(productTemplate, product); //!replacing placeholders with real data.
        res.end(output); //!displaying data as response to the request.
        //!====================================== API page ======================================
    } else if (pathname === '/api') {
        // fs.readFile(`${__dirname}/6_dev_data/data.json`, "utf-8", (err, data) => {
        res.writeHead(200, {
            //!==> 200 status code shows that the response is successfully delieverd without any error.
            'Content-type': 'application/json', //!==> This header data show what type of data will be displayed in the screen as a response i.e. "json" data.
        });
        res.end(
            JSON.stringify({
                message: 'api',
            })
        );
        // res.end(data);
        // });
        //!====================================== Error page ======================================
    } else {
        res.writeHead(404, {
            'Content-type': 'text/html',
        });
        res.end('<h1>Page not found</h1>');
    }
});

server.listen(8000, '127.0.0.1', () => {
    console.log('Starting the server at port 8000');
});

//!==> After completing our small project "node farm" , we deep dived into npm i.e. "node package manager" which is used to manage the packages in our node.
//!==> A package.json file stores the information of our project, and we can initialize it using npm command "npm init" , which create our "package.json" file for our project .
//!==> Using node we can install different types of packages or library or modules.
//!==> There are two types of packages. They are :-
//! 1) Simple or regular dependencies packages --> Our project depends on these packages to run.
//! 2) Development dependencies packages --> We use these packages during development phases, but our application doesnt depends on these packages during "production mode" . Some examples are "testing packages" or "nodemon package" which automatically restarts our server, each time our code is updated.

//!==> packages added.    "npm install slugify" --> it is simple dependencies
//!                      "npm install nodemon --save-dev" --> it is development dependencies .
//!==> we have installed above libraries in a single folder locally. so to run nodemon which helps us to restart our server, each tme our code changes. We have to create a script in "package.json" , where "start":"nodemon 6_create_simple_API.js" inside "scripts" . Than you can run this command in terminal using "npm run start" . But you can give any name instaed of "start" inside "scripts" and depending upon that name you use it in the terminal accordingly.

//!==> But if you want to install "nodemon" package for every project, than you can install this package globally in your project using the command line "npm install nodemon --global". Now your package is installed globally. You dont have to update your package.json "scripts" folder anymore. But you can use it directly in the terminal by using the keyword "nodemon file_name". It will start the server automatically.

//!=============== slugify ================
//! ==> now here we will implement sulgify i.e. third party library by reading documnetation.

//!==================================== deep dive into package version,update and delete ========================
//!==>  Inside "package.json" you will get to see all the regular and development dependencies in a structure like this:-
//!                                                       "dependencies": {
//!                                                          "slugify": "^1.6.6"
//!                                                        },
//! -->  where "^1.6.6" , last 6 means "patch" , middle 6 means "minor" , and first 1 means "major". And the beginning symbol i.e.   "^" means update our npm package but only minor and patch updates. There are two more symbols used beside "^" . They are "~" which says only update "patch" update. And the last one is "*" , which says update all i.e. major,minor and patch . By default our node manager always puts "^" symbol infront of our major,minor and patch version. But it is good to use patch symbol i.e. "~" ,as it will not really affect our code that much.
//! --> Now lets discuss about major,minor and patch. "patch" means those updates which is related with fixing errors. Suppose we have a version "1.2.3" . And recently we found a bug and solved the bug. Than our package version will be change from "1.2.3" to "1.2.4" . So patch is related to those updates which deals with fixing of bugs.    "minor" deals with adding of new features on top of our old packages code, without modifying old codes. But using "^" for minor update is not good, as the new feature might contain bugs and may lead to breakdown of our aplication.  Finally we have "major" where we change the old codes of our packages heavily of modify the old code heavily within the package. So this is all the related to verion of a package.
//! --> "npm outdated" , this will give a list of packages which are outdated in a table like structure.
//! --> "npm install package_name@version" , this will help you install a package of your desired version. For eg:- we have a package named "slugify" . Suppose I dont want the latest version of "slugify" i.e. "1.6.6". than you can write your own version as  "npm install slugify@1.0.0" .
//! --> "npm update slugify" , It will update you package to the latest version based on *,^,~ .
//! --> "npm uninstall slugify" , it will uninstall a package.

//!================ Prettier ===========
//! --> You can configure your prettier setting by adding ".prettierrc" file and configure all you want. Inside ".prettierrc" file
//!                        {
//!                               "singleQuote": true,
//!                               "tabWidth": 4
//!                         }
