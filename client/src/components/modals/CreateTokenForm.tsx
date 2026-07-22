import React from 'react';
import { Plus } from 'lucide-react';

interface CreateTokenFormProps {
  newLabel: string;
  loading: boolean;
  onChangeLabel: (val: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const CreateTokenForm: React.FC<CreateTokenFormProps> = ({
  newLabel,
  loading,
  onChangeLabel,
  onSubmit,
}) => {
  return (
    <form onSubmit={onSubmit} style={{ display: 'flex', gap: '8px' }}>
      <input
        type="text"
        placeholder="Label (e.g. Mod Alex - Stream Assistant)"
        value={newLabel}
        onChange={(e) => onChangeLabel(e.target.value)}
        className="studio-input"
        style={{ flex: 1 }}
      />
      <button
        type="submit"
        disabled={loading}
        className="studio-btn studio-btn-primary"
        style={{ padding: '8px 14px', fontSize: '0.85rem' }}
      >
        <Plus size={14} /> {loading ? 'Creating...' : 'Create 1-Year Link'}
      </button>
    </form>
  );
};
