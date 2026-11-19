import React from 'react';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';

export function MainLayout({ children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <main style={{ flex: 1, padding: 'var(--spacing-8) 0' }}>
        <div className="container">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}
