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
    bio: '',
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setSubmitting(true);

    try {
      await register({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        bio: formData.bio,
      });

      // Show success feedback and redirect to login
      setSuccessMessage('🎉 Account created successfully! Redirecting you to the sign-in page...');
      setTimeout(() => {
        navigate(`/login?registered=true&email=${encodeURIComponent(formData.email.trim())}`);
      }, 1500);
    } catch (err) {
      setError(err.message || 'Registration failed. Please check your details and try again.');
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

          {successMessage && (
            <div
              style={{
                background: '#ecfdf5',
                border: '1px solid #10b981',
                color: '#065f46',
                padding: '14px 16px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 600,
                marginBottom: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
              <div>{successMessage}</div>
              <Link to={`/login?registered=true&email=${encodeURIComponent(formData.email.trim())}`} style={{ textDecoration: 'none' }}>
                <Button variant="primary" size="sm" fullWidth>
                  Go to Sign In Now →
                </Button>
              </Link>
            </div>
          )}

          <ErrorMessage message={error} />

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <Input
              label="Full Name"
              name="fullName"
              required
              placeholder="e.g. Alex Johnson"
              value={formData.fullName}
              onChange={handleChange}
              disabled={submitting || !!successMessage}
            />

            <Input
              label="Email Address"
              name="email"
              type="email"
              required
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              disabled={submitting || !!successMessage}
            />

            <Input
              label="Password"
              name="password"
              type="password"
              required
              placeholder="Minimum 6 characters"
              value={formData.password}
              onChange={handleChange}
              disabled={submitting || !!successMessage}
            />

            <Textarea
              label="Short Bio & Motivation"
              name="bio"
              rows={3}
              placeholder="Tell other swappers about your background and what topics excite you..."
              value={formData.bio}
              onChange={handleChange}
              disabled={submitting || !!successMessage}
            />

            <Button type="submit" variant="primary" fullWidth loading={submitting} disabled={!!successMessage}>
              Create Account Free →
            </Button>
          </form>

          <p style={{ textAlign: 'center', fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)', marginTop: 'var(--space-6)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ fontWeight: 600, color: 'var(--color-primary-600)' }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </PublicLayout>
  );
}

export default RegisterPage;
