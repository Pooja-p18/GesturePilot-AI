// gestureStabilizer.js
// Takes a raw gesture string per frame, decides whether it's stable enough
// to trigger an action, and enforces a cooldown so one held gesture doesn't
// fire repeatedly.

const CONSISTENCY_FRAMES = 6;   // ~6 frames at 30fps ≈ 200ms of held gesture
const COOLDOWN_MS = 900;        // minimum gap between two triggered actions

class GestureStabilizer {
  constructor() {
    this.currentCandidate = 'NONE';
    this.candidateCount = 0;
    this.confirmedGesture = 'NONE';
    this.lastTriggeredGesture = null;
    this.lastTriggerTime = 0;
  }

  // Call this once per frame with the raw classifier output.
  // Returns the gesture to ACT ON, or null if nothing should trigger this frame.
  process(rawGesture) {
    // Step 1: consistency check
    if (rawGesture === this.currentCandidate) {
      this.candidateCount++;
    } else {
      this.currentCandidate = rawGesture;
      this.candidateCount = 1;
    }

    const isStable = this.candidateCount >= CONSISTENCY_FRAMES;

    if (!isStable) {
      return null; // not held long enough yet, ignore
    }

    this.confirmedGesture = rawGesture;

    // Step 2: nothing to trigger for NONE/UNKNOWN/FIST-as-idle etc.
    if (rawGesture === 'NONE' || rawGesture === 'UNKNOWN') {
      this.lastTriggeredGesture = null; // reset, so next real gesture can fire fresh
      return null;
    }

    // Step 3: cooldown + "must change gesture before re-firing" rule
    const now = performance.now();
    const sameAsLastTrigger = rawGesture === this.lastTriggeredGesture;
    const withinCooldown = (now - this.lastTriggerTime) < COOLDOWN_MS;

    if (sameAsLastTrigger && withinCooldown) {
      return null; // still cooling down on this exact gesture
    }
    if (sameAsLastTrigger) {
      // Cooldown expired but hand never left this gesture — per spec,
      // require an explicit gesture CHANGE before allowing a repeat.
      return null;
    }

    // New, different, stable gesture -> allowed to trigger
    this.lastTriggeredGesture = rawGesture;
    this.lastTriggerTime = now;
    return rawGesture;
  }

  getConfirmedGesture() {
    return this.confirmedGesture;
  }
}

export { GestureStabilizer };