import React, { useRef, useState, useEffect } from 'react';
import { Film, Music, MessageSquare, Volume2, Image as ImageIcon } from 'lucide-react';
import AudioWaveformCanvas from './AudioWaveformCanvas';

export default function Timeline({
  duration,
  currentTime,
  setCurrentTime,
  subtitles,
  setSubtitles,
  selectedSubId,
  setSelectedSubId,
  zoomLevel,
  isPlaying,
  backgroundTrack,
  overlayImages = [],
  selectedImageId,
  setSelectedImageId,
  onUpdateOverlayImage
}) {
  const timelineRef = useRef(null);
  const [isDraggingPlayhead, setIsDraggingPlayhead] = useState(false);
  const [resizingClip, setResizingClip] = useState(null);
  const [draggingClip, setDraggingClip] = useState(null);

  const pxPerSec = (zoomLevel / 100) * 45;
  const timelineWidth = Math.max(1200, duration * pxPerSec);

  const renderTimeRuler = () => {
    const ticks = [];
    const step = duration > 60 ? 10 : duration > 30 ? 5 : 2;
    for (let sec = 0; sec <= Math.ceil(duration); sec += step) {
      const left = sec * pxPerSec;
      ticks.push(
        <div
          key={sec}
          style={{
            position: 'absolute',
            left: `${left}px`,
            top: 0,
            bottom: 0,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            pointerEvents: 'none'
          }}
        >
          <span style={{ fontSize: '10px', color: 'var(--text-muted)', transform: 'translateX(-50%)', fontWeight: '700' }}>
            {sec}s
          </span>
          <div style={{ width: '1px', height: '7px', backgroundColor: 'var(--border-subtle)' }}></div>
        </div>
      );
    }
    return ticks;
  };

  const handleTimelinePointerDown = (e) => {
    if (!timelineRef.current) return;
    const rect = timelineRef.current.getBoundingClientRect();
    const scrollLeft = timelineRef.current.scrollLeft;
    const clickX = e.clientX - rect.left + scrollLeft;
    const newSec = Math.max(0, Math.min(duration, clickX / pxPerSec));
    setCurrentTime(newSec);
    setIsDraggingPlayhead(true);
  };

  useEffect(() => {
    const handlePointerMove = (e) => {
      if (isDraggingPlayhead && timelineRef.current) {
        const rect = timelineRef.current.getBoundingClientRect();
        const scrollLeft = timelineRef.current.scrollLeft;
        const dragX = e.clientX - rect.left + scrollLeft;
        const newSec = Math.max(0, Math.min(duration, dragX / pxPerSec));
        setCurrentTime(newSec);
      }

      if (resizingClip && timelineRef.current) {
        const deltaX = e.clientX - resizingClip.initialX;
        const deltaSec = deltaX / pxPerSec;

        const targetImg = overlayImages.find(img => img.id === resizingClip.id);
        if (targetImg && onUpdateOverlayImage) {
          if (resizingClip.side === 'left') {
            const newStart = Math.max(0, Math.min((targetImg.end ?? 4) - 0.5, resizingClip.initialStart + deltaSec));
            onUpdateOverlayImage(targetImg.id, { start: parseFloat(newStart.toFixed(2)) });
          } else {
            const newEnd = Math.max((targetImg.start ?? 0) + 0.5, Math.min(duration, resizingClip.initialEnd + deltaSec));
            onUpdateOverlayImage(targetImg.id, { end: parseFloat(newEnd.toFixed(2)) });
          }
        } else {
          setSubtitles(prev => prev.map(sub => {
            if (sub.id !== resizingClip.id) return sub;

            if (resizingClip.side === 'left') {
              const newStart = Math.max(0, Math.min(sub.end - 0.2, resizingClip.initialStart + deltaSec));
              return { ...sub, start: parseFloat(newStart.toFixed(2)) };
            } else {
              const newEnd = Math.max(sub.start + 0.2, Math.min(duration, resizingClip.initialEnd + deltaSec));
              return { ...sub, end: parseFloat(newEnd.toFixed(2)) };
            }
          }));
        }
      }

      if (draggingClip && timelineRef.current) {
        const deltaX = e.clientX - draggingClip.initialX;
        const deltaSec = deltaX / pxPerSec;

        const targetImg = overlayImages.find(img => img.id === draggingClip.id);
        if (targetImg && onUpdateOverlayImage) {
          const newStart = Math.max(0, Math.min(duration - draggingClip.clipDur, draggingClip.initialStart + deltaSec));
          const newEnd = newStart + draggingClip.clipDur;
          onUpdateOverlayImage(targetImg.id, {
            start: parseFloat(newStart.toFixed(2)),
            end: parseFloat(newEnd.toFixed(2))
          });
        } else {
          setSubtitles(prev => prev.map(sub => {
            if (sub.id !== draggingClip.id) return sub;
            const newStart = Math.max(0, Math.min(duration - draggingClip.clipDur, draggingClip.initialStart + deltaSec));
            const newEnd = newStart + draggingClip.clipDur;
            return {
              ...sub,
              start: parseFloat(newStart.toFixed(2)),
              end: parseFloat(newEnd.toFixed(2))
            };
          }));
        }
      }
    };

    const handlePointerUp = () => {
      setIsDraggingPlayhead(false);
      setResizingClip(null);
      setDraggingClip(null);
    };

    if (isDraggingPlayhead || resizingClip || draggingClip) {
      window.addEventListener('mousemove', handlePointerMove);
      window.addEventListener('mouseup', handlePointerUp);
    }

    return () => {
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseup', handlePointerUp);
    };
  }, [isDraggingPlayhead, resizingClip, draggingClip, duration, pxPerSec, setCurrentTime, setSubtitles]);

  return (
    <div style={{
      height: '245px',
      backgroundColor: 'var(--bg-timeline)',
      display: 'flex',
      flexDirection: 'column',
      borderTop: '1px solid var(--border-subtle)',
      userSelect: 'none',
      position: 'relative',
      transition: 'background-color 0.3s ease, border-color 0.3s ease'
    }}>
      {/* Track Headers & Timeline Canvas */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        
        {/* Track Headers Column (Left) */}
        <div style={{
          width: '160px',
          backgroundColor: 'var(--bg-sidebar)',
          borderRight: '1px solid var(--border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 15
        }}>
          {/* Top header corner */}
          <div style={{
            height: '32px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 12px',
            fontSize: '10.5px',
            color: '#94a3b8',
            fontWeight: '800',
            letterSpacing: '0.8px'
          }}>
            <span>TRACKS</span>
            <span style={{ fontSize: '9px', color: '#00d294', backgroundColor: 'rgba(0, 210, 148, 0.16)', padding: '2px 6px', borderRadius: '4px' }}>
              {subtitles.length} CLIPS
            </span>
          </div>

          {/* Track 1: Subtitles Track Header */}
          <div style={{
            height: '44px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            padding: '0 12px',
            gap: '8px',
            color: '#00d294',
            fontSize: '11.5px',
            fontWeight: '700'
          }}>
            <MessageSquare size={15} />
            <span>Subtitles</span>
          </div>

          {/* Track 2: Video Track Header */}
          <div style={{
            height: '44px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            padding: '0 12px',
            gap: '8px',
            color: '#38bdf8',
            fontSize: '11.5px',
            fontWeight: '700'
          }}>
            <Film size={15} />
            <span>Video Track</span>
          </div>

          {/* Track 2b: Media Image Overlay Track Header */}
          <div style={{
            height: '44px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            padding: '0 12px',
            gap: '8px',
            color: '#eab308',
            fontSize: '11.5px',
            fontWeight: '700'
          }}>
            <ImageIcon size={15} />
            <span>Image Overlay</span>
          </div>

          {/* Track 3: Audio Visualizer Track Header */}
          <div style={{
            height: '44px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            padding: '0 12px',
            gap: '8px',
            color: '#ff4d6d',
            fontSize: '11.5px',
            fontWeight: '700'
          }}>
            <Music size={15} />
            <span>Audio Wave</span>
          </div>

          {/* Track 4: Background Music Track Header */}
          <div style={{
            height: '44px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            padding: '0 12px',
            gap: '8px',
            color: '#00d294',
            fontSize: '11.5px',
            fontWeight: '700'
          }}>
            <Volume2 size={15} />
            <span>BG Music</span>
          </div>
        </div>

        {/* Scrollable Timeline Tracks Canvas (Right) */}
        <div
          ref={timelineRef}
          onMouseDown={handleTimelinePointerDown}
          style={{
            flex: 1,
            overflowX: 'auto',
            overflowY: 'hidden',
            position: 'relative',
            backgroundColor: 'var(--bg-timeline)'
          }}
        >
          <div style={{ width: `${timelineWidth}px`, height: '100%', position: 'relative' }}>
            
            {/* Time Ruler */}
            <div style={{
              height: '32px',
              borderBottom: '1px solid var(--border-subtle)',
              position: 'relative',
              backgroundColor: 'var(--bg-panel-header)'
            }}>
              {renderTimeRuler()}
            </div>

            {/* Track 1: Subtitle Clips Canvas */}
            <div style={{
              height: '44px',
              borderBottom: '1px solid var(--border-subtle)',
              position: 'relative',
              display: 'flex',
              alignItems: 'center'
            }}>
              {subtitles.map((sub) => {
                const left = sub.start * pxPerSec;
                const width = (sub.end - sub.start) * pxPerSec;
                const isSelected = selectedSubId === sub.id;

                return (
                  <div
                    key={sub.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedSubId(sub.id);
                      setCurrentTime(sub.start);
                    }}
                    onMouseDown={(e) => {
                      if (e.target.classList.contains('resizer-handle')) return;
                      setDraggingClip({
                        id: sub.id,
                        initialX: e.clientX,
                        initialStart: sub.start,
                        clipDur: sub.end - sub.start
                      });
                    }}
                    className={`track-subtitle-block ${isSelected ? 'selected' : ''}`}
                    style={{
                      position: 'absolute',
                      left: `${left}px`,
                      width: `${Math.max(26, width)}px`,
                      height: '32px',
                      display: 'flex',
                      alignItems: 'center',
                      padding: '0 10px',
                      fontSize: '11px',
                      fontWeight: '800',
                      color: '#ffffff',
                      cursor: 'grab',
                      overflow: 'hidden',
                      whiteSpace: 'nowrap',
                      textOverflow: 'ellipsis'
                    }}
                  >
                    {/* Left Resizer Handle */}
                    <div
                      onMouseDown={(e) => {
                        e.stopPropagation();
                        setResizingClip({
                          id: sub.id,
                          side: 'left',
                          initialX: e.clientX,
                          initialStart: sub.start,
                          initialEnd: sub.end
                        });
                      }}
                      className="resizer-handle resizer-left"
                    />

                    <span>{sub.text}</span>

                    {/* Right Resizer Handle */}
                    <div
                      onMouseDown={(e) => {
                        e.stopPropagation();
                        setResizingClip({
                          id: sub.id,
                          side: 'right',
                          initialX: e.clientX,
                          initialStart: sub.start,
                          initialEnd: sub.end
                        });
                      }}
                      className="resizer-handle resizer-right"
                    />
                  </div>
                );
              })}
            </div>

            {/* Track 2: Video Track Canvas */}
            <div style={{
              height: '44px',
              borderBottom: '1px solid var(--border-subtle)',
              position: 'relative',
              display: 'flex',
              alignItems: 'center'
            }}>
              <div
                className="track-video-block"
                style={{
                  position: 'absolute',
                  left: '0px',
                  width: `${duration * pxPerSec}px`,
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0 12px',
                  fontSize: '11px',
                  fontWeight: '700',
                  color: '#ffffff',
                  gap: '8px'
                }}
              >
                <span>🎥 Main Video Segment</span>
                <span style={{ fontSize: '10px', opacity: 0.85 }}>({duration.toFixed(1)}s HD 1080p)</span>
              </div>
            </div>

            {/* Track 2b: Media Image Overlay Canvas Block */}
            <div style={{
              height: '44px',
              borderBottom: '1px solid var(--border-subtle)',
              position: 'relative',
              display: 'flex',
              alignItems: 'center'
            }}>
              {overlayImages && overlayImages.length > 0 ? (
                overlayImages.map((img) => {
                  const isSelected = selectedImageId === img.id;
                  const startSec = img.start ?? 0;
                  const endSec = img.end ?? (startSec + 4);
                  const clipWidth = Math.max(30, (endSec - startSec) * pxPerSec);

                  return (
                    <div
                      key={img.id}
                      onClick={() => setSelectedImageId && setSelectedImageId(img.id)}
                      onMouseDown={(e) => {
                        if (e.target.classList.contains('resizer-handle')) return;
                        setSelectedImageId && setSelectedImageId(img.id);
                        setDraggingClip({
                          id: img.id,
                          initialX: e.clientX,
                          initialStart: startSec,
                          clipDur: endSec - startSec
                        });
                      }}
                      className={`track-subtitle-block ${isSelected ? 'selected' : ''}`}
                      style={{
                        position: 'absolute',
                        left: `${startSec * pxPerSec}px`,
                        width: `${clipWidth}px`,
                        height: '32px',
                        display: 'flex',
                        alignItems: 'center',
                        padding: '0 10px',
                        fontSize: '11px',
                        fontWeight: '800',
                        color: '#ffffff',
                        background: isSelected
                          ? 'linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)'
                          : 'linear-gradient(135deg, #0369a1 0%, #0284c7 100%)',
                        border: isSelected ? '2px solid #7dd3fc' : '1px solid #38bdf8',
                        boxShadow: isSelected ? '0 0 16px rgba(56, 189, 248, 0.6)' : 'none',
                        borderRadius: '6px',
                        cursor: 'grab',
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                        textOverflow: 'ellipsis',
                        zIndex: isSelected ? 5 : 2
                      }}
                    >
                      {/* Left Resizer Handle */}
                      <div
                        onMouseDown={(e) => {
                          e.stopPropagation();
                          setSelectedImageId && setSelectedImageId(img.id);
                          setResizingClip({
                            id: img.id,
                            side: 'left',
                            initialX: e.clientX,
                            initialStart: startSec,
                            initialEnd: endSec
                          });
                        }}
                        className="resizer-handle resizer-left"
                      />

                      <span>🖼️ {img.title || 'Stock Image'} ({startSec.toFixed(1)}s - {endSec.toFixed(1)}s)</span>

                      {/* Right Resizer Handle */}
                      <div
                        onMouseDown={(e) => {
                          e.stopPropagation();
                          setSelectedImageId && setSelectedImageId(img.id);
                          setResizingClip({
                            id: img.id,
                            side: 'right',
                            initialX: e.clientX,
                            initialStart: startSec,
                            initialEnd: endSec
                          });
                        }}
                        className="resizer-handle resizer-right"
                      />
                    </div>
                  );
                })
              ) : (
                <div style={{
                  position: 'absolute',
                  left: '0px',
                  width: `${duration * pxPerSec}px`,
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0 12px',
                  borderRadius: '6px',
                  backgroundColor: 'var(--bg-card)',
                  border: '1px dashed var(--border-subtle)',
                  color: 'var(--text-muted)',
                  fontSize: '11px',
                  fontWeight: '700'
                }}>
                  <span>+ Search & Insert Stock Images in Media Panel</span>
                </div>
              )}
            </div>

            {/* Track 3: Audio Waveform Canvas */}
            <div style={{
              height: '44px',
              borderBottom: '1px solid var(--border-subtle)',
              position: 'relative',
              display: 'flex',
              alignItems: 'center'
            }}>
              <div
                className="track-audio-block"
                style={{
                  position: 'absolute',
                  left: '0px',
                  width: `${duration * pxPerSec}px`,
                  height: '30px',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0 8px',
                  overflow: 'hidden'
                }}
              >
                <AudioWaveformCanvas isPlaying={isPlaying} width={duration * pxPerSec} height={28} />
              </div>
            </div>

            {/* Track 4: Background Music Track Canvas */}
            <div style={{
              height: '44px',
              borderBottom: '1px solid var(--border-subtle)',
              position: 'relative',
              display: 'flex',
              alignItems: 'center'
            }}>
              <div
                style={{
                  position: 'absolute',
                  left: '0px',
                  width: `${duration * pxPerSec}px`,
                  height: '30px',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0 12px',
                  borderRadius: '6px',
                  background: backgroundTrack && backgroundTrack !== 'none'
                    ? 'linear-gradient(135deg, #d97706 0%, #f59e0b 100%)'
                    : 'var(--bg-card)',
                  border: backgroundTrack && backgroundTrack !== 'none'
                    ? '1px solid #fbbf24'
                    : '1px dashed var(--border-subtle)',
                  color: backgroundTrack && backgroundTrack !== 'none' ? '#ffffff' : 'var(--text-muted)',
                  fontSize: '11px',
                  fontWeight: '700'
                }}
              >
                {backgroundTrack && backgroundTrack !== 'none' ? (
                  <span>🎵 Active BG Music Track ({backgroundTrack.toUpperCase()})</span>
                ) : (
                  <span>+ Select Background Music in Audio Panel</span>
                )}
              </div>
            </div>

            {/* Red Scrubbable Playhead Line */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: `${currentTime * pxPerSec}px`,
                width: '2px',
                backgroundColor: 'var(--playhead-red)',
                pointerEvents: 'none',
                zIndex: 35,
                boxShadow: '0 0 12px var(--playhead-red)'
              }}
            >
              {/* Top playhead handle */}
              <div className="playhead-head" />
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
