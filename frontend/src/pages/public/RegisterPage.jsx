import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { PublicLayout } from '../../layouts/PublicLayout';
import { Button } from '../../components/ui/Button/Button';
import { Input } from '../../components/ui/Input/Input';
import { Textarea } from '../../components/ui/Input/Textarea';
import { ErrorMessage } from '../../components/ui/Feedback/ErrorMessage';
import { useAuth } from '../../hooks/useAuth';
import './LoginPage.css';

export function RegisterPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    location: '',
    bio: '',
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login({ email: formData.email, password: formData.password });
      navigate('/app/teaching');
    } catch (err) {
      setError(err.message || 'Registration failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PublicLayout>
      <div className="auth-page-container">
        <div className="auth-card" style={{ maxWidth: '520px' }}>
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }}>
            <span style={{ fontSize: 'var(--font-size-xs)', fontWeight: 700, color: 'var(--color-primary-600)', textTransform: 'uppercase' }}>
              Free Membership
            </span>
            <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 700, marginTop: '2px' }}>
              Join Skill Swap Network
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)', marginTop: '4px' }}>
              Connect with peers, trade skills, and learn anything for free
            </p>
          </div>

          <ErrorMessage message={error} />

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
              <Input
                label="Full Name"
                name="fullName"
                required
                placeholder="e.g. Alex Johnson"
                value={formData.fullName}
                onChange={handleChange}
              />
              <Input
                label="Location / Timezone"
                name="location"
                placeholder="e.g. Austin, TX (CST)"
                value={formData.location}
                onChange={handleChange}
              />
            </div>

            <Input
              label="Email Address"
              name="email"
              type="email"
              required
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
            />

            <Input
              label="Password"
              name="password"
              type="password"
              required
              placeholder="Minimum 8 characters"
              value={formData.password}
              onChange={handleChange}
            />

            <Textarea
              label="Short Bio & Motivation"
              name="bio"
              rows={3}
              placeholder="Tell other swappers about your background and what topics excite you..."
              value={formData.bio}
              onChange={handleChange}
            />

            <Button type="submit" variant="primary" fullWidth loading={submitting}>
              Create Account & Set Up Skills →
            </Button>
          </form>

          <p style={{ textAlign: 'center', fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)', marginTop: 'var(--space-6)' }}>
            Already have an account? <Link to="/login" style={{ fontWeight: 600 }}>Sign in</Link>
          </p>
        </div>
      </div>
    </PublicLayout>
  );
}
