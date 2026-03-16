const SpeechRecognition =
  window.SpeechRecognition ||
  window.webkitSpeechRecognition;

const recognition = new SpeechRecognition();

recognition.lang = "en-US";
recognition.continuous = true;

const Commands = {
    "open google photo":"https://photos.google.com/?pli=1",
    "open chat gpt":"https://chatgpt.com/c/69b8202a-d95c-8324-bdc7-fe6057a2de2a",
    "open gmail":"https://mail.google.com/mail/u/0/#inbox"
};

recognition.onresult = (event) => {
  const text =
    event.results[event.results.length - 1][0].transcript.toLowerCase();

  document.getElementById("output").innerText = text;

  if (Commands[text]) {
    window.open(Commands[text], "_blank");
  }
};

recognition.onend = () => {
  recognition.start(); // mic auto restart
};

// start mic
recognition.start();







