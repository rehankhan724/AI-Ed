# 🪄 Magic Pro Studio — Automated NLE & Video Engine

A high-performance, studio-grade video production environment built with **React 18**, **Vite**, **Tailwind/Vanilla CSS Tokens**, and a server-side **Node.js + FFmpeg** assembly pipeline. Designed for 1-click automated short-form reel creation, kinetic word-by-word subtitles (`@drk_talks` style), multi-track timeline editing, and real-time canvas rendering.

---

## 🌟 Architecture & Core Features

- **🪄 Magic Folder-to-Reel Automator**: Drag & drop project folders containing video clips (`01_...mp4`), audio (`voiceover.mp3`), and scripts (`script.txt`) for instant 1-click reel generation.
- **🔥 DRK Talks Kinetic Subtitles**: Frame-accurate word-by-word caption engine featuring solid yellow key-word highlight boxes, 4-directional text outlines, and elastic zoom-punch scale animations.
- **⚡ Server-Side FFmpeg Engine**: Dedicated Node.js backend handles high-speed video concatenation, audio muxing, stream mapping, and session file management.
- **✂️ Combined Video + Waveform Timeline**: NLE timeline featuring unified video thumbnail tracks with inline SVG audio waveform visualization.
- **🎙️ AI Voiceover & Stock Explorer**: Integrated Speech Synthesis (TTS), ambient music track selector, ducking controls, and curated stock media library.
- **📐 Flexible Canvas Formats**: Real-time canvas preview supporting **9:16 Shorts/Reels**, **16:9 Landscape**, **1:1 Square**, and **4:5 Feed** aspect ratios.

---

## 📁 Repository Architecture

```text
AI-ED/
├── 📁 backend/                        # Node.js + Express + FFmpeg Backend
│   ├── server.js                      # Concat assembly API, duration probe & static host
│   ├── package.json                   # Backend service manifests
│   ├── uploads/                       # Session-isolated raw uploads (git-ignored)
│   └── outputs/                       # Assembled production video outputs (git-ignored)
│
├── 📁 src/                            # Frontend (React 18 + Vite)
│   ├── App.jsx                        # Studio Layout Orchestrator & State Container
│   ├── index.css                      # Design Tokens & Kinetic Subtitle Animation Keyframes
│   ├── main.jsx                       # React Application Entry
│   │
│   ├── 📁 components/                 # Isolated Studio UI Modules
│   │   ├── MagicPanel.jsx             # 🪄 1-Click Folder Automation Panel
│   │   ├── VideoCanvas.jsx            # Live Monitor & Frame-Synced Captions Overlay
│   │   ├── Timeline.jsx               # Multi-Track Timeline with Integrated Waveforms
│   │   ├── SubtitleEditorPanel.jsx    # Subtitle Segment Editor & Typography Controls
│   │   ├── AudioPanel.jsx             # AI TTS Voiceover & Ambient BG Music Ducks
│   │   ├── MediaPanel.jsx             # Asset Library & Stock Media Explorer
│   │   ├── PlaybackControls.jsx       # Transport Controls, Scrubbing & Zoom
│   │   ├── Sidebar.jsx                # Studio Header Tab Navigation
│   │   ├── Navbar.jsx                 # Top Bar with Preset & Resolution Selectors
│   │   └── RenderModal.jsx            # Video Export Progress Modal
│   │
│   └── 📁 services/                   # Core Domain Logic Services
│       ├── stockMediaService.js       # Curated Media Asset Provider
│       └── transcriptionService.js    # Speech Recognition & Caption Synchronization
│
├── 📁 public/                         # Public Static Assets
├── index.html                         # HTML Root Entry & Google Font Declarations
├── vite.config.js                     # Vite Bundler Configuration
└── package.json                       # Frontend Manifest
```

---

## 🚀 Getting Started

### 1. Frontend Setup
```bash
# Install frontend dependencies
npm install

# Start Vite dev server
npm run dev
```
Frontend running at: `http://localhost:5173`

### 2. Backend Setup
```bash
cd backend
npm install
node server.js
```
Backend API running at: `http://localhost:3001`

---

## 🔌 API Endpoints (Backend)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/health` | Server health and uptime status |
| `POST` | `/api/magic/assemble` | Concatenates video files, overlays audio track, and calculates word timings |
| `POST` | `/api/magic/probe` | Inspects single media file metadata (duration, width, height, codec) |

---

## 🎹 Keyboard Shortcuts

- **Space**: Play / Pause Video
- **S** / **K**: Split Subtitle Segment at Playhead
- **Delete** / **Backspace**: Delete Selected Segment
- **Left / Right Arrow**: Step 1 Frame (0.04s) Backward / Forward
- **Ctrl + Z**: Undo Action
- **Ctrl + Y** / **Ctrl + Shift + Z**: Redo Action
