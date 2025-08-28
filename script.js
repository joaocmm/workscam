const video = document.getElementById('video');

async function startCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    video.srcObject = stream;
  } catch (error) {
    alert('Erro ao acessar a câmera e o microfone: ' + error.message);
    console.error(error);
  }
}

startCamera();