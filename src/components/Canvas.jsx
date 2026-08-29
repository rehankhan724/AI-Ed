import React, { useRef, useState, useEffect } from 'react';
import { Upload, Film, Sparkles, Volume2, Move, Trash2 } from 'lucide-react';
import { useEditorStore } from '../store';

export default function Canvas() {
  const {
    videoSrc,
    setVideoFile,
    currentTime,
    setCurrentTime,
    isPlaying,
    setIsPlaying,
    setDuration,
    subtitles,
    overlayImages,
    selectedImageId,
    setSelectedImageId,
    onUpdateOverlayImage,
    onDeleteOverlayImage,
    aspectRatio,
    playbackSpeed,
    isMuted,
    volumeLevel
  } = useEditorStore();

  const videoRef = useRef(null);
  const fileInputRef = useRef(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  // Sync Video Element with Store State
  useEffect(() => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.play().catch(() => {});
    } else {
      videoRef.current.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    if (!videoRef.current) return;
    if (Math.abs(videoRef.current.currentTime - currentTime) > 0.3) {
      videoRef.current.currentTime = currentTime;
    }
  }, [currentTime]);

  useEffect(() => {
    if (!videoRef.current) return;
    videoRef.current.playbackRate = playbackSpeed;
  }, [playbackSpeed]);

  useEffect(() => {
    if (!videoRef.current) return;
    videoRef.current.muted = isMuted;
    videoRef.current.volume = volumeLevel;
  }, [isMuted, volumeLevel]);

  // Drag and Drop Upload Handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('video/')) {
        setVideoFile(file);
      }
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setVideoFile(e.target.files[0]);
    }
  };

  // Find Active Subtitle Caption Block
  const activeSub = subtitles.find(
    (sub) => currentTime >= sub.start && currentTime <= sub.end
  );

  // Aspect Ratio Dimensions Calculation
  const getAspectDimensions = () => {
    switch (aspectRatio) {
      case '9:16':
        return { width: '315px', height: '560px' };
      case '1:1':
        return { width: '480px', height: '480px' };
      case '4:5':
        return { width: '400px', height: '500px' };
      case '16:9':
      default:
        return { width: '850px', height: '478px' };
    }
  };

  const dim = getAspectDimensions();

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className="flex-1 flex items-center justify-center relative overflow-hidden bg-slate-950 p-6 select-none"
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="video/*"
        className="hidden"
      />

      {!videoSrc ? (
        /* Drag-and-Drop Video Upload Zone */
        <div
          onClick={() => fileInputRef.current?.click()}
          className={`w-full max-w-2xl h-96 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center p-8 text-center cursor-pointer transition-all duration-200 ${
            isDraggingOver
              ? 'border-teal-400 bg-teal-500/10 scale-102 shadow-2xl shadow-teal-500/20'
              : 'border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-900 shadow-xl'
          }`}
        >
          <div className="w-16 h-16 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 mb-5 shadow-inner">
            <Upload className="w-8 h-8 animate-pulse" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">
            Drag & Drop your video here
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mb-6 leading-relaxed">
            Supports MP4, MOV, WebM or AVI. Auto-generates AI subtitles & multi-track timeline visualization.
          </p>
          <button className="px-5 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg shadow-teal-500/25 transition-all hover:scale-105 active:scale-95">
            Browse Files
          </button>
        </div>
      ) : (
        /* Active Studio Video Monitor Player */
        <div
          style={dim}
          className="relative bg-black rounded-2xl shadow-2xl shadow-black border border-slate-800 overflow-hidden flex items-center justify-center transition-all duration-300"
        >
          <video
            ref={videoRef}
            src={videoSrc}
            onLoadedMetadata={(e) => setDuration(e.target.duration)}
            onTimeUpdate={(e) => setCurrentTime(e.target.currentTime)}
            onEnded={() => setIsPlaying(false)}
            className="w-full h-full object-contain"
          />

          {/* Active Live Subtitle Overlay */}
          {activeSub && (
            <div className="absolute bottom-10 left-0 right-0 flex justify-center px-6 pointer-events-none z-20">
              <div className="bg-black/80 backdrop-blur-md text-teal-300 px-4 py-2 rounded-xl border border-teal-500/40 text-base font-extrabold shadow-2xl shadow-teal-500/30 tracking-wide text-center animate-fadeIn">
                {activeSub.text}
              </div>
            </div>
          )}

          {/* Overlaid Images Synced to Timeline */}
          {overlayImages && overlayImages.map((img) => {
            const isVisible =
              currentTime >= (img.start ?? 0) &&
              currentTime <= (img.end ?? ((img.start ?? 0) + 4));

            if (!isVisible) return null;

            const isSelected = selectedImageId === img.id;

            return (
              <div
                key={img.id}
                onClick={() => setSelectedImageId && setSelectedImageId(img.id)}
                style={{
                  position: 'absolute',
                  top: `${img.y ?? 20}%`,
                  left: `${img.x ?? 20}%`,
                  transform: `scale(${img.scale ?? 1})`,
                  zIndex: isSelected ? 30 : 15
                }}
                className={`cursor-move transition-shadow ${
                  isSelected ? 'ring-2 ring-teal-400 rounded-lg shadow-2xl' : ''
                }`}
              >
                <img
                  src={img.url}
                  alt={img.title || 'Overlay'}
                  className="max-w-[140px] max-h-[140px] object-cover rounded-lg shadow-lg"
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
