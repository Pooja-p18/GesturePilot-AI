// handTracker.js
// Owns: loading the MediaPipe model, running detection per frame, drawing landmarks.
// Knows nothing about gesture meaning (that's gestureClassifier.js, Phase 6).

import {
  HandLandmarker,
  FilesetResolver
} from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/vision_bundle.mjs";

const modelStatusEl = document.getElementById('model-status');
const fpsEl = document.getElementById('fps-counter');
const statusIndicator = document.getElementById('status-indicator');

let handLandmarker = null;
let lastVideoTime = -1;
let animationFrameId = null;

// Frame-rate tracking
let frameCount = 0;
let lastFpsUpdate = performance.now();

async function initHandLandmarker() {
  modelStatusEl.textContent = 'Loading model...';

  // FilesetResolver locates the WASM runtime MediaPipe needs to execute the model
    const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
    );

  handLandmarker = await HandLandmarker.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath:
        "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
      delegate: "GPU" // falls back to CPU automatically if GPU unavailable
    },
    runningMode: "VIDEO",
    numHands: 1 // MVP: single hand only, matches our gesture set
  });

  modelStatusEl.textContent = 'Model loaded';
  return handLandmarker;
}

function startDetectionLoop(videoElement, canvasElement, onResults) {
  const ctx = canvasElement.getContext('2d');

  function detectFrame() {
    if (!handLandmarker) return;

    // Wait until the webcam has actual video dimensions.
    if (videoElement.readyState < 2 || videoElement.videoWidth === 0) {
      animationFrameId = requestAnimationFrame(detectFrame);
      return;
    }

    canvasElement.width = videoElement.videoWidth;
    canvasElement.height = videoElement.videoHeight;

    if (videoElement.currentTime !== lastVideoTime) {
      lastVideoTime = videoElement.currentTime;

      const results = handLandmarker.detectForVideo(
        videoElement,
        performance.now()
      );

      ctx.clearRect(
        0,
        0,
        canvasElement.width,
        canvasElement.height
      );

      drawLandmarks(
        ctx,
        results,
        canvasElement.width,
        canvasElement.height
      );

      onResults(results);

      frameCount++;
      const now = performance.now();

      if (now - lastFpsUpdate >= 1000) {
        fpsEl.textContent = frameCount;
        frameCount = 0;
        lastFpsUpdate = now;
      }
    }

    animationFrameId = requestAnimationFrame(detectFrame);
  }

  statusIndicator.textContent = '● ON-DEVICE AI ACTIVE';
  statusIndicator.classList.remove('status-off');
  statusIndicator.classList.add('status-on');

  detectFrame();
}

function stopDetectionLoop() {
  if (animationFrameId) cancelAnimationFrame(animationFrameId);
  animationFrameId = null;
  lastVideoTime = -1;

  statusIndicator.textContent = '● ON-DEVICE AI INACTIVE';
  statusIndicator.classList.remove('status-on');
  statusIndicator.classList.add('status-off');
}

function drawLandmarks(ctx, results, width, height) {
  if (!results.landmarks || results.landmarks.length === 0) return;

  for (const hand of results.landmarks) {
    for (const point of hand) {
      ctx.beginPath();
      ctx.arc(point.x * width, point.y * height, 4, 0, 2 * Math.PI);
      ctx.fillStyle = '#4fd1c5';
      ctx.fill();
    }
  }
}

export { initHandLandmarker, startDetectionLoop, stopDetectionLoop };