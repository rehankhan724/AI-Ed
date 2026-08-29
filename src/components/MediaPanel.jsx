import React, { useState, useEffect } from 'react';
import { Search, Image as ImageIcon, Sparkles, Plus, Check, Filter, Trash2, Sliders, Clock, Layers } from 'lucide-react';
import { searchStockPhotos } from '../services/stockMediaService';

export default function MediaPanel({
  aspectRatio = '16:9',
  currentTime = 0,
  overlayImages = [],
  selectedImageId,
  setSelectedImageId,
  onAddOverlayImage,
  onUpdateOverlayImage,
  onDeleteOverlayImage
}) {
  const [searchQuery, setSearchQuery] = useState('phone');
  const [selectedRatio, setSelectedRatio] = useState('auto');
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [insertedId, setInsertedId] = useState(null);

  const categories = [
    { id: 'phone', label: '📱 Phone' },
    { id: 'coffee', label: '☕ Coffee' },
    { id: 'cyberpunk', label: '⚡ Cyber' },
    { id: 'nature', label: '🌿 Nature' },
    { id: 'fitness', label: '💪 Fitness' },
    { id: 'technology', label: '💻 Tech' },
    { id: 'car', label: '🚗 Cars' },
    { id: 'city', label: '🏙️ City' },
    { id: 'background', label: '✨ BG' }
  ];

  const effectiveRatio = selectedRatio === 'auto' ? aspectRatio : selectedRatio;
  const activeClip = overlayImages.find(img => img.id === selectedImageId) || overlayImages[overlayImages.length - 1];

  const handlePerformSearch = (queryStr) => {
    setIsLoading(true);
    const results = searchStockPhotos(queryStr, effectiveRatio, 12);
    setTimeout(() => {
      setImages(results);
      setIsLoading(false);
    }, 250);
  };

  useEffect(() => {
    handlePerformSearch(searchQuery);
  }, [selectedRatio, aspectRatio]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    handlePerformSearch(searchQuery);
  };

  const handleCategoryClick = (catId) => {
    setSearchQuery(catId);
    handlePerformSearch(catId);
  };

  const handleSelectImage = (img) => {
    setInsertedId(img.id);
    if (onAddOverlayImage) {
      const playhead = currentTime || 0;
      onAddOverlayImage({
        id: `overlay_${Date.now()}`,
        url: img.url,
        title: img.title,
        aspectRatio: effectiveRatio,
        position: 'center',
        scale: 60,
        opacity: 1.0,
        rotation: 0,
        borderRadius: 12,
        objectFit: 'cover',
        start: parseFloat(playhead.toFixed(2)),
        end: parseFloat((playhead + 4.0).toFixed(2))
      });
    }
    setTimeout(() => setInsertedId(null), 1200);
  };

  return (
    <div style={{
      width: '320px',
      backgroundColor: 'var(--bg-panel)',
      borderRight: '1px solid var(--border-subtle)',
      display: 'flex',
      flexDirection: 'column',
      color: 'var(--text-main)',
      fontSize: '13px',
      zIndex: 15,
      transition: 'background-color 0.3s ease, border-color 0.3s ease'
    }}>
      {/* Panel Header */}
      <div style={{
        padding: '16px',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'var(--bg-panel-header)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '800', fontSize: '14px' }}>
          <ImageIcon size={18} style={{ color: 'var(--accent-cyan)' }} />
          <span>Stock Media & Image Search</span>
        </div>
      </div>

      <div style={{ padding: '16px', flex: 1, overflowY: 'auto' }}>
        
        {/* Active Overlay Inspector */}
        {activeClip && (
          <div style={{
            backgroundColor: 'rgba(2, 132, 199, 0.12)',
            border: '1px solid rgba(2, 132, 199, 0.35)',
            borderRadius: '12px',
            padding: '14px',
            marginBottom: '18px',
            boxShadow: 'var(--shadow-card)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ fontSize: '11.5px', fontWeight: '800', color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Sliders size={14} /> Active Image Inspector
              </div>
              <button
                onClick={() => onDeleteOverlayImage && onDeleteOverlayImage(activeClip.id)}
                className="btn-interactive"
                style={{
                  backgroundColor: 'rgba(225, 29, 72, 0.15)',
                  border: '1px solid rgba(225, 29, 72, 0.35)',
                  color: '#e11d48',
                  padding: '3px 8px',
                  borderRadius: '6px',
                  fontSize: '10.5px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
                title="Delete this image clip"
              >
                <Trash2 size={11} /> Delete Clip
              </button>
            </div>

            {/* Timing Controls (Start & End Seconds) */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px' }}>
              <div>
                <label style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '3px' }}>
                  <Clock size={10} /> Start (sec):
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  value={activeClip.start ?? 0}
                  onChange={(e) => onUpdateOverlayImage && onUpdateOverlayImage(activeClip.id, { start: Math.max(0, parseFloat(e.target.value) || 0) })}
                  style={{
                    width: '100%',
                    backgroundColor: 'var(--bg-input)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--accent-cyan)',
                    padding: '5px 8px',
                    borderRadius: '6px',
                    fontSize: '11.5px',
                    fontWeight: '700'
                  }}
                />
              </div>
              <div>
                <label style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '3px' }}>
                  <Clock size={10} /> End (sec):
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0.5"
                  value={activeClip.end ?? 4}
                  onChange={(e) => onUpdateOverlayImage && onUpdateOverlayImage(activeClip.id, { end: Math.max((activeClip.start || 0) + 0.5, parseFloat(e.target.value) || 4) })}
                  style={{
                    width: '100%',
                    backgroundColor: 'var(--bg-input)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--accent-cyan)',
                    padding: '5px 8px',
                    borderRadius: '6px',
                    fontSize: '11.5px',
                    fontWeight: '700'
                  }}
                />
              </div>
            </div>

            {/* Size Quick Presets */}
            <div style={{ marginBottom: '12px' }}>
              <label style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: '700', display: 'block', marginBottom: '6px' }}>
                Size Quick Presets
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '4px' }}>
                {[
                  { sz: 25, label: '25% Sm' },
                  { sz: 50, label: '50% Md' },
                  { sz: 75, label: '75% Lg' },
                  { sz: 100, label: '100% Full' }
                ].map((preset) => (
                  <button
                    key={preset.sz}
                    onClick={() => onUpdateOverlayImage && onUpdateOverlayImage(activeClip.id, { scale: preset.sz })}
                    className="btn-interactive"
                    style={{
                      padding: '5px 2px',
                      fontSize: '10px',
                      fontWeight: '700',
                      borderRadius: '6px',
                      backgroundColor: (activeClip.scale || 60) === preset.sz ? 'var(--accent-cyan)' : 'var(--bg-input)',
                      color: (activeClip.scale || 60) === preset.sz ? '#ffffff' : 'var(--text-main)',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Position Alignment */}
            <div style={{ marginBottom: '12px' }}>
              <label style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: '700', display: 'block', marginBottom: '6px' }}>
                Position Alignment
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '4px' }}>
                {[
                  { id: 'top-left', label: '↖️ Top-L' },
                  { id: 'center', label: '⏺️ Center' },
                  { id: 'top-right', label: '↗️ Top-R' },
                  { id: 'bottom-left', label: '↙️ Bot-L' },
                  { id: 'full', label: '🔲 Full' },
                  { id: 'bottom-right', label: '↘️ Bot-R' }
                ].map(pos => (
                  <button
                    key={pos.id}
                    onClick={() => onUpdateOverlayImage && onUpdateOverlayImage(activeClip.id, { position: pos.id })}
                    className="btn-interactive"
                    style={{
                      padding: '5px',
                      fontSize: '10px',
                      fontWeight: '700',
                      borderRadius: '6px',
                      backgroundColor: (activeClip.position || 'center') === pos.id ? 'var(--accent-cyan)' : 'var(--bg-input)',
                      color: (activeClip.position || 'center') === pos.id ? '#ffffff' : 'var(--text-main)',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    {pos.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Scale Slider */}
            <div style={{ marginBottom: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)' }}>
                <span>Scale Size / Width (%):</span>
                <strong style={{ color: 'var(--accent-cyan)' }}>{activeClip.scale || 60}%</strong>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                value={activeClip.scale || 60}
                onChange={(e) => onUpdateOverlayImage && onUpdateOverlayImage(activeClip.id, { scale: Number(e.target.value) })}
                style={{ width: '100%', cursor: 'pointer', accentColor: 'var(--accent-cyan)' }}
              />
            </div>

            {/* Border Radius Slider */}
            <div style={{ marginBottom: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)' }}>
                <span>Corner Roundness (px):</span>
                <strong style={{ color: 'var(--accent-cyan)' }}>{activeClip.borderRadius || 12}px</strong>
              </div>
              <input
                type="range"
                min="0"
                max="40"
                value={activeClip.borderRadius || 12}
                onChange={(e) => onUpdateOverlayImage && onUpdateOverlayImage(activeClip.id, { borderRadius: Number(e.target.value) })}
                style={{ width: '100%', cursor: 'pointer', accentColor: 'var(--accent-cyan)' }}
              />
            </div>

            {/* Rotation Slider */}
            <div style={{ marginBottom: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)' }}>
                <span>Rotate Angle:</span>
                <strong style={{ color: 'var(--accent-cyan)' }}>{activeClip.rotation || 0}°</strong>
              </div>
              <input
                type="range"
                min="0"
                max="360"
                step="5"
                value={activeClip.rotation || 0}
                onChange={(e) => onUpdateOverlayImage && onUpdateOverlayImage(activeClip.id, { rotation: Number(e.target.value) })}
                style={{ width: '100%', cursor: 'pointer', accentColor: 'var(--accent-cyan)' }}
              />
            </div>

            {/* Opacity Slider */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)' }}>
                <span>Opacity / Transparency:</span>
                <strong style={{ color: 'var(--accent-cyan)' }}>{Math.round((activeClip.opacity ?? 1.0) * 100)}%</strong>
              </div>
              <input
                type="range"
                min="0.1"
                max="1.0"
                step="0.05"
                value={activeClip.opacity ?? 1.0}
                onChange={(e) => onUpdateOverlayImage && onUpdateOverlayImage(activeClip.id, { opacity: Number(e.target.value) })}
                style={{ width: '100%', cursor: 'pointer', accentColor: 'var(--accent-cyan)' }}
              />
            </div>
          </div>
        )}

        {/* Added Overlay Clips Manager List */}
        {overlayImages && overlayImages.length > 0 && (
          <div style={{ marginBottom: '18px', backgroundColor: 'var(--bg-card)', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Layers size={14} style={{ color: 'var(--accent-cyan)' }} /> Timeline Image Clips ({overlayImages.length})
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '130px', overflowY: 'auto' }}>
              {overlayImages.map(img => (
                <div
                  key={img.id}
                  onClick={() => setSelectedImageId && setSelectedImageId(img.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: selectedImageId === img.id ? 'rgba(2, 132, 199, 0.15)' : 'var(--bg-input)',
                    border: selectedImageId === img.id ? '1px solid var(--accent-cyan)' : '1px solid var(--border-subtle)',
                    borderRadius: '7px',
                    padding: '5px 10px',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
                    <img src={img.url} alt="" style={{ width: '22px', height: '22px', borderRadius: '5px', objectFit: 'cover' }} />
                    <span style={{ fontSize: '11.5px', fontWeight: '700', color: selectedImageId === img.id ? 'var(--accent-cyan)' : 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {img.title || 'Stock Image'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>{(img.start ?? 0).toFixed(1)}s-{(img.end ?? 4).toFixed(1)}s</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteOverlayImage && onDeleteOverlayImage(img.id);
                      }}
                      style={{ backgroundColor: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '0' }}
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Search Bar Input */}
        <form onSubmit={handleSearchSubmit} style={{ marginBottom: '16px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: 'var(--bg-input)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '9px',
            padding: '5px 12px',
            gap: '8px'
          }}>
            <Search size={15} style={{ color: 'var(--text-muted)' }} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search (phone, coffee, car)..."
              style={{
                width: '100%',
                backgroundColor: 'transparent',
                border: 'none',
                color: 'var(--text-main)',
                outline: 'none',
                fontSize: '12px',
                padding: '6px 0',
                fontWeight: '600'
              }}
            />
            <button
              type="submit"
              className="btn-interactive"
              style={{
                background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                color: '#fff',
                border: 'none',
                borderRadius: '7px',
                padding: '6px 12px',
                fontSize: '11.5px',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              Search
            </button>
          </div>
        </form>

        {/* Video Format & Size Selector */}
        <div style={{ marginBottom: '16px', backgroundColor: 'var(--bg-card)', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
          <label style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.6px', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
            <Filter size={13} style={{ color: 'var(--accent-cyan)' }} /> Target Aspect Ratio
          </label>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
            {[
              { id: 'auto', label: `✨ Auto (${aspectRatio})` },
              { id: '9:16', label: '📱 9:16 Reels' },
              { id: '16:9', label: '🖥️ 16:9 Wide' },
              { id: '1:1', label: '⏹️ 1:1 Square' },
              { id: '4:5', label: '📸 4:5 Feed' }
            ].map((fmt) => (
              <button
                key={fmt.id}
                type="button"
                onClick={() => setSelectedRatio(fmt.id)}
                className="btn-interactive"
                style={{
                  padding: '7px 10px',
                  borderRadius: '7px',
                  backgroundColor: selectedRatio === fmt.id ? 'rgba(2, 132, 199, 0.18)' : 'var(--bg-input)',
                  border: selectedRatio === fmt.id ? '1px solid var(--accent-cyan)' : '1px solid var(--border-subtle)',
                  color: selectedRatio === fmt.id ? 'var(--accent-cyan)' : 'var(--text-muted)',
                  fontSize: '11px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                {fmt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Quick Category Chips */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px' }}>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id)}
                className="btn-interactive"
                style={{
                  backgroundColor: searchQuery.toLowerCase() === cat.id ? 'var(--accent-blue)' : 'var(--bg-card)',
                  color: searchQuery.toLowerCase() === cat.id ? '#fff' : 'var(--text-main)',
                  border: searchQuery.toLowerCase() === cat.id ? '1px solid var(--accent-blue)' : '1px solid var(--border-subtle)',
                  borderRadius: '16px',
                  padding: '5px 12px',
                  fontSize: '11px',
                  fontWeight: '700',
                  whiteSpace: 'nowrap',
                  cursor: 'pointer'
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Image Grid Results */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Query Matches ({images.length})
            </span>
            <span style={{ fontSize: '10.5px', color: 'var(--accent-cyan)', fontWeight: '700' }}>Click image to insert</span>
          </div>

          {isLoading ? (
            <div style={{ textAlign: 'center', padding: '36px 0', color: 'var(--text-muted)' }}>
              <Sparkles size={26} className="animate-spin" style={{ color: 'var(--accent-cyan)', margin: '0 auto 10px' }} />
              <p style={{ fontSize: '11.5px', fontWeight: '600' }}>Searching stock media library...</p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '10px'
            }}>
              {images.map((img) => (
                <div
                  key={img.id}
                  onClick={() => handleSelectImage(img)}
                  style={{
                    position: 'relative',
                    aspectRatio: img.aspect,
                    borderRadius: '10px',
                    overflow: 'hidden',
                    backgroundColor: 'var(--bg-card)',
                    cursor: 'pointer',
                    border: insertedId === img.id ? '2px solid var(--accent-emerald)' : '1px solid var(--border-subtle)',
                    boxShadow: 'var(--shadow-card)'
                  }}
                  className="glass-card"
                  title="Click to insert on Video Canvas"
                >
                  <img
                    src={img.url}
                    alt={img.title}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = img.fallbackUrl;
                    }}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                  {/* Hover Overlay Button */}
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundColor: 'rgba(0,0,0,0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: insertedId === img.id ? 1 : 0,
                    transition: 'opacity 0.15s ease'
                  }} className="img-hover-overlay">
                    <div style={{
                      backgroundColor: insertedId === img.id ? 'var(--accent-emerald)' : 'var(--accent-blue)',
                      color: '#fff',
                      borderRadius: '50%',
                      width: '34px',
                      height: '34px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                    }}>
                      {insertedId === img.id ? <Check size={18} /> : <Plus size={18} />}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
