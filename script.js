
const video = document.getElementById('video');
const recordBtn = document.getElementById('recordBtn');
const downloadLink = document.getElementById('downloadLink');
const saveOptions = document.getElementById('saveOptions');
const cloudBtn = document.getElementById('cloudBtn');

let mediaRecorder;
let recordedChunks = [];
let isRecording = false;

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
  if (!isRecording) {
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
      saveOptions.style.display = 'block';

      // Armazena o blob para upload futuro
      window.recordedBlob = blob;
    };

    mediaRecorder.start();
    isRecording = true;
    recordBtn.textContent = 'Parar Gravação';
    saveOptions.style.display = 'none';
  } else {
    mediaRecorder.stop();
    isRecording = false;
    recordBtn.textContent = 'Iniciar Gravação';
  }
});

// Placeholder para salvar na nuvem
cloudBtn.addEventListener('click', () => {
  alert('Funcionalidade de upload para nuvem será implementada na Parte 5.');
});

