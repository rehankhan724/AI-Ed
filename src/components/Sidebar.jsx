import React, { useRef, useState, useEffect } from 'react';
import {
  Video,
  ShoppingBag,
  Music,
  Type,
  GitCompare,
  Sparkles,
  Aperture,
  Smile,
  LayoutGrid,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab }) {
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const menuItems = [
    { id: 'media', label: 'Media', icon: Video },
    { id: 'stock_media', label: 'Stock', icon: ShoppingBag },
    { id: 'audio', label: 'Audio', icon: Music, badge: 'TTS' },
    { id: 'subtitles', label: 'Titles', icon: Type, badge: 'AI' },
    { id: 'transitions', label: 'Transitions', icon: GitCompare },
    { id: 'effects', label: 'Effects', icon: Sparkles },
    { id: 'filters', label: 'Filters', icon: Aperture },
    { id: 'stickers', label: 'Stickers', icon: Smile },
    { id: 'templates', label: 'Templates', icon: LayoutGrid }
  ];

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 2);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 4);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, []);

  const handleScroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -130 : 130;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      setTimeout(checkScroll, 250);
    }
  };

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      backgroundColor: '#111418',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      display: 'flex',
      alignItems: 'center',
      userSelect: 'none',
      height: '44px',
      overflow: 'hidden'
    }}>
      {/* Left Slider Arrow Button */}
      {canScrollLeft && (
        <button
          onClick={() => handleScroll('left')}
          className="btn-interactive"
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: '24px',
            backgroundColor: 'rgba(17, 20, 24, 0.92)',
            border: 'none',
            color: '#00d294',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 25,
            boxShadow: '4px 0 10px rgba(0,0,0,0.5)'
          }}
          title="Scroll Left"
        >
          <ChevronLeft size={15} />
        </button>
      )}

      {/* Horizontal Scrollable Navigation Strip */}
      <nav
        ref={scrollContainerRef}
        onScroll={checkScroll}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          overflowX: 'auto',
          scrollBehavior: 'smooth',
          padding: canScrollLeft ? '0 6px 0 26px' : canScrollRight ? '0 26px 0 6px' : '0 6px',
          width: '100%',
          height: '100%',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}
      >
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isCurrentActive =
            activeTab === item.id ||
            (activeTab === 'media' && (item.id === 'media' || item.id === 'stock_media' || item.id === 'transitions' || item.id === 'effects' || item.id === 'filters' || item.id === 'stickers' || item.id === 'templates')) ||
            (activeTab === 'subtitles' && item.id === 'subtitles') ||
            (activeTab === 'audio' && item.id === 'audio');

          const handleClick = () => {
            if (item.id === 'stock_media' || item.id === 'transitions' || item.id === 'filters' || item.id === 'stickers' || item.id === 'templates') {
              setActiveTab('media');
            } else {
              setActiveTab(item.id);
            }
          };

          return (
            <button
              key={item.id}
              onClick={handleClick}
              className="btn-interactive"
              style={{
                background: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                cursor: 'pointer',
                padding: '4px 7px',
                borderRadius: '6px',
                position: 'relative',
                backgroundColor: isCurrentActive ? 'rgba(0, 210, 148, 0.14)' : 'transparent',
                border: isCurrentActive ? '1px solid rgba(0, 210, 148, 0.3)' : '1px solid transparent',
                transition: 'all 0.15s ease',
                flexShrink: 0
              }}
              title={item.label}
            >
              <Icon
                size={14}
                style={{
                  color: isCurrentActive ? '#00d294' : '#94a3b8',
                  transition: 'color 0.15s ease'
                }}
              />

              <span style={{
                fontSize: '10.5px',
                fontWeight: '700',
                color: isCurrentActive ? '#00d294' : '#94a3b8',
                letterSpacing: '-0.1px',
                whiteSpace: 'nowrap'
              }}>
                {item.label}
              </span>

              {item.badge && (
                <span style={{
                  background: item.badge === 'AI' ? '#00d294' : '#3b82f6',
                  color: item.badge === 'AI' ? '#08121a' : '#ffffff',
                  fontSize: '7px',
                  fontWeight: '900',
                  padding: '1px 3px',
                  borderRadius: '3px',
                  marginLeft: '1px'
                }}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Right Slider Arrow Button */}
      {canScrollRight && (
        <button
          onClick={() => handleScroll('right')}
          className="btn-interactive"
          style={{
            position: 'absolute',
            right: 0,
            top: 0,
            bottom: 0,
            width: '24px',
            backgroundColor: 'rgba(17, 20, 24, 0.92)',
            border: 'none',
            color: '#00d294',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 25,
            boxShadow: '-4px 0 10px rgba(0,0,0,0.5)'
          }}
          title="Scroll Right"
        >
          <ChevronRight size={15} />
        </button>
      )}
    </div>
  );
}
