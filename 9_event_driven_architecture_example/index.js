//!==> events is module, which stores a class called "EventEmitter" . This class is used to create, listen and take action by using callback function in the form of events.
const EventEmitter = require("events");//! first er export "EventEmitter" class.

const myEmitter = new EventEmitter();//! second we create the "instance or object" of the class.


//! fourth , after event is created, these "on" function will listen or check, if the event "sale" is being activated or triggered. If it is triggered than the callback function inside "on" function will be executed in synchronous manner as response to the event.
myEmitter.on("sale" , ()=>{
    console.log("this is my sale");
})
//! fourth , after event is created, these "on" function will listen or check, if the event "sale" is being activated or triggered. If it is triggered than the callback function inside "on" function will be executed in synchronous manner as response to the event.
myEmitter.on("sale" , ()=>{
    console.log("We can listen multiple times for the same emitter");
})
//! fourth , after event is created, these "on" function will listen or check, if the event "sale" is being activated or triggered. If it is triggered than the callback function inside "on" function will be executed in synchronous manner as response to the event.This function is taking arguments too, you can do the same for about listener too.
myEmitter.on("sale" , stock=>{
    console.log(`There are ${stock} items left in the store`);
})
myEmitter.emit("sale" , 9);//! third we create or emit an event. The first parameter is the name of event, so that we know which event is being fired. So we can listen to the event accordingly by using ".on" function. The second argument is to provide arguments to the callback function inside "on" function. After event is triggered than only the "listener" will work . In our case we have three listener as shown above. some examples are like when clicking a buttom, you show certain action. clicking on button acts as event, and showing action acts as listenint to events, and executing the callback functions related to that function.

//!=========================================================================================================================

//!==> In above we are using multiple listener, a better way to do it is by creating another class and inherit the propoerties of EventEmitter , it is done in all other modules such as "http" module which uses "events". An example is shown below.
const EventEmitter2 = require('events');

//!==> The extends keyword is used to inherit all the methods and properties of parent class "EvnetEmitter2" , And the "super()" function inside constructor is used to call the constructor function of parent class i.e. "EventEmitter2" .
class Sales extends EventEmitter{
    constructor(){
        super();
    }
}

const myEmitter2 = new Sales();

myEmitter2.on("sales2" , ()=>{
    console.log("================Second emitter===============")
})
myEmitter2.on("sales2",(data)=>{
    console.log(`===============${data} for second emitter============`);
})

myEmitter2.emit("sales2" , "Prakash")