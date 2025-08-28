const video = document.getElementById('video');
const prepareBtn = document.getElementById('prepareBtn');
const configPanel = document.getElementById('configPanel');
const filenameInput = document.getElementById('filename');
const saveLocalBtn = document.getElementById('saveLocalBtn');
const saveCloudBtn = document.getElementById('saveCloudBtn');
const confirmBtn = document.getElementById('confirmBtn');
const downloadLink = document.getElementById('downloadLink');
const downloadSection = document.getElementById('downloadSection');

let mediaRecorder;
let recordedChunks = [];
let saveLocation = null;

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

prepareBtn.addEventListener('click', () => {
  configPanel.style.display = 'block';
  downloadSection.style.display = 'none';
});

saveLocalBtn.addEventListener('click', () => {
  saveLocation = 'local';
});

saveCloudBtn.addEventListener('click', () => {
  saveLocation = 'cloud';
});

confirmBtn.addEventListener('click', () => {
  const filename = filenameInput.value.trim() || 'gravacao';
  if (!saveLocation) {
    alert('Escolha onde deseja salvar o arquivo.');
    return;
  }

  recordedChunks = [];
  mediaRecorder = new MediaRecorder(window.fullStream);

  mediaRecorder.ondataavailable = event => {
    if (event.data.size > 0) {
      recordedChunks.push(event.data);
    }
  };

  mediaRecorder.onstop = () => {
    const blob = new Blob(recordedChunks, { type: 'video/webm' });

    if (saveLocation === 'local') {
      const url = URL.createObjectURL(blob);
      downloadLink.href = url;
      downloadLink.download = `${filename}.webm`;
      downloadSection.style.display = 'block';
    } else {
      window.recordedBlob = blob;
      alert('Upload para nuvem será implementado na Parte 5.');
    }
  };

  mediaRecorder.start();
  configPanel.style.display = 'none';
  prepareBtn.textContent = 'Parar Gravação';

  prepareBtn.onclick = () => {
    mediaRecorder.stop();
    prepareBtn.textContent = 'Gravar';
    prepareBtn.onclick = null;
  };
});