// const mic = require("mic");

// const micInstance = mic ({
//     rate:"16000",
//     channels:"1",
//     debug:false
// });

// const micInputStream = micInstance.getAudioStream();

// micInputStream.on("data", (data)=>{
//     console.log("Audio chunck receved...." , data.length);
// });

// micInputStream.on("errr",(err)=>{
//     console.log(err);
// });

// micInstance.start();


const mic= require("mic");
const { Collection } = require("mongoose");

const micInstance = mic({
    rate:"16000",
    channels:"1",

});

const Stream = micInstance.getAudioStream();

Stream.on("data", (chunk)=>{
    console.log("chunk size" , chunk.length);
});

Stream.on("stopComplete" , ()=>{
    console.log("mic Started");

});

Stream.on("StopedComplete" , ()=>{
    console.log("mic Stoped")
})


Stream.on("err" , (err)=>{
    console.log(err);
});

micInstance.start();

setTimeout(()=>{
    micInstance.stop();
} ,2000)