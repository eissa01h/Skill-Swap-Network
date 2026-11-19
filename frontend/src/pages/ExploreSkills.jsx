import React, { useState } from 'react';
import { Card } from '../components/common/Card';

export function ExploreSkills() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div>
      <div style={{ marginBottom: 'var(--spacing-8)' }}>
        <h1 style={{ fontSize: 'var(--font-size-2xl)', marginBottom: 'var(--spacing-2)' }}>Explore Skills Directory</h1>
        <p style={{ color: 'var(--text-muted)' }}>Browse available skills offered by community members and request a swap.</p>
      </div>

      <div style={{ marginBottom: 'var(--spacing-8)' }}>
        <input
          type="text"
          placeholder="Search by skill name, topic, or keyword (e.g. Java, Guitar, Spanish)..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: '100%', maxWidth: '600px', padding: 'var(--spacing-3)' }}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--spacing-6)' }}>
        <Card title="Programming & Tech" subtitle="Software, Web, Data, AI">
          <p style={{ color: 'var(--text-muted)', fontSize: 'var(--font-size-sm)' }}>
            Learn Python, Java, React, SQL, Cloud Architecture and more from experienced developers.
          </p>
        </Card>
        <Card title="Music & Creative Arts" subtitle="Instruments, Production, Design">
          <p style={{ color: 'var(--text-muted)', fontSize: 'var(--font-size-sm)' }}>
            Guitar lessons, digital illustration, audio mixing, and video editing.
          </p>
        </Card>
        <Card title="Languages & Humanities" subtitle="Spoken languages, Writing">
          <p style={{ color: 'var(--text-muted)', fontSize: 'var(--font-size-sm)' }}>
            Practice conversational Spanish, Japanese, German, or creative writing.
          </p>
        </Card>
      </div>
    </div>
  );
}
