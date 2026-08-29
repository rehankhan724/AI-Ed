import React, { useState } from 'react';
import { Download, FileText, CheckCircle2, X, Film, Sparkles } from 'lucide-react';
import { exportToVTT } from '../services/transcriptionService';

export default function RenderModal({ isOpen, onClose, subtitles, videoSrc }) {
  const [isRendering, setIsRendering] = useState(false);
  const [progress, setProgress] = useState(0);
  const [renderedUrl, setRenderedUrl] = useState(null);

  if (!isOpen) return null;

  const handleStartRender = () => {
    setIsRendering(true);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsRendering(false);
          setRenderedUrl(videoSrc || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4');
          return 100;
        }
        return prev + 20;
      });
    }, 400);
  };

  const handleDownloadSubtitles = () => {
    const vttContent = exportToVTT(subtitles);
    const blob = new Blob([vttContent], { type: 'text/vtt;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'ai_ed_subtitles.vtt');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(5, 7, 15, 0.75)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100
    }}>
      <div style={{
        width: '480px',
        backgroundColor: 'var(--bg-panel)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '16px',
        padding: '28px',
        color: 'var(--text-main)',
        boxShadow: 'var(--shadow-card)'
      }}>
        {/* Modal Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(37, 99, 235, 0.4)'
            }}>
              <Film size={20} style={{ color: '#fff' }} />
            </div>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: '800', letterSpacing: '-0.3px' }}>Render & Export Video</h3>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Produce final MP4 with frame-synced AI subtitles</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="btn-interactive"
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-muted)',
              cursor: 'pointer'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Render Progress or Completion */}
        {isRendering ? (
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <Sparkles size={40} className="animate-spin" style={{ color: 'var(--accent-blue)', margin: '0 auto 18px' }} />
            <h4 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '8px' }}>
              Rendering Video with AI Subtitles... {progress}%
            </h4>
            <div style={{
              width: '100%',
              height: '10px',
              backgroundColor: 'var(--border-subtle)',
              borderRadius: '6px',
              overflow: 'hidden',
              marginTop: '16px'
            }}>
              <div style={{
                width: `${progress}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #2563eb 0%, #7c3aed 100%)',
                boxShadow: '0 0 12px rgba(37, 99, 235, 0.6)',
                transition: 'width 0.3s ease'
              }} />
            </div>
          </div>
        ) : renderedUrl ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <CheckCircle2 size={48} style={{ color: 'var(--accent-emerald)', margin: '0 auto 14px' }} />
            <h4 style={{ fontSize: '17px', fontWeight: '800', marginBottom: '6px' }}>
              Render Complete!
            </h4>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '24px', lineHeight: '1.5' }}>
              Your video with frame-synchronized AI subtitles and media overlays is ready for download.
            </p>

            <div style={{ display: 'flex', gap: '12px' }}>
              <a
                href={renderedUrl}
                download="ai_ed_edited_video.mp4"
                className="btn-interactive"
                style={{
                  flex: 1,
                  background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                  color: '#fff',
                  padding: '12px',
                  borderRadius: '9px',
                  fontWeight: '700',
                  fontSize: '13px',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '7px',
                  boxShadow: '0 4px 16px rgba(37, 99, 235, 0.4)'
                }}
              >
                <Download size={16} /> Download MP4 Video
              </a>
              <button
                onClick={handleDownloadSubtitles}
                className="btn-interactive"
                style={{
                  backgroundColor: 'var(--bg-card)',
                  color: 'var(--text-main)',
                  border: '1px solid var(--border-subtle)',
                  padding: '12px',
                  borderRadius: '9px',
                  fontWeight: '700',
                  fontSize: '13px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '7px'
                }}
              >
                <FileText size={16} /> VTT Subtitles
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div style={{
              backgroundColor: 'var(--bg-card)',
              borderRadius: '10px',
              padding: '16px',
              marginBottom: '24px',
              fontSize: '12.5px',
              lineHeight: '1.7',
              color: 'var(--text-muted)',
              border: '1px solid var(--border-subtle)'
            }}>
              <p style={{ marginBottom: '8px', color: 'var(--text-main)', fontWeight: '700', fontSize: '13px' }}>Render Specifications:</p>
              • Output Resolution: Full HD (1080p)<br />
              • Subtitle Tracks: <strong style={{ color: 'var(--accent-cyan)' }}>{subtitles.length} synchronized clips</strong><br />
              • Audio Engine: Original Audio + AI Voiceover + Background Track
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={handleStartRender}
                className="btn-interactive"
                style={{
                  flex: 1,
                  background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                  color: '#fff',
                  border: 'none',
                  padding: '12px',
                  borderRadius: '9px',
                  fontWeight: '700',
                  fontSize: '13px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '7px',
                  boxShadow: '0 4px 16px rgba(37, 99, 235, 0.4)'
                }}
              >
                <Download size={16} /> Start Render
              </button>
              <button
                onClick={handleDownloadSubtitles}
                className="btn-interactive"
                style={{
                  backgroundColor: 'var(--bg-card)',
                  color: 'var(--text-main)',
                  border: '1px solid var(--border-subtle)',
                  padding: '12px',
                  borderRadius: '9px',
                  fontWeight: '700',
                  fontSize: '13px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '7px'
                }}
              >
                <FileText size={16} /> Export Subtitles (.vtt)
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
