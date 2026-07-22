import React from 'react';
import { Clock, Check, Copy, Trash2 } from 'lucide-react';
import { SharedTokenItem } from '../../utils/tokenStorage';

interface TokenListItemProps {
  item: SharedTokenItem;
  copiedId: string | null;
  onCopyLink: (tokenStr: string, id: string) => void;
  onRevokeToken: (tokenId: string) => void;
}

export const TokenListItem: React.FC<TokenListItemProps> = ({
  item,
  copiedId,
  onCopyLink,
  onRevokeToken,
}) => {
  return (
    <div
      style={{
        background: '#18181b',
        border: '1px solid #27272a',
        borderRadius: '10px',
        padding: '12px 14px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
      }}
    >
      <div style={{ overflow: 'hidden' }}>
        <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#ffffff' }}>{item.label}</div>
        <div style={{ fontSize: '0.74rem', color: '#a1a1aa', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
          <Clock size={11} color="#818cf8" />
          Expires: {new Date(item.expiresAt).toLocaleDateString()} (1 Year Max)
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <button
          className="studio-btn"
          onClick={() => onCopyLink(item.token, item.id)}
          style={{ padding: '4px 8px', fontSize: '0.75rem' }}
          title="Copy Shared Mod Link"
        >
          {copiedId === item.id ? <Check size={12} color="#10b981" /> : <Copy size={12} />}
          {copiedId === item.id ? 'Copied!' : 'Copy Link'}
        </button>

        <button
          className="studio-btn"
          onClick={() => onRevokeToken(item.id)}
          style={{ padding: '4px 8px', fontSize: '0.75rem', color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.4)' }}
          title="Revoke / Delete Mod Token (Blocks access immediately)"
        >
          <Trash2 size={12} /> Revoke
        </button>
      </div>
    </div>
  );
};
