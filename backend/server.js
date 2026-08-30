/**
 * Magic Pro — Server-Side Video Assembly & Automation Pipeline
 * 
 * Powered by Node.js, Express, and Native FFmpeg.
 * Provides high-speed video concatenation, audio overlay, and frame-synced caption generation.
 */

const express = require('express');
const cors = require('cors');
const multer = require('multer');
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3001;

// ── Middlewares & Security ────────────────────────────────────
app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// ── Directory Initialization ─────────────────────────────────
const uploadsDir = path.join(__dirname, 'uploads');
const outputsDir = path.join(__dirname, 'outputs');

[uploadsDir, outputsDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Serve finished output videos as static assets
app.use('/outputs', express.static(outputsDir));

// ── Session Storage Configuration ──────────────────────────────
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const sid = req.headers['x-session-id'] || uuidv4();
    req.sessionId = sid;
    const dir = path.join(uploadsDir, sid);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    // Sanitize filename
    const safeName = file.originalname.replace(/[^a-zA-Z0-9_.-]/g, '_');
    cb(null, safeName);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 * 1024 } // 2 GB max file size
});

// ── Helper Utilities ─────────────────────────────────────────
const VIDEO_EXTS = new Set(['.mp4', '.mov', '.webm', '.avi', '.mkv']);
const AUDIO_EXTS = new Set(['.mp3', '.wav', '.m4a', '.aac', '.ogg']);

const isVideo = f => VIDEO_EXTS.has(path.extname(f.originalname).toLowerCase());
const isAudio = f => AUDIO_EXTS.has(path.extname(f.originalname).toLowerCase());

/**
 * Extracts duration of media file using ffprobe
 */
const getDuration = filePath =>
  new Promise((resolve, reject) => {
    ffmpeg.ffprobe(filePath, (err, meta) => {
      if (err) reject(err);
      else resolve(Number(meta.format.duration) || 0);
    });
  });

/**
 * Generates word-level timestamps across the total video duration
 */
const buildWordTimings = (script, totalDuration) => {
  if (!script || !script.trim()) return [];
  const words = script.trim().split(/\s+/);
  const secPerWord = totalDuration / words.length;

  return words.map((word, i) => {
    const cleanWord = word.replace(/[.,!?;:]/g, '');
    return {
      word: cleanWord,
      raw: word,
      start: parseFloat((i * secPerWord).toFixed(3)),
      end: parseFloat(((i + 1) * secPerWord).toFixed(3)),
      isKey: cleanWord.length > 5 || /[!?]/.test(word)
    };
  });
};

/**
 * Schedules directory cleanup for temporary uploads
 */
const cleanup = (dir, delayMs = 120_000) => {
  setTimeout(() => {
    try {
      if (fs.existsSync(dir)) fs.rmSync(dir, { recursive: true, force: true });
    } catch (_) {}
  }, delayMs);
};

// ── API Routes ───────────────────────────────────────────────

/**
 * @route GET /health
 * @desc System sanity and readiness check
 */
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'Magic Pro Backend Engine',
    uptime: process.uptime()
  });
});

/**
 * @route POST /api/magic/assemble
 * @desc Assembles video clips and voiceover into a single output video with word timings
 */
app.post('/api/magic/assemble', upload.array('files', 50), async (req, res) => {
  const sessionId = req.sessionId || uuidv4();
  const sessionDir = path.join(uploadsDir, sessionId);

  try {
    const files = req.files || [];
    if (!files.length) {
      return res.status(400).json({ error: 'No files uploaded. Provide video clips and audio.' });
    }

    const captionScript = req.body.captionScript || '';

    // Filter and sort clips by numeric filename prefix
    const videoFiles = files
      .filter(isVideo)
      .sort((a, b) => a.originalname.localeCompare(b.originalname, undefined, { numeric: true }));

    const audioFile = files.find(isAudio) || null;

    if (!videoFiles.length) {
      return res.status(400).json({ error: 'No valid video files (.mp4, .mov, .mkv) found in request.' });
    }

    // Inspect individual durations concurrently
    const durations = await Promise.all(videoFiles.map(f => getDuration(f.path)));
    const totalDuration = durations.reduce((acc, curr) => acc + curr, 0);

    // Create FFmpeg concat demuxer manifest
    const concatManifestPath = path.join(sessionDir, 'concat.txt');
    const concatContent = videoFiles
      .map(f => `file '${f.path.replace(/\\/g, '/')}'`)
      .join('\n');
    fs.writeFileSync(concatManifestPath, concatContent);

    const outputId = uuidv4();
    const outputPath = path.join(outputsDir, `${outputId}.mp4`);

    // Execute FFmpeg concatenation & audio muxing pipeline
    await new Promise((resolve, reject) => {
      let cmd = ffmpeg()
        .input(concatManifestPath)
        .inputOptions(['-f', 'concat', '-safe', '0']);

      if (audioFile) {
        cmd = cmd.input(audioFile.path);
        cmd.outputOptions([
          '-map', '0:v:0',
          '-map', '1:a:0',
          '-c:v', 'libx264',
          '-preset', 'fast',
          '-crf', '23',
          '-c:a', 'aac',
          '-b:a', '192k',
          '-shortest',
          '-pix_fmt', 'yuv420p',
          '-movflags', '+faststart'
        ]);
      } else {
        cmd.outputOptions([
          '-c:v', 'libx264',
          '-preset', 'fast',
          '-crf', '23',
          '-pix_fmt', 'yuv420p',
          '-an',
          '-movflags', '+faststart'
        ]);
      }

      cmd
        .output(outputPath)
        .on('start', cmdLine => console.log('[FFmpeg Start]:', cmdLine))
        .on('end', () => resolve())
        .on('error', err => reject(err))
        .run();
    });

    const wordTimings = buildWordTimings(captionScript, totalDuration);

    // Schedule background cleanup of uploaded raw session files
    cleanup(sessionDir);

    // Build dynamic absolute URL using host header
    const host = req.get('host') || `localhost:${PORT}`;
    const protocol = req.protocol || 'http';
    const outputUrl = `${protocol}://${host}/outputs/${outputId}.mp4`;

    return res.json({
      success: true,
      outputUrl,
      totalDuration: parseFloat(totalDuration.toFixed(2)),
      clipCount: videoFiles.length,
      clips: videoFiles.map((f, i) => ({
        name: f.originalname,
        duration: parseFloat(durations[i].toFixed(2))
      })),
      hasAudio: !!audioFile,
      wordTimings
    });

  } catch (err) {
    console.error('[Magic Assembly Error]:', err);
    cleanup(sessionDir, 5000);
    return res.status(500).json({
      error: err.message || 'An unexpected error occurred during video assembly.'
    });
  }
});

// ── Global Error Handling Middleware ─────────────────────────
app.use((err, req, res, next) => {
  console.error('[Unhandled Error]:', err.stack);
  res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

// ── Server Process Initialization with Auto-Port Retry ─────────────────
function startServer(portToUse) {
  const server = app.listen(portToUse, () => {
    console.log(`\n==================================================`);
    console.log(`🪄 Magic Pro Backend Engine Ready`);
    console.log(`🚀 API Base URL : http://localhost:${portToUse}`);
    console.log(`📁 Uploads Dir  : ${uploadsDir}`);
    console.log(`🎬 Outputs Dir  : ${outputsDir}`);
    console.log(`==================================================\n`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.warn(`\n⚠️  Port ${portToUse} is busy. Retrying on port ${portToUse + 1}...`);
      startServer(portToUse + 1);
    } else {
      console.error('Server error:', err);
    }
  });
}

startServer(Number(PORT));

