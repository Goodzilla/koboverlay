import React, { useState } from 'react';
import {
  ListMusic,
  History,
  SkipForward,
  Trash2,
  RotateCcw,
  ChevronRight,
  ChevronLeft,
  Zap,
  Sparkles,
  Gift,
  Users,
  Activity,
} from 'lucide-react';
import { AlertData } from '../SubAlertWidget';

interface RightAlertSidebarProps {
  queue: AlertData[];
  history: AlertData[];
  isOpen: boolean;
  onToggleOpen: () => void;
  onSkipAlert: () => void;
  onClearQueue: () => void;
  onReplayAlert: (alert: AlertData) => void;
  onClearHistory: () => void;
}

export const RightAlertSidebar: React.FC<RightAlertSidebarProps> = ({
  queue,
  history,
  isOpen,
  onToggleOpen,
  onSkipAlert,
  onClearQueue,
  onReplayAlert,
  onClearHistory,
}) => {
  const [activeTab, setActiveTab] = useState<'queue' | 'history'>('queue');

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'sub':
        return <Zap size={13} color="#38bdf8" />;
      case 'resub':
        return <RotateCcw size={13} color="#818cf8" />;
      case 'subgift':
        return <Gift size={13} color="#ec4899" />;
      case 'bits':
        return <Zap size={13} color="#eab308" />;
      case 'raid':
        return <Users size={13} color="#10b981" />;
      default:
        return <Sparkles size={13} color="#6366f1" />;
    }
  };

  const getAlertSummary = (alert: AlertData) => {
    const tierName = alert.tier === 'Prime' ? 'Prime' : `Tier ${alert.tier === '3000' ? 3 : alert.tier === '2000' ? 2 : 1}`;
    if (alert.type === 'subgift') return `${alert.username} • Gifted ${alert.amount || 1} Subs (${tierName})`;
    if (alert.type === 'resub') return `${alert.username} • ${alert.months || 1}-Month Resub (${tierName})`;
    if (alert.type === 'bits') return `${alert.username} • ${alert.amount || 100} Bits`;
    if (alert.type === 'raid') return `${alert.username} • Raid (${alert.amount || 10} Viewers)`;
    return `${alert.username} • ${tierName} Sub`;
  };

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={onToggleOpen}
        style={{
          position: 'absolute',
          right: '16px',
          top: '16px',
          zIndex: 40,
          background: '#16161a',
          border: '1px solid #6366f1',
          borderRadius: '8px',
          color: '#ffffff',
          padding: '8px 14px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '0.8rem',
          fontWeight: 700,
          boxShadow: '0 8px 25px rgba(99, 102, 241, 0.25)',
          transition: 'all 0.15s ease',
        }}
        title="Expand Live Alert Feed & History Sidebar"
      >
        <ChevronLeft size={15} color="#818cf8" />
        <Activity size={15} color="#6366f1" />
        <span>Alert Feed</span>
        {queue.length > 0 && (
          <span
            style={{
              background: '#10b981',
              color: '#ffffff',
              fontSize: '0.68rem',
              fontWeight: 800,
              padding: '2px 7px',
              borderRadius: '10px',
            }}
          >
            {queue.length}
          </span>
        )}
      </button>
    );
  }

  return (
    <aside
      style={{
        width: '340px',
        background: '#121215',
        borderLeft: '1px solid #27272a',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        zIndex: 30,
        boxShadow: '-10px 0 30px rgba(0,0,0,0.5)',
      }}
    >
      {/* Drawer Header */}
      <div
        style={{
          padding: '12px 14px',
          borderBottom: '1px solid #27272a',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Activity size={15} color="#6366f1" />
          <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#ffffff' }}>Live Alert Feed</span>
        </div>

        <button
          type="button"
          onClick={onToggleOpen}
          style={{
            background: 'none',
            border: 'none',
            color: '#71717a',
            cursor: 'pointer',
            padding: '4px',
            display: 'flex',
            alignItems: 'center',
          }}
          title="Collapse Sidebar"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid #27272a' }}>
        <button
          onClick={() => setActiveTab('queue')}
          style={{
            flex: 1,
            padding: '8px 0',
            background: activeTab === 'queue' ? '#18181b' : 'transparent',
            border: 'none',
            borderBottom: activeTab === 'queue' ? '2px solid #6366f1' : 'none',
            color: activeTab === 'queue' ? '#ffffff' : '#71717a',
            fontSize: '0.78rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
          }}
        >
          <ListMusic size={13} /> Alert Queue ({queue.length})
        </button>

        <button
          onClick={() => setActiveTab('history')}
          style={{
            flex: 1,
            padding: '8px 0',
            background: activeTab === 'history' ? '#18181b' : 'transparent',
            border: 'none',
            borderBottom: activeTab === 'history' ? '2px solid #6366f1' : 'none',
            color: activeTab === 'history' ? '#ffffff' : '#71717a',
            fontSize: '0.78rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
          }}
        >
          <History size={13} /> History ({history.length})
        </button>
      </div>

      {/* Tab Content */}
      <div style={{ flex: 1, padding: '12px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {activeTab === 'queue' && (
          <>
            {/* Queue Action Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#a1a1aa' }}>
                ACTIVE QUEUE ({queue.length})
              </div>
              {queue.length > 0 && (
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    type="button"
                    className="studio-btn"
                    onClick={onSkipAlert}
                    style={{ padding: '3px 8px', fontSize: '0.7rem', color: '#818cf8', borderColor: 'rgba(129, 140, 248, 0.4)' }}
                    title="Skip Current Playing Alert"
                  >
                    <SkipForward size={11} /> Skip
                  </button>
                  <button
                    type="button"
                    className="studio-btn"
                    onClick={onClearQueue}
                    style={{ padding: '3px 8px', fontSize: '0.7rem', color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.4)' }}
                    title="Clear Queue"
                  >
                    <Trash2 size={11} /> Clear
                  </button>
                </div>
              )}
            </div>

            {/* Queue List */}
            {queue.length === 0 ? (
              <div
                style={{
                  padding: '30px 16px',
                  textAlign: 'center',
                  color: '#52525b',
                  fontSize: '0.78rem',
                  background: '#16161a',
                  borderRadius: '8px',
                  border: '1px dashed #27272a',
                }}
              >
                No active alerts in queue.
                <div style={{ fontSize: '0.7rem', color: '#71717a', marginTop: '4px' }}>
                  Trigger test events or wait for live stream events.
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {queue.map((item, index) => {
                  const isCurrent = index === 0;
                  return (
                    <div
                      key={item.id}
                      style={{
                        background: isCurrent ? 'rgba(99, 102, 241, 0.12)' : '#16161a',
                        border: isCurrent ? '1px solid rgba(99, 102, 241, 0.5)' : '1px solid #27272a',
                        borderRadius: '8px',
                        padding: '10px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '6px',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          {getEventIcon(item.type)}
                          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#ffffff' }}>
                            {item.username}
                          </span>
                        </div>
                        <span
                          style={{
                            fontSize: '0.62rem',
                            fontWeight: 800,
                            padding: '1px 6px',
                            borderRadius: '4px',
                            background: isCurrent ? '#10b981' : '#27272a',
                            color: isCurrent ? '#ffffff' : '#71717a',
                          }}
                        >
                          {isCurrent ? 'NOW PLAYING' : `#${index + 1} QUEUED`}
                        </span>
                      </div>

                      <div style={{ fontSize: '0.72rem', color: '#a1a1aa' }}>
                        {getAlertSummary(item)}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {activeTab === 'history' && (
          <>
            {/* History Action Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#a1a1aa' }}>
                PROCESSED ALERTS ({history.length})
              </div>
              {history.length > 0 && (
                <button
                  type="button"
                  className="studio-btn"
                  onClick={onClearHistory}
                  style={{ padding: '3px 8px', fontSize: '0.7rem', color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.4)' }}
                  title="Clear History Log"
                >
                  <Trash2 size={11} /> Clear Log
                </button>
              )}
            </div>

            {/* History List */}
            {history.length === 0 ? (
              <div
                style={{
                  padding: '30px 16px',
                  textAlign: 'center',
                  color: '#52525b',
                  fontSize: '0.78rem',
                  background: '#16161a',
                  borderRadius: '8px',
                  border: '1px dashed #27272a',
                }}
              >
                No completed alerts in history.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {history.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      background: '#16161a',
                      border: '1px solid #27272a',
                      borderRadius: '8px',
                      padding: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '8px',
                    }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', overflow: 'hidden' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {getEventIcon(item.type)}
                        <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#ffffff' }}>
                          {item.username}
                        </span>
                      </div>
                      <span style={{ fontSize: '0.7rem', color: '#a1a1aa', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                        {getAlertSummary(item)}
                      </span>
                    </div>

                    <button
                      type="button"
                      className="studio-btn"
                      onClick={() => onReplayAlert(item)}
                      style={{ padding: '4px 8px', fontSize: '0.7rem', whiteSpace: 'nowrap' }}
                      title="Re-play this alert on canvas"
                    >
                      <RotateCcw size={11} color="#6366f1" /> Re-play
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </aside>
  );
};
