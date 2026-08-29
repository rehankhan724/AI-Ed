import React from 'react';
import { Play, Pause, Scissors, Trash2, ZoomIn, ZoomOut, Volume2, Volume1, VolumeX, SkipBack, SkipForward, Sliders, Zap } from 'lucide-react';
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
  setIsMuted,
  volumeLevel = 1.0,
  setVolumeLevel,
  onRemoveSilence
}) {
  const handleStepBack = () => {
    setCurrentTime(Math.max(0, currentTime - 0.04));
  };

  const handleStepForward = () => {
    setCurrentTime(Math.min(duration, currentTime + 0.04));
  };

  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value);
    if (setVolumeLevel) {
      setVolumeLevel(val);
    }
    if (val === 0) {
      setIsMuted(true);
    } else if (isMuted) {
      setIsMuted(false);
    }
  };

  const renderVolumeIcon = () => {
    if (isMuted || volumeLevel === 0) {
      return <VolumeX size={15} style={{ color: '#ff4d6d' }} />;
    } else if (volumeLevel < 0.5) {
      return <Volume1 size={15} style={{ color: '#00d294' }} />;
    } else {
      return <Volume2 size={15} style={{ color: '#00d294' }} />;
    }
  };

  const currentVolPercent = isMuted ? 0 : Math.round(volumeLevel * 100);

  return (
    <div style={{
      height: '48px',
      backgroundColor: '#171b21',
      borderTop: '1px solid rgba(255, 255, 255, 0.08)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 18px',
      color: '#f8fafc',
      fontSize: '12px',
      zIndex: 25
    }}>
      {/* Left tools: Split, Delete, Video Filters & Cut Silences */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <button
          onClick={onSplitAtPlayhead}
          className="btn-interactive"
          style={{
            backgroundColor: '#202630',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            color: '#f8fafc',
            padding: '5px 12px',
            borderRadius: '6px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '11.5px',
            fontWeight: '700'
          }}
          title="Split clip at playhead position (Shortcut: S)"
        >
          <Scissors size={14} style={{ color: '#ff4d6d' }} />
          <span>Split</span>
        </button>

        <button
          onClick={onDeleteSelected}
          disabled={!selectedSubId}
          className="btn-interactive"
          style={{
            backgroundColor: selectedSubId ? 'rgba(255, 77, 109, 0.14)' : '#202630',
            border: selectedSubId ? '1px solid rgba(255, 77, 109, 0.4)' : '1px solid rgba(255, 255, 255, 0.08)',
            color: selectedSubId ? '#ff4d6d' : '#94a3b8',
            padding: '5px 12px',
            borderRadius: '6px',
            cursor: selectedSubId ? 'pointer' : 'not-allowed',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '11.5px',
            fontWeight: '700'
          }}
          title="Delete selected clip (Shortcut: Delete)"
        >
          <Trash2 size={14} />
          <span>Delete</span>
        </button>

        <button
          onClick={onRemoveSilence}
          className="btn-interactive"
          style={{
            backgroundColor: 'rgba(234, 179, 8, 0.12)',
            border: '1px solid rgba(234, 179, 8, 0.35)',
            color: '#eab308',
            padding: '5px 12px',
            borderRadius: '6px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            fontSize: '11.5px',
            fontWeight: '800'
          }}
          title="Auto cut dead silence & compress timeline into jump-cuts"
        >
          <Zap size={14} style={{ fill: '#eab308' }} />
          <span>Cut Silences</span>
        </button>

        {/* Video Filter Preset dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', borderLeft: '1px solid rgba(255, 255, 255, 0.08)', paddingLeft: '12px' }}>
          <Sliders size={13} style={{ color: '#94a3b8' }} />
          <select
            value={activeFilter}
            onChange={(e) => setActiveFilter(e.target.value)}
            style={{
              backgroundColor: '#1b2028',
              color: '#00d294',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '6px',
              padding: '4px 10px',
              fontSize: '11.5px',
              fontWeight: '700',
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
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <button
          onClick={handleStepBack}
          style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}
          title="Step 1 Frame Back (Left Arrow)"
        >
          <SkipBack size={16} />
        </button>

        {/* Filmora Signature Bright Emerald Teal Play/Pause Button */}
        <button
          onClick={onPlayPauseToggle}
          className="btn-interactive"
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #00d294 0%, #00b37e 100%)',
            color: '#08121a',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 3px 12px rgba(0, 210, 148, 0.45)'
          }}
          title={isPlaying ? 'Pause (Spacebar)' : 'Play (Spacebar)'}
        >
          {isPlaying ? <Pause size={17} style={{ color: '#08121a' }} /> : <Play size={17} style={{ marginLeft: '2px', color: '#08121a' }} />}
        </button>

        <button
          onClick={handleStepForward}
          style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}
          title="Step 1 Frame Forward (Right Arrow)"
        >
          <SkipForward size={16} />
        </button>

        <div style={{
          fontFamily: 'monospace',
          fontSize: '13px',
          fontWeight: '800',
          color: '#00d294',
          letterSpacing: '0.8px',
          backgroundColor: '#111418',
          padding: '4px 12px',
          borderRadius: '6px',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          {formatTimecode(currentTime)} / {formatTimecode(duration || 0)}
        </div>
      </div>

      {/* Right tools: Speed, Aspect Ratio, Volume & Zoom */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        {/* Playback Speed selector */}
        <select
          value={playbackSpeed}
          onChange={(e) => setPlaybackSpeed(parseFloat(e.target.value))}
          style={{
            backgroundColor: '#1b2028',
            color: '#f8fafc',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '6px',
            padding: '4px 8px',
            fontSize: '11px',
            fontWeight: '700',
            cursor: 'pointer'
          }}
        >
          <option value="0.5">0.5x Speed</option>
          <option value="1.0">1.0x Speed</option>
          <option value="1.5">1.5x Speed</option>
          <option value="2.0">2.0x Speed</option>
        </select>

        {/* Aspect Ratio selector */}
        <select
          value={aspectRatio}
          onChange={(e) => setAspectRatio(e.target.value)}
          style={{
            backgroundColor: '#1b2028',
            color: '#f8fafc',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '6px',
            padding: '4px 8px',
            fontSize: '11px',
            fontWeight: '700',
            cursor: 'pointer'
          }}
        >
          <option value="16:9">16:9 Landscape</option>
          <option value="9:16">9:16 Portrait (TikTok)</option>
          <option value="1:1">1:1 Square (Insta)</option>
          <option value="4:5">4:5 Feed</option>
        </select>

        {/* Volume Control */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button
            onClick={() => setIsMuted(!isMuted)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {renderVolumeIcon()}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={isMuted ? 0 : volumeLevel}
            onChange={handleVolumeChange}
            style={{ width: '60px' }}
            title={`Volume: ${currentVolPercent}%`}
          />
          <span style={{ fontSize: '10px', color: '#94a3b8', width: '28px' }}>{currentVolPercent}%</span>
        </div>

        {/* Timeline Zoom Slider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', borderLeft: '1px solid rgba(255, 255, 255, 0.08)', paddingLeft: '12px' }}>
          <ZoomOut size={13} style={{ color: '#94a3b8' }} />
          <input
            type="range"
            min="50"
            max="200"
            value={zoomLevel}
            onChange={(e) => setZoomLevel(Number(e.target.value))}
            style={{ width: '60px' }}
            title={`Timeline Zoom: ${zoomLevel}%`}
          />
          <ZoomIn size={13} style={{ color: '#94a3b8' }} />
        </div>
      </div>
    </div>
  );
}
