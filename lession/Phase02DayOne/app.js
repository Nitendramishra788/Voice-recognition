//  Step 01 make  Recognition Object 

const SpeechRecognition = window.SpeechRecognition ||
window.webkitSpeechRecognition;

// step 02 Recognition Instace 

const recognition = new SpeechRecognition();

// step 03 Set your voice 
recognition.lang = "en-US";
recognition.continuous = true;     
recognition.interimResults = true;

// step04 Result Event 

recognition.onresult =  (event)=>{

    // Step 04 SpeechText Nikalna 

    const text = event.results[0][0].transcript;

 

    // Showing Our OutPut 

    document.getElementById("output").innerText=
    "You Said" +text
};

// 🔥 Mic band ho → dubara start
recognition.onend = () => {
    recognition.start();
};



document.getElementById("start").onclick =()=>{
    recognition.start();
};