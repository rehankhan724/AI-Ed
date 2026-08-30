import React, { useState, useEffect } from 'react';
import {
  ChevronRight,
  Plus,
  Play,
  Search,
  ChevronDown,
  SlidersHorizontal,
  MoreHorizontal,
  FolderPlus,
  FolderMinus,
  ChevronLeft,
  Check
} from 'lucide-react';
import { searchStockPhotos } from '../services/stockMediaService';

export default function MediaPanel({
  aspectRatio = '16:9',
  currentTime = 0,
  overlayImages = [],
  selectedImageId,
  setSelectedImageId,
  onAddOverlayImage,
  onUpdateOverlayImage,
  onDeleteOverlayImage,
  onUploadClick
}) {
  const [activeSubCategory, setActiveSubCategory] = useState('project_media');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRatio, setSelectedRatio] = useState('auto');
  const [stockImages, setStockImages] = useState([]);
  const [insertedId, setInsertedId] = useState(null);

  const subCategories = [
    { id: 'project_media', label: 'Project Media' },
    { id: 'global_media', label: 'Global Media' },
    { id: 'cloud_media', label: 'Cloud Media' },
    { id: 'img_to_video', label: 'Image to Video' },
    { id: 'adj_layer', label: 'Adjustment Layer' },
    { id: 'compound_clip', label: 'Compound Clip' },
    { id: 'influence_kit', label: 'Influence Kit' }
  ];

  const sampleMediaItems = [
    { id: 'vid_1', title: 'VID20260125150035', duration: '00:00:48', type: 'video', thumb: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=60' },
    { id: 'vid_2', title: 'VID20260125150222', duration: '00:00:55', type: 'video', thumb: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=60' },
    { id: 'vid_3', title: 'VID20260125150442', duration: '00:00:11', type: 'video', thumb: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=60' },
    { id: 'vid_4', title: 'VID20260125150528', duration: '00:01:01', type: 'video', thumb: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=60' },
    { id: 'vid_5', title: 'VID20260125150956', duration: '00:00:33', type: 'video', thumb: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&auto=format&fit=crop&q=60' },
    { id: 'vid_6', title: 'VID20260125151120', duration: '00:00:40', type: 'video', thumb: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=500&auto=format&fit=crop&q=60' },
    { id: 'vid_7', title: 'VID20260125151245', duration: '00:00:12', type: 'video', thumb: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=500&auto=format&fit=crop&q=60' },
    { id: 'vid_8', title: 'VID20260125151410', duration: '00:00:36', type: 'video', thumb: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=500&auto=format&fit=crop&q=60' }
  ];

  const effectiveRatio = selectedRatio === 'auto' ? aspectRatio : selectedRatio;

  useEffect(() => {
    const results = searchStockPhotos('technology', effectiveRatio, 8);
    setStockImages(results);
  }, [selectedRatio, aspectRatio]);

  const handleAddMediaToTimeline = (mediaItem) => {
    setInsertedId(mediaItem.id);
    if (onAddOverlayImage) {
      const playhead = currentTime || 0;
      onAddOverlayImage({
        id: `overlay_${Date.now()}`,
        url: mediaItem.thumb,
        title: mediaItem.title,
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
    setTimeout(() => setInsertedId(null), 1000);
  };

  const filteredMedia = sampleMediaItems.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{
      display: 'flex',
      width: '100%',
      height: '100%',
      backgroundColor: '#12151a',
      color: '#f8fafc',
      fontSize: '12px',
      overflow: 'hidden',
      userSelect: 'none'
    }}>
      {/* 1. Sub-Sidebar Column (Compact 125px) */}
      <div style={{
        width: '125px',
        backgroundColor: '#161a20',
        borderRight: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '8px 4px',
        shrink: 0
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {subCategories.map(cat => {
            const isActive = activeSubCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveSubCategory(cat.id)}
                className="btn-interactive"
                style={{
                  width: '100%',
                  padding: '5px 6px',
                  borderRadius: '5px',
                  backgroundColor: isActive ? '#202630' : 'transparent',
                  color: isActive ? '#ffffff' : '#94a3b8',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  cursor: 'pointer',
                  fontSize: '11px',
                  fontWeight: isActive ? '700' : '500',
                  textAlign: 'left'
                }}
              >
                <ChevronRight
                  size={12}
                  style={{
                    color: isActive ? '#00d294' : '#64748b',
                    transform: isActive ? 'rotate(90deg)' : 'none'
                  }}
                />
                <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {cat.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Bottom Folder & Bin Icons */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          color: '#94a3b8'
        }}>
          <button style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }} title="New Folder">
            <FolderPlus size={13} />
          </button>
          <button style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }} title="New Bin">
            <FolderMinus size={13} />
          </button>
          <button style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', marginLeft: 'auto' }} title="Collapse Menu">
            <ChevronLeft size={13} />
          </button>
        </div>
      </div>

      {/* 2. Media Asset Grid Area */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#12151a',
        overflow: 'hidden'
      }}>
        {/* Top Action Bar */}
        <div style={{
          height: '38px',
          padding: '0 10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          backgroundColor: '#161a20'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={onUploadClick}
              className="btn-interactive"
              style={{
                backgroundColor: '#202630',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#ffffff',
                padding: '4px 10px',
                borderRadius: '5px',
                fontSize: '11px',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <span>Import</span>
              <ChevronDown size={12} style={{ color: '#94a3b8' }} />
            </button>

            <button
              className="btn-interactive"
              style={{
                backgroundColor: '#202630',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#ffffff',
                padding: '4px 10px',
                borderRadius: '5px',
                fontSize: '11px',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}
            >
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#ff4d6d' }} />
              <span>Record</span>
              <ChevronDown size={12} style={{ color: '#94a3b8' }} />
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#94a3b8' }}>
            <button style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
              <SlidersHorizontal size={14} />
            </button>
            <button style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
              <MoreHorizontal size={15} />
            </button>
          </div>
        </div>

        {/* Search Row */}
        <div style={{
          padding: '6px 10px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          backgroundColor: '#171b21',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '3px', color: '#94a3b8', fontSize: '11px', fontWeight: '700', cursor: 'pointer' }}>
            <span>Default</span>
            <ChevronDown size={12} />
          </div>

          <div style={{ width: '1px', height: '12px', backgroundColor: 'rgba(255, 255, 255, 0.15)' }} />

          <div style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#111418',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '5px',
            padding: '3px 8px',
            gap: '6px'
          }}>
            <Search size={12} style={{ color: '#64748b' }} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search media"
              style={{
                width: '100%',
                backgroundColor: 'transparent',
                border: 'none',
                color: '#ffffff',
                outline: 'none',
                fontSize: '11px'
              }}
            />
          </div>
        </div>

        {/* Media Assets Grid Area */}
        <div style={{
          flex: 1,
          padding: '10px',
          overflowY: 'auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(115px, 1fr))',
          gap: '8px',
          alignContent: 'start'
        }}>
          {/* Import Dropzone Tile */}
          <div
            onClick={onUploadClick}
            className="btn-interactive"
            style={{
              height: '80px',
              backgroundColor: '#1c2129',
              border: '1.5px dashed rgba(0, 210, 148, 0.4)',
              borderRadius: '6px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
              cursor: 'pointer'
            }}
          >
            <div style={{
              width: '26px',
              height: '26px',
              borderRadius: '50%',
              backgroundColor: 'rgba(0, 210, 148, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#00d294'
            }}>
              <Plus size={16} />
            </div>
            <span style={{ fontSize: '10px', fontWeight: '700', color: '#94a3b8' }}>Import Media</span>
          </div>

          {/* Media Cards */}
          {filteredMedia.map((media) => (
            <div key={media.id} style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <div
                style={{
                  position: 'relative',
                  height: '80px',
                  borderRadius: '6px',
                  overflow: 'hidden',
                  backgroundColor: '#1b2028',
                  border: insertedId === media.id ? '2px solid #00d294' : '1px solid rgba(255, 255, 255, 0.08)',
                  cursor: 'pointer'
                }}
                className="glass-card"
                onClick={() => handleAddMediaToTimeline(media)}
                title={`Click to add ${media.title} to timeline`}
              >
                <img
                  src={media.thumb}
                  alt={media.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />

                {/* Duration Tag */}
                <div style={{
                  position: 'absolute',
                  top: '3px',
                  right: '3px',
                  backgroundColor: 'rgba(0, 0, 0, 0.75)',
                  color: '#ffffff',
                  fontSize: '9px',
                  fontWeight: '800',
                  padding: '1px 4px',
                  borderRadius: '3px',
                  fontFamily: 'monospace'
                }}>
                  {media.duration}
                </div>

                {/* Play Icon */}
                <div style={{
                  position: 'absolute',
                  bottom: '3px',
                  left: '3px',
                  backgroundColor: 'rgba(0, 0, 0, 0.65)',
                  color: '#00d294',
                  borderRadius: '3px',
                  width: '16px',
                  height: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Play size={9} style={{ fill: '#00d294', marginLeft: '1px' }} />
                </div>

                {/* Add Button */}
                <div style={{
                  position: 'absolute',
                  bottom: '3px',
                  right: '3px',
                  backgroundColor: insertedId === media.id ? '#00d294' : 'rgba(0, 0, 0, 0.65)',
                  color: insertedId === media.id ? '#08121a' : '#ffffff',
                  borderRadius: '50%',
                  width: '18px',
                  height: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {insertedId === media.id ? <Check size={11} /> : <Plus size={11} />}
                </div>
              </div>

              <span style={{
                fontSize: '10px',
                fontWeight: '600',
                color: '#94a3b8',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                {media.title}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
