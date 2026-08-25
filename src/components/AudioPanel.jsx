import React, { useState } from 'react';
import { Mic, Music, Volume2, Sparkles, Play, Plus, Trash2 } from 'lucide-react';

export default function AudioPanel({
  onAddTTSVoiceover,
  backgroundTrack,
  setBackgroundTrack,
  bgMusicVolume,
  setBgMusicVolume
}) {
  const [ttsText, setTtsText] = useState('WELCOME TO AI EDITOR PRO VIDEO STUDIO');
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
          <Mic size={16} style={{ color: '#06b6d4' }} />
          <span>AI Voiceover & Music</span>
        </div>
      </div>

      <div style={{ padding: '16px', flex: 1, overflowY: 'auto' }}>
        
        {/* Text-to-Speech Generator Section */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.15) 0%, rgba(59, 130, 246, 0.15) 100%)',
          border: '1px solid rgba(6, 182, 212, 0.3)',
          borderRadius: '10px',
          padding: '14px',
          marginBottom: '18px'
        }}>
          <h4 style={{ fontSize: '13px', fontWeight: '800', marginBottom: '6px', color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={14} /> AI Voiceover Generator (TTS)
          </h4>
          <p style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '10px', lineHeight: '1.4' }}>
            Type script text to generate natural spoken AI voice synced to timeline.
          </p>

          <textarea
            value={ttsText}
            onChange={(e) => setTtsText(e.target.value)}
            placeholder="Type your script here..."
            style={{
              width: '100%',
              height: '60px',
              backgroundColor: '#070a13',
              border: '1px solid #334155',
              borderRadius: '6px',
              color: '#fff',
              padding: '8px',
              fontSize: '12px',
              fontFamily: 'inherit',
              resize: 'none',
              outline: 'none',
              marginBottom: '10px'
            }}
          />

          <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: '10px', color: '#94a3b8', fontWeight: '700' }}>Speech Rate</label>
              <select
                value={speechRate}
                onChange={(e) => setSpeechRate(Number(e.target.value))}
                style={{
                  width: '100%',
                  backgroundColor: '#0d1220',
                  color: '#38bdf8',
                  border: '1px solid #1e293b',
                  borderRadius: '5px',
                  padding: '4px 6px',
                  fontSize: '11px',
                  fontWeight: '700',
                  marginTop: '2px'
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
            style={{
              width: '100%',
              background: isGenerating ? '#334155' : 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
              color: '#fff',
              border: 'none',
              borderRadius: '7px',
              padding: '9px 12px',
              fontWeight: '700',
              fontSize: '12px',
              cursor: isGenerating ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              boxShadow: '0 4px 14px rgba(6, 182, 212, 0.4)'
            }}
          >
            <Mic size={14} className={isGenerating ? 'animate-spin' : ''} />
            {isGenerating ? 'Speaking AI Voice...' : 'Generate AI Voiceover'}
          </button>
        </div>

        {/* Background Music Selector Section */}
        <div style={{ marginBottom: '18px' }}>
          <label style={{ fontSize: '11px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Music size={12} /> Background Music Vibe
          </label>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '8px' }}>
            {bgTracks.map((tr) => (
              <button
                key={tr.id}
                onClick={() => setBackgroundTrack && setBackgroundTrack(tr.id)}
                style={{
                  padding: '9px 12px',
                  borderRadius: '7px',
                  backgroundColor: backgroundTrack === tr.id ? '#1e293b' : '#0d1220',
                  border: backgroundTrack === tr.id ? '1px solid #38bdf8' : '1px solid #1e293b',
                  color: backgroundTrack === tr.id ? '#38bdf8' : '#cbd5e1',
                  fontSize: '11px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <span>{tr.name}</span>
                {backgroundTrack === tr.id && <span style={{ fontSize: '10px', color: '#10b981' }}>Active</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Background Music Volume */}
        {backgroundTrack && backgroundTrack !== 'none' && (
          <div style={{ backgroundColor: '#0d1220', padding: '12px', borderRadius: '8px', border: '1px solid #1e293b' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#94a3b8', marginBottom: '6px' }}>
              <span>Background Volume:</span>
              <strong style={{ color: '#38bdf8' }}>{Math.round((bgMusicVolume || 0.3) * 100)}%</strong>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={bgMusicVolume || 0.3}
              onChange={(e) => setBgMusicVolume && setBgMusicVolume(Number(e.target.value))}
              style={{ width: '100%', cursor: 'pointer', accentColor: '#38bdf8' }}
            />
          </div>
        )}

      </div>
    </div>
  );
}
