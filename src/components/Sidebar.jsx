import React from 'react';
import { LayoutGrid, Type, Music, Film, Image as ImageIcon, MessageSquareQuote, FolderOpen, Layers, Sparkles } from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, onTranscribeClick }) {
  const menuItems = [
    { id: 'templates', label: 'Templates', icon: LayoutGrid },
    { id: 'subtitles', label: 'AI Subtitles', icon: MessageSquareQuote, badge: 'AI' },
    { id: 'text', label: 'Text', icon: Type },
    { id: 'audio', label: 'Audio', icon: Music },
    { id: 'video', label: 'Videos', icon: Film },
    { id: 'images', label: 'Images', icon: ImageIcon },
    { id: 'files', label: 'Files', icon: FolderOpen },
    { id: 'elements', label: 'Elements', icon: Layers },
  ];

  return (
    <aside style={{
      width: '64px',
      backgroundColor: '#0a0d17',
      borderRight: '1px solid #1e293b',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '12px 0',
      zIndex: 20
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%', alignItems: 'center' }}>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '8px',
                backgroundColor: isActive ? '#1e293b' : 'transparent',
                color: isActive ? '#38bdf8' : '#94a3b8',
                border: isActive ? '1px solid #334155' : '1px solid transparent',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '3px',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                position: 'relative'
              }}
              title={item.label}
            >
              <Icon size={18} />
              <span style={{ fontSize: '9px', fontWeight: '500' }}>{item.label}</span>
              {item.badge && (
                <span style={{
                  position: 'absolute',
                  top: '2px',
                  right: '2px',
                  backgroundColor: '#8b5cf6',
                  color: '#fff',
                  fontSize: '8px',
                  fontWeight: '800',
                  padding: '1px 3px',
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
