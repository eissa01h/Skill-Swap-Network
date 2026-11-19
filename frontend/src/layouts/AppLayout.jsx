import React from 'react';
import { Navbar } from '../components/ui/Navigation/Navbar';
import { Sidebar } from '../components/ui/Navigation/Sidebar';

export function AppLayout({ children, title, subtitle, actions }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'var(--bg-app)' }}>
      <Navbar />
      <div className="container" style={{ display: 'flex', flex: 1, padding: 0, maxWidth: '100%' }}>
        <Sidebar isAdmin={false} />
        <main style={{ flex: 1, padding: 'var(--space-8) var(--space-8)', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
          {(title || subtitle || actions) && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-8)', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
              <div>
                {title && <h1 style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 700 }}>{title}</h1>}
                {subtitle && <p style={{ color: 'var(--text-muted)', fontSize: 'var(--font-size-sm)', marginTop: 'var(--space-1)' }}>{subtitle}</p>}
              </div>
              {actions && <div style={{ display: 'flex', gap: 'var(--space-3)' }}>{actions}</div>}
            </div>
          )}
          {children}
        </main>
      </div>
    </div>
  );
}
