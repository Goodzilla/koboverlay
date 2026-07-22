import React from 'react';
import { Users, X } from 'lucide-react';
import { useModTokens } from '../hooks/useModTokens';
import { CreateTokenForm } from './modals/CreateTokenForm';
import { TokenListItem } from './modals/TokenListItem';

interface ModTokenManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
}

export const ModTokenManagerModal: React.FC<ModTokenManagerModalProps> = ({ isOpen, onClose, userId }) => {
  const {
    tokens,
    newLabel,
    setNewLabel,
    copiedId,
    loading,
    handleCreateToken,
    handleRevokeToken,
    copyShareLink,
  } = useModTokens(isOpen, userId);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.8)',
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
          maxWidth: '520px',
          background: '#121215',
          border: '1px solid #27272a',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 20px 50px rgba(0,0,0,0.8)',
          color: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Users size={18} color="#6366f1" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Manage Shared Moderator Links</h3>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#a1a1aa', cursor: 'pointer', display: 'flex' }}>
            <X size={18} />
          </button>
        </div>

        <p style={{ fontSize: '0.84rem', color: '#a1a1aa', lineHeight: 1.5 }}>
          Generates direct-bypass links for moderators. Shared tokens expire automatically after <strong>1 year max</strong>. Revoking a token immediately blocks anyone using it.
        </p>

        {/* Generate New Shared Mod Token Form */}
        <CreateTokenForm
          newLabel={newLabel}
          loading={loading}
          onChangeLabel={setNewLabel}
          onSubmit={handleCreateToken}
        />

        {/* Active Mod Tokens List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '280px', overflowY: 'auto' }}>
          {tokens.length === 0 ? (
            <div style={{ padding: '20px', textAlign: 'center', color: '#71717a', fontSize: '0.82rem', background: '#18181b', borderRadius: '8px', border: '1px dashed #27272a' }}>
              No active shared moderator links. Create one above to grant mod access!
            </div>
          ) : (
            tokens.map((item) => (
              <TokenListItem
                key={item.id}
                item={item}
                copiedId={copiedId}
                onCopyLink={copyShareLink}
                onRevokeToken={handleRevokeToken}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};
