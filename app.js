import { initHandLandmarker, startDetectionLoop, stopDetectionLoop } from './js/handTracker.js';

console.log("GesturePilot AI - app.js loaded");

const startCameraBtn = document.getElementById('start-camera-btn');
const nextSlideBtn = document.getElementById('next-slide-btn');
const prevSlideBtn = document.getElementById('prev-slide-btn');
const overlayCanvas = document.getElementById('overlay-canvas');
const videoElement = document.getElementById('webcam');

let cameraRunning = false;
let modelReady = false;

// Load the model once, immediately on page load, so it's ready by the time
// the user clicks Start Camera (avoids a delay at click time).
initHandLandmarker()
  .then(() => {
    modelReady = true;
    console.log("MediaPipe Hand Landmarker ready");
  })
  .catch((err) => {
    console.error("MediaPipe model failed to load:", err);
  });

startCameraBtn.addEventListener('click', async () => {
  if (!cameraRunning) {
    try {
      await window.startCamera(); // from camera.js (classic script, still on window)
      cameraRunning = true;

      if (modelReady) {
        startDetectionLoop(videoElement, overlayCanvas, handleResults);
      } else {
        console.warn('Model not ready yet, waiting...');
        const waitInterval = setInterval(() => {
          if (modelReady) {
            clearInterval(waitInterval);
            startDetectionLoop(videoElement, overlayCanvas, handleResults);
          }
        }, 200);
      }
    } catch (err) {
      cameraRunning = false;
    }
  } else {
    window.stopCamera();
    stopDetectionLoop();
    cameraRunning = false;
  }
});

function handleResults(results) {
  // Phase 6 will interpret these landmarks into gestures.
  // For now, just prove data is flowing:
  if (results.landmarks && results.landmarks.length > 0) {
    console.log('Hand detected, landmark count:', results.landmarks[0].length);
  }
}

nextSlideBtn.addEventListener('click', () => console.log('Next slide clicked'));
prevSlideBtn.addEventListener('click', () => console.log('Previous slide clicked'));