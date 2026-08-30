import React, { useState, useRef, useEffect } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import VideoCanvas from './components/VideoCanvas';
import PlaybackControls from './components/PlaybackControls';
import Timeline from './components/Timeline';
import SubtitleEditorPanel from './components/SubtitleEditorPanel';
import AudioPanel from './components/AudioPanel';
import MediaPanel from './components/MediaPanel';
import RenderModal from './components/RenderModal';
import MagicPanel from './components/MagicPanel';
import { transcribeVideoAudio, DEMO_SAMPLE_SUBTITLES } from './services/transcriptionService';

export default function App() {
  // Video & Playback state
  const [videoSrc, setVideoSrc] = useState(null);
  const [overlayImages, setOverlayImages] = useState([]);
  const [selectedImageId, setSelectedImageId] = useState(null);
  const [duration, setDuration] = useState(15);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [activeFilter, setActiveFilter] = useState('normal');
  const [isMuted, setIsMuted] = useState(false);
  const [volumeLevel, setVolumeLevel] = useState(1.0);

  // Background Music & Audio state
  const [backgroundTrack, setBackgroundTrack] = useState('none');
  const [bgMusicVolume, setBgMusicVolume] = useState(0.3);

  // Subtitle & Style state
  const [subtitles, setSubtitles] = useState([]);
  const [selectedSubId, setSelectedSubId] = useState(null);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [activeCaptionStyle, setActiveCaptionStyle] = useState('hormozi');
  const [captionPosition, setCaptionPosition] = useState('center');
  const [captionColor, setCaptionColor] = useState('#facc15');
  const [captionFont, setCaptionFont] = useState('Montserrat');
  const [captionSize, setCaptionSize] = useState(26);

  const [activeTab, setActiveTab] = useState('subtitles');
  const [magicWordTimings, setMagicWordTimings] = useState([]);
  const [magicCaptionStyle, setMagicCaptionStyle] = useState('drk-talks');
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [zoomLevel, setZoomLevel] = useState(100);
  const [isRenderModalOpen, setIsRenderModalOpen] = useState(false);

  // Force dark theme on mount & localStorage reset
  useEffect(() => {
    document.documentElement.className = 'theme-dark';
    document.body.className = 'theme-dark';
    localStorage.setItem('aied_theme', 'dark');
  }, []);

  // Refs
  const videoRef = useRef(null);
  const fileInputRef = useRef(null);
  const animFrameRef = useRef(null);

  // 1. Restore Project State from localStorage or load default stock video
  useEffect(() => {
    try {
      const saved = localStorage.getItem('aied_project_state');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.subtitles && parsed.subtitles.length > 0) {
          setSubtitles(parsed.subtitles);
        } else {
          setSubtitles(DEMO_SAMPLE_SUBTITLES);
        }
        if (parsed.activeCaptionStyle) setActiveCaptionStyle(parsed.activeCaptionStyle);
        if (parsed.captionFont) setCaptionFont(parsed.captionFont);
        if (parsed.captionColor) setCaptionColor(parsed.captionColor);
        if (parsed.activeFilter) setActiveFilter(parsed.activeFilter);
        if (parsed.aspectRatio) setAspectRatio(parsed.aspectRatio);
      } else {
        setSubtitles(DEMO_SAMPLE_SUBTITLES);
      }
    } catch (e) {
      setSubtitles(DEMO_SAMPLE_SUBTITLES);
    }

    const sampleUrl = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4';
    setVideoSrc(sampleUrl);
  }, []);

  // 2. Auto-Save Project State to localStorage
  useEffect(() => {
    try {
      const stateToSave = {
        subtitles,
        activeCaptionStyle,
        captionFont,
        captionColor,
        activeFilter,
        aspectRatio
      };
      localStorage.setItem('aied_project_state', JSON.stringify(stateToSave));
    } catch (e) {}
  }, [subtitles, activeCaptionStyle, captionFont, captionColor, activeFilter, aspectRatio]);

  // 2b. Undo (Ctrl+Z) & Redo (Ctrl+Y) History Stack
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const isUndoRedoAction = useRef(false);

  useEffect(() => {
    if (isUndoRedoAction.current) {
      isUndoRedoAction.current = false;
      return;
    }

    const snapshot = {
      subtitles,
      activeCaptionStyle,
      captionFont,
      captionColor,
      captionPosition,
      captionSize,
      activeFilter,
      aspectRatio
    };

    const serialized = JSON.stringify(snapshot);

    setHistory(prevHistory => {
      const currentHistory = prevHistory.slice(0, historyIndex + 1);
      const lastSnapshot = currentHistory[currentHistory.length - 1];

      if (lastSnapshot && JSON.stringify(lastSnapshot) === serialized) {
        return prevHistory;
      }

      const newHistory = [...currentHistory, snapshot];
      setHistoryIndex(newHistory.length - 1);
      return newHistory;
    });
  }, [subtitles, activeCaptionStyle, captionFont, captionColor, captionPosition, captionSize, activeFilter, aspectRatio]);

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  const handleUndo = () => {
    if (historyIndex > 0) {
      const targetIndex = historyIndex - 1;
      const snapshot = history[targetIndex];
      if (snapshot) {
        isUndoRedoAction.current = true;
        setSubtitles(snapshot.subtitles);
        setActiveCaptionStyle(snapshot.activeCaptionStyle);
        setCaptionFont(snapshot.captionFont);
        setCaptionColor(snapshot.captionColor);
        setCaptionPosition(snapshot.captionPosition);
        setCaptionSize(snapshot.captionSize);
        setActiveFilter(snapshot.activeFilter);
        setAspectRatio(snapshot.aspectRatio);
        setHistoryIndex(targetIndex);
      }
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const targetIndex = historyIndex + 1;
      const snapshot = history[targetIndex];
      if (snapshot) {
        isUndoRedoAction.current = true;
        setSubtitles(snapshot.subtitles);
        setActiveCaptionStyle(snapshot.activeCaptionStyle);
        setCaptionFont(snapshot.captionFont);
        setCaptionColor(snapshot.captionColor);
        setCaptionPosition(snapshot.captionPosition);
        setCaptionSize(snapshot.captionSize);
        setActiveFilter(snapshot.activeFilter);
        setAspectRatio(snapshot.aspectRatio);
        setHistoryIndex(targetIndex);
      }
    }
  };

  // 3. Global NLE Keyboard Shortcuts Engine (Ctrl+Z, Ctrl+Y, Space, Key S, Delete, Left/Right Arrows)
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Catch Ctrl+Z / Cmd+Z (Undo / Redo)
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          handleRedo();
        } else {
          handleUndo();
        }
        return;
      }

      // Catch Ctrl+Y / Cmd+Y (Redo)
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        handleRedo();
        return;
      }

      // Don't intercept shortcuts if typing in text inputs or textareas
      const tag = document.activeElement?.tagName?.toLowerCase();
      if (tag === 'input' || tag === 'textarea') return;

      if (e.code === 'Space') {
        e.preventDefault();
        setIsPlaying(prev => !prev);
      } else if (e.code === 'KeyS' || e.code === 'KeyK') {
        e.preventDefault();
        handleSplitAtPlayhead();
      } else if (e.code === 'Delete' || e.code === 'Backspace') {
        e.preventDefault();
        handleDeleteSelected();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        const step = e.shiftKey ? 1.0 : 0.05;
        handleSetCurrentTime(Math.max(0, currentTime - step));
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        const step = e.shiftKey ? 1.0 : 0.05;
        handleSetCurrentTime(Math.min(duration, currentTime + step));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentTime, duration, selectedSubId, subtitles, historyIndex, history]);

  // Sync playback speed, muted state & volume level to video element
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = playbackSpeed;
      videoRef.current.muted = isMuted;
      videoRef.current.volume = Math.min(1, Math.max(0, volumeLevel));
    }
  }, [playbackSpeed, isMuted, volumeLevel]);

  // Frame-accurate playhead tracking loop
  useEffect(() => {
    const updatePlayhead = () => {
      if (videoRef.current && !videoRef.current.paused) {
        setCurrentTime(videoRef.current.currentTime);
        animFrameRef.current = requestAnimationFrame(updatePlayhead);
      }
    };

    if (isPlaying) {
      if (videoRef.current) {
        videoRef.current.play().catch(() => {});
      }
      animFrameRef.current = requestAnimationFrame(updatePlayhead);
    } else {
      if (videoRef.current) {
        videoRef.current.pause();
      }
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    }

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [isPlaying]);

  // Sync video HTML currentTime when user scrubs timeline
  const handleSetCurrentTime = (newTime) => {
    setCurrentTime(newTime);
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
    }
  };

  // Video File Upload Handler
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      setVideoSrc(fileUrl);
      setIsPlaying(false);
      setCurrentTime(0);
      setSubtitles([]);
      setSelectedSubId(null);
      
      // Auto-trigger speech transcription for newly uploaded video
      setTimeout(() => {
        handleTranscribeAudio(fileUrl, file.name);
      }, 500);
    }
  };

  // Convert Speech to Subtitles
  const handleTranscribeAudio = async (overrideUrl = null, name = 'uploaded_video.mp4') => {
    setIsTranscribing(true);
    try {
      const fileNameToUse = name || 'uploaded_video.mp4';
      const generated = await transcribeVideoAudio(videoRef.current, duration, fileNameToUse);
      setSubtitles(generated);
      if (generated.length > 0) {
        setSelectedSubId(generated[0].id);
      }
    } catch (err) {
      console.error("Transcription error:", err);
      setSubtitles(DEMO_SAMPLE_SUBTITLES);
    } finally {
      setIsTranscribing(false);
    }
  };

  // Add subtitle block at playhead
  const handleAddSubtitleAtPlayhead = () => {
    const start = parseFloat(currentTime.toFixed(2));
    const end = parseFloat((currentTime + 3.0).toFixed(2));
    const newSub = {
      id: `sub_${Date.now()}`,
      text: 'NEW SUBTITLE TEXT',
      start,
      end
    };
    setSubtitles(prev => [...prev, newSub]);
    setSelectedSubId(newSub.id);
  };

  // Split subtitle clip at playhead
  const handleSplitAtPlayhead = () => {
    if (!selectedSubId) return;
    const sub = subtitles.find(s => s.id === selectedSubId);
    if (!sub) return;

    if (currentTime > sub.start + 0.2 && currentTime < sub.end - 0.2) {
      const sub1 = { ...sub, end: parseFloat(currentTime.toFixed(2)) };
      const sub2 = {
        id: `sub_${Date.now()}`,
        text: sub.text,
        start: parseFloat(currentTime.toFixed(2)),
        end: sub.end
      };

      setSubtitles(prev => prev.map(s => s.id === sub.id ? sub1 : s).concat(sub2));
      setSelectedSubId(sub2.id);
    }
  };

  // Delete selected subtitle clip
  const handleDeleteSelected = () => {
    if (!selectedSubId) return;
    setSubtitles(prev => prev.filter(s => s.id !== selectedSubId));
    setSelectedSubId(null);
  };

  // AI Auto-Cut Silences & Jump-Cut Engine
  const handleRemoveSilence = () => {
    if (!subtitles || subtitles.length === 0) return;
    const sorted = [...subtitles].sort((a, b) => a.start - b.start);
    let cumulativeShift = 0;
    const packedSubtitles = [];

    sorted.forEach((sub, idx) => {
      if (idx === 0) {
        if (sub.start > 0.3) {
          cumulativeShift = sub.start - 0.2;
        }
        packedSubtitles.push({
          ...sub,
          start: parseFloat(Math.max(0, sub.start - cumulativeShift).toFixed(2)),
          end: parseFloat(Math.max(0.5, sub.end - cumulativeShift).toFixed(2))
        });
      } else {
        const prevEnd = packedSubtitles[idx - 1].end;
        const actualGap = sub.start - sorted[idx - 1].end;

        if (actualGap > 0.3) {
          cumulativeShift += (actualGap - 0.1);
        }

        const newStart = parseFloat(Math.max(prevEnd + 0.1, sub.start - cumulativeShift).toFixed(2));
        const subDuration = sub.end - sub.start;
        const newEnd = parseFloat((newStart + subDuration).toFixed(2));

        packedSubtitles.push({
          ...sub,
          start: newStart,
          end: newEnd
        });
      }
    });

    setSubtitles(packedSubtitles);
  };

  // AI Text-to-Speech (TTS) Voiceover Adder
  const handleAddTTSVoiceover = (text) => {
    const start = parseFloat(currentTime.toFixed(2));
    const end = parseFloat((currentTime + Math.max(2.5, text.length * 0.12)).toFixed(2));
    const newSub = {
      id: `sub_tts_${Date.now()}`,
      text: text.toUpperCase(),
      start,
      end
    };
    setSubtitles(prev => [...prev, newSub]);
    setSelectedSubId(newSub.id);
  };

  // Multi-Clip Image Overlay Handlers
  const handleAddOverlayImage = (newImg) => {
    setOverlayImages(prev => [...prev, newImg]);
    setSelectedImageId(newImg.id);
  };

  const handleUpdateOverlayImage = (id, updates) => {
    setOverlayImages(prev => prev.map(img => img.id === id ? { ...img, ...updates } : img));
  };

  const handleDeleteOverlayImage = (id) => {
    setOverlayImages(prev => prev.filter(img => img.id !== id));
    if (selectedImageId === id) setSelectedImageId(null);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: 'var(--bg-dark)', transition: 'background-color 0.3s ease' }}>
      
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept="video/*"
        style={{ display: 'none' }}
      />

      {/* Top Navbar */}
      <Navbar
        onUploadClick={() => fileInputRef.current?.click()}
        onRenderClick={() => setIsRenderModalOpen(true)}
        onTranscribeClick={() => handleTranscribeAudio()}
        isTranscribing={isTranscribing}
        onUndo={handleUndo}
        onRedo={handleRedo}
        canUndo={canUndo}
        canRedo={canRedo}
      />

      {/* Main Studio Workspace */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        {/* Video Player Canvas with live kinetic subtitles */}
        <VideoCanvas
          videoSrc={videoSrc}
          currentTime={currentTime}
          isPlaying={isPlaying}
          subtitles={subtitles}
          overlayImages={overlayImages}
          selectedImageId={selectedImageId}
          setSelectedImageId={setSelectedImageId}
          onUpdateOverlayImage={handleUpdateOverlayImage}
          onDeleteOverlayImage={handleDeleteOverlayImage}
          activeCaptionStyle={activeCaptionStyle}
          captionPosition={captionPosition}
          captionColor={captionColor}
          captionFont={captionFont}
          captionSize={captionSize}
          activeFilter={activeFilter}
          aspectRatio={aspectRatio}
          onVideoLoaded={(dur) => setDuration(dur)}
          videoRef={videoRef}
          onUploadClick={() => fileInputRef.current?.click()}
          onTranscribeClick={() => handleTranscribeAudio()}
          isTranscribing={isTranscribing}
          magicWordTimings={magicWordTimings}
          magicCaptionStyle={magicCaptionStyle}
        />

        {/* Right Side Studio Panel (Navigation Tabs + Active Panel) */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          width: '360px',
          flexShrink: 0,
          backgroundColor: '#12151a',
          borderLeft: '1px solid rgba(255, 255, 255, 0.08)',
          overflow: 'hidden'
        }}>
          {/* Filmora Navigation Header Tab Strip */}
          <Sidebar
            activeTab={activeTab}
            setActiveTab={(tab) => {
              if (tab === 'export') {
                setIsRenderModalOpen(true);
              } else {
                setActiveTab(tab);
              }
            }}
          />

          {/* Active Feature Panel */}
          <div style={{ flex: 1, overflow: 'hidden', display: 'flex' }}>
            {activeTab === 'subtitles' && (
              <SubtitleEditorPanel
                subtitles={subtitles}
                setSubtitles={setSubtitles}
                selectedSubId={selectedSubId}
                setSelectedSubId={setSelectedSubId}
                onTranscribeClick={() => handleTranscribeAudio()}
                isTranscribing={isTranscribing}
                activeCaptionStyle={activeCaptionStyle}
                setActiveCaptionStyle={setActiveCaptionStyle}
                captionPosition={captionPosition}
                setCaptionPosition={setCaptionPosition}
                captionColor={captionColor}
                setCaptionColor={setCaptionColor}
                captionFont={captionFont}
                setCaptionFont={setCaptionFont}
                captionSize={captionSize}
                setCaptionSize={setCaptionSize}
                onAddSubtitleAtPlayhead={handleAddSubtitleAtPlayhead}
                onRemoveSilence={handleRemoveSilence}
              />
            )}

            {activeTab === 'media' && (
              <MediaPanel
                aspectRatio={aspectRatio}
                currentTime={currentTime}
                overlayImages={overlayImages}
                selectedImageId={selectedImageId}
                setSelectedImageId={setSelectedImageId}
                onAddOverlayImage={handleAddOverlayImage}
                onUpdateOverlayImage={handleUpdateOverlayImage}
                onDeleteOverlayImage={handleDeleteOverlayImage}
                onUploadClick={() => fileInputRef.current?.click()}
              />
            )}

            {activeTab === 'audio' && (
              <AudioPanel
                onAddTTSVoiceover={handleAddTTSVoiceover}
                backgroundTrack={backgroundTrack}
                setBackgroundTrack={setBackgroundTrack}
                bgMusicVolume={bgMusicVolume}
                setBgMusicVolume={setBgMusicVolume}
              />
            )}

            {activeTab === 'magic' && (
              <MagicPanel
                onMagicComplete={(result) => {
                  setVideoSrc(result.outputUrl);
                  setDuration(result.totalDuration);
                  setMagicWordTimings(result.wordTimings || []);
                  setMagicCaptionStyle(result.captionStyle || 'magic-pop');
                  setCurrentTime(0);
                  setIsPlaying(false);
                }}
              />
            )}
          </div>
        </div>
      </div>

      {/* Control Bar right under canvas */}
      <PlaybackControls
        isPlaying={isPlaying}
        onPlayPauseToggle={() => setIsPlaying(!isPlaying)}
        currentTime={currentTime}
        setCurrentTime={handleSetCurrentTime}
        duration={duration}
        aspectRatio={aspectRatio}
        setAspectRatio={setAspectRatio}
        zoomLevel={zoomLevel}
        setZoomLevel={setZoomLevel}
        onSplitAtPlayhead={handleSplitAtPlayhead}
        onDeleteSelected={handleDeleteSelected}
        onRemoveSilence={handleRemoveSilence}
        selectedSubId={selectedSubId}
        playbackSpeed={playbackSpeed}
        setPlaybackSpeed={setPlaybackSpeed}
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        isMuted={isMuted}
        setIsMuted={setIsMuted}
        volumeLevel={volumeLevel}
        setVolumeLevel={setVolumeLevel}
        onUndo={handleUndo}
        onRedo={handleRedo}
        canUndo={canUndo}
        canRedo={canRedo}
      />

      {/* Downside Multi-Track Timeline */}
      <Timeline
        duration={duration}
        currentTime={currentTime}
        setCurrentTime={handleSetCurrentTime}
        subtitles={subtitles}
        setSubtitles={setSubtitles}
        selectedSubId={selectedSubId}
        setSelectedSubId={setSelectedSubId}
        zoomLevel={zoomLevel}
        isPlaying={isPlaying}
        backgroundTrack={backgroundTrack}
        overlayImages={overlayImages}
        selectedImageId={selectedImageId}
        setSelectedImageId={setSelectedImageId}
        onUpdateOverlayImage={handleUpdateOverlayImage}
      />

      {/* Render & Export Modal */}
      <RenderModal
        isOpen={isRenderModalOpen}
        onClose={() => setIsRenderModalOpen(false)}
        subtitles={subtitles}
        videoSrc={videoSrc}
      />

    </div>
  );
}
