import React, { useRef, useEffect } from 'react';

export default function AudioWaveformCanvas({ isPlaying, width = 800, height = 30 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId;
    let phase = 0;

    const drawWave = () => {
      ctx.clearRect(0, 0, width, height);

      const bars = Math.floor(width / 4);
      const centerY = height / 2;

      for (let i = 0; i < bars; i++) {
        // Pseudo-random dynamic audio spectrum heights
        const x = i * 4;
        const normalized = Math.sin((i * 0.1) + phase) * Math.cos((i * 0.05) + phase);
        const barHeight = Math.max(3, Math.abs(normalized) * (height - 6));

        // Gradient for audio waveform
        const grad = ctx.createLinearGradient(0, centerY - barHeight / 2, 0, centerY + barHeight / 2);
        grad.addColorStop(0, '#f472b6');
        grad.addColorStop(1, '#ec4899');

        ctx.fillStyle = grad;
        ctx.fillRect(x, centerY - barHeight / 2, 2, barHeight);
      }

      if (isPlaying) {
        phase += 0.15;
        animId = requestAnimationFrame(drawWave);
      }
    };

    drawWave();

    return () => {
      if (animId) cancelAnimationFrame(animId);
    };
  }, [isPlaying, width, height]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{
        width: '100%',
        height: '100%',
        display: 'block',
        pointerEvents: 'none',
        opacity: 0.85
      }}
    />
  );
}
