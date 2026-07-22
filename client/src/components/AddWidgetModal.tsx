import React from 'react';
import { Target, Sparkles, Image as ImageIcon, X, Plus } from 'lucide-react';

export type WidgetType = 'subGoal' | 'subAlert' | 'customImage';

interface AddWidgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddWidget: (type: WidgetType) => void;
}

export const AddWidgetModal: React.FC<AddWidgetModalProps> = ({ isOpen, onClose, onAddWidget }) => {
  if (!isOpen) return null;

  const availableWidgets: { type: WidgetType; label: string; description: string; icon: React.ReactNode }[] = [
    {
      type: 'subGoal',
      label: 'Sub Goal Bar',
      description: 'Animated progress bar for subscriber goal tracking.',
      icon: <Target size={20} color="#6366f1" />,
    },
    {
      type: 'subAlert',
      label: 'Sub Alert Popup',
      description: 'Animated popup for new subs, resubs, and gift subs.',
      icon: <Sparkles size={20} color="#38bdf8" />,
    },
    {
      type: 'customImage',
      label: 'Custom Image / Sponsor Logo',
      description: 'Upload or link custom PNG, GIF, or WebP channel graphics.',
      icon: <ImageIcon size={20} color="#10b981" />,
    },
  ];

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(4px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '440px',
          background: '#121215',
          border: '1px solid #27272a',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 20px 50px rgba(0,0,0,0.8)',
          color: '#ffffff',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Plus size={18} color="#6366f1" />
            <h3 style={{ fontSize: '1rem', fontWeight: 800 }}>Add Widget to Canvas</h3>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: '#a1a1aa', cursor: 'pointer', display: 'flex' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Widget Options List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {availableWidgets.map((widget) => (
            <div
              key={widget.type}
              onClick={() => {
                onAddWidget(widget.type);
                onClose();
              }}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                padding: '12px 14px',
                borderRadius: '8px',
                background: '#18181b',
                border: '1px solid #27272a',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#27272a';
                e.currentTarget.style.borderColor = '#6366f1';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#18181b';
                e.currentTarget.style.borderColor = '#27272a';
              }}
            >
              <div style={{ marginTop: '2px' }}>{widget.icon}</div>
              <div>
                <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#ffffff' }}>{widget.label}</div>
                <div style={{ fontSize: '0.78rem', color: '#a1a1aa', marginTop: '2px' }}>{widget.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
