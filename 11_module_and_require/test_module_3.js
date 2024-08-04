console.log("Hi from test_module_3.js");

module.exports = ()=>console.log("Function is called from caching 😀😀😀😀😀");
//--> This module is to show you how caching works inside nodejs. nodejs reads the module only once, and stores them in cache, so it no need to read the module again and again when we use that module .