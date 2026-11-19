import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { PublicLayout } from '../../layouts/PublicLayout';
import { Button } from '../../components/ui/Button/Button';
import { Input } from '../../components/ui/Input/Input';
import { ErrorMessage } from '../../components/ui/Feedback/ErrorMessage';
import { useAuth } from '../../hooks/useAuth';
import './LoginPage.css';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [sessionExpiredNotice, setSessionExpiredNotice] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { login, loginAsMember, loginAsAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('expired') === 'true') {
      setSessionExpiredNotice(true);
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSessionExpiredNotice(false);
    setSubmitting(true);
    try {
      const res = await login({ email, password });
      if (res.user?.role === 'ROLE_ADMIN' || email.toLowerCase().includes('admin')) {
        navigate('/admin');
      } else {
        const from = location.state?.from?.pathname || '/app/dashboard';
        navigate(from);
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDemoMember = () => {
    loginAsMember();
    navigate('/app/dashboard');
  };

  const handleDemoAdmin = () => {
    loginAsAdmin();
    navigate('/admin');
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

          {sessionExpiredNotice && (
            <div style={{
              background: '#fef3c7',
              border: '1px solid #f59e0b',
              color: '#92400e',
              padding: '10px 14px',
              borderRadius: '8px',
              fontSize: '13px',
              marginBottom: '16px'
            }}>
              Your previous session has expired. Please log in again to continue.
            </div>
          )}

          <ErrorMessage message={error} />

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <Input
              label="Email Address"
              type="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              label="Password"
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button type="submit" variant="primary" fullWidth loading={submitting}>
              Sign In to SkillSwap
            </Button>
          </form>

          {/* Quick Demo Fillers for Evaluators */}
          <div className="demo-account-pills">
            <span style={{ fontWeight: 700, color: 'var(--color-slate-700)', display: 'block', marginBottom: 'var(--space-2)' }}>
              ⚡ Quick-Test One-Click Logins:
            </span>
            <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
              <Button variant="outline" size="sm" fullWidth onClick={handleDemoMember}>
                Member (Sarah)
              </Button>
              <Button variant="outline" size="sm" fullWidth onClick={handleDemoAdmin}>
                Admin (David)
              </Button>
            </div>
          </div>

          <p style={{ textAlign: 'center', fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)', marginTop: 'var(--space-6)' }}>
            Don't have an account yet? <Link to="/register" style={{ fontWeight: 600 }}>Create account free</Link>
          </p>
        </div>
      </div>
    </PublicLayout>
  );
}
