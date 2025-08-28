
const video = document.getElementById('video');

async function startCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

    // Exibe apenas o vídeo, sem o áudio
    const videoOnlyStream = new MediaStream(stream.getVideoTracks());
    video.srcObject = videoOnlyStream;

    // Armazena o stream completo (com áudio) para gravação futura
    window.fullStream = stream;

  } catch (error) {
    alert('Erro ao acessar a câmera e o microfone: ' + error.message);
    console.error(error);
  }
}
