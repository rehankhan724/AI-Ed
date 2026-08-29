import React from 'react';
import {
  LayoutGrid,
  MousePointer2,
  Undo,
  Redo,
  Trash2,
  Scissors,
  Type,
  Square,
  Video,
  Aperture,
  ChevronsRight,
  Zap,
  Sliders,
  SkipBack,
  Play,
  Pause,
  SkipForward,
  Volume2,
  Volume1,
  VolumeX,
  ZoomOut,
  ZoomIn
} from 'lucide-react';
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
  onRemoveSilence,
  onUndo,
  onRedo,
  canUndo = false,
  canRedo = false
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
      padding: '0 16px',
      color: '#f8fafc',
      fontSize: '12px',
      zIndex: 25
    }}>
      {/* Left section: Filmora Professional Icon Toolbar Strip */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
        {/* Layout Grid */}
        <button
          className="btn-interactive"
          style={{ padding: '6px', borderRadius: '6px', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
          title="Layout Grid View"
        >
          <LayoutGrid size={16} />
        </button>

        {/* Select Pointer */}
        <button
          className="btn-interactive"
          style={{ padding: '6px', borderRadius: '6px', backgroundColor: 'rgba(0, 210, 148, 0.12)', border: 'none', color: '#00d294', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
          title="Selection Pointer Tool"
        >
          <MousePointer2 size={16} />
        </button>

        {/* Divider */}
        <div style={{ width: '1px', height: '16px', backgroundColor: 'rgba(255, 255, 255, 0.15)', margin: '0 5px' }} />

        {/* Undo */}
        <button
          onClick={onUndo}
          disabled={!canUndo}
          className="btn-interactive"
          style={{
            padding: '6px',
            borderRadius: '6px',
            background: 'none',
            border: 'none',
            color: canUndo ? '#f8fafc' : '#475569',
            cursor: canUndo ? 'pointer' : 'not-allowed',
            opacity: canUndo ? 1 : 0.4,
            display: 'flex',
            alignItems: 'center'
          }}
          title="Undo Action (Ctrl+Z)"
        >
          <Undo size={16} />
        </button>

        {/* Redo */}
        <button
          onClick={onRedo}
          disabled={!canRedo}
          className="btn-interactive"
          style={{
            padding: '6px',
            borderRadius: '6px',
            background: 'none',
            border: 'none',
            color: canRedo ? '#f8fafc' : '#475569',
            cursor: canRedo ? 'pointer' : 'not-allowed',
            opacity: canRedo ? 1 : 0.4,
            display: 'flex',
            alignItems: 'center'
          }}
          title="Redo Action (Ctrl+Y)"
        >
          <Redo size={16} />
        </button>

        {/* Delete */}
        <button
          onClick={onDeleteSelected}
          disabled={!selectedSubId}
          className="btn-interactive"
          style={{
            padding: '6px',
            borderRadius: '6px',
            backgroundColor: selectedSubId ? 'rgba(255, 77, 109, 0.18)' : 'transparent',
            border: 'none',
            color: selectedSubId ? '#ff4d6d' : '#475569',
            cursor: selectedSubId ? 'pointer' : 'not-allowed',
            opacity: selectedSubId ? 1 : 0.4,
            display: 'flex',
            alignItems: 'center'
          }}
          title="Delete Selected Clip (Shortcut: Delete)"
        >
          <Trash2 size={16} />
        </button>

        {/* Split */}
        <button
          onClick={onSplitAtPlayhead}
          className="btn-interactive"
          style={{
            padding: '6px',
            borderRadius: '6px',
            backgroundColor: 'rgba(244, 63, 94, 0.12)',
            border: '1px solid rgba(244, 63, 94, 0.25)',
            color: '#fb7185',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center'
          }}
          title="Split Clip at Playhead (Shortcut: S)"
        >
          <Scissors size={16} />
        </button>

        {/* Text */}
        <button
          className="btn-interactive"
          style={{ padding: '6px', borderRadius: '6px', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
          title="Add Text & Subtitle"
        >
          <Type size={16} />
        </button>

        {/* Shape / Mask */}
        <button
          className="btn-interactive"
          style={{ padding: '6px', borderRadius: '6px', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
          title="Crop & Shape Masking"
        >
          <Square size={16} />
        </button>

        {/* Video Tool */}
        <button
          className="btn-interactive"
          style={{ padding: '6px', borderRadius: '6px', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
          title="Video Segment Controls"
        >
          <Video size={16} />
        </button>

        {/* Aperture / Visual Effects */}
        <button
          className="btn-interactive"
          style={{ padding: '6px', borderRadius: '6px', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
          title="Aperture & Motion Effects"
        >
          <Aperture size={16} />
        </button>

        {/* Chevrons Right (More Tools) */}
        <button
          className="btn-interactive"
          style={{ padding: '6px', borderRadius: '6px', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
          title="Expand Toolbar Tools"
        >
          <ChevronsRight size={16} />
        </button>

        {/* Cut Silences Icon Button */}
        <button
          onClick={onRemoveSilence}
          className="btn-interactive"
          style={{
            padding: '6px 8px',
            borderRadius: '6px',
            backgroundColor: 'rgba(234, 179, 8, 0.14)',
            border: '1px solid rgba(234, 179, 8, 0.35)',
            color: '#eab308',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
          title="Auto Cut Dead Silence & Jump-Cuts"
        >
          <Zap size={15} style={{ fill: '#eab308' }} />
        </button>

        {/* Video Filter Preset dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', borderLeft: '1px solid rgba(255, 255, 255, 0.12)', paddingLeft: '8px', marginLeft: '4px' }}>
          <Sliders size={13} style={{ color: '#94a3b8' }} />
          <select
            value={activeFilter}
            onChange={(e) => setActiveFilter(e.target.value)}
            style={{
              backgroundColor: '#1b2028',
              color: '#00d294',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '6px',
              padding: '4px 8px',
              fontSize: '11px',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            <option value="normal">Normal</option>
            <option value="cinematic">Cinematic Teal</option>
            <option value="cyberpunk">Cyberpunk Neon</option>
            <option value="vintage">Vintage Film</option>
            <option value="bw">Black & White</option>
            <option value="vibrant">Vibrant Colors</option>
          </select>
        </div>
      </div>

      {/* Center section: Frame Navigation, Play/Pause & Timecode counter */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button
          onClick={handleStepBack}
          style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}
          title="Step 1 Frame Back (Left Arrow)"
        >
          <SkipBack size={16} />
        </button>

        {/* Filmora Signature Emerald Teal Play/Pause Button */}
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
          fontSize: '12.5px',
          fontWeight: '800',
          color: '#00d294',
          letterSpacing: '0.8px',
          backgroundColor: '#111418',
          padding: '4px 10px',
          borderRadius: '6px',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          {formatTimecode(currentTime)} / {formatTimecode(duration || 0)}
        </div>
      </div>

      {/* Right section: Speed, Aspect Ratio, Volume & Zoom */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Playback Speed selector */}
        <select
          value={playbackSpeed}
          onChange={(e) => setPlaybackSpeed(parseFloat(e.target.value))}
          style={{
            backgroundColor: '#1b2028',
            color: '#f8fafc',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '6px',
            padding: '4px 6px',
            fontSize: '11px',
            fontWeight: '700',
            cursor: 'pointer'
          }}
        >
          <option value="0.5">0.5x</option>
          <option value="1.0">1.0x</option>
          <option value="1.5">1.5x</option>
          <option value="2.0">2.0x</option>
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
            padding: '4px 6px',
            fontSize: '11px',
            fontWeight: '700',
            cursor: 'pointer'
          }}
        >
          <option value="16:9">16:9</option>
          <option value="9:16">9:16</option>
          <option value="1:1">1:1</option>
          <option value="4:5">4:5</option>
        </select>

        {/* Volume Control */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
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
            style={{ width: '55px' }}
            title={`Volume: ${currentVolPercent}%`}
          />
          <span style={{ fontSize: '10px', color: '#94a3b8', width: '26px' }}>{currentVolPercent}%</span>
        </div>

        {/* Timeline Zoom Slider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', borderLeft: '1px solid rgba(255, 255, 255, 0.08)', paddingLeft: '10px' }}>
          <ZoomOut size={13} style={{ color: '#94a3b8' }} />
          <input
            type="range"
            min="50"
            max="200"
            value={zoomLevel}
            onChange={(e) => setZoomLevel(Number(e.target.value))}
            style={{ width: '55px' }}
            title={`Timeline Zoom: ${zoomLevel}%`}
          />
          <ZoomIn size={13} style={{ color: '#94a3b8' }} />
        </div>
      </div>
    </div>
  );
}
