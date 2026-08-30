import React, { useRef, useState, useEffect } from 'react';
import {
  Video, ShoppingBag, Music, Type, GitCompare,
  Sparkles, Aperture, Smile, LayoutGrid,
  ChevronLeft, ChevronRight, Wand2
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab }) {
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const menuItems = [
    { id: 'media',       label: 'Media',      icon: Video },
    { id: 'stock_media', label: 'Stock',       icon: ShoppingBag },
    { id: 'audio',       label: 'Audio',       icon: Music,      badge: 'TTS' },
    { id: 'subtitles',   label: 'Titles',      icon: Type,       badge: 'AI' },
    { id: 'transitions', label: 'Transitions', icon: GitCompare },
    { id: 'effects',     label: 'Effects',     icon: Sparkles },
    { id: 'filters',     label: 'Filters',     icon: Aperture },
    { id: 'stickers',    label: 'Stickers',    icon: Smile },
    { id: 'templates',   label: 'Templates',   icon: LayoutGrid },
    { id: 'magic',       label: 'Magic',       icon: Wand2,      badge: '✨', magic: true },
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
      scrollContainerRef.current.scrollBy({ left: direction === 'left' ? -130 : 130, behavior: 'smooth' });
      setTimeout(checkScroll, 250);
    }
  };

  return (
    <div style={{
      position: 'relative', width: '100%',
      backgroundColor: '#111418',
      borderBottom: '1px solid rgba(255,255,255,0.08)',
      display: 'flex', alignItems: 'center',
      userSelect: 'none', height: '44px', overflow: 'hidden'
    }}>
      {canScrollLeft && (
        <button onClick={() => handleScroll('left')} className="btn-interactive" style={{
          position: 'absolute', left: 0, top: 0, bottom: 0, width: '24px',
          backgroundColor: 'rgba(17,20,24,0.92)', border: 'none', color: '#00d294',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', zIndex: 25, boxShadow: '4px 0 10px rgba(0,0,0,0.5)'
        }}>
          <ChevronLeft size={15} />
        </button>
      )}

      <nav ref={scrollContainerRef} onScroll={checkScroll} style={{
        display: 'flex', alignItems: 'center', gap: '4px',
        overflowX: 'auto', scrollBehavior: 'smooth',
        padding: canScrollLeft ? '0 6px 0 26px' : canScrollRight ? '0 26px 0 6px' : '0 6px',
        width: '100%', height: '100%',
        scrollbarWidth: 'none', msOverflowStyle: 'none'
      }}>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id ||
            (activeTab === 'media' && ['media','stock_media','transitions','effects','filters','stickers','templates'].includes(item.id)) ||
            (activeTab === 'subtitles' && item.id === 'subtitles') ||
            (activeTab === 'audio' && item.id === 'audio') ||
            (activeTab === 'magic' && item.id === 'magic');

          const handleClick = () => {
            if (['stock_media','transitions','filters','stickers','templates'].includes(item.id)) {
              setActiveTab('media');
            } else {
              setActiveTab(item.id);
            }
          };

          return (
            <button key={item.id} onClick={handleClick} className="btn-interactive" style={{
              background: 'none',
              display: 'flex', alignItems: 'center', gap: '5px',
              cursor: 'pointer', padding: '4px 7px', borderRadius: '6px',
              position: 'relative', flexShrink: 0,
              backgroundColor: isActive
                ? item.magic ? 'rgba(139,92,246,0.18)' : 'rgba(0,210,148,0.14)'
                : 'transparent',
              border: isActive
                ? item.magic ? '1px solid rgba(139,92,246,0.4)' : '1px solid rgba(0,210,148,0.3)'
                : '1px solid transparent',
              transition: 'all 0.15s ease',
            }} title={item.label}>
              <Icon size={14} style={{
                color: isActive
                  ? item.magic ? '#a78bfa' : '#00d294'
                  : '#94a3b8',
                transition: 'color 0.15s ease'
              }} />
              <span style={{
                fontSize: '10.5px', fontWeight: '700',
                color: isActive
                  ? item.magic ? '#a78bfa' : '#00d294'
                  : '#94a3b8',
                letterSpacing: '-0.1px', whiteSpace: 'nowrap'
              }}>
                {item.label}
              </span>
              {item.badge && (
                <span style={{
                  background: item.magic
                    ? (isActive ? '#8b5cf6' : 'rgba(139,92,246,0.3)')
                    : (item.badge === 'AI' ? '#00d294' : '#3b82f6'),
                  color: item.magic ? '#fff' : (item.badge === 'AI' ? '#08121a' : '#ffffff'),
                  fontSize: '7px', fontWeight: '900',
                  padding: '1px 3px', borderRadius: '3px', marginLeft: '1px'
                }}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {canScrollRight && (
        <button onClick={() => handleScroll('right')} className="btn-interactive" style={{
          position: 'absolute', right: 0, top: 0, bottom: 0, width: '24px',
          backgroundColor: 'rgba(17,20,24,0.92)', border: 'none', color: '#00d294',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', zIndex: 25, boxShadow: '-4px 0 10px rgba(0,0,0,0.5)'
        }}>
          <ChevronRight size={15} />
        </button>
      )}
    </div>
  );
}
