import React from 'react';
import { Download, RotateCcw, RotateCw, Sparkles, Upload, Video } from 'lucide-react';

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
      backgroundColor: '#161a20',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 18px',
      color: '#ffffff',
      zIndex: 40
    }}>
      {/* Left section: Filmora Logo, Title & Active File Tag */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: '8px',
          background: 'linear-gradient(135deg, #00d294 0%, #00b37e 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: '900',
          fontSize: '14px',
          color: '#08121a',
          boxShadow: '0 2px 10px rgba(0, 210, 148, 0.4)',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          <Video size={18} style={{ color: '#08121a' }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              fontWeight: '800',
              fontSize: '16px',
              letterSpacing: '-0.3px',
              color: '#ffffff'
            }}>
              AI Editor
            </span>
            <span style={{
              fontSize: '9.5px',
              fontWeight: '800',
              padding: '2px 7px',
              borderRadius: '4px',
              background: 'rgba(0, 210, 148, 0.16)',
              color: '#00d294',
              border: '1px solid rgba(0, 210, 148, 0.3)',
              letterSpacing: '0.5px'
            }}>
              PRO
            </span>
          </div>
        </div>

        <div style={{
          height: '18px',
          width: '1px',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          margin: '0 4px'
        }} />

        {/* Current Active File Tag */}
        <div style={{
          backgroundColor: '#202630',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '4px 10px',
          borderRadius: '6px',
          fontSize: '11px',
          color: '#00d294',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontWeight: '700'
        }}>
          <span className="live-pulse-dot" style={{ backgroundColor: '#ff4d6d' }} />
          <span style={{ maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {currentFileName || 'Project Media'}
          </span>
        </div>
      </div>

      {/* Middle section: Transcribe AI & Upload Media */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <button
          onClick={onTranscribeClick}
          disabled={isTranscribing}
          className="btn-interactive"
          style={{
            background: isTranscribing 
              ? 'rgba(35, 42, 54, 0.8)' 
              : 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
            border: isTranscribing ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(255, 255, 255, 0.2)',
            color: '#fff',
            padding: '6px 15px',
            borderRadius: '6px',
            fontWeight: '700',
            fontSize: '12px',
            cursor: isTranscribing ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '7px',
            boxShadow: isTranscribing ? 'none' : '0 3px 12px rgba(59, 130, 246, 0.35)',
            letterSpacing: '0.2px'
          }}
          title="Convert audio speech in video to timeline subtitles automatically"
        >
          <Sparkles size={14} className={isTranscribing ? 'animate-spin' : ''} style={{ color: '#00d294' }} />
          <span>{isTranscribing ? 'Extracting Speech...' : 'Convert Audio to Subtitles'}</span>
        </button>

        <button
          onClick={onUploadClick}
          className="btn-interactive"
          style={{
            backgroundColor: '#202630',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: '#f1f5f9',
            padding: '6px 14px',
            borderRadius: '6px',
            fontSize: '12px',
            fontWeight: '700',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <Upload size={14} style={{ color: '#00d294' }} />
          <span>Import Media</span>
        </button>
      </div>

      {/* Right section: History Undo/Redo & Filmora Teal Export Button */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {/* History Undo / Redo Group */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center',
          gap: '2px', 
          backgroundColor: '#202630',
          padding: '3px',
          borderRadius: '6px',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <button
            onClick={onUndo}
            disabled={!canUndo}
            style={{
              background: 'none',
              border: 'none',
              color: canUndo ? '#00d294' : '#64748b',
              padding: '4px 7px',
              borderRadius: '4px',
              cursor: canUndo ? 'pointer' : 'not-allowed',
              opacity: canUndo ? 1 : 0.4,
              transition: 'all 0.15s ease',
              display: 'flex',
              alignItems: 'center'
            }}
            title="Undo (Ctrl+Z)"
          >
            <RotateCcw size={14} />
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo}
            style={{
              background: 'none',
              border: 'none',
              color: canRedo ? '#00d294' : '#64748b',
              padding: '4px 7px',
              borderRadius: '4px',
              cursor: canRedo ? 'pointer' : 'not-allowed',
              opacity: canRedo ? 1 : 0.4,
              transition: 'all 0.15s ease',
              display: 'flex',
              alignItems: 'center'
            }}
            title="Redo (Ctrl+Y)"
          >
            <RotateCw size={14} />
          </button>
        </div>

        {/* Filmora Signature Teal Export Button */}
        <button
          onClick={onRenderClick}
          className="btn-interactive"
          style={{
            background: 'linear-gradient(135deg, #00d294 0%, #00b37e 100%)',
            border: 'none',
            color: '#08121a',
            padding: '7px 18px',
            borderRadius: '18px',
            fontWeight: '800',
            fontSize: '12.5px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 3px 14px rgba(0, 210, 148, 0.45)'
          }}
        >
          <Download size={15} style={{ color: '#08121a' }} />
          <span>Export</span>
        </button>
      </div>
    </header>
  );
}
