import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { PublicLayout } from '../../layouts/PublicLayout';
import { Button } from '../../components/ui/Button/Button';
import { Input } from '../../components/ui/Input/Input';
import { ErrorMessage } from '../../components/ui/Feedback/ErrorMessage';
import { useAuth } from '../../hooks/useAuth';
import { isAdminEmail } from '../../config/supabaseClient';
import './LoginPage.css';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isNoAccountError, setIsNoAccountError] = useState(false);
  const [sessionExpiredNotice, setSessionExpiredNotice] = useState(false);
  const [registeredNotice, setRegisteredNotice] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('expired') === 'true') {
      setSessionExpiredNotice(true);
    }
    if (params.get('registered') === 'true') {
      setRegisteredNotice(true);
      const prefillEmail = params.get('email');
      if (prefillEmail) {
        setEmail(prefillEmail);
      }
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsNoAccountError(false);
    setSessionExpiredNotice(false);
    setSubmitting(true);

    try {
      const res = await login({ email, password });
      if (res?.user?.role === 'ROLE_ADMIN' || isAdminEmail(res?.user?.email || email)) {
        navigate('/admin');
      } else {
        const from = location.state?.from?.pathname || '/app/dashboard';
        navigate(from);
      }
    } catch (err) {
      const rawMessage = String(err?.message || '').toLowerCase();
      // Detect invalid credentials / non-existent account in Supabase or client auth
      const isNotFoundOrInvalid =
        rawMessage.includes('invalid') ||
        rawMessage.includes('not found') ||
        rawMessage.includes('credentials') ||
        rawMessage.includes('user not found') ||
        rawMessage.includes('email not confirmed') ||
        rawMessage.includes('grant_type');

      if (isNotFoundOrInvalid) {
        setIsNoAccountError(true);
        setError('No account found with these details. Please create an account first');
      } else {
        setIsNoAccountError(false);
        setError(err.message || 'Login failed. Please check your credentials.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PublicLayout>
      <div className="auth-page-container">
        <div className="auth-card">
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }}>
            <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 700 }}>Welcome Back</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)', marginTop: '4px' }}>
              Sign in to manage your skill swaps and messages
            </p>
          </div>

          {registeredNotice && (
            <div
              style={{
                background: '#ecfdf5',
                border: '1px solid #10b981',
                color: '#065f46',
                padding: '12px 16px',
                borderRadius: '8px',
                fontSize: '13px',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                lineHeight: 1.4,
              }}
            >
              <span style={{ fontSize: '18px' }}>🎉</span>
              <div>
                <strong>Account created successfully!</strong>
                <div>Please sign in with your password to continue to your dashboard.</div>
              </div>
            </div>
          )}

          {sessionExpiredNotice && (
            <div
              style={{
                background: '#fef3c7',
                border: '1px solid #f59e0b',
                color: '#92400e',
                padding: '10px 14px',
                borderRadius: '8px',
                fontSize: '13px',
                marginBottom: '16px',
              }}
            >
              Your previous session has expired. Please log in again to continue.
            </div>
          )}

          {/* Invalid credentials notice with direct button to Sign Up page */}
          {isNoAccountError ? (
            <div
              style={{
                background: '#fef2f2',
                border: '1px solid #f87171',
                borderRadius: '8px',
                padding: '14px 16px',
                marginBottom: '18px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '8px',
                  color: '#991b1b',
                  fontSize: '14px',
                  fontWeight: 600,
                  lineHeight: 1.4,
                }}
              >
                <span style={{ fontSize: '18px', lineHeight: 1 }}>⚠️</span>
                <span>No account found with these details. Please create an account first</span>
              </div>
              <Link to="/register" style={{ textDecoration: 'none' }}>
                <Button variant="danger" size="sm" fullWidth>
                  Create an Account →
                </Button>
              </Link>
            </div>
          ) : (
            <ErrorMessage message={error} />
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <Input
              label="Email Address"
              type="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (isNoAccountError) setIsNoAccountError(false);
              }}
            />

            <Input
              label="Password"
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (isNoAccountError) setIsNoAccountError(false);
              }}
            />

            <Button type="submit" variant="primary" fullWidth loading={submitting}>
              Sign In to SkillSwap
            </Button>
          </form>

          <p style={{ textAlign: 'center', fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)', marginTop: 'var(--space-6)' }}>
            Don't have an account yet?{' '}
            <Link to="/register" style={{ fontWeight: 600, color: 'var(--color-primary-600)' }}>
              Create account free
            </Link>
          </p>
        </div>
      </div>
    </PublicLayout>
  );
}

export default LoginPage;
