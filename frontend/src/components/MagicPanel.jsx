import React, { useState, useRef, useCallback } from 'react';
import { Wand2, FolderOpen, Film, Music, FileText, Trash2, Play, CheckCircle, AlertCircle, Sparkles, ChevronRight, Mic } from 'lucide-react';

const BACKEND = 'http://localhost:3001';

const CAPTION_STYLES = [
  { id: 'drk-talks',   label: '🔥 DRK Talks',    desc: 'Exact Instagram Reel style' },
  { id: 'magic-pop',   label: '⚡ Word Pop',     desc: 'One word bounces in' },
  { id: 'magic-neon',  label: '🌈 Neon Glow',    desc: 'Glowing neon flash' },
  { id: 'magic-bold',  label: '👑 Hormozi Bold', desc: 'Yellow key words' },
  { id: 'magic-clean', label: '✨ Clean White',   desc: 'Minimal pill style' },
];

/* ── Recursively read a dropped folder entry ── */
const readDirEntry = (dirEntry) =>
  new Promise((resolve) => {
    const reader = dirEntry.createReader();
    const allEntries = [];
    const readBatch = () => {
      reader.readEntries((batch) => {
        if (!batch.length) return resolve(allEntries);
        allEntries.push(...batch);
        readBatch();
      });
    };
    readBatch();
  });

const entryToFile = (entry) =>
  new Promise((resolve) => entry.file(resolve));

const collectFiles = async (entry) => {
  if (entry.isFile) {
    const file = await entryToFile(entry);
    return [file];
  }
  if (entry.isDirectory) {
    const children = await readDirEntry(entry);
    const nested = await Promise.all(children.map(collectFiles));
    return nested.flat();
  }
  return [];
};

/* ── File row ── */
function FileRow({ file, type }) {
  const sizeMB = (file.size / 1024 / 1024).toFixed(1);
  const colors = {
    video:  { bg: 'linear-gradient(135deg,#0284c7,#38bdf8)', icon: <Film size={13} color="#fff" /> },
    audio:  { bg: 'linear-gradient(135deg,#6366f1,#8b5cf6)', icon: <Music size={13} color="#fff" /> },
    script: { bg: 'linear-gradient(135deg,#059669,#34d399)', icon: <FileText size={13} color="#fff" /> },
  };
  const c = colors[type] || colors.video;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '7px 10px', borderRadius: '6px', backgroundColor: 'rgba(255,255,255,0.03)' }}>
      <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: c.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        {c.icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: '11px', fontWeight: '700', color: '#f1f5f9', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{file.name}</div>
        <div style={{ fontSize: '9.5px', color: '#64748b' }}>{sizeMB} MB</div>
      </div>
      <div style={{ fontSize: '9px', fontWeight: '700', padding: '2px 6px', borderRadius: '3px', backgroundColor: 'rgba(255,255,255,0.07)', color: '#94a3b8' }}>
        {type.toUpperCase()}
      </div>
    </div>
  );
}

