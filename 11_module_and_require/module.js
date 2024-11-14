//--> when we use "require()" function to import a module, than following steps takes :-
//      1)  Resolving and loading ==> Here nodejs will determine the path of module and its type . As there are three types of module.They are "nodejs core module"-> eg http , "developer module" --> made by developer eg "./module_name" , and finally "npm modules" --> these are external libraries eg "express" . After resolving the type of module, nodejs will now load the module .
//      2) Wrapping ==> Our whole code is wrapped inside a function that includes modules too. And this function provides us with global variables such as "exports" , "require" , "module" , "__filename" , "__dirname".
//      3) Execution ==> Now execution of code begins if we run our code .
//      4) returning exports ==> when we import a module using require , than we will get the data which is on the othe side of module stored by "module.exports" or "exports" .
//       5) caching ==> it is process of storing data in a temporaring memory so data can be accessed more fastly. This is applied by nodejs too. As it only loads the module once, and next time if we use the property of that module, than it brings the data from cache instead of again loading the whole module.

//--> below code is to show that we are inside wrapper function which provide us with global variables such as "exports" , "require" , "__filename" , "__dirname" .
// console.log(arguments);
// exports --> helps us to export a module .
// require --> heplps us to import a module .
// __filename --> gives us the pathname of currently working file
// __dirname --> gives us the pathname of root directory of currently working file .

//--> below code will print us the wrapper function and shows how it looks like
console.log(require("module").wrapper); //the "module" is an internal working library of nodejs .
// [
//     '(function (exports, require, module, __filename, __dirname) {
//     });'
// ]
//---> Above is how our wrapper function looks like which wraps our whole code in nodejs, and our code is inserted inside the body of this function .

//================= module.exports demo =================
const Calc = require("./test_module_1");
const addNum = new Calc(); // creating instance or object of class "calculator" .
console.log(addNum.add(5, 5));
console.log(addNum.multiply(5, 5));
console.log("============================================");

//================ exports demo ===================
const calc2 = require("./test_module_2");
console.log(calc2.add(7, 7));
console.log(calc2.multiply(7, 7));
//--> or you can directly destructure too as shown below :-
// const {add} = require("./test_module_2");
// console.log(add(9,6));

//=====================caching ======================
const myFunc = require("./test_module_3");
// myFunc();
// myFunc();
// myFunc();
//--> here you can see the "top level code" is executed only once but we the function is executed is multiple times, it is because nodejs loads the "module" only once and stores the necessary exports in the cache memory, so no need to load the code again and again.
