
let mediaRecoder;
let audioChunks=[];

async function SetUp(){



    // step01 mic Audio

    const stream = await navigator.mediaDevices.getUserMedia({audio:true});

    // step02 audio processing seytem
    const audioContext = new AudioContext();

    // step03 mic ko audio engin me dalna processing ke liye 

    const source = audioContext.createMediaStreamSource(stream);

    // step04 Filter Create karna 
    const filter = audioContext.createBiquadFilter();

    // step05 filter type and value  set karna
    filter.type="bandpass";
    filter.frequency.value=1700;

    // if we want high voice with backgound noice so we use highpass value 80
    // filter.type = "highpass";
    // filter.frequency.value = 80;

    // step06 Filter Output banana 

    const destination = audioContext.createMediaStreamDestination();

    // stap07 connection of source to filter and filter to destination

    source.connect(filter);
    filter.connect(destination);

    // step08 Recoder ko filter audio dena 

    mediaRecoder = new MediaRecorder(destination.stream);

    mediaRecoder.ondataavailable=(event)=>{
        audioChunks.push(event.data);
    };

    mediaRecoder.onstop=()=>{
        const blob = new Blob (audioChunks);
        const url = URL.createObjectURL(blob);
        document.getElementById("player").src=url;
    };

}

SetUp();

document.getElementById("start").onclick=()=>{
    audioChunks=[];
    mediaRecoder.start();
};

document.getElementById("stop").onclick=()=>{
    mediaRecoder.stop();
};

