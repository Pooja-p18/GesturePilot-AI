// gestureClassifier.js
// Pure function(s): landmarks in -> gesture name out.
// No DOM access, no camera knowledge — easy to unit-test or replace with an ML model later.

const FINGER_JOINTS = {
  thumb:  { base: 2, tip: 4 },
  index:  { base: 5, tip: 8 },
  middle: { base: 9, tip: 12 },
  ring:   { base: 13, tip: 16 },
  pinky:  { base: 17, tip: 20 }
};

const WRIST = 0;

function distance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

// A finger counts as "extended" if its tip is meaningfully farther
// from the wrist than its base joint is.
function isFingerExtended(landmarks, fingerName) {
  const { base, tip } = FINGER_JOINTS[fingerName];
  const wrist = landmarks[WRIST];

  const baseDist = distance(landmarks[base], wrist);
  const tipDist = distance(landmarks[tip], wrist);

  return tipDist > baseDist * 1.15; // 15% margin to avoid borderline flicker
}

// Thumb is checked differently: it moves mostly sideways, not up/down like
// the other 4 fingers, so we compare it against the index finger's base joint
// instead of the wrist.
function isThumbExtended(landmarks) {
  const thumbTip = landmarks[FINGER_JOINTS.thumb.tip];
  const indexBase = landmarks[FINGER_JOINTS.index.base];
  const wrist = landmarks[WRIST];

  const thumbToIndexBase = distance(thumbTip, indexBase);
  const wristToIndexBase = distance(wrist, indexBase);

  return thumbToIndexBase > wristToIndexBase * 0.6;
}

function classifyGesture(landmarks) {
  if (!landmarks || landmarks.length === 0) return 'NONE';

  const thumb = isThumbExtended(landmarks);
  const index = isFingerExtended(landmarks, 'index');
  const middle = isFingerExtended(landmarks, 'middle');
  const ring = isFingerExtended(landmarks, 'ring');
  const pinky = isFingerExtended(landmarks, 'pinky');

  const extendedCount = [thumb, index, middle, ring, pinky].filter(Boolean).length;

  // PINCH: thumb tip and index tip very close together, other fingers curled
  const thumbTip = landmarks[FINGER_JOINTS.thumb.tip];
  const indexTip = landmarks[FINGER_JOINTS.index.tip];
  const pinchDistance = distance(thumbTip, indexTip);
  const handSpan = distance(landmarks[WRIST], landmarks[FINGER_JOINTS.middle.base]);

  if (pinchDistance < handSpan * 0.35 && !middle && !ring && !pinky) {
    return 'PINCH';
  }

  // FIST: nothing extended
  if (extendedCount === 0) {
    return 'FIST';
  }

  // THUMBS UP: only thumb extended, all four fingers curled
  if (thumb && !index && !middle && !ring && !pinky) {
    return 'THUMBS_UP';
  }

  // ONE FINGER: only index extended
  if (!thumb && index && !middle && !ring && !pinky) {
    return 'ONE_FINGER';
  }

  // TWO FINGERS: index + middle extended, ring/pinky curled
  if (index && middle && !ring && !pinky) {
    return 'TWO_FINGERS';
  }

  // OPEN PALM: all 5 extended
  if (extendedCount >= 4) {
    return 'OPEN_PALM';
  }

  return 'UNKNOWN';
}

export { classifyGesture };