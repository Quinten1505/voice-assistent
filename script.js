const recordBtn = document.getElementById("record-btn");
const stopBtn = document.getElementById("stop-btn");
const transcription = document.getElementById("transcription");

let mediaRecorder;
let audioChunks = [];

recordBtn.addEventListener("click", startRecording);
stopBtn.addEventListener("click", stopRecording);

async function startRecording() {
  try {
    const mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(mediaStream);
    audioChunks = [];

    mediaRecorder.addEventListener("dataavailable", (event) => {
      audioChunks.push(event.data);
    });

    mediaRecorder.addEventListener("stop", () => {
      const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
      transcribeAudio(audioBlob);
    });

    mediaRecorder.start();
    recordBtn.disabled = true;
    stopBtn.disabled = false;
  } catch (error) {
    console.error("Error starting recording:", error);
    alert("Failed to start recording. Please check your microphone settings.");
  }
}

function stopRecording() {
  if (mediaRecorder) {
    mediaRecorder.stop();
    recordBtn.disabled = false;
    stopBtn.disabled = true;
  }
}

async function transcribeAudio(audioBlob) {
  const formData = new FormData();
  formData.append("audio", audioBlob);

  try {
    const response = await fetch("your_api_endpoint", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const result = await response.text();
    transcription.value = result;
  } catch (error) {
    console.error("Error during transcription:", error);
    alert("Failed to transcribe audio. Please try again.");
  }
}
