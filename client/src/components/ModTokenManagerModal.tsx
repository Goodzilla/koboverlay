import React, { useState, useEffect } from 'react';
import { Users, Plus, Trash2, Copy, Check, Clock, X, ShieldAlert } from 'lucide-react';

interface ModTokenManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
}

interface SharedTokenItem {
  id: string;
  token: string;
  label: string;
  createdAt: string;
  expiresAt: string;
}

export const ModTokenManagerModal: React.FC<ModTokenManagerModalProps> = ({ isOpen, onClose, userId }) => {
  const [tokens, setTokens] = useState<SharedTokenItem[]>([]);
  const [newLabel, setNewLabel] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

  const fetchTokens = async () => {
    try {
      const res = await fetch(`${API_URL}/api/tokens/my-mod-tokens/${userId}`);
      const data = await res.json();
      if (res.ok && data.tokens) {
        setTokens(data.tokens);
      }
    } catch (err) {}
  };

  useEffect(() => {
    if (isOpen && userId) {
      fetchTokens();
    }
  }, [isOpen, userId]);

  if (!isOpen) return null;

  const handleCreateToken = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_URL}/api/tokens/create-mod-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, label: newLabel || 'Moderator Shared Link' }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate mod token.');

      setNewLabel('');
      fetchTokens();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRevokeToken = async (tokenId: string) => {
    try {
      const res = await fetch(`${API_URL}/api/tokens/revoke-mod-token/${tokenId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setTokens((prev) => prev.filter((t) => t.id !== tokenId));
      }
    } catch (err) {}
  };

  const copyShareLink = (tokenStr: string, id: string) => {
    const link = `${window.location.origin}/studio?token=${tokenStr}`;
    navigator.clipboard.writeText(link);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

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
        <form onSubmit={handleCreateToken} style={{ display: 'flex', gap: '8px' }}>
          <input
            type="text"
            placeholder="Label (e.g. Mod Alex - Stream Assistant)"
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            className="studio-input"
            style={{ flex: 1 }}
          />
          <button type="submit" disabled={loading} className="studio-btn studio-btn-primary" style={{ padding: '8px 14px', fontSize: '0.85rem' }}>
            <Plus size={14} /> {loading ? 'Creating...' : 'Create 1-Year Link'}
          </button>
        </form>

        {error && <div style={{ color: '#ef4444', fontSize: '0.8rem' }}>{error}</div>}

        {/* Active Mod Tokens List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '280px', overflowY: 'auto' }}>
          {tokens.length === 0 ? (
            <div style={{ padding: '20px', textAlign: 'center', color: '#71717a', fontSize: '0.82rem', background: '#18181b', borderRadius: '8px', border: '1px dashed #27272a' }}>
              No active shared moderator links. Create one above to grant mod access!
            </div>
          ) : (
            tokens.map((item) => (
              <div
                key={item.id}
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
                    onClick={() => copyShareLink(item.token, item.id)}
                    style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                    title="Copy Shared Mod Link"
                  >
                    {copiedId === item.id ? <Check size={12} color="#10b981" /> : <Copy size={12} />}
                    {copiedId === item.id ? 'Copied!' : 'Copy Link'}
                  </button>

                  <button
                    className="studio-btn"
                    onClick={() => handleRevokeToken(item.id)}
                    style={{ padding: '4px 8px', fontSize: '0.75rem', color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.4)' }}
                    title="Revoke / Delete Mod Token (Blocks access immediately)"
                  >
                    <Trash2 size={12} /> Revoke
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
