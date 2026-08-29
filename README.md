# 🎬 Ai-Editor Studio

A modern, professional AI-powered video editing web application built with **React 18**, **Vite**, and **Lucide React**. Designed for ultra-fast audio-to-subtitle extraction, kinetic subtitle styling, multi-track timeline editing, and video rendering.

---

## 🌟 Key Features

- **🖼️ In-App Stock Media & Image Search Engine**: Instant search for high-res images (e.g., *coffee, cyberpunk, nature*) directly in the editor.
- **📐 Aspect Ratio & Size Filter**: Filter image searches by target format: **9:16 Reels/Shorts**, **16:9 Landscape**, **1:1 Square**, or **4:5 Portrait Feed**.
- **⚡ AI Audio-to-Subtitle Extraction**: Automatic speech transcription converted into frame-synchronized subtitle clips.
- **🎨 Kinetic Subtitle Styling**: Presets including *Hormozi Pop*, *Dark Box*, *Cyber Neon*, *Glass Karaoke*, and *Classic Sub*.
- **✂️ Multi-Track NLE Timeline**: Drag & drop timeline blocks, split clips (`S`/`K`), auto-cut dead silences, and overlay image track.
- **🎙️ Text-to-Speech (TTS) & Background Music**: Built-in speech synthesizer voiceovers and ambient music track selector.
- **🔄 State Persistence & Undo/Redo**: Full project state saving (`localStorage`) with keyboard shortcuts (`Ctrl+Z` / `Ctrl+Y`).
- **🎛️ Color Grading Filters & Export**: Real-time video filters and export tools (.MP4 render & `.vtt` subtitles download).

---

## 📁 Project Structure

```text
AI-ED/
├── public/
│   └── favicon.svg           # Project favicon asset
├── src/
│   ├── components/           # Modular Studio UI components
│   │   ├── AudioPanel.jsx               # AI TTS Voiceover & Background Music panel
│   │   ├── AudioWaveformCanvas.jsx      # Canvas-based real-time audio waveform
│   │   ├── Navbar.jsx                   # Studio Header with action controls
│   │   ├── PlaybackControls.jsx         # Frame scrub, playback speed, volume, zoom
│   │   ├── RenderModal.jsx              # Video export & VTT subtitle downloader
│   │   ├── Sidebar.jsx                  # Left Navigation Rail
│   │   ├── SubtitleEditorPanel.jsx      # Subtitle editor & typography controls
│   │   ├── Timeline.jsx                 # Multi-track NLE timeline editor
│   │   └── VideoCanvas.jsx              # Main video canvas with kinetic overlays
│   ├── services/
│   │   └── transcriptionService.js      # Speech recognition & VAD audio processing
│   ├── App.jsx               # Main Application Orchestrator
│   ├── index.css             # Design Tokens & Kinetic Subtitle Animations
│   └── main.jsx              # React Entry Point
├── index.html                # Main HTML page entry
├── package.json              # Project dependencies & scripts
├── vite.config.js            # Vite build configuration
└── README.md                 # Project documentation
```

---

## 🚀 How to Run the Project

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed (v18+ recommended).

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
Open your browser and navigate to: `http://localhost:3002`

### 3. Build for Production
```bash
npm run build
```

---

## 🎹 Keyboard Shortcuts

- **Space**: Play / Pause Video
- **S** or **K**: Split Subtitle Clip at Playhead
- **Delete** / **Backspace**: Delete Selected Clip
- **Left Arrow** / **Right Arrow**: Step 1 Frame Backward / Forward (0.04s)
- **Ctrl + Z**: Undo Action
- **Ctrl + Y** / **Ctrl + Shift + Z**: Redo Action