export default function MagicPanel({ onMagicComplete }) {
  const [folderName, setFolderName] = useState('');
  const [videoFiles, setVideoFiles] = useState([]);
  const [audioFile, setAudioFile] = useState(null);
  const [scriptFile, setScriptFile] = useState(null);
  const [captionScript, setCaptionScript] = useState('THIS IS THE END OF THE LINE WATCH HOW KINETIC CAPTIONS POP UP DYNAMICALLY IN YOUR VIRAL REEL');
  const [captionStyle, setCaptionStyle] = useState('drk-talks');
  const [isDragging, setIsDragging] = useState(false);
  const [status, setStatus] = useState('idle');
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [backendOk, setBackendOk] = useState(null);
  const folderInputRef = useRef(null);
  const progressRef = useRef(null);

  React.useEffect(() => {
    fetch(`${BACKEND}/health`)
      .then(r => r.json())
      .then(() => setBackendOk(true))
      .catch(() => setBackendOk(false));
  }, []);

  const classifyFile = (f) => {
    const n = f.name.toLowerCase();
    if (/\.(mp4|mov|webm|avi|mkv)$/.test(n)) return 'video';
    if (/\.(mp3|wav|m4a|aac|ogg)$/.test(n)) return 'audio';
    if (/\.(txt)$/.test(n)) return 'script';
    return null;
  };

  const processFiles = useCallback(async (files, name = 'Dropped Folder') => {
    const vids = [], audios = [], scripts = [];
    for (const f of files) {
      const type = classifyFile(f);
      if (type === 'video') vids.push(f);
      else if (type === 'audio') audios.push(f);
      else if (type === 'script') scripts.push(f);
    }
    vids.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));
    setFolderName(name);
    setVideoFiles(vids);
    setAudioFile(audios[0] || null);
    setScriptFile(scripts[0] || null);
    if (scripts[0]) {
      const text = await scripts[0].text();
      setCaptionScript(text.trim());
    }
  }, []);

  /* ── Folder drag & drop using webkitGetAsEntry ── */
  const handleDrop = useCallback(async (e) => {
    e.preventDefault();
    setIsDragging(false);
    const items = Array.from(e.dataTransfer.items);
    const allFiles = [];
    let name = 'Dropped Folder';
    for (const item of items) {
      const entry = item.webkitGetAsEntry?.();
      if (!entry) continue;
      if (entry.isDirectory) { name = entry.name; }
      const files = await collectFiles(entry);
      allFiles.push(...files);
    }
    await processFiles(allFiles, name);
  }, [processFiles]);

  /* ── Browse folder button (input[webkitdirectory]) ── */
  const handleFolderInput = useCallback(async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const name = files[0].webkitRelativePath?.split('/')[0] || 'Selected Folder';
    await processFiles(files, name);
  }, [processFiles]);

  const simulateProgress = () => {
    let p = 0; setProgress(0);
    progressRef.current = setInterval(() => {
      p += Math.random() * 2.5;
      if (p >= 90) { clearInterval(progressRef.current); p = 90; }
      setProgress(Math.round(p));
    }, 500);
  };

  const handleAssemble = async () => {
    if (!videoFiles.length) return;
    setStatus('processing'); setErrorMsg(''); simulateProgress();
    try {
      const form = new FormData();
      videoFiles.forEach(f => form.append('files', f));
      if (audioFile) form.append('files', audioFile);
      form.append('captionScript', captionScript);
      form.append('captionStyle', captionStyle);
      const sid = (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : Math.random().toString(36).slice(2);
      const res = await fetch(`${BACKEND}/api/magic/assemble`, { method: 'POST', headers: { 'x-session-id': sid }, body: form });
      const data = await res.json();
      clearInterval(progressRef.current);
      if (!res.ok || !data.success) throw new Error(data.error || 'Assembly failed');
      setProgress(100); setStatus('done'); setResult({ ...data, captionStyle });
      if (onMagicComplete) onMagicComplete({ ...data, captionStyle });
    } catch (err) {
      clearInterval(progressRef.current);
      setStatus('error'); setErrorMsg(err.message);
    }
  };

  const reset = () => {
    setFolderName(''); setVideoFiles([]); setAudioFile(null); setScriptFile(null);
    setCaptionScript(''); setStatus('idle'); setProgress(0); setResult(null); setErrorMsg('');
    if (folderInputRef.current) folderInputRef.current.value = '';
  };

  const hasFolder = folderName && (videoFiles.length > 0 || audioFile);

  return (
    <div style={{ width: '360px', backgroundColor: '#12151a', display: 'flex', flexDirection: 'column', color: '#f8fafc', fontSize: '13px', height: '100%', overflowY: 'auto' }}>

      {/* Header */}
      <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.08)', background: 'linear-gradient(135deg,rgba(139,92,246,0.15),rgba(99,102,241,0.1))', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '9px', background: 'linear-gradient(135deg,#8b5cf6,#6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 16px rgba(139,92,246,0.5)' }}>
            <Wand2 size={17} color="#fff" />
          </div>
          <div>
            <div style={{ fontWeight: '800', fontSize: '15px' }}>Magic</div>
            <div style={{ fontSize: '10px', color: '#8b5cf6', fontWeight: '700' }}>Drop a folder — we handle the rest</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '3px 8px', borderRadius: '20px', background: backendOk ? 'rgba(0,210,148,0.12)' : 'rgba(239,68,68,0.12)', border: `1px solid ${backendOk ? 'rgba(0,210,148,0.3)' : 'rgba(239,68,68,0.3)'}`, fontSize: '9px', fontWeight: '800', color: backendOk ? '#00d294' : '#ef4444' }}>
          <div style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: backendOk ? '#00d294' : '#ef4444' }} />
          {backendOk === null ? 'CHECKING' : backendOk ? 'BACKEND OK' : 'OFFLINE'}
        </div>
      </div>

      <div style={{ padding: '14px', flex: 1 }}>

        {/* Backend offline */}
        {backendOk === false && (
          <div style={{ padding: '12px', borderRadius: '8px', marginBottom: '14px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)' }}>
            <div style={{ fontSize: '11.5px', fontWeight: '700', color: '#ef4444', marginBottom: '5px', display: 'flex', alignItems: 'center', gap: '6px' }}><AlertCircle size={13} /> Backend Offline</div>
            <code style={{ fontSize: '10px', color: '#a78bfa', display: 'block', lineHeight: 1.6 }}>
              cd d:\AI-ED\backend{'\n'}node server.js
            </code>
          </div>
        )}



        {status === 'done' && result ? (
          /* Done */
          <div style={{ textAlign: 'center', padding: '16px 0' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', margin: '0 auto 12px', background: 'linear-gradient(135deg,#00d294,#00b37e)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 24px rgba(0,210,148,0.5)' }}>
              <CheckCircle size={28} color="#fff" />
            </div>
            <div style={{ fontWeight: '800', fontSize: '16px', marginBottom: '4px' }}>Magic Complete! 🎉</div>
            <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '16px' }}>{result.clipCount} clips · {result.totalDuration?.toFixed(1)}s · {result.hasAudio ? 'With voiceover' : 'No audio'}</div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => window.open(result.outputUrl, '_blank')} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', background: 'linear-gradient(135deg,#8b5cf6,#6366f1)', color: '#fff', fontWeight: '700', fontSize: '12.5px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', boxShadow: '0 4px 16px rgba(139,92,246,0.4)' }}>
                <Play size={14} /> Preview
              </button>
              <button onClick={reset} style={{ flex: 1, padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#f1f5f9', fontWeight: '700', fontSize: '12.5px', cursor: 'pointer' }}>
                New Magic
              </button>
            </div>
          </div>

        ) : status === 'processing' ? (
          /* Processing */
          <div style={{ textAlign: 'center', padding: '28px 0' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', margin: '0 auto 16px', background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 30px rgba(139,92,246,0.3)' }}>
              <Wand2 size={28} style={{ color: '#a78bfa', animation: 'spin 2s linear infinite' }} />
            </div>
            <div style={{ fontWeight: '800', fontSize: '15px', marginBottom: '6px' }}>🪄 Assembling Magic...</div>
            <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '20px' }}>FFmpeg is stitching {videoFiles.length} clips</div>
            <div style={{ backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: '8px', height: '6px', overflow: 'hidden', marginBottom: '8px' }}>
              <div style={{ height: '100%', borderRadius: '8px', background: 'linear-gradient(90deg,#8b5cf6,#6366f1,#a78bfa)', width: `${progress}%`, transition: 'width 0.4s ease', boxShadow: '0 0 10px rgba(139,92,246,0.6)' }} />
            </div>
            <div style={{ fontSize: '11px', color: '#a78bfa', fontWeight: '700' }}>{progress}%</div>
          </div>

        ) : (
          <>
            {/* Drop Zone */}
            <div
              onDrop={handleDrop}
              onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onClick={() => folderInputRef.current?.click()}
              style={{ border: `2px dashed ${isDragging ? '#8b5cf6' : hasFolder ? 'rgba(0,210,148,0.4)' : 'rgba(255,255,255,0.12)'}`, borderRadius: '12px', padding: hasFolder ? '14px 16px' : '24px 16px', textAlign: 'center', cursor: 'pointer', marginBottom: '14px', transition: 'all 0.2s ease', background: isDragging ? 'rgba(139,92,246,0.1)' : hasFolder ? 'rgba(0,210,148,0.05)' : 'rgba(255,255,255,0.02)' }}>
              <input ref={folderInputRef} type="file" webkitdirectory="true" directory="" multiple onChange={handleFolderInput} style={{ display: 'none' }} />

              {hasFolder ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', textAlign: 'left' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'linear-gradient(135deg,rgba(0,210,148,0.2),rgba(0,210,148,0.1))', border: '1px solid rgba(0,210,148,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <FolderOpen size={20} style={{ color: '#00d294' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '800', fontSize: '13px', color: '#00d294' }}>📁 {folderName}</div>
                    <div style={{ fontSize: '10px', color: '#64748b', marginTop: '2px' }}>
                      {videoFiles.length} video{videoFiles.length !== 1 ? 's' : ''} · {audioFile ? '1 audio' : 'no audio'} · {scriptFile ? 'script found ✓' : 'no script'}
                    </div>
                  </div>
                  <button onClick={e => { e.stopPropagation(); reset(); }} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', opacity: 0.7, padding: '4px' }}>
                    <Trash2 size={14} />
                  </button>
                </div>
              ) : (
                <>
                  <div style={{ width: '44px', height: '44px', borderRadius: '12px', margin: '0 auto 10px', background: 'linear-gradient(135deg,rgba(139,92,246,0.2),rgba(99,102,241,0.2))', border: '1px solid rgba(139,92,246,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FolderOpen size={22} style={{ color: '#a78bfa' }} />
                  </div>
                  <div style={{ fontWeight: '700', fontSize: '13px', color: '#e2e8f0', marginBottom: '4px' }}>Drop your project folder here</div>
                  <div style={{ fontSize: '10.5px', color: '#64748b' }}>Or click to browse folder</div>
                </>
              )}
            </div>

            {/* Detected files */}
            {hasFolder && (
              <div style={{ marginBottom: '14px' }}>
                <div style={{ fontSize: '10px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '7px' }}>Detected Files</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', backgroundColor: '#1a1f28', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)', padding: '6px', maxHeight: '160px', overflowY: 'auto' }}>
                  {videoFiles.map((f, i) => <FileRow key={i} file={f} type="video" />)}
                  {audioFile && <FileRow file={audioFile} type="audio" />}
                  {scriptFile && <FileRow file={scriptFile} type="script" />}
                </div>
              </div>
            )}

            {/* Caption script */}
            <div style={{ marginBottom: '14px' }}>
              <div style={{ fontSize: '10px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '7px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Mic size={11} /> Caption Script {scriptFile && <span style={{ color: '#00d294', fontSize: '9px' }}>(auto-loaded from script.txt)</span>}
              </div>
              <textarea value={captionScript} onChange={e => setCaptionScript(e.target.value)} placeholder="Paste voiceover script here. Words sync to video automatically..." rows={3}
                style={{ width: '100%', backgroundColor: '#1b2028', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '10px', color: '#fff', fontSize: '12px', resize: 'vertical', outline: 'none', fontFamily: 'Inter,sans-serif', lineHeight: 1.6, transition: 'border-color 0.15s' }}
                onFocus={e => e.target.style.borderColor = 'rgba(139,92,246,0.5)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'} />
              {captionScript.trim() && <div style={{ fontSize: '10px', color: '#6366f1', marginTop: '3px' }}>{captionScript.trim().split(/\s+/).length} words will be synced</div>}
            </div>

            {/* Caption style */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '10px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Sparkles size={11} /> Caption Style
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '7px' }}>
                {CAPTION_STYLES.map(s => (
                  <button key={s.id} onClick={() => setCaptionStyle(s.id)} style={{ padding: '9px 10px', textAlign: 'left', borderRadius: '8px', cursor: 'pointer', background: captionStyle === s.id ? 'rgba(139,92,246,0.18)' : 'rgba(255,255,255,0.03)', border: captionStyle === s.id ? '1px solid rgba(139,92,246,0.5)' : '1px solid rgba(255,255,255,0.07)', transition: 'all 0.15s' }}>
                    <div style={{ fontSize: '11.5px', fontWeight: '700', color: captionStyle === s.id ? '#a78bfa' : '#e2e8f0', marginBottom: '2px' }}>{s.label}</div>
                    <div style={{ fontSize: '9.5px', color: '#64748b' }}>{s.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Error */}
            {status === 'error' && (
              <div style={{ padding: '10px 12px', borderRadius: '8px', marginBottom: '12px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                <AlertCircle size={13} style={{ color: '#ef4444', flexShrink: 0, marginTop: '1px' }} />
                <div style={{ fontSize: '11px', color: '#fca5a5' }}>{errorMsg}</div>
              </div>
            )}

            {/* Magic button */}
            <button onClick={handleAssemble} disabled={!videoFiles.length || backendOk === false}
              style={{ width: '100%', padding: '13px', borderRadius: '10px', border: 'none', background: !videoFiles.length || backendOk === false ? 'rgba(255,255,255,0.05)' : 'linear-gradient(135deg,#7c3aed,#6366f1,#8b5cf6)', color: !videoFiles.length || backendOk === false ? '#475569' : '#fff', fontWeight: '800', fontSize: '14px', cursor: !videoFiles.length || backendOk === false ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '9px', boxShadow: !videoFiles.length || backendOk === false ? 'none' : '0 4px 20px rgba(124,58,237,0.5)', transition: 'all 0.2s' }}>
              <Wand2 size={17} />
              {!videoFiles.length ? 'Drop a folder first' : `🪄 Generate Magic (${videoFiles.length} clips)`}
            </button>

            {videoFiles.length > 0 && (
              <div style={{ marginTop: '10px', display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                {videoFiles.map((f, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '3px', backgroundColor: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', padding: '2px 7px', borderRadius: '4px', fontSize: '10px', color: '#a78bfa', fontWeight: '600' }}>
                    <ChevronRight size={9} />{f.name.replace(/\.[^.]+$/, '')}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
