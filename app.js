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


// ================================
// DOM ELEMENTS
// ================================

const startCameraBtn = document.getElementById('start-camera-btn');
const nextSlideBtn = document.getElementById('next-slide-btn');
const prevSlideBtn = document.getElementById('prev-slide-btn');
const overlayCanvas = document.getElementById('overlay-canvas');
const videoElement = document.getElementById('webcam');
const detectedGestureEl = document.getElementById('detected-gesture');

const stabilizer = new GestureStabilizer();

const currentActionEl = document.getElementById('current-action');


// ================================
// GESTURE GUIDE TOGGLE
// ================================

const guideToggle = document.getElementById('guide-toggle');
const guideList = document.getElementById('guide-list');

if (guideToggle && guideList) {
  guideToggle.addEventListener('click', () => {
    const isHidden = guideList.style.display === 'none';

    guideList.style.display = isHidden ? 'block' : 'none';

    guideToggle.textContent = isHidden
      ? 'Hide Gesture Guide'
      : 'Show Gesture Guide';
  });
}


// ================================
// APPLICATION STATE
// ================================

let cameraRunning = false;
let modelReady = false;


// ================================
// LOAD AI MODEL
// ================================

initHandLandmarker()
  .then(() => {
    modelReady = true;
    console.log("MediaPipe Hand Landmarker ready");
  })
  .catch((err) => {
    console.error("MediaPipe model failed to load:", err);

    document.getElementById('model-status').textContent =
      'Model failed to load — check your internet connection and refresh.';

    startCameraBtn.disabled = true;
    startCameraBtn.title = 'AI model unavailable';
  });


// ================================
// CAMERA BUTTON
// ================================

startCameraBtn.addEventListener('click', async () => {

  if (!cameraRunning) {

    try {

      await window.startCamera();

      cameraRunning = true;

      if (modelReady) {

        startDetectionLoop(
          videoElement,
          overlayCanvas,
          handleResults
        );

      } else {

        console.warn('Model not ready yet, waiting...');

        const waitInterval = setInterval(() => {

          if (modelReady) {

            clearInterval(waitInterval);

            startDetectionLoop(
              videoElement,
              overlayCanvas,
              handleResults
            );

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


// ================================
// HANDLE AI RESULTS
// ================================

function handleResults(results) {

  let rawGesture = 'NONE';


  // Check whether a hand was detected
  if (
    results.landmarks &&
    results.landmarks.length > 0
  ) {

    rawGesture = classifyGesture(
      results.landmarks[0]
    );
  }


  // Send raw gesture to stabilizer
  const triggeredGesture =
    stabilizer.process(rawGesture);


  // Always show the stable/confirmed gesture
  detectedGestureEl.textContent =
    stabilizer.getConfirmedGesture();


  // ================================
  // ACTION TRIGGERED
  // ================================

  if (triggeredGesture) {

    console.log(
      'ACTION TRIGGERED:',
      triggeredGesture
    );


    currentActionEl.textContent =
      triggeredGesture;


    // Visual feedback
    const gestureSection =
      document.querySelector('.gesture-section');


    if (gestureSection) {

      gestureSection.classList.remove(
        'action-flash'
      );

      // Force reflow so animation restarts
      void gestureSection.offsetWidth;

      gestureSection.classList.add(
        'action-flash'
      );
    }


    // Find corresponding presentation action
    const actionFn =
      GESTURE_ACTION_MAP[triggeredGesture];


    // Execute action
    if (actionFn) {

      actionFn();

    } else {

      console.warn(
        'No action mapped for gesture:',
        triggeredGesture
      );
    }
  }
}


// ================================
// MANUAL PRESENTATION CONTROLS
// ================================

nextSlideBtn.addEventListener(
  'click',
  nextSlide
);

prevSlideBtn.addEventListener(
  'click',
  previousSlide
);