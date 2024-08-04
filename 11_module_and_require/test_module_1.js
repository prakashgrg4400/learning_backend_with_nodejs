class Calculator{
    add(a,b){
        return a+b ;
    }

    multiply(a,b){
        return a*b;
    }

    divide(a,b){
        return a/b ;
    }
}

module.exports = Calculator ;
//--> If you are importing a single class or method or variable i.e. only one from a module , than we normally use             "module.exports = name_of_item_you_wanna_export";



//====================== You can do the above stuff in below method too =========================
//--> Exporting asynchronous class.
// module.exports = class{
//     add(a,b){
//         return a+b;
//     }

//     multiply(a,b){
//         return a*b;
//     }

//     divide(a,b){
//         return a/b;
//     }
// }