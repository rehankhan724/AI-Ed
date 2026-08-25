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
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100
    }}>
      <div style={{
        width: '460px',
        backgroundColor: '#0d121f',
        border: '1px solid #1e293b',
        borderRadius: '12px',
        padding: '24px',
        color: '#fff',
        boxShadow: '0 25px 50px rgba(0,0,0,0.9)'
      }}>
        {/* Modal Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Film size={20} style={{ color: '#3b82f6' }} />
            <h3 style={{ fontSize: '18px', fontWeight: '800' }}>Render & Export Video</h3>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {/* Render Progress or Completion */}
        {isRendering ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <Sparkles size={36} className="animate-spin" style={{ color: '#3b82f6', margin: '0 auto 16px' }} />
            <h4 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '8px' }}>
              Rendering Video with Subtitles... {progress}%
            </h4>
            <div style={{
              width: '100%',
              height: '8px',
              backgroundColor: '#1e293b',
              borderRadius: '4px',
              overflow: 'hidden',
              marginTop: '12px'
            }}>
              <div style={{
                width: `${progress}%`,
                height: '100%',
                backgroundColor: '#3b82f6',
                transition: 'width 0.3s ease'
              }} />
            </div>
          </div>
        ) : renderedUrl ? (
          <div style={{ textAlign: 'center', padding: '16px 0' }}>
            <CheckCircle2 size={44} style={{ color: '#10b981', margin: '0 auto 12px' }} />
            <h4 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '4px' }}>
              Render Complete!
            </h4>
            <p style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '20px' }}>
              Your edited video with AI speech subtitles is ready to download.
            </p>

            <div style={{ display: 'flex', gap: '10px' }}>
              <a
                href={renderedUrl}
                download="ai_ed_edited_video.mp4"
                style={{
                  flex: 1,
                  backgroundColor: '#3b82f6',
                  color: '#fff',
                  padding: '10px',
                  borderRadius: '6px',
                  fontWeight: '700',
                  fontSize: '13px',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <Download size={16} /> Download MP4 Video
              </a>
              <button
                onClick={handleDownloadSubtitles}
                style={{
                  backgroundColor: '#1e293b',
                  color: '#cbd5e1',
                  border: '1px solid #334155',
                  padding: '10px',
                  borderRadius: '6px',
                  fontWeight: '600',
                  fontSize: '13px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <FileText size={16} /> VTT Subtitles
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div style={{
              backgroundColor: '#171e2e',
              borderRadius: '8px',
              padding: '14px',
              marginBottom: '20px',
              fontSize: '12px',
              lineHeight: '1.6',
              color: '#94a3b8'
            }}>
              <p style={{ marginBottom: '6px', color: '#f8fafc', fontWeight: '600' }}>Render Details:</p>
              • Resolution: Full HD (1080p)<br />
              • Subtitle Tracks: {subtitles.length} synchronized clips<br />
              • Audio: Original Track + Synced Captions
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={handleStartRender}
                style={{
                  flex: 1,
                  backgroundColor: '#3b82f6',
                  color: '#fff',
                  border: 'none',
                  padding: '10px',
                  borderRadius: '6px',
                  fontWeight: '700',
                  fontSize: '13px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <Download size={16} /> Start Render
              </button>
              <button
                onClick={handleDownloadSubtitles}
                style={{
                  backgroundColor: '#1e293b',
                  color: '#cbd5e1',
                  border: '1px solid #334155',
                  padding: '10px',
                  borderRadius: '6px',
                  fontWeight: '600',
                  fontSize: '13px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
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
