import React, { useState, useEffect } from 'react';
import { AppLayout } from '../../layouts/AppLayout';
import { Card } from '../../components/ui/Card/Card';
import { Button } from '../../components/ui/Button/Button';
import { Modal } from '../../components/ui/Modal/Modal';
import { Input } from '../../components/ui/Input/Input';
import { Select } from '../../components/ui/Select/Select';
import { StatusBadge } from '../../components/ui/Badge/StatusBadge';
import { Spinner } from '../../components/ui/Feedback/Spinner';
import { EmptyState } from '../../components/ui/Feedback/EmptyState';
import { scheduleService } from '../../services/mockApi';

export function LessonSchedulePage() {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [newLesson, setNewLesson] = useState({
    partnerName: 'Carlos Rodriguez',
    topic: '',
    type: 'TEACHING',
    dateTime: '',
    meetingLink: 'https://meet.jit.si/skillswap-session',
  });

  const loadLessons = async () => {
    try {
      setLoading(true);
      const data = await scheduleService.getLessons();
      setLessons(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLessons();
  }, []);

  const handleSchedule = async (e) => {
    e.preventDefault();
    if (!newLesson.topic.trim()) {
      setErrorMsg('Please specify a lesson topic.');
      return;
    }
    if (!newLesson.dateTime.trim()) {
      setErrorMsg('Please specify date and time.');
      return;
    }

    try {
      setSubmitting(true);
      setErrorMsg('');
      await scheduleService.scheduleLesson(newLesson);
      await loadLessons();
      setModalOpen(false);
      setNewLesson({
        partnerName: 'Carlos Rodriguez',
        topic: '',
        type: 'TEACHING',
        dateTime: '',
        meetingLink: 'https://meet.jit.si/skillswap-session',
      });
    } catch (err) {
      setErrorMsg(err.message || 'Failed to schedule lesson.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AppLayout
      title="Lesson Schedule"
      subtitle="Upcoming exchange sessions and mutual video meeting links."
      actions={
        <Button variant="primary" size="md" onClick={() => { setErrorMsg(''); setModalOpen(true); }}>
          + Schedule New Session
        </Button>
      }
    >
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--space-8)' }}>
          <Spinner />
        </div>
      ) : lessons.length === 0 ? (
        <EmptyState
          title="No lessons scheduled yet"
          description="Plan your next teaching or learning session with your exchange partners."
          actionText="Schedule Session"
          onAction={() => setModalOpen(true)}
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {lessons.map(item => (
            <Card key={item.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                  <img
                    src={item.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80'}
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
      )}

      {/* Schedule Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Schedule an Exchange Session"
      >
        <form onSubmit={handleSchedule} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {errorMsg && (
            <div style={{ padding: '0.75rem', backgroundColor: '#fef2f2', color: '#b91c1c', borderRadius: 'var(--radius-md)', fontSize: 'var(--font-size-sm)' }}>
              {errorMsg}
            </div>
          )}

          <Select
            label="Swap Partner"
            options={['Carlos Rodriguez', 'Elena Rostova', 'Marcus Vance']}
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
            <Button variant="outline" type="button" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={submitting}>
              {submitting ? 'Scheduling...' : 'Confirm & Add to Schedule'}
            </Button>
          </div>
        </form>
      </Modal>
    </AppLayout>
  );
}

export default LessonSchedulePage;
