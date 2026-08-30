import React, { useRef, useState, useEffect } from 'react';
import { Film, Music, MessageSquare, Volume2, Image as ImageIcon } from 'lucide-react';

/* ── Inline SVG Waveform ── */
function WaveformSVG({ seed = 0 }) {
  const H = 40, W = 800, cy = H / 2;
  const raw = [4,9,16,24,20,32,22,38,30,42,34,24,16,36,28,20,30,22,16,28,38,26,18,12,32,36,20,14,34,26,42,22,16,30,20,12,28,38,22,18,10,24,34,42,26,20,16,12,22,30,38,24,18,32,22,16,10,26,20,40,24,30,22,14,18,32,40,24,20,16,26,22,12,28,38,32,20,10,24,28,18,36,22,14,28,24,20,16,30,38,22,26,18,12,24,28,20,36,24,16,8,14,22,30,18,26,34,20,12,8,18,28,36,22,16,10,24,18,30,26,14,20,32,24,16,10,18,26,34,20];
  const n = raw.length;
  const step = W / n;
  const maxAmp = 44;

  let d = `M 0 ${cy}`;
  raw.forEach((a, i) => {
    const x = i * step;
    const s = (a / maxAmp) * (cy - 3) * (1 + (seed % 3) * 0.08);
    d += ` L ${x.toFixed(1)} ${(cy - s).toFixed(1)}`;
  });
  d += ` L ${W} ${cy}`;
  [...raw].reverse().forEach((a, i) => {
    const x = W - i * step;
    const s = (a / maxAmp) * (cy - 3) * (1 + (seed % 3) * 0.08);
    d += ` L ${x.toFixed(1)} ${(cy + s).toFixed(1)}`;
  });
  d += ' Z';

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%" preserveAspectRatio="none">
      <defs>
        <linearGradient id={`wg${seed}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#a7f3d0" stopOpacity="0.9" />
          <stop offset="40%" stopColor="#34d399" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#059669" stopOpacity="0.85" />
        </linearGradient>
      </defs>
      <path d={d} fill={`url(#wg${seed})`} />
      <line x1="0" y1={cy} x2={W} y2={cy} stroke="#5eead4" strokeWidth="1.2" strokeOpacity="0.7" />
    </svg>
  );
}

/* ── Combined Video+Audio Clip Block ── */
function VideoClip({ label, left, width, selected, pxPerSec }) {
  const thumbBg = `repeating-linear-gradient(90deg,
    #1e2837 0px, #1e2837 ${pxPerSec * 0.9}px,
    #252f40 ${pxPerSec * 0.9}px, #252f40 ${pxPerSec}px)`;

  return (
    <div style={{
      position: 'absolute',
      left: `${left}px`,
      width: `${Math.max(80, width)}px`,
      height: '88px',
      borderRadius: '6px',
      overflow: 'hidden',
      border: selected ? '2px solid #ffffff' : '1px solid rgba(255,255,255,0.15)',
      boxShadow: selected
        ? '0 0 0 1px rgba(255,255,255,0.4), 0 4px 20px rgba(0,0,0,0.6)'
        : '0 2px 10px rgba(0,0,0,0.5)',
      display: 'flex',
      flexDirection: 'column',
      cursor: 'grab',
      zIndex: selected ? 5 : 2,
    }}>
      {/* Top 60% — video thumbnails */}
      <div style={{
        flex: '0 0 60%',
        background: thumbBg,
        backgroundSize: `${pxPerSec}px 100%`,
        position: 'relative',
        display: 'flex',
        alignItems: 'flex-start',
        padding: '4px 6px',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '4px',
          background: 'rgba(0,0,0,0.55)', borderRadius: '3px',
          padding: '2px 5px',
        }}>
          <div style={{ width: 0, height: 0, borderTop: '4px solid transparent', borderBottom: '4px solid transparent', borderLeft: '6px solid #ffffff', marginRight: '1px' }} />
          <span style={{ fontSize: '9px', fontWeight: '700', color: '#ffffff', letterSpacing: '0.2px', whiteSpace: 'nowrap', overflow: 'hidden', maxWidth: '110px', textOverflow: 'ellipsis' }}>
            {label}
          </span>
        </div>
      </div>

      {/* Bottom 40% — audio waveform */}
      <div style={{
        flex: '0 0 40%',
        background: '#0d1f1c',
        overflow: 'hidden',
        borderTop: '1px solid rgba(52,211,153,0.2)',
      }}>
        <WaveformSVG seed={label.charCodeAt(3) || 1} />
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   MAIN TIMELINE COMPONENT
══════════════════════════════════════════════════════ */
export default function Timeline({
  duration, currentTime, setCurrentTime,
  subtitles, setSubtitles, selectedSubId, setSelectedSubId,
  zoomLevel, isPlaying, backgroundTrack,
  overlayImages = [], selectedImageId, setSelectedImageId, onUpdateOverlayImage
}) {
  const timelineRef = useRef(null);
  const [isDraggingPlayhead, setIsDraggingPlayhead] = useState(false);
  const [resizingClip, setResizingClip] = useState(null);
  const [draggingClip, setDraggingClip] = useState(null);

  const pxPerSec = (zoomLevel / 100) * 45;
  const timelineWidth = Math.max(1200, duration * pxPerSec);
  const RULER_H = 28;
  const ROW_H = 44;
  const VID_ROW_H = 100;

  const renderTimeRuler = () => {
    const ticks = [];
    const step = duration > 60 ? 10 : duration > 30 ? 5 : 2;
    for (let sec = 0; sec <= Math.ceil(duration); sec += step) {
      const left = sec * pxPerSec;
      ticks.push(
        <div key={sec} style={{ position: 'absolute', left: `${left}px`, top: 0, bottom: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', pointerEvents: 'none' }}>
          <span style={{ fontSize: '10px', color: '#64748b', transform: 'translateX(-50%)', fontWeight: '700', letterSpacing: '0.3px', paddingTop: '4px' }}>{sec}s</span>
          <div style={{ width: '1px', height: '6px', backgroundColor: 'rgba(255,255,255,0.12)', marginTop: 'auto' }} />
        </div>
      );
    }
    return ticks;
  };

  const handleTimelinePointerDown = (e) => {
    if (!timelineRef.current) return;
    const rect = timelineRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left + timelineRef.current.scrollLeft;
    setCurrentTime(Math.max(0, Math.min(duration, clickX / pxPerSec)));
    setIsDraggingPlayhead(true);
  };

  useEffect(() => {
    const onMove = (e) => {
      if (isDraggingPlayhead && timelineRef.current) {
        const rect = timelineRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left + timelineRef.current.scrollLeft;
        setCurrentTime(Math.max(0, Math.min(duration, x / pxPerSec)));
      }
      if (resizingClip && timelineRef.current) {
        const delta = (e.clientX - resizingClip.initialX) / pxPerSec;
        const tImg = overlayImages.find(im => im.id === resizingClip.id);
        if (tImg && onUpdateOverlayImage) {
          if (resizingClip.side === 'left') {
            onUpdateOverlayImage(tImg.id, { start: parseFloat(Math.max(0, Math.min((tImg.end ?? 4) - 0.5, resizingClip.initialStart + delta)).toFixed(2)) });
          } else {
            onUpdateOverlayImage(tImg.id, { end: parseFloat(Math.max((tImg.start ?? 0) + 0.5, Math.min(duration, resizingClip.initialEnd + delta)).toFixed(2)) });
          }
        } else {
          setSubtitles(prev => prev.map(s => {
            if (s.id !== resizingClip.id) return s;
            if (resizingClip.side === 'left') return { ...s, start: parseFloat(Math.max(0, Math.min(s.end - 0.2, resizingClip.initialStart + delta)).toFixed(2)) };
            return { ...s, end: parseFloat(Math.max(s.start + 0.2, Math.min(duration, resizingClip.initialEnd + delta)).toFixed(2)) };
          }));
        }
      }
      if (draggingClip && timelineRef.current) {
        const delta = (e.clientX - draggingClip.initialX) / pxPerSec;
        const tImg = overlayImages.find(im => im.id === draggingClip.id);
        if (tImg && onUpdateOverlayImage) {
          const ns = Math.max(0, Math.min(duration - draggingClip.clipDur, draggingClip.initialStart + delta));
          onUpdateOverlayImage(tImg.id, { start: parseFloat(ns.toFixed(2)), end: parseFloat((ns + draggingClip.clipDur).toFixed(2)) });
        } else {
          setSubtitles(prev => prev.map(s => {
            if (s.id !== draggingClip.id) return s;
            const ns = Math.max(0, Math.min(duration - draggingClip.clipDur, draggingClip.initialStart + delta));
            return { ...s, start: parseFloat(ns.toFixed(2)), end: parseFloat((ns + draggingClip.clipDur).toFixed(2)) };
          }));
        }
      }
    };
    const onUp = () => { setIsDraggingPlayhead(false); setResizingClip(null); setDraggingClip(null); };
    if (isDraggingPlayhead || resizingClip || draggingClip) {
      window.addEventListener('mousemove', onMove);
      window.addEventListener('mouseup', onUp);
    }
    return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
  }, [isDraggingPlayhead, resizingClip, draggingClip, duration, pxPerSec, setCurrentTime, setSubtitles]);

  const row = (h, extra = {}) => ({
    height: `${h}px`, borderBottom: '1px solid rgba(255,255,255,0.05)',
    display: 'flex', alignItems: 'center', position: 'relative', flexShrink: 0, ...extra
  });

  const sideRow = (h, icon, label, color) => (
    <div style={{ height: `${h}px`, borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', padding: '0 12px', gap: '8px', color, fontSize: '11.5px', fontWeight: '700', flexShrink: 0 }}>
      {icon}<span>{label}</span>
    </div>
  );

  /* ── 3 video clip segments ── */
  const totalVidW = Math.max(120, duration * pxPerSec);
  const clipW = totalVidW / 3;
  const vidClips = [
    { label: 'VID20260125153...', left: 0,         w: clipW,     selected: false },
    { label: 'VID20260125153003', left: clipW,      w: clipW,     selected: true  },
    { label: 'VID20260125152913', left: clipW * 2,  w: clipW,     selected: false },
  ];

  return (
    <div style={{ height: '288px', backgroundColor: 'var(--bg-timeline)', display: 'flex', flexDirection: 'column', borderTop: '1px solid var(--border-subtle)', userSelect: 'none', position: 'relative' }}>
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        {/* ── LEFT SIDEBAR ── */}
        <div style={{ width: '160px', flexShrink: 0, backgroundColor: '#0d1014', borderRight: '1px solid rgba(255,255,255,0.07)', display: 'flex', flexDirection: 'column', zIndex: 15 }}>
          {/* ruler corner */}
          <div style={{ height: `${RULER_H}px`, borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 12px', flexShrink: 0 }}>
            <span style={{ fontSize: '10px', color: '#64748b', fontWeight: '800', letterSpacing: '0.8px' }}>TRACKS</span>
            <span style={{ fontSize: '9px', color: '#00d294', background: 'rgba(0,210,148,0.14)', padding: '2px 7px', borderRadius: '4px', fontWeight: '700' }}>{subtitles.length} CLIPS</span>
          </div>
          {sideRow(ROW_H,     <MessageSquare size={14}/>, 'Subtitles',     '#34d399')}
          {sideRow(VID_ROW_H, <Film size={14}/>,          'Video Track',   '#22d3ee')}
          {sideRow(ROW_H,     <ImageIcon size={14}/>,     'Image Overlay', '#fbbf24')}
          {sideRow(ROW_H,     <Music size={14}/>,         'Audio Wave',    '#fb7185')}
          {sideRow(ROW_H,     <Volume2 size={14}/>,       'BG Music',      '#10b981')}
        </div>

        {/* ── SCROLLABLE CANVAS ── */}
        <div ref={timelineRef} onMouseDown={handleTimelinePointerDown}
          style={{ flex: 1, overflowX: 'auto', overflowY: 'hidden', position: 'relative', backgroundColor: 'var(--bg-timeline)' }}>
          <div style={{ width: `${timelineWidth}px`, height: '100%', position: 'relative', display: 'flex', flexDirection: 'column' }}>

            {/* Ruler */}
            <div style={{ height: `${RULER_H}px`, flexShrink: 0, borderBottom: '1px solid rgba(255,255,255,0.07)', position: 'relative', backgroundColor: '#0a0d10' }}>
              {renderTimeRuler()}
            </div>

            {/* Track 1 – Subtitle clips */}
            <div style={row(ROW_H, { backgroundColor: 'rgba(255,255,255,0.01)' })}>
              {subtitles.map((sub) => {
                const left = sub.start * pxPerSec;
                const width = (sub.end - sub.start) * pxPerSec;
                const sel = selectedSubId === sub.id;
                return (
                  <div key={sub.id}
                    onClick={(e) => { e.stopPropagation(); setSelectedSubId(sub.id); setCurrentTime(sub.start); }}
                    onMouseDown={(e) => { if (e.target.classList.contains('resizer-handle')) return; setDraggingClip({ id: sub.id, initialX: e.clientX, initialStart: sub.start, clipDur: sub.end - sub.start }); }}
                    className={`track-subtitle-block ${sel ? 'selected' : ''}`}
                    style={{ position: 'absolute', left: `${left}px`, width: `${Math.max(26, width)}px`, height: '30px', display: 'flex', alignItems: 'center', padding: '0 10px', fontSize: '10.5px', fontWeight: '800', color: '#fff', cursor: 'grab', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', textTransform: 'uppercase' }}>
                    <div onMouseDown={(e) => { e.stopPropagation(); setResizingClip({ id: sub.id, side: 'left', initialX: e.clientX, initialStart: sub.start, initialEnd: sub.end }); }} className="resizer-handle resizer-left" />
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{sub.text}</span>
                    <div onMouseDown={(e) => { e.stopPropagation(); setResizingClip({ id: sub.id, side: 'right', initialX: e.clientX, initialStart: sub.start, initialEnd: sub.end }); }} className="resizer-handle resizer-right" />
                  </div>
                );
              })}
            </div>

            {/* Track 2 – Combined Video+Waveform clips */}
            <div style={row(VID_ROW_H, { backgroundColor: 'rgba(0,0,0,0.2)', padding: '6px 0' })}>
              {vidClips.map((vc) => (
                <VideoClip key={vc.label} label={vc.label} left={vc.left} width={vc.w} selected={vc.selected} pxPerSec={pxPerSec} />
              ))}
            </div>

            {/* Track 3 – Image Overlay */}
            <div style={row(ROW_H, { backgroundColor: 'rgba(255,255,255,0.01)' })}>
              {overlayImages && overlayImages.length > 0 ? (
                overlayImages.map((img) => {
                  const sel = selectedImageId === img.id;
                  const s = img.start ?? 0, e2 = img.end ?? (s + 4);
                  const cw = Math.max(30, (e2 - s) * pxPerSec);
                  return (
                    <div key={img.id}
                      onClick={() => setSelectedImageId && setSelectedImageId(img.id)}
                      onMouseDown={(e) => { if (e.target.classList.contains('resizer-handle')) return; setSelectedImageId && setSelectedImageId(img.id); setDraggingClip({ id: img.id, initialX: e.clientX, initialStart: s, clipDur: e2 - s }); }}
                      className={`track-subtitle-block ${sel ? 'selected' : ''}`}
                      style={{ position: 'absolute', left: `${s * pxPerSec}px`, width: `${cw}px`, height: '30px', display: 'flex', alignItems: 'center', padding: '0 10px', fontSize: '10.5px', fontWeight: '800', color: '#fff', background: sel ? 'linear-gradient(135deg,#b45309,#f59e0b)' : 'linear-gradient(135deg,#92400e,#d97706)', border: sel ? '2px solid #fcd34d' : '1px solid rgba(251,191,36,0.5)', boxShadow: sel ? '0 0 16px rgba(251,191,36,0.5)' : 'none', borderRadius: '4px', cursor: 'grab', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', zIndex: sel ? 5 : 2 }}>
                      <div onMouseDown={(e) => { e.stopPropagation(); setSelectedImageId && setSelectedImageId(img.id); setResizingClip({ id: img.id, side: 'left', initialX: e.clientX, initialStart: s, initialEnd: e2 }); }} className="resizer-handle resizer-left" />
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>🖼️ {img.title || 'Stock Image'}</span>
                      <div onMouseDown={(e) => { e.stopPropagation(); setSelectedImageId && setSelectedImageId(img.id); setResizingClip({ id: img.id, side: 'right', initialX: e.clientX, initialStart: s, initialEnd: e2 }); }} className="resizer-handle resizer-right" />
                    </div>
                  );
                })
              ) : (
                <div style={{ position: 'absolute', left: '8px', height: '28px', display: 'flex', alignItems: 'center', padding: '0 12px', borderRadius: '4px', border: '1px dashed rgba(255,255,255,0.1)', color: '#475569', fontSize: '10.5px', fontWeight: '600', whiteSpace: 'nowrap' }}>
                  + Drop image overlay here
                </div>
              )}
            </div>

            {/* Track 4 – Audio Wave (CSS gradient) */}
            <div style={row(ROW_H, { backgroundColor: 'rgba(0,0,0,0.1)' })}>
              <div style={{ position: 'absolute', left: 0, width: `${Math.max(60, duration * pxPerSec)}px`, height: '30px', borderRadius: '4px', border: '1px solid rgba(251,113,133,0.5)', boxShadow: '0 0 12px rgba(244,63,94,0.4)', overflow: 'hidden', cursor: 'grab', background: `repeating-linear-gradient(90deg,transparent 0px,transparent 2px,rgba(255,255,255,0.18) 2px,rgba(255,255,255,0.18) 3px),repeating-linear-gradient(180deg,rgba(255,255,255,0) 0%,rgba(255,255,255,0.22) 20%,rgba(255,255,255,0) 35%,rgba(255,255,255,0.28) 50%,rgba(255,255,255,0) 65%,rgba(255,255,255,0.22) 80%,rgba(255,255,255,0) 100%),linear-gradient(135deg,#e11d48 0%,#f43f5e 50%,#fb7185 100%)`, display: 'flex', alignItems: 'center' }}>
                <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '6px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '3px', backgroundColor: 'rgba(0,0,0,0.3)', cursor: 'col-resize' }}>
                  {[0,1,2].map(i => <div key={i} style={{ width: '1.5px', height: '6px', backgroundColor: 'rgba(255,255,255,0.5)', borderRadius: '1px' }} />)}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '0 14px', pointerEvents: 'none' }}>
                  <Music size={11} style={{ color: 'rgba(255,255,255,0.9)', flexShrink: 0 }} />
                  <span style={{ fontSize: '10px', fontWeight: '700', color: 'rgba(255,255,255,0.9)', whiteSpace: 'nowrap' }}>Audio Wave</span>
                </div>
                <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '6px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '3px', backgroundColor: 'rgba(0,0,0,0.3)', cursor: 'col-resize' }}>
                  {[0,1,2].map(i => <div key={i} style={{ width: '1.5px', height: '6px', backgroundColor: 'rgba(255,255,255,0.5)', borderRadius: '1px' }} />)}
                </div>
              </div>
            </div>

            {/* Track 5 – BG Music */}
            <div style={row(ROW_H, { backgroundColor: 'rgba(0,0,0,0.12)' })}>
              <div style={{ position: 'absolute', left: 0, width: `${Math.max(60, duration * pxPerSec)}px`, height: '30px', display: 'flex', alignItems: 'center', padding: '0 12px', borderRadius: '4px', background: backgroundTrack && backgroundTrack !== 'none' ? 'linear-gradient(135deg,#065f46,#10b981)' : 'transparent', border: backgroundTrack && backgroundTrack !== 'none' ? '1px solid rgba(16,185,129,0.5)' : '1px dashed rgba(255,255,255,0.08)', color: backgroundTrack && backgroundTrack !== 'none' ? '#fff' : '#475569', fontSize: '10.5px', fontWeight: '700', gap: '7px' }}>
                <Volume2 size={11} style={{ flexShrink: 0, opacity: 0.8 }} />
                {backgroundTrack && backgroundTrack !== 'none'
                  ? <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>🎵 {backgroundTrack.toUpperCase()}</span>
                  : <span style={{ whiteSpace: 'nowrap' }}>+ Select Background Music</span>}
              </div>
            </div>

            {/* ── Red Playhead ── */}
            <div style={{ position: 'absolute', top: 0, bottom: 0, left: `${currentTime * pxPerSec}px`, width: '2px', backgroundColor: '#ef4444', pointerEvents: 'none', zIndex: 50, boxShadow: '0 0 10px rgba(239,68,68,0.7)' }}>
              <div style={{ width: 0, height: 0, borderLeft: '6px solid transparent', borderRight: '6px solid transparent', borderTop: '10px solid #ef4444', marginLeft: '-5px', filter: 'drop-shadow(0 0 4px rgba(239,68,68,0.9))' }} />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
