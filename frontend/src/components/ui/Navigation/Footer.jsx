import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

export function Footer() {
  return (
    <footer className="app-footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-3)' }}>
              <div style={{ width: '32px', height: '32px', background: 'linear-gradient(135deg, #6366f1, #10b981)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700 }}>
                🔄
              </div>
              <span style={{ color: '#fff', fontSize: 'var(--font-size-lg)', fontWeight: 700 }}>SkillSwap Network</span>
            </div>
            <p style={{ color: 'var(--color-slate-400)', fontSize: 'var(--font-size-sm)', maxWidth: '320px', lineHeight: 1.6 }}>
              The modern, 100% free peer-to-peer learning community. Exchange expertise directly without credits, paywalls, or subscriptions.
            </p>
          </div>

          <div>
            <h5 className="footer-col-title">Platform</h5>
            <ul className="footer-links">
              <li><Link to="/how-it-works" className="footer-link">How It Works</Link></li>
              <li><Link to="/app/find-partners" className="footer-link">Explore Directory</Link></li>
              <li><Link to="/app/matches" className="footer-link">Smart Matching</Link></li>
              <li><Link to="/about" className="footer-link">About Our Mission</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="footer-col-title">Community</h5>
            <ul className="footer-links">
              <li><Link to="/how-it-works" className="footer-link">Safety Guidelines</Link></li>
              <li><Link to="/app/feedback" className="footer-link">Reviews & Trust</Link></li>
              <li><Link to="/admin" className="footer-link">Moderation Center</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="footer-col-title">Academic Notice</h5>
            <p style={{ color: 'var(--color-slate-400)', fontSize: 'var(--font-size-xs)', lineHeight: 1.6 }}>
              Developed as a formal Software Engineering Project. Built on a clean decoupled Three-Layer Architecture adhering to FR-01–FR-13 & NFR-01–NFR-07.
            </p>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© 2026 Skill Swap Network. Free & open-source peer knowledge exchange.</span>
          <span>Designed with high-contrast, accessible standards • React 18 & Vite</span>
        </div>
      </div>
    </footer>
  );
}

