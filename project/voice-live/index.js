require("dotenv").config();

const mic = require("mic");
const fs = require("fs");
const axios = require("axios");
const FormData = require("form-data");

//  mic setup
const micInstance = mic({
  rate: "8000",
  channels: "1",
});

const stream = micInstance.getAudioStream();

let audioChunks = [];

console.log(" Press ENTER to start recording...");
process.stdin.resume();

//  Start on ENTER
process.stdin.once("data", () => {
  console.log(" Recording started... Press ENTER again to stop");

  micInstance.start();

  stream.on("data", (chunk) => {
    audioChunks.push(chunk);
  });

  //  Stop on ENTER again
  process.stdin.once("data", async () => {
    micInstance.stop();
  });
});

//  Stop event
stream.on("stopComplete", async () => {
  console.log("⏹ Recording stopped");

  const audioBuffer = Buffer.concat(audioChunks);

  // WAV header function
  function createWavHeader(dataLength) {
    const buffer = Buffer.alloc(44);

    buffer.write("RIFF", 0);
    buffer.writeUInt32LE(36 + dataLength, 4);
    buffer.write("WAVE", 8);
    buffer.write("fmt ", 12);
    buffer.writeUInt32LE(16, 16);
    buffer.writeUInt16LE(1, 20);
    buffer.writeUInt16LE(1, 22);
    buffer.writeUInt32LE(16000, 24);
    buffer.writeUInt32LE(16000 * 2, 28);
    buffer.writeUInt16LE(2, 32);
    buffer.writeUInt16LE(16, 34);
    buffer.write("data", 36);
    buffer.writeUInt32LE(dataLength, 40);

    return buffer;
  }

  const header = createWavHeader(audioBuffer.length);
  const finalBuffer = Buffer.concat([header, audioBuffer]);

  fs.writeFileSync("audio.wav", finalBuffer);

  console.log(" Sending to AI...");

  const formData = new FormData();
  formData.append("file", fs.createReadStream("audio.wav"));
  formData.append("model", "whisper-1");

  try {
    const res = await axios.post(
      "https://api.openai.com/v1/audio/transcriptions",
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          Authorization: `Bearer ${process.env.API_KEY}`,
        },
      }
    );

    console.log(" Text:", res.data.text);

  } catch (err) {
    console.log(" Error:", err.response?.data || err.message);
  }
});