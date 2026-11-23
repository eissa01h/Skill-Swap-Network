import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/authService';
import { Card } from '../components/common/Card';

export function Register() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    bio: '',
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await authService.register(formData);
      navigate('/login');
    } catch (err) {
      setError(err.message || 'Registration failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '480px', margin: 'var(--spacing-8) auto' }}>
      <Card title="Create Account" subtitle="Join the Skill Swap Network community">
        {error && (
          <div style={{ padding: 'var(--spacing-3)', backgroundColor: '#fee2e2', color: 'var(--danger)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--spacing-4)', fontSize: 'var(--font-size-sm)' }}>
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
          <div>
            <label style={{ display: 'block', marginBottom: 'var(--spacing-1)', fontSize: 'var(--font-size-sm)', fontWeight: 500 }}>
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              required
              value={formData.fullName}
              onChange={handleChange}
              placeholder="e.g. Alex Johnson"
              style={{ width: '100%' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 'var(--spacing-1)', fontSize: 'var(--font-size-sm)', fontWeight: 500 }}>
              Email Address
            </label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
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
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              style={{ width: '100%' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: 'var(--spacing-1)', fontSize: 'var(--font-size-sm)', fontWeight: 500 }}>
              Bio / Interests
            </label>
            <textarea
              name="bio"
              rows="3"
              value={formData.bio}
              onChange={handleChange}
              placeholder="A few words about your background and what you want to learn..."
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
            {submitting ? 'Creating account...' : 'Create Account'}
          </button>
        </form>
        <p style={{ marginTop: 'var(--spacing-4)', textAlign: 'center', fontSize: 'var(--font-size-sm)', color: 'var(--text-muted)' }}>
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </Card>
    </div>
  );
}

