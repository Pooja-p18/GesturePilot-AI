// camera.js
// Responsible ONLY for requesting/starting/stopping the webcam.
// It knows nothing about MediaPipe or gestures — single responsibility.

const videoElement = document.getElementById('webcam');
const cameraStatusEl = document.getElementById('camera-status');
const startCameraBtn = document.getElementById('start-camera-btn');

let currentStream = null;

async function startCamera() {
  // Guard: if a stream is already running, don't request a second one
  if (currentStream) {
    console.log('Camera already running');
    return;
  }

  cameraStatusEl.textContent = 'Camera: Requesting permission...';

  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        width: { ideal: 640 },
        height: { ideal: 480 },
        facingMode: 'user'
      },
      audio: false
    });

    currentStream = stream;
    videoElement.srcObject = stream;

    cameraStatusEl.textContent = 'Camera: Active';
    startCameraBtn.textContent = 'Stop Camera';

    return stream;

  } catch (err) {
    handleCameraError(err);
    throw err;
  }
}

function stopCamera() {
  if (!currentStream) return;

  currentStream.getTracks().forEach(track => track.stop());
  currentStream = null;
  videoElement.srcObject = null;

  cameraStatusEl.textContent = 'Camera: Stopped';
  startCameraBtn.textContent = 'Start Camera';
}

function handleCameraError(err) {
  console.error('Camera error:', err);

  if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
    cameraStatusEl.textContent = 'Camera: Permission denied. Please allow camera access in your browser settings.';
  } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
    cameraStatusEl.textContent = 'Camera: No camera device found.';
  } else if (err.name === 'NotReadableError') {
    cameraStatusEl.textContent = 'Camera: Camera is already in use by another application.';
  } else {
    cameraStatusEl.textContent = `Camera: Error - ${err.message}`;
  }
}

function isCameraActive() {
  return currentStream !== null;
}

window.startCamera = startCamera;
window.stopCamera = stopCamera;
window.isCameraActive = isCameraActive;