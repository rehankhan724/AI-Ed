import React from 'react';
import { Play, Pause, Scissors, Trash2, ZoomIn, ZoomOut, Volume2, VolumeX, SkipBack, SkipForward, Sliders, RotateCcw, RotateCw } from 'lucide-react';
import { formatTimecode } from '../services/transcriptionService';

export default function PlaybackControls({
  isPlaying,
  onPlayPauseToggle,
  currentTime,
  setCurrentTime,
  duration,
  aspectRatio,
  setAspectRatio,
  zoomLevel,
  setZoomLevel,
  onSplitAtPlayhead,
  onDeleteSelected,
  selectedSubId,
  playbackSpeed,
  setPlaybackSpeed,
  activeFilter,
  setActiveFilter,
  isMuted,
  setIsMuted
}) {
  // Step backward 1 frame (approx 0.04s for 25fps)
  const handleStepBack = () => {
    setCurrentTime(Math.max(0, currentTime - 0.04));
  };

  // Step forward 1 frame
  const handleStepForward = () => {
    setCurrentTime(Math.min(duration, currentTime + 0.04));
  };

  return (
    <div style={{
      height: '44px',
      backgroundColor: '#070a13',
      borderTop: '1px solid #1e293b',
      borderBottom: '1px solid #1e293b',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 16px',
      color: '#cbd5e1',
      fontSize: '12px',
      zIndex: 20
    }}>
      {/* Left tools: Split, Delete, Video Filters & Color Grading */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button
          onClick={onSplitAtPlayhead}
          style={{
            backgroundColor: '#1e293b',
            border: '1px solid #334155',
            color: '#f8fafc',
            padding: '4px 10px',
            borderRadius: '6px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            fontSize: '11px',
            fontWeight: '600'
          }}
          title="Split clip at playhead"
        >
          <Scissors size={14} style={{ color: '#38bdf8' }} />
          <span>Split</span>
        </button>

        <button
          onClick={onDeleteSelected}
          disabled={!selectedSubId}
          style={{
            backgroundColor: selectedSubId ? 'rgba(239, 68, 68, 0.15)' : '#1e293b',
            border: selectedSubId ? '1px solid rgba(239, 68, 68, 0.4)' : '1px solid #334155',
            color: selectedSubId ? '#ef4444' : '#475569',
            padding: '4px 10px',
            borderRadius: '6px',
            cursor: selectedSubId ? 'pointer' : 'not-allowed',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            fontSize: '11px',
            fontWeight: '600'
          }}
          title="Delete selected clip"
        >
          <Trash2 size={14} />
          <span>Delete</span>
        </button>

        {/* Video Filter Preset dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', borderLeft: '1px solid #1e293b', paddingLeft: '10px' }}>
          <Sliders size={13} style={{ color: '#94a3b8' }} />
          <select
            value={activeFilter}
            onChange={(e) => setActiveFilter(e.target.value)}
            style={{
              backgroundColor: '#1e293b',
              color: '#38bdf8',
              border: '1px solid #334155',
              borderRadius: '6px',
              padding: '3px 8px',
              fontSize: '11px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            <option value="normal">Filter: Normal</option>
            <option value="cinematic">Filter: Cinematic Teal</option>
            <option value="cyberpunk">Filter: Cyberpunk Neon</option>
            <option value="vintage">Filter: Vintage Film</option>
            <option value="bw">Filter: Black & White</option>
            <option value="vibrant">Filter: Vibrant Colors</option>
          </select>
        </div>
      </div>

      {/* Center tools: Frame Navigation, Play/Pause & Timecode counter */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button
          onClick={handleStepBack}
          style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
          title="Step 1 Frame Back"
        >
          <SkipBack size={15} />
        </button>

        <button
          onClick={onPlayPauseToggle}
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            backgroundColor: '#3b82f6',
            color: '#fff',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 0 12px rgba(59, 130, 246, 0.5)'
          }}
        >
          {isPlaying ? <Pause size={16} /> : <Play size={16} style={{ marginLeft: '2px' }} />}
        </button>

        <button
          onClick={handleStepForward}
          style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
          title="Step 1 Frame Forward"
        >
          <SkipForward size={15} />
        </button>

        <div style={{
          fontFamily: 'monospace',
          fontSize: '13px',
          fontWeight: '700',
          color: '#38bdf8',
          letterSpacing: '0.5px',
          backgroundColor: '#0d1220',
          padding: '3px 10px',
          borderRadius: '6px',
          border: '1px solid #1e293b'
        }}>
          {formatTimecode(currentTime)} <span style={{ color: '#475569' }}>/</span> {formatTimecode(duration)}
        </div>
      </div>

      {/* Right tools: Speed, Aspect Ratio, Mute, Zoom slider */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Speed Dropdown */}
        <select
          value={playbackSpeed}
          onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
          style={{
            backgroundColor: '#1e293b',
            color: '#cbd5e1',
            border: '1px solid #334155',
            borderRadius: '6px',
            padding: '3px 6px',
            fontSize: '11px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          <option value="0.5">0.5x Speed</option>
          <option value="1">1.0x Speed</option>
          <option value="1.25">1.25x Speed</option>
          <option value="1.5">1.5x Speed</option>
          <option value="2">2.0x Speed</option>
        </select>

        {/* Aspect Ratio */}
        <select
          value={aspectRatio}
          onChange={(e) => setAspectRatio(e.target.value)}
          style={{
            backgroundColor: '#1e293b',
            color: '#f8fafc',
            border: '1px solid #334155',
            borderRadius: '6px',
            padding: '3px 8px',
            fontSize: '11px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          <option value="16:9">16:9 Landscape</option>
          <option value="9:16">9:16 Shorts/Reels</option>
          <option value="1:1">1:1 Square</option>
          <option value="4:5">4:5 Portrait</option>
        </select>

        {/* Mute toggle */}
        <button
          onClick={() => setIsMuted(!isMuted)}
          style={{ background: 'none', border: 'none', color: isMuted ? '#ef4444' : '#94a3b8', cursor: 'pointer' }}
          title={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>

        {/* Zoom slider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <ZoomOut size={13} style={{ color: '#64748b' }} />
          <input
            type="range"
            min="50"
            max="200"
            value={zoomLevel}
            onChange={(e) => setZoomLevel(Number(e.target.value))}
            style={{ width: '70px', cursor: 'pointer' }}
          />
          <ZoomIn size={13} style={{ color: '#64748b' }} />
        </div>
      </div>
    </div>
  );
}
