import React, { useState } from 'react';
import { Mic, Music, Sparkles, Check } from 'lucide-react';

export default function AudioPanel({
  onAddTTSVoiceover,
  backgroundTrack,
  setBackgroundTrack,
  bgMusicVolume,
  setBgMusicVolume
}) {
  const [ttsText, setTtsText] = useState('WELCOME TO MAGIC PRO VIDEO STUDIO');
  const [selectedVoice, setSelectedVoice] = useState('en-US');
  const [speechRate, setSpeechRate] = useState(1.0);
  const [isGenerating, setIsGenerating] = useState(false);

  const bgTracks = [
    { id: 'none', name: '🚫 No Background Music' },
    { id: 'lofi', name: '☕ Lo-Fi Chill Beats' },
    { id: 'phonk', name: '⚡ Cyber Phonk Viral' },
    { id: 'hype', name: '🚀 Upbeat Creator Hype' },
    { id: 'cinematic', name: '🎬 Dark Cinematic Ambient' }
  ];

  const handleGenerateSpeech = () => {
    if (!ttsText.trim()) return;
    setIsGenerating(true);

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(ttsText);
      utterance.rate = speechRate;
      utterance.lang = selectedVoice;

      utterance.onend = () => {
        setIsGenerating(false);
      };

      utterance.onerror = () => {
        setIsGenerating(false);
      };

      window.speechSynthesis.speak(utterance);
    }

    if (onAddTTSVoiceover) {
      onAddTTSVoiceover(ttsText);
    }

    setTimeout(() => {
      setIsGenerating(false);
    }, 1200);
  };

  return (
    <div style={{
      width: '300px',
      backgroundColor: 'var(--bg-panel)',
      borderRight: '1px solid var(--border-subtle)',
      display: 'flex',
      flexDirection: 'column',
      color: 'var(--text-main)',
      fontSize: '13px',
      zIndex: 15,
      transition: 'background-color 0.3s ease, border-color 0.3s ease'
    }}>
      {/* Panel Header */}
      <div style={{
        padding: '16px',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'var(--bg-panel-header)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '800', fontSize: '14px' }}>
          <Mic size={18} style={{ color: 'var(--accent-cyan)' }} />
          <span>AI Voiceover & Music</span>
        </div>
      </div>

      <div style={{ padding: '16px', flex: 1, overflowY: 'auto' }}>
        
        {/* Text-to-Speech Generator Section */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.12) 0%, rgba(37, 99, 235, 0.12) 100%)',
          border: '1px solid rgba(2, 132, 199, 0.35)',
          borderRadius: '12px',
          padding: '14px',
          marginBottom: '20px',
          boxShadow: 'var(--shadow-card)'
        }}>
          <h4 style={{ fontSize: '13px', fontWeight: '800', marginBottom: '6px', color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={15} /> AI Voiceover Generator (TTS)
          </h4>
          <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '12px', lineHeight: '1.45' }}>
            Type script text to generate spoken AI voice synced to timeline.
          </p>

          <textarea
            value={ttsText}
            onChange={(e) => setTtsText(e.target.value)}
            placeholder="Type your script here..."
            style={{
              width: '100%',
              height: '65px',
              backgroundColor: 'var(--bg-input)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '8px',
              color: 'var(--text-main)',
              padding: '8px 10px',
              fontSize: '12px',
              fontFamily: 'inherit',
              resize: 'none',
              outline: 'none',
              marginBottom: '12px'
            }}
          />

          <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: '700' }}>Speech Pace</label>
              <select
                value={speechRate}
                onChange={(e) => setSpeechRate(Number(e.target.value))}
                style={{
                  width: '100%',
                  backgroundColor: 'var(--bg-input)',
                  color: 'var(--accent-cyan)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '6px',
                  padding: '5px 8px',
                  fontSize: '11.5px',
                  fontWeight: '700',
                  marginTop: '4px'
                }}
              >
                <option value="0.8">0.8x Slow</option>
                <option value="1.0">1.0x Normal</option>
                <option value="1.2">1.2x Fast</option>
                <option value="1.5">1.5x Rapid</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleGenerateSpeech}
            disabled={isGenerating}
            className="btn-interactive"
            style={{
              width: '100%',
              background: isGenerating ? 'var(--border-subtle)' : 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              padding: '10px 14px',
              fontWeight: '700',
              fontSize: '12.5px',
              cursor: isGenerating ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '7px',
              boxShadow: isGenerating ? 'none' : '0 4px 14px rgba(2, 132, 199, 0.35)'
            }}
          >
            <Mic size={15} className={isGenerating ? 'animate-spin' : ''} />
            <span>{isGenerating ? 'Speaking AI Voice...' : 'Generate AI Voiceover'}</span>
          </button>
        </div>

        {/* Background Music Selector Section */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Music size={13} style={{ color: 'var(--accent-pink)' }} /> Background Music Vibe
          </label>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '10px' }}>
            {bgTracks.map((tr) => (
              <button
                key={tr.id}
                onClick={() => setBackgroundTrack && setBackgroundTrack(tr.id)}
                className="btn-interactive"
                style={{
                  padding: '10px 12px',
                  borderRadius: '8px',
                  backgroundColor: backgroundTrack === tr.id ? 'rgba(2, 132, 199, 0.15)' : 'var(--bg-card)',
                  border: backgroundTrack === tr.id ? '1px solid var(--accent-cyan)' : '1px solid var(--border-subtle)',
                  color: backgroundTrack === tr.id ? 'var(--accent-cyan)' : 'var(--text-main)',
                  fontSize: '11.5px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <span>{tr.name}</span>
                {backgroundTrack === tr.id && <Check size={14} style={{ color: 'var(--accent-emerald)' }} />}
              </button>
            ))}
          </div>
        </div>

        {/* Background Music Volume */}
        {backgroundTrack && backgroundTrack !== 'none' && (
          <div style={{ backgroundColor: 'var(--bg-card)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', color: 'var(--text-muted)', marginBottom: '8px' }}>
              <span>Background Volume:</span>
              <strong style={{ color: 'var(--accent-cyan)' }}>{Math.round((bgMusicVolume || 0.3) * 100)}%</strong>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={bgMusicVolume || 0.3}
              onChange={(e) => setBgMusicVolume && setBgMusicVolume(Number(e.target.value))}
              style={{ width: '100%', cursor: 'pointer', accentColor: 'var(--accent-cyan)' }}
            />
          </div>
        )}

      </div>
    </div>
  );
}
