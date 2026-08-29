import React from 'react';
import { Sparkles, Plus, Type, Palette, Zap } from 'lucide-react';

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
  onAddSubtitleAtPlayhead,
  onRemoveSilence
}) {
  const selectedSub = subtitles.find(s => s.id === selectedSubId);

  const handleTextChange = (text) => {
    if (!selectedSubId) return;
    setSubtitles(prev => prev.map(sub => sub.id === selectedSubId ? { ...sub, text } : sub));
  };

  const highlightColors = [
    { name: 'Emerald Teal', hex: '#00d294' },
    { name: 'Royal Blue', hex: '#3b82f6' },
    { name: 'Neon Yellow', hex: '#facc15' },
    { name: 'Coral Pink', hex: '#ff4d6d' },
    { name: 'Purple', hex: '#8b5cf6' },
    { name: 'Pure White', hex: '#ffffff' }
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
      width: '300px',
      backgroundColor: '#171b21',
      borderRight: '1px solid rgba(255, 255, 255, 0.08)',
      display: 'flex',
      flexDirection: 'column',
      color: '#f8fafc',
      fontSize: '13px',
      zIndex: 15
    }}>
      {/* Panel Header */}
      <div style={{
        padding: '16px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#1c2129'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '800', fontSize: '14px', letterSpacing: '-0.2px' }}>
          <Sparkles size={17} style={{ color: '#00d294' }} />
          <span>AI Titles & Styling</span>
        </div>
        <span style={{ fontSize: '10px', color: '#00d294', backgroundColor: 'rgba(0, 210, 148, 0.15)', padding: '2px 7px', borderRadius: '5px', fontWeight: '800' }}>
          PRO
        </span>
      </div>

      <div style={{ padding: '16px', flex: 1, overflowY: 'auto' }}>
        
        {/* Audio to Text Converter CTA Card */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(0, 210, 148, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)',
          border: '1px solid rgba(0, 210, 148, 0.3)',
          borderRadius: '10px',
          padding: '14px',
          marginBottom: '20px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.4)'
        }}>
          <h4 style={{ fontSize: '13px', fontWeight: '800', marginBottom: '4px', color: '#00d294', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={15} /> Audio Speech Extraction
          </h4>
          <p style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '12px', lineHeight: '1.45' }}>
            Transcribe speech in video to frame-synced kinetic subtitles.
          </p>
          <button
            onClick={onTranscribeClick}
            disabled={isTranscribing}
            className="btn-interactive"
            style={{
              width: '100%',
              background: isTranscribing ? 'rgba(255,255,255,0.1)' : 'linear-gradient(135deg, #00d294 0%, #00b37e 100%)',
              color: isTranscribing ? '#94a3b8' : '#08121a',
              border: 'none',
              borderRadius: '6px',
              padding: '9px 14px',
              fontWeight: '800',
              fontSize: '12.5px',
              cursor: isTranscribing ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '7px',
              boxShadow: isTranscribing ? 'none' : '0 3px 12px rgba(0, 210, 148, 0.35)'
            }}
          >
            <Sparkles size={15} className={isTranscribing ? 'animate-spin' : ''} />
            <span>{isTranscribing ? 'Extracting Speech...' : 'Extract AI Subtitles'}</span>
          </button>
          
          <button
            onClick={onRemoveSilence}
            className="btn-interactive"
            style={{
              width: '100%',
              marginTop: '8px',
              backgroundColor: '#202630',
              color: '#f8fafc',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '6px',
              padding: '8px 12px',
              fontWeight: '700',
              fontSize: '11.5px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <Zap size={14} style={{ color: '#eab308' }} />
            <span>Auto Cut Silences & Jump-Cuts</span>
          </button>
        </div>

        {/* Caption Style Presets */}
        <div style={{ marginBottom: '22px' }}>
          <h4 style={{ fontSize: '11px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '10px' }}>
            Viral Preset Styles
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            {[
              { id: 'hormozi', label: '🔥 Hormozi Pop' },
              { id: 'box', label: '🍱 Dark Box' },
              { id: 'neon', label: '⚡ Neon Cyber' },
              { id: 'karaoke', label: '🎤 Glass Karaoke' },
              { id: 'classic', label: '📝 Classic Sub' }
            ].map((style) => (
              <button
                key={style.id}
                onClick={() => setActiveCaptionStyle(style.id)}
                className="btn-interactive"
                style={{
                  padding: '8px 10px',
                  backgroundColor: activeCaptionStyle === style.id ? 'rgba(0, 210, 148, 0.16)' : '#202630',
                  border: activeCaptionStyle === style.id ? '1px solid #00d294' : '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '6px',
                  color: activeCaptionStyle === style.id ? '#00d294' : '#f8fafc',
                  fontSize: '11.5px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                {style.label}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Subtitle Clip Text Editor */}
        <div style={{ marginBottom: '22px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <h4 style={{ fontSize: '11px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
              Active Subtitle Text
            </h4>
            <button
              onClick={onAddSubtitleAtPlayhead}
              className="btn-interactive"
              style={{
                backgroundColor: 'rgba(0, 210, 148, 0.12)',
                border: '1px solid rgba(0, 210, 148, 0.3)',
                color: '#00d294',
                padding: '3px 8px',
                borderRadius: '4px',
                fontSize: '10.5px',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <Plus size={12} /> Add Clip
            </button>
          </div>

          {selectedSub ? (
            <textarea
              value={selectedSub.text}
              onChange={(e) => handleTextChange(e.target.value)}
              rows={3}
              style={{
                width: '100%',
                backgroundColor: '#1b2028',
                border: '1px solid #00d294',
                borderRadius: '8px',
                padding: '10px',
                color: '#fff',
                fontSize: '13px',
                fontWeight: '600',
                resize: 'none',
                outline: 'none',
                boxShadow: '0 0 10px rgba(0, 210, 148, 0.2)'
              }}
              placeholder="Enter subtitle text..."
            />
          ) : (
            <div style={{
              padding: '14px',
              backgroundColor: '#202630',
              border: '1px dashed rgba(255, 255, 255, 0.15)',
              borderRadius: '8px',
              color: '#94a3b8',
              fontSize: '11.5px',
              textAlign: 'center'
            }}>
              Click a subtitle block on the timeline to edit text & properties.
            </div>
          )}
        </div>

        {/* Font Family Selection */}
        <div style={{ marginBottom: '20px' }}>
          <h4 style={{ fontSize: '11px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Type size={13} /> Font Family
          </h4>
          <select
            value={captionFont}
            onChange={(e) => setCaptionFont(e.target.value)}
            style={{
              width: '100%',
              backgroundColor: '#202630',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '6px',
              padding: '8px 10px',
              color: '#fff',
              fontSize: '12px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            {fonts.map(f => (
              <option key={f.id} value={f.id} style={{ backgroundColor: '#171b21', color: '#fff' }}>
                {f.name}
              </option>
            ))}
          </select>
        </div>

        {/* Caption Highlight Color Picker */}
        <div style={{ marginBottom: '20px' }}>
          <h4 style={{ fontSize: '11px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Palette size={13} /> Highlight Color
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '6px' }}>
            {highlightColors.map((color) => (
              <button
                key={color.hex}
                onClick={() => setCaptionColor(color.hex)}
                style={{
                  height: '28px',
                  borderRadius: '6px',
                  backgroundColor: color.hex,
                  border: captionColor === color.hex ? '2px solid #ffffff' : '1px solid rgba(0, 0, 0, 0.2)',
                  cursor: 'pointer',
                  boxShadow: captionColor === color.hex ? `0 0 10px ${color.hex}` : 'none',
                  transition: 'transform 0.15s ease'
                }}
                title={color.name}
              />
            ))}
          </div>
        </div>

        {/* Font Size & Screen Position */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ fontSize: '11px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Font Size</span>
            <span style={{ fontSize: '11px', fontWeight: '800', color: '#00d294' }}>{captionSize}px</span>
          </div>
          <input
            type="range"
            min="16"
            max="42"
            value={captionSize}
            onChange={(e) => setCaptionSize(Number(e.target.value))}
            style={{ width: '100%', marginBottom: '16px' }}
          />

          <span style={{ fontSize: '11px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.8px', display: 'block', marginBottom: '8px' }}>Screen Position</span>
          <div style={{ display: 'flex', gap: '8px' }}>
            {['top', 'center', 'bottom'].map((pos) => (
              <button
                key={pos}
                onClick={() => setCaptionPosition(pos)}
                className="btn-interactive"
                style={{
                  flex: 1,
                  padding: '6px',
                  backgroundColor: captionPosition === pos ? 'rgba(0, 210, 148, 0.16)' : '#202630',
                  border: captionPosition === pos ? '1px solid #00d294' : '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '6px',
                  color: captionPosition === pos ? '#00d294' : '#f8fafc',
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
        </div>

      </div>
    </div>
  );
}
