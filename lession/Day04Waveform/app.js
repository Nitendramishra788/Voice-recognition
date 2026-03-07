let mediaRecorder;
let audioChunks = [];
let audioContext;
let source;
let analyser;
let dataArray;
let bufferLength;

async function SetUp(){

    const stream = await navigator.mediaDevices.getUserMedia({audio:true});

    audioContext = new AudioContext();

    source = audioContext.createMediaStreamSource(stream);

    // Filters

    const highpass = audioContext.createBiquadFilter();
    highpass.type = "highpass";
    highpass.frequency.value = 300;

    const lowpass = audioContext.createBiquadFilter();
    lowpass.type = "lowpass";
    lowpass.frequency.value = 3400;

    const bandpass = audioContext.createBiquadFilter();
    bandpass.type = "bandpass";
    bandpass.frequency.value = 1700;

    // destination

    const destination = audioContext.createMediaStreamDestination();

    // Connect nodes

    source.connect(highpass);
    highpass.connect(lowpass);
    lowpass.connect(bandpass);
    bandpass.connect(destination);

    // Recorder

    mediaRecorder = new MediaRecorder(destination.stream);

    mediaRecorder.ondataavailable = (event)=>{
        audioChunks.push(event.data);
    }

    mediaRecorder.onstop = ()=>{

        const blob = new Blob(audioChunks,{type:"audio/wav"});
        const url = URL.createObjectURL(blob);

        document.getElementById("player").src = url;

        audioChunks = [];
    }

    // Wave analyser

    analyser = audioContext.createAnalyser();
    analyser.fftSize = 2048;

    bandpass.connect(analyser);

    bufferLength = analyser.fftSize;
    dataArray = new Uint8Array(bufferLength);

    drawWaveform();
}


// Canvas

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

function drawWaveform(){

    requestAnimationFrame(drawWaveform);

    analyser.getByteTimeDomainData(dataArray);

    ctx.fillStyle = "white";
    ctx.fillRect(0,0,canvas.width,canvas.height);

    ctx.lineWidth = 2;
    ctx.strokeStyle = "black";
    ctx.beginPath();

    let sliceWidth = canvas.width / bufferLength;
    let x = 0;

    for(let i=0;i<bufferLength;i++){

        let v = dataArray[i] / 128.0;
        let y = v * canvas.height / 2;

        if(i === 0){
            ctx.moveTo(x,y);
        }else{
            ctx.lineTo(x,y);
        }

        x += sliceWidth;
    }

    ctx.lineTo(canvas.width,canvas.height/2);
    ctx.stroke();
}


// satrt 
document.getElementById("start").onclick=()=>{
    audioChunks=[];
    mediaRecorder.start();
}



// Record stop

document.getElementById("stop").onclick=()=>{
    mediaRecorder.stop();
};


// Setup call

SetUp();