import React, { useState } from 'react';
import { AppLayout } from '../../layouts/AppLayout';
import { Card } from '../../components/ui/Card/Card';
import { Button } from '../../components/ui/Button/Button';
import { Modal } from '../../components/ui/Modal/Modal';
import { Input } from '../../components/ui/Input/Input';
import { Select } from '../../components/ui/Select/Select';
import { StatusBadge } from '../../components/ui/Badge/StatusBadge';
import { MOCK_SCHEDULED_LESSONS } from '../../utils/mockData';

export function LessonSchedulePage() {
  const [lessons, setLessons] = useState(MOCK_SCHEDULED_LESSONS);
  const [modalOpen, setModalOpen] = useState(false);
  const [newLesson, setNewLesson] = useState({
    partnerName: 'Carlos Rodriguez',
    topic: '',
    type: 'TEACHING',
    dateTime: '',
    meetingLink: 'https://meet.jit.si/skillswap-session',
  });

  const handleSchedule = (e) => {
    e.preventDefault();
    if (!newLesson.topic.trim()) return;

    setLessons([
      {
        id: `les_${Date.now()}`,
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
        status: 'UPCOMING',
        ...newLesson,
      },
      ...lessons,
    ]);
    setModalOpen(false);
  };

  return (
    <AppLayout
      title="Lesson Schedule"
      subtitle="Upcoming exchange sessions and mutual video meeting links."
      actions={
        <Button variant="primary" size="md" onClick={() => setModalOpen(true)}>
          + Schedule New Session
        </Button>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        {lessons.map(item => (
          <Card key={item.id}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                <img
                  src={item.avatar}
                  alt={item.partnerName}
                  style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                    <h4 style={{ fontSize: 'var(--font-size-md)', fontWeight: 700 }}>{item.topic}</h4>
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, padding: '0.15rem 0.5rem', borderRadius: 'var(--radius-sm)', backgroundColor: item.type === 'TEACHING' ? 'var(--color-primary-100)' : 'var(--color-accent-100)', color: item.type === 'TEACHING' ? 'var(--color-primary-700)' : 'var(--color-accent-700)' }}>
                      {item.type === 'TEACHING' ? 'YOU TEACH' : 'YOU LEARN'}
                    </span>
                  </div>
                  <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)', marginTop: '2px' }}>
                    Partner: <strong>{item.partnerName}</strong> • {item.dateTime}
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                <StatusBadge status={item.status} />
                {item.meetingLink && item.status === 'UPCOMING' && (
                  <a href={item.meetingLink} target="_blank" rel="noreferrer">
                    <Button variant="primary" size="sm">
                      Join Video Call ↗
                    </Button>
                  </a>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Schedule Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Schedule an Exchange Session"
      >
        <form onSubmit={handleSchedule} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <Select
            label="Swap Partner"
            options={['Carlos Rodriguez', 'Elena Rostova']}
            value={newLesson.partnerName}
            onChange={(e) => setNewLesson({ ...newLesson, partnerName: e.target.value })}
          />

          <Select
            label="Session Type"
            options={[
              { value: 'TEACHING', label: 'You are teaching your partner' },
              { value: 'LEARNING', label: 'Partner is teaching you' },
            ]}
            value={newLesson.type}
            onChange={(e) => setNewLesson({ ...newLesson, type: e.target.value })}
          />

          <Input
            label="Topic / Focus Area"
            required
            placeholder="e.g. Spanish Past Tense & Irregular Verbs"
            value={newLesson.topic}
            onChange={(e) => setNewLesson({ ...newLesson, topic: e.target.value })}
          />

          <Input
            label="Date & Time"
            required
            placeholder="e.g. Next Saturday, 11:00 AM PST"
            value={newLesson.dateTime}
            onChange={(e) => setNewLesson({ ...newLesson, dateTime: e.target.value })}
          />

          <Input
            label="Video Room URL"
            value={newLesson.meetingLink}
            onChange={(e) => setNewLesson({ ...newLesson, meetingLink: e.target.value })}
            helperText="Default room generated using free Jitsi Meet."
          />

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)', marginTop: 'var(--space-2)' }}>
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Confirm & Add to Schedule
            </Button>
          </div>
        </form>
      </Modal>
    </AppLayout>
  );
}
