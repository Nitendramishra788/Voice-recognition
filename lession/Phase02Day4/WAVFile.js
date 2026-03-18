const mic = require("mic");
const fs = require("fs");

const micInstace = mic({
  rate:8000,
  channels: 1,
  debug: false,
 
});

const Stream = micInstace.getAudioStream();


// WAV header function
function createWavHeader(dataLength) {
  const buffer = Buffer.alloc(44);

  buffer.write("RIFF", 0);
  buffer.writeUInt32LE(36 + dataLength, 4);
  buffer.write("WAVE", 8);

  buffer.write("fmt ", 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);   // PCM
  buffer.writeUInt16LE(1, 22);   // channels
  buffer.writeUInt32LE(16000, 24);
  buffer.writeUInt32LE(16000 * 2, 28);
  buffer.writeUInt16LE(2, 32);
  buffer.writeUInt16LE(16, 34);

  buffer.write("data", 36);
  buffer.writeUInt32LE(dataLength, 40);

  return buffer;
}

let audioData = [];

Stream.on("data", (chunk) => {
  audioData.push(chunk);
});

Stream.on("startComplete", () => {
  console.log("🎤 Recording Started...");
});

Stream.on("stopComplete", () => {
  console.log("⏹️ Recording Stopped...");

  const audioBuffer = Buffer.concat(audioData);
  const header = createWavHeader(audioBuffer.length);

  const outputFile = fs.createWriteStream("output.wav");

  outputFile.write(header);
  outputFile.write(audioBuffer);
  outputFile.end();

  console.log("✅ Saved as output.wav");
});

micInstace.start();

setTimeout(() => {
  micInstace.stop();
}, 7000);