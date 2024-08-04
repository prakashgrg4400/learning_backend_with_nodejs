exports.add = (a,b)=>a+b ;
exports.multiply = (a,b)=>a*b;
exports.divide = (a,b)=>a/b;

//--> If you want to export multiple items from a module, than instead of using "module.exports = filename" which is mainly used for exporting single item from a module.  We use "exports.name_of_property = assign_the_item" as shown above .