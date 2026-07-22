import { LOCAL_STORAGE_MOD_TOKENS_KEY } from '../constants/tokens';

export interface SharedTokenItem {
  id: string;
  token: string;
  label: string;
  createdAt: string;
  expiresAt: string;
}

export const getStoredTokens = (uid: string): SharedTokenItem[] => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_MOD_TOKENS_KEY(uid));
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
};

export const saveStoredTokens = (uid: string, items: SharedTokenItem[]) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_MOD_TOKENS_KEY(uid), JSON.stringify(items));
  } catch (e) {}
};
