import React from 'react';
import { MessageSquareQuote, Sliders, Music, Download } from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab }) {
  const menuItems = [
    { id: 'subtitles', label: 'Captions', icon: MessageSquareQuote, badge: 'AI' },
    { id: 'effects', label: 'Filters', icon: Sliders },
    { id: 'audio', label: 'Audio', icon: Music },
    { id: 'export', label: 'Export', icon: Download }
  ];

  return (
    <aside style={{
      width: '68px',
      backgroundColor: '#0a0d17',
      borderRight: '1px solid #1e293b',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '16px 0',
      zIndex: 20
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%', alignItems: 'center' }}>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                width: '52px',
                height: '52px',
                borderRadius: '10px',
                backgroundColor: isActive ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
                color: isActive ? '#38bdf8' : '#94a3b8',
                border: isActive ? '1px solid rgba(59, 130, 246, 0.4)' : '1px solid transparent',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                position: 'relative'
              }}
              title={item.label}
            >
              <Icon size={19} />
              <span style={{ fontSize: '9.5px', fontWeight: '700' }}>{item.label}</span>
              {item.badge && (
                <span style={{
                  position: 'absolute',
                  top: '3px',
                  right: '3px',
                  backgroundColor: '#8b5cf6',
                  color: '#fff',
                  fontSize: '8px',
                  fontWeight: '800',
                  padding: '1px 4px',
                  borderRadius: '4px'
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
