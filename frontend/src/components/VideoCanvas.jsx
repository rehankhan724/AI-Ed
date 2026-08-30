import React, { useState, useEffect } from 'react';
import { Upload, Sparkles, Move, Trash2, RotateCw } from 'lucide-react';

export default function VideoCanvas({
  videoSrc,
  currentTime,
  subtitles,
  overlayImages = [],
  selectedImageId,
  setSelectedImageId,
  onUpdateOverlayImage,
  onDeleteOverlayImage,
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
  isTranscribing,
  magicWordTimings = [],
  magicCaptionStyle = 'drk-talks'
}) {
  const [resizingImage, setResizingImage] = useState(null); // { id, corner, startX, initialScale }

  // Find active subtitle block for live playhead position
  const activeSub = subtitles.find(
    (sub) => currentTime >= sub.start && currentTime <= sub.end
  );

  // Handle Mouse Drag Resizing for Corner Handles
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!resizingImage) return;
      const deltaX = e.clientX - resizingImage.startX;
      let scaleChange = deltaX / 2.5;
      if (resizingImage.corner === 'tl' || resizingImage.corner === 'bl') {
        scaleChange = -scaleChange;
      }
      const newScale = Math.max(10, Math.min(100, Math.round(resizingImage.initialScale + scaleChange)));
      if (onUpdateOverlayImage) {
        onUpdateOverlayImage(resizingImage.id, { scale: newScale });
      }
    };

    const handleMouseUp = () => {
      if (resizingImage) {
        setResizingImage(null);
      }
    };

    if (resizingImage) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [resizingImage, onUpdateOverlayImage]);

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

  // Calculate CSS position for an image overlay clip
  const getImageOverlayStyle = (img) => {
    const pos = img.position || 'center';
    const scale = img.scale || 60;
    const opacity = img.opacity ?? 1.0;
    const rotation = img.rotation || 0;
    const borderRadius = img.borderRadius || 12;

    let posStyle = {};
    if (pos === 'full') {
      posStyle = { inset: 0, width: '100%', height: '100%' };
    } else if (pos === 'top-left') {
      posStyle = { top: '5%', left: '5%', width: `${scale}%` };
    } else if (pos === 'top-right') {
      posStyle = { top: '5%', right: '5%', width: `${scale}%` };
    } else if (pos === 'bottom-left') {
      posStyle = { bottom: '8%', left: '5%', width: `${scale}%` };
    } else if (pos === 'bottom-right') {
      posStyle = { bottom: '8%', right: '5%', width: `${scale}%` };
    } else {
      // Center
      posStyle = {
        top: '50%',
        left: '50%',
        transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
        width: `${scale}%`
      };
    }

    return {
      ...posStyle,
      opacity,
      transform: pos !== 'center' && rotation ? `rotate(${rotation}deg)` : posStyle.transform,
      borderRadius: `${borderRadius}px`
    };
  };

  // Filter active images for the playhead time
  const activeImages = overlayImages.filter(
    (img) => currentTime >= (img.start ?? 0) && currentTime <= (img.end ?? ((img.start ?? 0) + 4))
  );

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
      {/* Studio Monitor Canvas Frame Container */}
      <div style={{
        ...dim,
        position: 'relative',
        backgroundColor: '#000000',
        borderRadius: '16px',
        boxShadow: '0 30px 80px rgba(0, 0, 0, 0.95), 0 0 0 1px rgba(255, 255, 255, 0.12), 0 0 40px rgba(99, 102, 241, 0.12)',
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
            padding: '32px',
            textAlign: 'center',
            color: '#64748b'
          }}>
            <div style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px',
              border: '1px solid rgba(99, 102, 241, 0.4)',
              boxShadow: '0 0 25px rgba(99, 102, 241, 0.3)'
            }}>
              <Upload size={32} style={{ color: '#818cf8' }} />
            </div>
            <h3 style={{ color: '#ffffff', fontWeight: '800', fontSize: '18px', marginBottom: '6px', letterSpacing: '-0.3px' }}>
              Upload Video Media
            </h3>
            <p style={{ fontSize: '12px', color: '#cbd5e1', marginBottom: '22px', maxWidth: '300px', lineHeight: '1.5' }}>
              Drop your video file to auto-extract spoken speech into frame-synced kinetic subtitles.
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={onUploadClick}
                className="btn-interactive"
                style={{
                  background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                  color: '#fff',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '9px',
                  fontWeight: '700',
                  fontSize: '13px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 16px rgba(59, 130, 246, 0.45)'
                }}
              >
                Upload Video
              </button>
              <button
                onClick={onTranscribeClick}
                disabled={isTranscribing}
                className="btn-interactive"
                style={{
                  background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
                  color: '#fff',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '9px',
                  fontWeight: '700',
                  fontSize: '13px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '7px',
                  boxShadow: '0 4px 16px rgba(139, 92, 246, 0.45)'
                }}
              >
                <Sparkles size={16} /> Demo Sample
              </button>
            </div>
          </div>
        )}

        {/* Overlay Image elements (Multi-clip active rendering with Drag Resizing) */}
        {activeImages.map((img) => {
          const isSelected = selectedImageId === img.id;

          return (
            <div
              key={img.id}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImageId && setSelectedImageId(img.id);
              }}
              style={{
                position: 'absolute',
                ...getImageOverlayStyle(img),
                zIndex: isSelected ? 14 : 12,
                cursor: 'pointer',
                boxShadow: isSelected
                  ? '0 14px 40px rgba(0, 0, 0, 0.85), 0 0 0 2px #38bdf8'
                  : '0 8px 25px rgba(0,0,0,0.5)',
                transition: 'border-color 0.15s ease, box-shadow 0.15s ease'
              }}
              title="Click & Drag Corner Dots to Resize Image"
            >
              <img
                src={img.url}
                alt={img.title || 'Stock Media'}
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: `${img.borderRadius || 12}px`,
                  objectFit: img.objectFit || 'cover',
                  display: 'block'
                }}
              />

              {/* 4 Interactive Corner Drag Resizing Dots */}
              {isSelected && (
                <>
                  {/* Top-Left Corner Handle */}
                  <div
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      setResizingImage({ id: img.id, corner: 'tl', startX: e.clientX, initialScale: img.scale || 60 });
                    }}
                    style={{
                      position: 'absolute',
                      top: '-7px',
                      left: '-7px',
                      width: '14px',
                      height: '14px',
                      backgroundColor: '#38bdf8',
                      border: '2.5px solid #ffffff',
                      borderRadius: '50%',
                      cursor: 'nwse-resize',
                      zIndex: 20,
                      boxShadow: '0 0 8px rgba(56, 189, 248, 0.9)'
                    }}
                    title="Drag to Resize"
                  />
                  {/* Top-Right Corner Handle */}
                  <div
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      setResizingImage({ id: img.id, corner: 'tr', startX: e.clientX, initialScale: img.scale || 60 });
                    }}
                    style={{
                      position: 'absolute',
                      top: '-7px',
                      right: '-7px',
                      width: '14px',
                      height: '14px',
                      backgroundColor: '#38bdf8',
                      border: '2.5px solid #ffffff',
                      borderRadius: '50%',
                      cursor: 'nesw-resize',
                      zIndex: 20,
                      boxShadow: '0 0 8px rgba(56, 189, 248, 0.9)'
                    }}
                    title="Drag to Resize"
                  />
                  {/* Bottom-Left Corner Handle */}
                  <div
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      setResizingImage({ id: img.id, corner: 'bl', startX: e.clientX, initialScale: img.scale || 60 });
                    }}
                    style={{
                      position: 'absolute',
                      bottom: '-7px',
                      left: '-7px',
                      width: '14px',
                      height: '14px',
                      backgroundColor: '#38bdf8',
                      border: '2.5px solid #ffffff',
                      borderRadius: '50%',
                      cursor: 'nesw-resize',
                      zIndex: 20,
                      boxShadow: '0 0 8px rgba(56, 189, 248, 0.9)'
                    }}
                    title="Drag to Resize"
                  />
                  {/* Bottom-Right Corner Handle */}
                  <div
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      setResizingImage({ id: img.id, corner: 'br', startX: e.clientX, initialScale: img.scale || 60 });
                    }}
                    style={{
                      position: 'absolute',
                      bottom: '-7px',
                      right: '-7px',
                      width: '14px',
                      height: '14px',
                      backgroundColor: '#38bdf8',
                      border: '2.5px solid #ffffff',
                      borderRadius: '50%',
                      cursor: 'nwse-resize',
                      zIndex: 20,
                      boxShadow: '0 0 8px rgba(56, 189, 248, 0.9)'
                    }}
                    title="Drag to Resize"
                  />
                </>
              )}

              {/* Canvas Quick Controls Toolbar on Selection */}
              {isSelected && (
                <div style={{
                  position: 'absolute',
                  top: '-34px',
                  right: '0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: 'rgba(8, 11, 20, 0.9)',
                  backdropFilter: 'blur(10px)',
                  padding: '4px 10px',
                  borderRadius: '7px',
                  border: '1px solid #38bdf8',
                  boxShadow: '0 6px 16px rgba(0,0,0,0.7)'
                }}>
                  <span style={{ fontSize: '9.5px', fontWeight: '800', color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Move size={11} /> {img.title || 'Image'} ({img.scale || 60}%)
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onUpdateOverlayImage && onUpdateOverlayImage(img.id, {
                        rotation: ((img.rotation || 0) + 90) % 360
                      });
                    }}
                    style={{
                      backgroundColor: 'transparent',
                      border: 'none',
                      color: '#cbd5e1',
                      cursor: 'pointer',
                      padding: '0 2px'
                    }}
                    title="Rotate 90°"
                  >
                    <RotateCw size={12} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteOverlayImage && onDeleteOverlayImage(img.id);
                    }}
                    style={{
                      backgroundColor: 'transparent',
                      border: 'none',
                      color: '#ef4444',
                      cursor: 'pointer',
                      padding: '0 2px'
                    }}
                    title="Delete image clip"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              )}
            </div>
          );
        })}

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
                    style={isWordActive && captionColor ? { color: captionColor, textShadow: `0 0 20px ${captionColor}` } : {}}
                  >
                    {word}
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {/* Aspect Ratio Badge */}
        <div style={{
          position: 'absolute', top: '12px', right: '12px',
          backgroundColor: 'rgba(8,11,20,0.75)', backdropFilter: 'blur(10px)',
          padding: '4px 10px', borderRadius: '7px', fontSize: '10px',
          fontWeight: '800', color: '#94a3b8',
          border: '1px solid rgba(255,255,255,0.12)', pointerEvents: 'none'
        }}>
          {aspectRatio || '16:9'}
        </div>

        {/* ── Magic Word-by-Word Caption Overlay ── */}
        {magicWordTimings.length > 0 && (() => {
          const activeWord = magicWordTimings.find(
            w => currentTime >= w.start && currentTime < w.end
          );
          if (!activeWord) return null;
          return (
            <div style={{
              position: 'absolute',
              left: '50%', transform: 'translateX(-50%)',
              bottom: '18%',
              width: '90%', textAlign: 'center',
              pointerEvents: 'none', zIndex: 20
            }}>
              <span
                key={`${activeWord.word}-${activeWord.start}`}
                className={`caption-style-${magicCaptionStyle}${activeWord.isKey ? ' magic-key' : ''}`}
              >
                {activeWord.word}
              </span>
            </div>
          );
        })()}
      </div>
    </div>
  );
}
