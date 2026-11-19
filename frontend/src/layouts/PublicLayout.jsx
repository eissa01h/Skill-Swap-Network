import React from 'react';
import { Navbar } from '../components/ui/Navigation/Navbar';
import { Footer } from '../components/ui/Navigation/Footer';

export function PublicLayout({ children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'var(--bg-app)' }}>
      <Navbar />
      <main style={{ flex: 1 }}>{children}</main>
      <Footer />
    </div>
  );
}
