import { useState, useEffect, useCallback } from 'react';
import { SharedTokenItem, getStoredTokens, saveStoredTokens } from '../utils/tokenStorage';
import { TOKEN_EXPIRATION_ONE_YEAR_MS } from '../constants/tokens';

export function useModTokens(isOpen: boolean, userId: string) {
  const [tokens, setTokens] = useState<SharedTokenItem[]>([]);
  const [newLabel, setNewLabel] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

  const fetchTokens = useCallback(async () => {
    if (!userId) return;
    const local = getStoredTokens(userId);
    setTokens(local);

    try {
      const res = await fetch(`${API_URL}/api/tokens/my-mod-tokens/${userId}`);
      if (res.ok) {
        const data = await res.json();
        if (data.tokens && Array.isArray(data.tokens)) {
          setTokens(data.tokens);
          saveStoredTokens(userId, data.tokens);
        }
      }
    } catch (err) {}
  }, [userId, API_URL]);

  useEffect(() => {
    if (isOpen && userId) {
      fetchTokens();
    }
  }, [isOpen, userId, fetchTokens]);

  const handleCreateToken = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const tokenLabel = newLabel.trim() || 'Moderator Shared Link';
    const newTokenStr = `mod_${Math.random().toString(36).substring(2, 10)}${Math.random().toString(36).substring(2, 10)}`;
    const oneYearFromNow = new Date(Date.now() + TOKEN_EXPIRATION_ONE_YEAR_MS).toISOString();

    const localItem: SharedTokenItem = {
      id: `mod_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      token: newTokenStr,
      label: tokenLabel,
      createdAt: new Date().toISOString(),
      expiresAt: oneYearFromNow,
    };

    let createdTokenItem = localItem;

    try {
      const res = await fetch(`${API_URL}/api/tokens/create-mod-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, label: tokenLabel }),
      });

      const data = await res.json();
      if (res.ok && data.sharedToken) {
        createdTokenItem = data.sharedToken;
      }
    } catch (err) {}

    setTokens((prev) => {
      const filtered = prev.filter((t) => t.id !== createdTokenItem.id);
      const updated = [createdTokenItem, ...filtered];
      saveStoredTokens(userId, updated);
      return updated;
    });

    setNewLabel('');
    setLoading(false);
  }, [newLabel, userId, API_URL]);

  const handleRevokeToken = useCallback(async (tokenId: string) => {
    setTokens((prev) => {
      const updated = prev.filter((t) => t.id !== tokenId);
      saveStoredTokens(userId, updated);
      return updated;
    });

    try {
      await fetch(`${API_URL}/api/tokens/revoke-mod-token/${tokenId}`, {
        method: 'DELETE',
      });
    } catch (err) {}
  }, [userId, API_URL]);

  const copyShareLink = useCallback((tokenStr: string, id: string) => {
    const link = `${window.location.origin}/studio?token=${tokenStr}`;
    navigator.clipboard.writeText(link);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }, []);

  return {
    tokens,
    newLabel,
    setNewLabel,
    copiedId,
    loading,
    handleCreateToken,
    handleRevokeToken,
    copyShareLink,
  };
}
