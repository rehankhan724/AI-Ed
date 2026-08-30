# 🪄 Magic Pro Studio — Automated NLE & Video Engine

A high-performance, studio-grade video production environment built as a clean **Full-Stack Monorepo** with **Frontend (React 18 + Vite)** and **Backend (Node.js + Express + FFmpeg)**.

---

## 📁 Repository Architecture

```text
AI-ED/
├── 📁 frontend/                       # React 18 + Vite Web Studio Application
│   ├── 📁 src/                        # React Components, State & CSS Tokens
│   │   ├── App.jsx                    # Studio Orchestrator & State Container
│   │   ├── index.css                  # Design System & Kinetic Subtitle Animation Keyframes
│   │   ├── main.jsx                   # Application Entry
│   │   ├── 📁 components/             # Studio UI Modules (MagicPanel, VideoCanvas, Timeline, etc.)
│   │   └── 📁 services/               # Stock Media & Transcription Services
│   ├── 📁 public/                     # Static Assets
│   ├── index.html                     # HTML Document Root
│   ├── vite.config.js                 # Vite Bundler Config
│   └── package.json                   # Frontend Dependencies
│
├── 📁 backend/                        # Node.js + Express + FFmpeg Server
│   ├── server.js                      # Concat assembly API, duration probe & static host
│   ├── package.json                   # Backend Service Manifest
│   ├── uploads/                       # Session-isolated raw uploads (git-ignored)
│   └── outputs/                       # Assembled production video outputs (git-ignored)
│
├── package.json                       # Monorepo Workspace Scripts
├── README.md                          # Project Documentation
└── .gitignore                         # Repository Ignore Configuration
```

---

## 🌟 Core Features

- **🪄 Magic Folder-to-Reel Automator**: Drag & drop project folders containing video clips (`01_...mp4`), audio (`voiceover.mp3`), and scripts (`script.txt`) for instant 1-click reel generation.
- **🔥 DRK Talks Kinetic Subtitles**: Frame-accurate word-by-word caption engine featuring solid yellow key-word highlight boxes, 4-directional text outlines, and elastic zoom-punch scale animations.
- **⚡ Server-Side FFmpeg Engine**: Dedicated Node.js backend handles high-speed video concatenation, audio muxing, stream mapping, and session file management.
- **✂️ Combined Video + Waveform Timeline**: NLE timeline featuring unified video thumbnail tracks with inline SVG audio waveform visualization.
- **🎙️ AI Voiceover & Stock Explorer**: Integrated Speech Synthesis (TTS), ambient music track selector, ducking controls, and curated stock media library.
- **📐 Flexible Canvas Formats**: Real-time canvas preview supporting **9:16 Shorts/Reels**, **16:9 Landscape**, **1:1 Square**, and **4:5 Feed** aspect ratios.

---

## 🚀 Getting Started

### 1. Start Frontend (React Studio)
```bash
cd frontend
npm install
npm run dev
```
Open: `http://localhost:5173`

### 2. Start Backend (Assembly Server)
```bash
cd backend
npm install
node server.js
```
API Running at: `http://localhost:3001`

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
