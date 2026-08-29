import React from 'react';
import { MessageSquareQuote, Image as ImageIcon, Sliders, Music, Download } from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab }) {
  const menuItems = [
    { id: 'subtitles', label: 'Titles', icon: MessageSquareQuote, badge: 'AI', color: '#00d294' },
    { id: 'media', label: 'Media', icon: ImageIcon, color: '#00d294' },
    { id: 'effects', label: 'Effects', icon: Sliders, color: '#00d294' },
    { id: 'audio', label: 'Audio', icon: Music, badge: 'TTS', color: '#00d294' },
    { id: 'export', label: 'Export', icon: Download, color: '#00d294' }
  ];

  return (
    <aside style={{
      width: '70px',
      backgroundColor: '#111418',
      borderRight: '1px solid rgba(255, 255, 255, 0.08)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '14px 0',
      zIndex: 20
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%', alignItems: 'center' }}>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className="btn-interactive"
              style={{
                width: '54px',
                height: '52px',
                borderRadius: '8px',
                backgroundColor: isActive ? 'rgba(0, 210, 148, 0.14)' : 'transparent',
                color: isActive ? '#00d294' : '#8a99ad',
                border: isActive ? '1px solid rgba(0, 210, 148, 0.4)' : '1px solid transparent',
                boxShadow: isActive ? '0 2px 10px rgba(0, 210, 148, 0.2)' : 'none',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '3px',
                cursor: 'pointer',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                position: 'relative'
              }}
              title={item.label}
            >
              {/* Active Indicator Bar on Left Edge */}
              {isActive && (
                <div style={{
                  position: 'absolute',
                  left: '-8px',
                  top: '10px',
                  bottom: '10px',
                  width: '3px',
                  borderRadius: '0 3px 3px 0',
                  backgroundColor: '#00d294',
                  boxShadow: '0 0 10px #00d294'
                }} />
              )}

              <Icon size={19} style={{ filter: isActive ? 'drop-shadow(0 2px 6px rgba(0, 210, 148, 0.6))' : 'none' }} />
              <span style={{ fontSize: '9.5px', fontWeight: '700', letterSpacing: '0.2px' }}>{item.label}</span>

              {item.badge && (
                <span style={{
                  position: 'absolute',
                  top: '3px',
                  right: '3px',
                  background: item.id === 'subtitles' 
                    ? 'linear-gradient(135deg, #00d294 0%, #00b37e 100%)' 
                    : 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                  color: item.id === 'subtitles' ? '#08121a' : '#ffffff',
                  fontSize: '7.5px',
                  fontWeight: '900',
                  padding: '1px 4px',
                  borderRadius: '3px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
                  letterSpacing: '0.4px'
                }}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </aside>
  );
}
