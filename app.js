import { initHandLandmarker, startDetectionLoop, stopDetectionLoop } from './js/handTracker.js';
import { classifyGesture } from './js/gestureClassifier.js';
import { GestureStabilizer } from './js/gestureStabilizer.js';
import {
  nextSlide,
  previousSlide,
  togglePresentationMode,
  confirmAction,
  pausePresentation,
  selectAction
} from './js/presentation.js';

const GESTURE_ACTION_MAP = {
  TWO_FINGERS: nextSlide,
  ONE_FINGER: previousSlide,
  OPEN_PALM: togglePresentationMode,
  THUMBS_UP: confirmAction,
  FIST: pausePresentation,
  PINCH: selectAction
};

console.log("GesturePilot AI - app.js loaded");

const startCameraBtn = document.getElementById('start-camera-btn');
const nextSlideBtn = document.getElementById('next-slide-btn');
const prevSlideBtn = document.getElementById('prev-slide-btn');
const overlayCanvas = document.getElementById('overlay-canvas');
const videoElement = document.getElementById('webcam');
const detectedGestureEl = document.getElementById('detected-gesture');
const stabilizer = new GestureStabilizer();
const currentActionEl = document.getElementById('current-action');

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
  let rawGesture = 'NONE';

  if (results.landmarks && results.landmarks.length > 0) {
    rawGesture = classifyGesture(results.landmarks[0]);
  }

  const triggeredGesture = stabilizer.process(rawGesture);

  // Always show the stable/confirmed gesture, not the raw flickery one
  detectedGestureEl.textContent = stabilizer.getConfirmedGesture();
  
    if (triggeredGesture) {
    console.log('ACTION TRIGGERED:', triggeredGesture);
    currentActionEl.textContent = triggeredGesture;

    const actionFn = GESTURE_ACTION_MAP[triggeredGesture];
    if (actionFn) {
      actionFn();
    }
  }
}

nextSlideBtn.addEventListener('click', nextSlide);
prevSlideBtn.addEventListener('click', previousSlide);