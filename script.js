const video = document.getElementById('video');
const recordBtn = document.getElementById('recordBtn');
const stopBtn = document.getElementById('stopBtn');
const saveOptions = document.getElementById('saveOptions');
const filenameInput = document.getElementById('filename');
const downloadLink = document.getElementById('downloadLink');
const cloudBtn = document.getElementById('cloudBtn');

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
  let countdown = 3;
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
    const blob = new Blob(recordedChunks, { type: 'video/webm' });
    const url = URL.createObjectURL(blob);
    downloadLink.href = url;

    const filename = filenameInput.value.trim() || 'gravacao';
    downloadLink.download = `${filename}.webm`;

    window.recordedBlob = blob;
    saveOptions.style.display = 'block';
  };

  mediaRecorder.start();
  recordBtn.disabled = true;
  stopBtn.disabled = false;
  saveOptions.style.display = 'none';
}

stopBtn.addEventListener('click', () => {
  mediaRecorder.stop();
  recordBtn.disabled = false;
  stopBtn.disabled = true;
});

cloudBtn.addEventListener('click', () => {
  alert('Upload para nuvem será implementado na Parte 5.');
});
