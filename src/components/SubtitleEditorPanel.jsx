import React from 'react';
import { Sparkles, Plus, Trash2, Edit3, Type, Palette } from 'lucide-react';

export default function SubtitleEditorPanel({
  subtitles,
  setSubtitles,
  selectedSubId,
  setSelectedSubId,
  onTranscribeClick,
  isTranscribing,
  activeCaptionStyle,
  setActiveCaptionStyle,
  captionPosition,
  setCaptionPosition,
  captionColor,
  setCaptionColor,
  captionFont = 'Montserrat',
  setCaptionFont,
  captionSize,
  setCaptionSize,
  currentTime,
  onAddSubtitleAtPlayhead
}) {
  const selectedSub = subtitles.find(s => s.id === selectedSubId);

  const handleTextChange = (text) => {
    if (!selectedSubId) return;
    setSubtitles(prev => prev.map(sub => sub.id === selectedSubId ? { ...sub, text } : sub));
  };

  const highlightColors = [
    { name: 'Neon Yellow', hex: '#facc15' },
    { name: 'Electric Cyan', hex: '#06b6d4' },
    { name: 'Hot Pink', hex: '#ec4899' },
    { name: 'Emerald', hex: '#10b981' },
    { name: 'Violet', hex: '#a855f7' },
    { name: 'White', hex: '#ffffff' }
  ];

  const fonts = [
    { id: 'Montserrat', name: 'Montserrat (Bold)' },
    { id: 'Bebas Neue', name: 'Bebas Neue (Punchy)' },
    { id: 'Outfit', name: 'Outfit (Modern)' },
    { id: 'Inter', name: 'Inter (Clean)' },
    { id: 'Space Grotesk', name: 'Space Grotesk' }
  ];

  return (
    <div style={{
      width: '290px',
      backgroundColor: '#0a0e1a',
      borderRight: '1px solid #1e293b',
      display: 'flex',
      flexDirection: 'column',
      color: '#f8fafc',
      fontSize: '13px',
      zIndex: 15
    }}>
      {/* Panel Header */}
      <div style={{
        padding: '14px 16px',
        borderBottom: '1px solid #1e293b',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#0c1120'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '800' }}>
          <Sparkles size={16} style={{ color: '#8b5cf6' }} />
          <span>AI Subtitles & Styling</span>
        </div>
      </div>

      <div style={{ padding: '16px', flex: 1, overflowY: 'auto' }}>
        
        {/* Audio to Text Converter CTA */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(59, 130, 246, 0.15) 100%)',
          border: '1px solid rgba(139, 92, 246, 0.3)',
          borderRadius: '10px',
          padding: '14px',
          marginBottom: '18px'
        }}>
          <h4 style={{ fontSize: '13px', fontWeight: '800', marginBottom: '4px', color: '#a855f7', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={14} /> Convert Audio to Subtitles
          </h4>
          <p style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '12px', lineHeight: '1.4' }}>
            Extract speech spoken in video into frame-synced caption blocks.
          </p>
          <button
            onClick={onTranscribeClick}
            disabled={isTranscribing}
            style={{
              width: '100%',
              background: isTranscribing ? '#334155' : 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
              color: '#fff',
              border: 'none',
              borderRadius: '7px',
              padding: '9px 12px',
              fontWeight: '700',
              fontSize: '12px',
              cursor: isTranscribing ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              boxShadow: '0 4px 14px rgba(139, 92, 246, 0.4)'
            }}
          >
            <Sparkles size={14} className={isTranscribing ? 'animate-spin' : ''} />
            {isTranscribing ? 'Extracting Speech...' : 'Extract AI Subtitles'}
          </button>
        </div>

        {/* Caption Style Presets */}
        <div style={{ marginBottom: '18px' }}>
          <label style={{ fontSize: '11px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Viral Preset Styles
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '8px' }}>
            {[
              { id: 'hormozi', name: '🔥 Hormozi Pop' },
              { id: 'box', name: '📦 Dark Box' },
              { id: 'neon', name: '⚡ Neon Cyber' },
              { id: 'karaoke', name: '🎤 Glass Karaoke' },
              { id: 'classic', name: '📝 Classic Sub' }
            ].map(style => (
              <button
                key={style.id}
                onClick={() => setActiveCaptionStyle(style.id)}
                style={{
                  padding: '9px 6px',
                  borderRadius: '7px',
                  backgroundColor: activeCaptionStyle === style.id ? '#1e293b' : '#0d1220',
                  border: activeCaptionStyle === style.id ? '1px solid #38bdf8' : '1px solid #1e293b',
                  color: activeCaptionStyle === style.id ? '#38bdf8' : '#cbd5e1',
                  fontSize: '11px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all 0.15s ease'
                }}
              >
                {style.name}
              </button>
            ))}
          </div>
        </div>

        {/* Typography & Font Picker */}
        <div style={{ marginBottom: '18px' }}>
          <label style={{ fontSize: '11px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Type size={12} /> Font Family
          </label>
          <select
            value={captionFont}
            onChange={(e) => setCaptionFont && setCaptionFont(e.target.value)}
            style={{
              width: '100%',
              backgroundColor: '#0d1220',
              color: '#38bdf8',
              border: '1px solid #1e293b',
              borderRadius: '6px',
              padding: '6px 10px',
              fontSize: '12px',
              fontWeight: '700',
              marginTop: '6px',
              cursor: 'pointer'
            }}
          >
            {fonts.map(f => (
              <option key={f.id} value={f.id}>{f.name}</option>
            ))}
          </select>
        </div>

        {/* Custom Word Highlight Color */}
        <div style={{ marginBottom: '18px' }}>
          <label style={{ fontSize: '11px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Palette size={12} /> Active Word Highlight
          </label>
          <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
            {highlightColors.map(c => (
              <button
                key={c.hex}
                onClick={() => setCaptionColor(c.hex)}
                style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  backgroundColor: c.hex,
                  border: captionColor === c.hex ? '2px solid #ffffff' : '1px solid rgba(255,255,255,0.2)',
                  boxShadow: captionColor === c.hex ? `0 0 10px ${c.hex}` : 'none',
                  cursor: 'pointer',
                  transform: captionColor === c.hex ? 'scale(1.15)' : 'scale(1)',
                  transition: 'all 0.15s ease'
                }}
                title={c.name}
              />
            ))}
          </div>
        </div>

        {/* Position & Size Adjuster */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ fontSize: '11px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Overlay Position & Scale
          </label>
          <div style={{ display: 'flex', gap: '6px', marginTop: '8px', marginBottom: '10px' }}>
            {['top', 'center', 'bottom'].map(pos => (
              <button
                key={pos}
                onClick={() => setCaptionPosition(pos)}
                style={{
                  flex: 1,
                  padding: '6px',
                  borderRadius: '6px',
                  backgroundColor: captionPosition === pos ? '#1e293b' : '#0d1220',
                  border: captionPosition === pos ? '1px solid #38bdf8' : '1px solid #1e293b',
                  color: captionPosition === pos ? '#38bdf8' : '#94a3b8',
                  fontSize: '11px',
                  fontWeight: '700',
                  textTransform: 'capitalize',
                  cursor: 'pointer'
                }}
              >
                {pos}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px', color: '#94a3b8' }}>
            <span>Font Size: {captionSize || 26}px</span>
            <input
              type="range"
              min="18"
              max="48"
              value={captionSize || 26}
              onChange={(e) => setCaptionSize(Number(e.target.value))}
              style={{ width: '120px', cursor: 'pointer', accentColor: '#38bdf8' }}
            />
          </div>
        </div>

        {/* Selected Subtitle Clip Text Editor */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <label style={{ fontSize: '11px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Edit Subtitle Clip
            </label>
            <button
              onClick={onAddSubtitleAtPlayhead}
              style={{
                backgroundColor: '#1e293b',
                border: '1px solid #334155',
                color: '#38bdf8',
                padding: '3px 8px',
                borderRadius: '5px',
                fontSize: '10px',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '3px'
              }}
            >
              <Plus size={12} /> Add Clip
            </button>
          </div>

          {selectedSub ? (
            <div style={{ backgroundColor: '#0d1220', padding: '10px', borderRadius: '8px', border: '1px solid #1e293b' }}>
              <textarea
                value={selectedSub.text}
                onChange={(e) => handleTextChange(e.target.value)}
                style={{
                  width: '100%',
                  height: '65px',
                  backgroundColor: '#070a13',
                  border: '1px solid #334155',
                  borderRadius: '6px',
                  color: '#fff',
                  padding: '8px',
                  fontSize: '12px',
                  fontFamily: 'inherit',
                  resize: 'none',
                  outline: 'none',
                  fontWeight: '600'
                }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '11px', color: '#64748b' }}>
                <span>Start: <strong style={{ color: '#38bdf8' }}>{selectedSub.start}s</strong></span>
                <span>End: <strong style={{ color: '#38bdf8' }}>{selectedSub.end}s</strong></span>
              </div>
            </div>
          ) : (
            <div style={{
              backgroundColor: '#0d1220',
              padding: '14px',
              borderRadius: '8px',
              border: '1px border-dashed #1e293b',
              textAlign: 'center',
              color: '#64748b',
              fontSize: '11px'
            }}>
              Click any subtitle block on the timeline to edit text.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
