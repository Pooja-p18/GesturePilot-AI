console.log("GesturePilot AI - app.js loaded");

let cameraRunning = false;

startCameraBtn.addEventListener('click', async () => {
  if (!cameraRunning) {
    try {
      await startCamera();
      cameraRunning = true;
    } catch (err) {
      cameraRunning = false;
    }
  } else {
    stopCamera();
    cameraRunning = false;
  }
});

document.getElementById('next-slide-btn').addEventListener('click', () => {
  console.log('Next slide clicked - logic comes later');
});

document.getElementById('prev-slide-btn').addEventListener('click', () => {
  console.log('Previous slide clicked - logic comes later');
});