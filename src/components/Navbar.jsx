import React from 'react';
import { Video, Download, RotateCcw, RotateCw, Sparkles, Upload, FileText } from 'lucide-react';

export default function Navbar({
  onUploadClick,
  onRenderClick,
  onTranscribeClick,
  isTranscribing,
  currentFileName,
  onUndo,
  onRedo,
  canUndo,
  canRedo
}) {
  return (
    <header style={{
      height: '52px',
      backgroundColor: '#0c101d',
      borderBottom: '1px solid #1e293b',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 16px',
      color: '#fff',
      zIndex: 30
    }}>
      {/* Left section: Logo & Project Badge */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: '8px',
          background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: '900',
          fontSize: '16px',
          boxShadow: '0 0 12px rgba(59, 130, 246, 0.4)'
        }}>
          AI
        </div>
        <span style={{ fontWeight: '800', fontSize: '18px', letterSpacing: '-0.5px' }}>
          Ai-Editor <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '500' }}>Studio</span>
        </span>
        <div style={{
          backgroundColor: '#1e293b',
          padding: '2px 8px',
          borderRadius: '12px',
          fontSize: '11px',
          color: '#38bdf8',
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#38bdf8' }}></span>
          {currentFileName || 'RVE Editor'}
        </div>
      </div>

      {/* Middle section: Action status / Transcribe AI Trigger */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button
          onClick={onTranscribeClick}
          disabled={isTranscribing}
          style={{
            background: isTranscribing ? '#334155' : 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
            border: 'none',
            color: '#fff',
            padding: '7px 14px',
            borderRadius: '6px',
            fontWeight: '600',
            fontSize: '13px',
            cursor: isTranscribing ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)',
            transition: 'all 0.2s ease'
          }}
          title="Convert audio/speech in video directly to timeline subtitles"
        >
          <Sparkles size={16} className={isTranscribing ? 'animate-spin' : ''} />
          {isTranscribing ? 'Converting Audio to Text...' : 'Convert Audio to Subtitles'}
        </button>

        <button
          onClick={onUploadClick}
          style={{
            backgroundColor: '#1e293b',
            border: '1px solid #334155',
            color: '#e2e8f0',
            padding: '7px 12px',
            borderRadius: '6px',
            fontSize: '13px',
            fontWeight: '500',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <Upload size={14} />
          Upload Video
        </button>
      </div>

      {/* Right section: Render / Export */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{ display: 'flex', gap: '4px', borderRight: '1px solid #334155', paddingRight: '10px' }}>
          <button
            onClick={onUndo}
            disabled={!canUndo}
            style={{
              background: 'none',
              border: 'none',
              color: canUndo ? '#38bdf8' : '#475569',
              padding: '6px',
              cursor: canUndo ? 'pointer' : 'not-allowed',
              opacity: canUndo ? 1 : 0.4,
              transition: 'all 0.15s ease'
            }}
            title="Undo Step (Ctrl+Z)"
          >
            <RotateCcw size={16} />
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo}
            style={{
              background: 'none',
              border: 'none',
              color: canRedo ? '#38bdf8' : '#475569',
              padding: '6px',
              cursor: canRedo ? 'pointer' : 'not-allowed',
              opacity: canRedo ? 1 : 0.4,
              transition: 'all 0.15s ease'
            }}
            title="Redo Step (Ctrl+Y)"
          >
            <RotateCw size={16} />
          </button>
        </div>

        <button
          onClick={onRenderClick}
          style={{
            backgroundColor: '#3b82f6',
            border: 'none',
            color: '#fff',
            padding: '7px 16px',
            borderRadius: '6px',
            fontWeight: '600',
            fontSize: '13px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 2px 10px rgba(59, 130, 246, 0.4)'
          }}
        >
          <Download size={14} />
          Render Video
        </button>
      </div>
    </header>
  );
}
