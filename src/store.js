import { create } from 'zustand';

export const useEditorStore = create((set, get) => ({
  // Core Video Engine State
  videoFile: null,
  videoSrc: null,
  duration: 15,
  currentTime: 0,
  isPlaying: false,

  // Subtitles & Track Media Clips State
  subtitles: [
    { id: 'sub-1', start: 0, end: 3.5, text: 'Welcome to Magic Pro' },
    { id: 'sub-2', start: 3.8, end: 7.2, text: 'Automatic AI Subtitles & Kinetic Captions' },
    { id: 'sub-3', start: 7.5, end: 11.0, text: 'Export in High Quality 1080p 60fps' }
  ],
  selectedSubId: null,
  overlayImages: [],
  selectedImageId: null,
  backgroundTrack: null,

  // Settings & Canvas Controls
  aspectRatio: '16:9',
  playbackSpeed: 1.0,
  isMuted: false,
  volumeLevel: 1.0,
  zoomLevel: 100,

  // Core Video Actions
  setVideoFile: (file) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    set({ videoFile: file, videoSrc: url, isPlaying: false, currentTime: 0 });
  },

  setVideoSrc: (src) => set({ videoSrc: src }),
  setDuration: (duration) => set({ duration: Math.max(1, duration) }),
  setCurrentTime: (time) => {
    const { duration } = get();
    const safeTime = Math.max(0, Math.min(duration, time));
    set({ currentTime: safeTime });
  },
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  togglePlayPause: () => set((state) => ({ isPlaying: !state.isPlaying })),

  // Subtitles Actions
  setSubtitles: (subtitles) => {
    if (typeof subtitles === 'function') {
      set((state) => ({ subtitles: subtitles(state.subtitles) }));
    } else {
      set({ subtitles });
    }
  },
  setSelectedSubId: (id) => set({ selectedSubId: id }),

  // Overlay Images Actions
  setOverlayImages: (overlayImages) => {
    if (typeof overlayImages === 'function') {
      set((state) => ({ overlayImages: overlayImages(state.overlayImages) }));
    } else {
      set({ overlayImages });
    }
  },
  setSelectedImageId: (id) => set({ selectedImageId: id }),

  // Settings Actions
  setAspectRatio: (aspectRatio) => set({ aspectRatio }),
  setPlaybackSpeed: (playbackSpeed) => set({ playbackSpeed }),
  setIsMuted: (isMuted) => set({ isMuted }),
  setVolumeLevel: (volumeLevel) => set({ volumeLevel }),
  setZoomLevel: (zoomLevel) => set({ zoomLevel })
}));
