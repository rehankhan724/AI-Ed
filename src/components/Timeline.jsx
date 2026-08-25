import React, { useRef, useState, useEffect } from 'react';
import { Type, Film, Music, MessageSquare, Volume2, Eye, Lock, Scissors, Plus } from 'lucide-react';
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
  isPlaying
}) {
  const timelineRef = useRef(null);
  const [isDraggingPlayhead, setIsDraggingPlayhead] = useState(false);
  const [resizingClip, setResizingClip] = useState(null); // { id, side, initialX, initialStart, initialEnd }
  const [draggingClip, setDraggingClip] = useState(null); // { id, initialX, initialStart, duration }

  // Scale: pixels per second based on zoom level
  const pxPerSec = (zoomLevel / 100) * 45;
  const timelineWidth = Math.max(1200, duration * pxPerSec);

  // Time ruler tick lines
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
          <span style={{ fontSize: '10px', color: '#64748b', transform: 'translateX(-50%)', fontWeight: '600' }}>
            {sec}s
          </span>
          <div style={{ width: '1px', height: '6px', backgroundColor: '#334155' }}></div>
        </div>
      );
    }
    return ticks;
  };

  // Click timeline to move playhead
  const handleTimelinePointerDown = (e) => {
    if (!timelineRef.current) return;
    const rect = timelineRef.current.getBoundingClientRect();
    const scrollLeft = timelineRef.current.scrollLeft;
    const clickX = e.clientX - rect.left + scrollLeft;
    const newSec = Math.max(0, Math.min(duration, clickX / pxPerSec));
    setCurrentTime(newSec);
    setIsDraggingPlayhead(true);
  };

  // Global Dragging & Resizing handler
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

      if (draggingClip && timelineRef.current) {
        const deltaX = e.clientX - draggingClip.initialX;
        const deltaSec = deltaX / pxPerSec;

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
      height: '240px',
      backgroundColor: '#070a13',
      display: 'flex',
      flexDirection: 'column',
      borderTop: '1px solid #1e293b',
      userSelect: 'none',
      position: 'relative'
    }}>
      {/* Track Headers & Timeline Canvas */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        
        {/* Track Headers Column (Left) */}
        <div style={{
          width: '150px',
          backgroundColor: '#0a0e19',
          borderRight: '1px solid #1e293b',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 15
        }}>
          {/* Top header corner */}
          <div style={{
            height: '30px',
            borderBottom: '1px solid #1e293b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 10px',
            fontSize: '10px',
            color: '#64748b',
            fontWeight: '700',
            letterSpacing: '0.5px'
          }}>
            <span>TRACKS</span>
            <span style={{ fontSize: '9px', color: '#38bdf8' }}>{subtitles.length} CLIPS</span>
          </div>

          {/* Track 1: Subtitles Track Header */}
          <div style={{
            height: '48px',
            borderBottom: '1px solid #1e293b',
            display: 'flex',
            alignItems: 'center',
            padding: '0 10px',
            gap: '8px',
            color: '#38bdf8',
            fontSize: '11px',
            fontWeight: '700'
          }}>
            <MessageSquare size={15} />
            <span>Subtitles</span>
          </div>

          {/* Track 2: Video Track Header */}
          <div style={{
            height: '48px',
            borderBottom: '1px solid #1e293b',
            display: 'flex',
            alignItems: 'center',
            padding: '0 10px',
            gap: '8px',
            color: '#10b981',
            fontSize: '11px',
            fontWeight: '700'
          }}>
            <Film size={15} />
            <span>Video Track</span>
          </div>

          {/* Track 3: Audio Visualizer Track Header */}
          <div style={{
            height: '48px',
            borderBottom: '1px solid #1e293b',
            display: 'flex',
            alignItems: 'center',
            padding: '0 10px',
            gap: '8px',
            color: '#ec4899',
            fontSize: '11px',
            fontWeight: '700'
          }}>
            <Music size={15} />
            <span>Audio Wave</span>
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
            backgroundColor: '#080c16'
          }}
        >
          <div style={{ width: `${timelineWidth}px`, height: '100%', position: 'relative' }}>
            
            {/* Time Ruler */}
            <div style={{
              height: '30px',
              borderBottom: '1px solid #1e293b',
              position: 'relative',
              backgroundColor: '#0b0f1c'
            }}>
              {renderTimeRuler()}
            </div>

            {/* Track 1: Subtitle Clips Canvas (Blue draggable blocks like photo) */}
            <div style={{
              height: '48px',
              borderBottom: '1px solid #1e293b',
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
                      width: `${Math.max(24, width)}px`,
                      height: '34px',
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

            {/* Track 2: Video Track Canvas (Teal block with video thumbnail strip) */}
            <div style={{
              height: '48px',
              borderBottom: '1px solid #1e293b',
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
                  height: '34px',
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
                <span style={{ fontSize: '10px', opacity: 0.8 }}>({duration.toFixed(1)}s HD)</span>
              </div>
            </div>

            {/* Track 3: Audio Waveform Canvas (Pink block with animated canvas bars) */}
            <div style={{
              height: '48px',
              borderBottom: '1px solid #1e293b',
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
                  height: '34px',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0 8px',
                  overflow: 'hidden'
                }}
              >
                <AudioWaveformCanvas isPlaying={isPlaying} width={duration * pxPerSec} height={30} />
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
                boxShadow: '0 0 10px rgba(244, 63, 94, 0.9)'
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
