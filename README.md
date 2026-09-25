# GesturePilot AI

### Touchless Control Powered by On-Device AI

GesturePilot AI is a browser-based touchless interaction system that uses **hand tracking and gesture recognition** to control a presentation without requiring physical touch.

The application uses **MediaPipe Hand Landmarker** to detect hand landmarks through the webcam and converts recognized hand gestures into presentation actions.

---

## 🚀 Project Overview

Traditional presentation control usually requires a keyboard, mouse, or physical remote.

GesturePilot AI explores an alternative interaction method:

**Camera → Hand Tracking → Gesture Recognition → Gesture Stabilization → Presentation Action**

The project demonstrates how **AI running locally in the browser** can be integrated into a practical interactive application.

---

## ✨ Key Features

* 📷 Real-time webcam-based hand tracking
* 🤖 On-device hand landmark detection using MediaPipe
* ✋ Multiple gesture-based controls
* 🧠 Gesture classification
* 🔄 Temporal gesture stabilization
* 🎯 Gesture-to-action mapping
* 📊 Real-time FPS monitoring
* 🔵 Live AI model status indicator
* 🖐️ Visual hand landmark overlay
* 📖 Interactive gesture guide
* 🖥️ Built-in presentation viewer
* 🌐 Browser-based deployment
* 🔒 Camera frames are processed locally for gesture recognition and are not intentionally uploaded to a cloud AI service by the application

---

## 🖐️ Supported Gestures

| Gesture        | Action                         |
| -------------- | ------------------------------ |
| ✋ Open Palm    | Start / Stop Presentation Mode |
| ☝️ One Finger  | Previous Slide                 |
| ✌️ Two Fingers | Next Slide                     |
| 👍 Thumbs Up   | Confirm                        |
| ✊ Fist         | Pause                          |
| 🤏 Pinch       | Select                         |

Gesture stabilization is used to reduce accidental triggers caused by temporary changes in hand position or detection noise.

---

## 🧠 AI Technology

The project uses **MediaPipe Hand Landmarker** from the MediaPipe Tasks Vision library.

The model detects **21 hand landmarks** from the webcam input.

These landmarks are then passed to the application's gesture classifier.

### Processing Pipeline

```text
Webcam
   ↓
Video Stream
   ↓
MediaPipe Hand Landmarker
   ↓
21 Hand Landmarks
   ↓
Gesture Classifier
   ↓
Gesture Stabilizer
   ↓
Gesture → Action Mapping
   ↓
Presentation Control
```

---

## 🏗️ Architecture

```text
┌──────────────────────┐
│      Webcam          │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Browser Video Stream │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────────┐
│ MediaPipe Hand Landmarker│
│       On-Device AI       │
└──────────┬───────────────┘
           │
           ▼
┌──────────────────────┐
│ Hand Landmarks       │
│ 21 Landmark Points   │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Gesture Classifier   │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Gesture Stabilizer   │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Presentation Actions │
└──────────────────────┘
```

---

## 📁 Project Structure

```text
GesturePilot-AI/
│
├── index.html
├── style.css
├── app.js
│
├── js/
│   ├── camera.js
│   ├── handTracker.js
│   ├── gestureClassifier.js
│   ├── gestureStabilizer.js
│   └── presentation.js
│
└── README.md
```

### Main Components

#### `app.js`

Acts as the main application controller.

It connects:

* Camera
* Hand tracking
* Gesture classification
* Gesture stabilization
* Presentation actions
* UI updates

#### `camera.js`

Responsible for:

* Requesting webcam permission
* Starting the camera
* Stopping the camera
* Handling camera errors

#### `handTracker.js`

Responsible for:

* Loading the MediaPipe Hand Landmarker
* Running hand detection
* Processing video frames
* Drawing hand landmarks
* Monitoring FPS

#### `gestureClassifier.js`

Converts hand landmark positions into predefined gestures.

#### `gestureStabilizer.js`

Helps prevent unstable detections and repeated actions by requiring gesture consistency before triggering an action.

#### `presentation.js`

Contains presentation-related actions such as:

* Next slide
* Previous slide
* Start/Stop
* Confirm
* Pause
* Select

---

## 🛠️ Technologies Used

* HTML5
* CSS3
* JavaScript
* MediaPipe Tasks Vision
* MediaPipe Hand Landmarker
* WebRTC / `getUserMedia()`
* Canvas API
* WebGL/GPU acceleration where available
* GitHub Pages

---

## 🔐 Privacy

GesturePilot AI is designed around local browser-based gesture processing.

The application accesses the webcam only after the user grants permission.

For basic gesture recognition, camera frames are processed within the browser rather than intentionally uploaded to a cloud AI service by the application.

> Note: The browser still needs to download the application, MediaPipe runtime, and model resources from their respective servers.

---

## ▶️ Running Locally

### 1. Clone the repository

```bash
git clone <your-github-repository-url>
```

### 2. Open the project

Open the project folder in VS Code.

### 3. Run using a local web server

Because webcam access requires a secure context, use a local development server instead of opening `index.html` directly.

For example, with VS Code Live Server:

```text
Right Click → Open with Live Server
```

Then open the generated localhost URL in your browser.

### 4. Allow Camera Access

Click:

```text
```
