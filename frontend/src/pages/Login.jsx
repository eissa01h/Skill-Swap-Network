import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Card } from '../components/common/Card';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login({ email, password });
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '420px', margin: 'var(--spacing-8) auto' }}>
      <Card title="Welcome Back" subtitle="Sign in to your Skill Swap account">
        {error && (
          <div style={{ padding: 'var(--spacing-3)', backgroundColor: '#fee2e2', color: 'var(--danger)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--spacing-4)', fontSize: 'var(--font-size-sm)' }}>
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
          <div>
            <label style={{ display: 'block', marginBottom: 'var(--spacing-1)', fontSize: 'var(--font-size-sm)', fontWeight: 500 }}>
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              style={{ width: '100%' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 'var(--spacing-1)', fontSize: 'var(--font-size-sm)', fontWeight: 500 }}>
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{ width: '100%' }}
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            style={{
              padding: 'var(--spacing-3)',
              backgroundColor: 'var(--primary)',
              color: 'var(--text-inverse)',
              borderRadius: 'var(--radius-md)',
              fontWeight: 600,
              marginTop: 'var(--spacing-2)',
            }}
          >
            {submitting ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <p style={{ marginTop: 'var(--spacing-4)', textAlign: 'center', fontSize: 'var(--font-size-sm)', color: 'var(--text-muted)' }}>
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </Card>
    </div>
  );
}

