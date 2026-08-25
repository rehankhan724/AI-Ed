import React from 'react';
import { Upload, Sparkles } from 'lucide-react';

export default function VideoCanvas({
  videoSrc,
  currentTime,
  isPlaying,
  subtitles,
  activeCaptionStyle,
  captionPosition,
  captionColor,
  captionFont = 'Montserrat',
  captionSize,
  activeFilter,
  aspectRatio,
  onVideoLoaded,
  videoRef,
  onUploadClick,
  onTranscribeClick,
  isTranscribing
}) {
  // Find active subtitle block for live playhead position
  const activeSub = subtitles.find(
    (sub) => currentTime >= sub.start && currentTime <= sub.end
  );

  // Aspect ratio dimensions mapping
  const getAspectRatioStyle = () => {
    switch (aspectRatio) {
      case '9:16':
        return { width: '280px', height: '495px' };
      case '1:1':
        return { width: '430px', height: '430px' };
      case '4:5':
        return { width: '370px', height: '462px' };
      case '16:9':
      default:
        return { width: '680px', height: '382px' };
    }
  };

  const dim = getAspectRatioStyle();

  // Compute active word index inside subtitle block based on progress
  const getActiveWordIndex = () => {
    if (!activeSub || !activeSub.text) return -1;
    const words = activeSub.text.split(' ');
    const duration = activeSub.end - activeSub.start;
    if (duration <= 0) return 0;
    const elapsed = currentTime - activeSub.start;
    const progress = Math.max(0, Math.min(1, elapsed / duration));
    return Math.floor(progress * words.length);
  };

  const activeWordIdx = getActiveWordIndex();

  // Detect key AI terms and return matching B-Roll Emoji
  const getActiveEmoji = () => {
    if (!activeSub || !activeSub.text) return null;
    const text = activeSub.text.toUpperCase();
    if (text.includes('KILL') || text.includes('EVERYBODY') || text.includes('FIRE') || text.includes('HOT')) return '🔥';
    if (text.includes('CHAMP') || text.includes('KING') || text.includes('BEST') || text.includes('WIN')) return '👑';
    if (text.includes('THINKING') || text.includes('CRITICAL') || text.includes('BRAIN') || text.includes('SCHOOL')) return '🧠';
    if (text.includes('MONEY') || text.includes('CASH') || text.includes('RICH')) return '💰';
    if (text.includes('LIGHTNING') || text.includes('SPEED') || text.includes('FAST') || text.includes('AI')) return '⚡';
    if (text.includes('ROCKET') || text.includes('GROWTH') || text.includes('SUCCESS') || text.includes('GO')) return '🚀';
    if (text.includes('SYSTEM') || text.includes('DESIGN') || text.includes('CODE')) return '⚙️';
    if (text.includes('VIDEO') || text.includes('EDITOR') || text.includes('EDIT')) return '🎬';
    return null;
  };

  const activeEmoji = getActiveEmoji();

  return (
    <div className="editor-grid-bg" style={{
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
      padding: '24px'
    }}>
      {/* Studio Frame Canvas Container */}
      <div style={{
        ...dim,
        position: 'relative',
        backgroundColor: '#000000',
        borderRadius: '12px',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.9), 0 0 0 1px rgba(255, 255, 255, 0.12)',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)'
      }}>
        {videoSrc ? (
          <video
            ref={videoRef}
            src={videoSrc}
            onLoadedMetadata={(e) => onVideoLoaded && onVideoLoaded(e.target.duration)}
            className={`filter-${activeFilter || 'normal'}`}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              transition: 'filter 0.3s ease'
            }}
            playsInline
          />
        ) : (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '28px',
            textAlign: 'center',
            color: '#64748b'
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: 'rgba(59, 130, 246, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '14px',
              border: '1px solid rgba(59, 130, 246, 0.3)'
            }}>
              <Upload size={30} style={{ color: '#38bdf8' }} />
            </div>
            <h3 style={{ color: '#f8fafc', fontWeight: '800', fontSize: '17px', marginBottom: '6px' }}>
              Upload Your Video File
            </h3>
            <p style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '20px', maxWidth: '280px' }}>
              Drop your video here or click upload to start extracting AI speech subtitles
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={onUploadClick}
                style={{
                  backgroundColor: '#3b82f6',
                  color: '#fff',
                  border: 'none',
                  padding: '9px 18px',
                  borderRadius: '8px',
                  fontWeight: '700',
                  fontSize: '13px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(59, 130, 246, 0.4)'
                }}
              >
                Upload Video
              </button>
              <button
                onClick={onTranscribeClick}
                disabled={isTranscribing}
                style={{
                  backgroundColor: '#8b5cf6',
                  color: '#fff',
                  border: 'none',
                  padding: '9px 18px',
                  borderRadius: '8px',
                  fontWeight: '700',
                  fontSize: '13px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 4px 14px rgba(139, 92, 246, 0.4)'
                }}
              >
                <Sparkles size={15} /> Demo Sample
              </button>
            </div>
          </div>
        )}

        {/* Dynamic Kinetic Subtitle & AI B-Roll Emoji Overlay on Video Player */}
        {activeSub && activeSub.text && (
          <div style={{
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            top: captionPosition === 'top' ? '10%' : captionPosition === 'center' ? '40%' : '72%',
            width: '90%',
            textAlign: 'center',
            pointerEvents: 'none',
            zIndex: 15
          }}>
            {activeEmoji && (
              <div className="emoji-broll-pop" key={`${activeSub.id}_${activeEmoji}`}>
                {activeEmoji}
              </div>
            )}
            <div
              className={`caption-style-${activeCaptionStyle || 'hormozi'}`}
              style={{
                fontFamily: `'${captionFont || 'Montserrat'}', sans-serif`,
                fontSize: captionSize ? `${captionSize}px` : undefined
              }}
            >
              {activeSub.text.split(' ').map((word, idx) => {
                const isWordActive = idx === activeWordIdx;
                return (
                  <span
                    key={idx}
                    className={`word-span ${isWordActive ? 'active' : ''}`}
                    style={isWordActive && captionColor ? { color: captionColor, textShadow: `0 0 18px ${captionColor}` } : {}}
                  >
                    {word}
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {/* Aspect Ratio Badge watermark */}
        <div style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(6px)',
          padding: '3px 8px',
          borderRadius: '6px',
          fontSize: '10px',
          fontWeight: '700',
          color: '#94a3b8',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          pointerEvents: 'none'
        }}>
          {aspectRatio || '16:9'}
        </div>
      </div>
    </div>
  );
}
