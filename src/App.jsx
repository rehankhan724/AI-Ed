import React, { useState, useRef, useEffect } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import VideoCanvas from './components/VideoCanvas';
import PlaybackControls from './components/PlaybackControls';
import Timeline from './components/Timeline';
import SubtitleEditorPanel from './components/SubtitleEditorPanel';
import RenderModal from './components/RenderModal';
import { transcribeVideoAudio, DEMO_SAMPLE_SUBTITLES } from './services/transcriptionService';

export default function App() {
  // Video & Playback state
  const [videoSrc, setVideoSrc] = useState(null);
  const [currentFileName, setCurrentFileName] = useState('sample_video.mp4');
  const [duration, setDuration] = useState(15);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [activeFilter, setActiveFilter] = useState('normal');
  const [isMuted, setIsMuted] = useState(false);
  const [volumeLevel, setVolumeLevel] = useState(1.0);

  // Subtitle & Style state
  const [subtitles, setSubtitles] = useState([]);
  const [selectedSubId, setSelectedSubId] = useState(null);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [activeCaptionStyle, setActiveCaptionStyle] = useState('hormozi');
  const [captionPosition, setCaptionPosition] = useState('center');
  const [captionColor, setCaptionColor] = useState('');
  const [captionSize, setCaptionSize] = useState(26);

  // Studio UI state
  const [activeTab, setActiveTab] = useState('subtitles');
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [zoomLevel, setZoomLevel] = useState(100);
  const [isRenderModalOpen, setIsRenderModalOpen] = useState(false);

  // Refs
  const videoRef = useRef(null);
  const fileInputRef = useRef(null);
  const animFrameRef = useRef(null);

  // Load online stock video as default lightweight media
  useEffect(() => {
    const sampleUrl = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4';
    setVideoSrc(sampleUrl);
    setSubtitles(DEMO_SAMPLE_SUBTITLES);
    if (DEMO_SAMPLE_SUBTITLES.length > 0) {
      setSelectedSubId(DEMO_SAMPLE_SUBTITLES[0].id);
    }
  }, []);

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
      setCurrentFileName(file.name);
      setIsPlaying(false);
      setCurrentTime(0);
      
      // Auto-trigger speech transcription for newly uploaded video
      setTimeout(() => {
        handleTranscribeAudio(fileUrl, file.name);
      }, 500);
    }
  };

  // Convert Speech to Subtitles
  const handleTranscribeAudio = async (overrideUrl = null, name = null) => {
    setIsTranscribing(true);
    try {
      const fileNameToUse = name || currentFileName;
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#070a13' }}>
      
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
        currentFileName={currentFileName}
      />

      {/* Main Studio Area */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onTranscribeClick={() => handleTranscribeAudio()}
        />

        {/* Subtitle & Caption Styling Panel */}
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
            captionSize={captionSize}
            setCaptionSize={setCaptionSize}
            currentTime={currentTime}
            onAddSubtitleAtPlayhead={handleAddSubtitleAtPlayhead}
          />
        )}

        {/* Video Player Canvas with live kinetic subtitles */}
        <VideoCanvas
          videoSrc={videoSrc}
          currentTime={currentTime}
          isPlaying={isPlaying}
          subtitles={subtitles}
          activeCaptionStyle={activeCaptionStyle}
          captionPosition={captionPosition}
          captionColor={captionColor}
          captionSize={captionSize}
          activeFilter={activeFilter}
          aspectRatio={aspectRatio}
          onVideoLoaded={(dur) => setDuration(dur)}
          videoRef={videoRef}
          onUploadClick={() => fileInputRef.current?.click()}
          onTranscribeClick={() => handleTranscribeAudio()}
          isTranscribing={isTranscribing}
        />
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
        selectedSubId={selectedSubId}
        playbackSpeed={playbackSpeed}
        setPlaybackSpeed={setPlaybackSpeed}
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        isMuted={isMuted}
        setIsMuted={setIsMuted}
        volumeLevel={volumeLevel}
        setVolumeLevel={setVolumeLevel}
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
