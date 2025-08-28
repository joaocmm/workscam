const video = document.getElementById('video');
const recordBtn = document.getElementById('recordBtn');
const stopBtn = document.getElementById('stopBtn');
const recordingIndicator = document.getElementById('recordingIndicator');
const popup = document.getElementById('popup');
const filenameInput = document.getElementById('filename');
const saveLocalBtn = document.getElementById('saveLocalBtn');
const saveCloudBtn = document.getElementById('saveCloudBtn');

let mediaRecorder;
let recordedChunks = [];

async function startCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    const videoOnlyStream = new MediaStream(stream.getVideoTracks());
    video.srcObject = videoOnlyStream;
    window.fullStream = stream;
  } catch (error) {
    alert('Erro ao acessar a câmera e o microfone: ' + error.message);
    console.error(error);
  }
}

startCamera();

recordBtn.addEventListener('click', () => {
  let countdown = 5;
  const countdownInterval = setInterval(() => {
    if (countdown > 0) {
      alert(`Gravação começará em ${countdown} segundos...`);
      countdown--;
    } else {
      clearInterval(countdownInterval);
      startRecording();
    }
  }, 1000);
});

function startRecording() {
  recordedChunks = [];
  mediaRecorder = new MediaRecorder(window.fullStream);

  mediaRecorder.ondataavailable = event => {
    if (event.data.size > 0) {
      recordedChunks.push(event.data);
    }
  };

  mediaRecorder.onstop = () => {
    popup.style.display = 'block';
  };

  mediaRecorder.start();
  recordingIndicator.style.display = 'block';
  recordBtn.disabled = true;
  stopBtn.disabled = false;
}

stopBtn.addEventListener('click', () => {
  mediaRecorder.stop();
  recordingIndicator.style.display = 'none';
  recordBtn.disabled = false;
  stopBtn.disabled = true;
});

saveLocalBtn.addEventListener('click', () => {
  const blob = new Blob(recordedChunks, { type: 'video/webm' });
  const url = URL.createObjectURL(blob);
  const filename = filenameInput.value.trim() || 'gravacao';

  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.webm`;
  a.click();

  popup.style.display = 'none';
});

saveCloudBtn.addEventListener('click', () => {
  alert('Upload para nuvem será implementado na Parte 5.');
  popup.style.display = 'none';
});
