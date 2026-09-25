// presentation.js
// Owns: slide data, current slide index, rendering, and the action functions
// that gestures (or buttons) call. No knowledge of gestures or cameras.

const slides = [
  { title: 'GesturePilot AI', body: 'Touchless Control powered by On-Device AI' },
  { title: 'The Problem', body: 'Traditional interfaces require physical contact — a barrier in many real-world settings.' },
  { title: 'Traditional Interaction', body: 'Mouse, keyboard, touchscreen — all require direct physical input.' },
  { title: 'Our Edge AI Architecture', body: 'Webcam → MediaPipe (on-device) → Hand Landmarks → Gesture Classifier → Stabilization → Action.' },
  { title: 'Supported Gestures', body: 'Open Palm, One Finger, Two Fingers, Thumbs Up, Fist, Pinch.' },
  { title: 'Real-Time Demonstration', body: 'Live gesture detection driving this very presentation.' },
  { title: 'Why On-Device AI?', body: 'Privacy, lower latency, and reduced dependence on cloud processing.' },
  { title: 'Applications', body: 'Presentations, classrooms, kiosks, accessibility, hands-busy environments.' },
  { title: 'Limitations', body: 'Lighting, occlusion, single-hand only, gesture ambiguity — see docs for full list.' },
  { title: 'Future Scope', body: 'On-device LLMs (LiteRT-LM), multimodal input, OS-level control.' }
];

let currentIndex = 0;
let presentationActive = false;

const slideContainer = document.getElementById('slide-container');
const slideNumberEl = document.getElementById('slide-number');

function renderSlide() {
  const slide = slides[currentIndex];
  slideContainer.innerHTML = `
    <div class="slide active">
      <h3>${slide.title}</h3>
      <p>${slide.body}</p>
    </div>
  `;
  slideNumberEl.textContent = `${currentIndex + 1} / ${slides.length}`;
}

function nextSlide() {
  if (currentIndex < slides.length - 1) {
    currentIndex++;
    renderSlide();
  }
}

function previousSlide() {
  if (currentIndex > 0) {
    currentIndex--;
    renderSlide();
  }
}

function togglePresentationMode() {
  presentationActive = !presentationActive;
  console.log('Presentation active:', presentationActive);
  // Reserved for later: could dim UI chrome, go fullscreen, etc.
  // Kept intentionally simple to avoid over-engineering under deadline.
}

function confirmAction() {
  console.log('Confirm action triggered on slide', currentIndex + 1);
  // Placeholder hook — no confirmable choices exist yet in the MVP deck.
}

function pausePresentation() {
  console.log('Presentation paused');
  // Placeholder hook — pausing has no persistent effect in a static deck yet.
}

function selectAction() {
  console.log('Select action triggered on slide', currentIndex + 1);
  // Placeholder hook — matches PINCH per the gesture map; no selectable
  // elements exist in the MVP deck, so this just logs for now.
}

// Render slide 1 immediately on load
renderSlide();

export {
  nextSlide,
  previousSlide,
  togglePresentationMode,
  confirmAction,
  pausePresentation,
  selectAction
};