const SpeechRecognition =
  window.SpeechRecognition ||
  window.webkitSpeechRecognition;

const recognition = new SpeechRecognition();

recognition.lang = "en-US";
recognition.continuous = true;

const Command = [
  {
    phrases: ["open google", "google kholo"],
    action: () => {
      window.open("https://www.google.com", "_blank");
    }
  },

  {
    phrases: ["open youtube", "youtube kholo"],
    action: () => {
      window.open("https://www.youtube.com", "_blank");
    }
  }
];

recognition.onresult = (event) => {
  const text =
    event.results[event.results.length - 1][0].transcript
      .toLowerCase();

  document.getElementById("output").innerText = text;

  Command.forEach(cmd => {
    cmd.phrases.forEach(phrase => {
      if (text.includes(phrase)) {
        cmd.action();
      }
    });
  });
};

recognition.onend = () => {
  recognition.start(); // auto restart
};

// start mic
recognition.start();