import React, { useState } from 'react';
import { LogIn, UserPlus, KeyRound, X, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: { id: string; username: string; email: string; overlayToken: string }) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [tab, setTab] = useState<'login' | 'register' | 'forgot'>('login');

  // Form Fields
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // Status & Feedback
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usernameOrEmail: username, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed.');

      onSuccess(data.user);
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Registration failed.');

      setMessage('Account created successfully! Auto-signing in...');
      setTimeout(() => {
        onSuccess(data.user);
        onClose();
      }, 1000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/auth/reset-password-request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Request failed.');

      setMessage(`Password reset token generated! (Demo code: ${data.resetTokenDemo})`);
      setResetToken(data.resetTokenDemo || '');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resetToken, newPassword }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Reset failed.');

      setMessage('Password reset successful! Please sign in with your new password.');
      setTab('login');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
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
          maxWidth: '420px',
          background: '#121215',
          border: '1px solid #27272a',
          borderRadius: '16px',
          padding: '28px',
          boxShadow: '0 20px 50px rgba(0,0,0,0.8)',
          color: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header & Tabs */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => { setTab('login'); setError(null); setMessage(null); }}
              style={{
                background: 'none',
                border: 'none',
                color: tab === 'login' ? '#ffffff' : '#71717a',
                fontSize: '1rem',
                fontWeight: tab === 'login' ? 800 : 500,
                cursor: 'pointer',
                borderBottom: tab === 'login' ? '2px solid #6366f1' : 'none',
                paddingBottom: '4px',
              }}
            >
              Sign In
            </button>

            <button
              onClick={() => { setTab('register'); setError(null); setMessage(null); }}
              style={{
                background: 'none',
                border: 'none',
                color: tab === 'register' ? '#ffffff' : '#71717a',
                fontSize: '1rem',
                fontWeight: tab === 'register' ? 800 : 500,
                cursor: 'pointer',
                borderBottom: tab === 'register' ? '2px solid #6366f1' : 'none',
                paddingBottom: '4px',
              }}
            >
              Register
            </button>
          </div>

          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: '#a1a1aa', cursor: 'pointer', display: 'flex' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Feedback Messages */}
        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.4)', borderRadius: '8px', padding: '10px 12px', color: '#ef4444', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertCircle size={14} /> {error}
          </div>
        )}

        {message && (
          <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.4)', borderRadius: '8px', padding: '10px 12px', color: '#10b981', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle size={14} /> {message}
          </div>
        )}

        {/* 1. SIGN IN FORM */}
        {tab === 'login' && (
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#a1a1aa', display: 'block', marginBottom: '4px' }}>
                Username or Email
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username or email"
                className="studio-input"
                required
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#a1a1aa' }}>Password</label>
                <button
                  type="button"
                  onClick={() => { setTab('forgot'); setError(null); setMessage(null); }}
                  style={{ background: 'none', border: 'none', color: '#818cf8', fontSize: '0.75rem', cursor: 'pointer' }}
                >
                  Forgot Password?
                </button>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="studio-input"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="studio-btn studio-btn-primary"
              style={{ padding: '10px', fontSize: '0.9rem', fontWeight: 700, width: '100%', justifyContent: 'center' }}
            >
              <LogIn size={15} /> {loading ? 'Signing In...' : 'Sign In to Studio'}
            </button>
          </form>
        )}

        {/* 2. REGISTER FORM */}
        {tab === 'register' && (
          <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#a1a1aa', display: 'block', marginBottom: '4px' }}>
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. PixelStreamer"
                className="studio-input"
                required
              />
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#a1a1aa', display: 'block', marginBottom: '4px' }}>
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="streamer@example.com"
                className="studio-input"
                required
              />
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#a1a1aa', display: 'block', marginBottom: '4px' }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create password"
                className="studio-input"
                required
              />
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#a1a1aa', display: 'block', marginBottom: '4px' }}>
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
                className="studio-input"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="studio-btn studio-btn-primary"
              style={{ padding: '10px', fontSize: '0.9rem', fontWeight: 700, width: '100%', justifyContent: 'center' }}
            >
              <UserPlus size={15} /> {loading ? 'Creating Account...' : 'Create Streamer Account'}
            </button>
          </form>
        )}

        {/* 3. PASSWORD RESET FORM */}
        {tab === 'forgot' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <form onSubmit={handleRequestReset} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#a1a1aa', display: 'block', marginBottom: '4px' }}>
                  Account Email
                </label>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="streamer@example.com"
                    className="studio-input"
                    required
                  />
                  <button type="submit" className="studio-btn studio-btn-primary" style={{ padding: '8px 12px', fontSize: '0.8rem' }}>
                    Send Code
                  </button>
                </div>
              </div>
            </form>

            <form onSubmit={handleConfirmReset} style={{ display: 'flex', flexDirection: 'column', gap: '12px', borderTop: '1px solid #27272a', paddingTop: '12px' }}>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#a1a1aa', display: 'block', marginBottom: '4px' }}>
                  Reset Token
                </label>
                <input
                  type="text"
                  value={resetToken}
                  onChange={(e) => setResetToken(e.target.value)}
                  placeholder="Paste reset token"
                  className="studio-input"
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#a1a1aa', display: 'block', marginBottom: '4px' }}>
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="studio-input"
                  required
                />
              </div>

              <button type="submit" className="studio-btn studio-btn-primary" style={{ padding: '10px', fontSize: '0.85rem', fontWeight: 700 }}>
                <KeyRound size={14} /> Update Password
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
