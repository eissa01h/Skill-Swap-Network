import React, { useState } from 'react';
import { AppLayout } from '../../layouts/AppLayout';
import { Card } from '../../components/ui/Card/Card';
import { Button } from '../../components/ui/Button/Button';
import { Input } from '../../components/ui/Input/Input';
import { Textarea } from '../../components/ui/Input/Textarea';
import { Select } from '../../components/ui/Select/Select';
import { Modal } from '../../components/ui/Modal/Modal';
import { SkillTag } from '../../components/ui/SkillTag/SkillTag';
import { MOCK_LEARNING_INTERESTS, MOCK_SKILL_CATEGORIES } from '../../utils/mockData';

export function LearningInterestsPage() {
  const [interests, setInterests] = useState(MOCK_LEARNING_INTERESTS);
  const [modalOpen, setModalOpen] = useState(false);
  const [newInterest, setNewInterest] = useState({
    name: '',
    category: 'Languages',
    currentLevel: 'BEGINNER',
    targetLevel: 'INTERMEDIATE',
    goal: '',
  });

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newInterest.name.trim()) return;

    setInterests([
      ...interests,
      {
        id: `li_${Date.now()}`,
        ...newInterest,
      },
    ]);
    setNewInterest({
      name: '',
      category: 'Languages',
      currentLevel: 'BEGINNER',
      targetLevel: 'INTERMEDIATE',
      goal: '',
    });
    setModalOpen(false);
  };

  const handleRemove = (id) => {
    setInterests(interests.filter(i => i.id !== id));
  };

  return (
    <AppLayout
      title="My Learning Goals"
      subtitle="Skills and disciplines you want to learn. Our engine uses these to discover partners who teach them."
      actions={
        <Button variant="primary" size="md" onClick={() => setModalOpen(true)}>
          + Add Learning Goal
        </Button>
      }
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--space-6)' }}>
        {interests.map(item => (
          <Card key={item.id} hoverable>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-3)' }}>
              <div>
                <span style={{ fontSize: '0.7rem', color: 'var(--color-accent-700)', fontWeight: 700, textTransform: 'uppercase' }}>
                  {item.category}
                </span>
                <h3 style={{ fontSize: 'var(--font-size-md)', fontWeight: 700, marginTop: '2px' }}>
                  {item.name}
                </h3>
              </div>
              <SkillTag name={`Target: ${item.targetLevel}`} type="wanted" />
            </div>

            <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)', marginBottom: 'var(--space-4)', lineHeight: 1.6 }}>
              <strong>Goal:</strong> {item.goal || 'General improvement and conversational practice.'}
            </p>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: 'var(--space-3)', borderTop: '1px solid var(--border-subtle)', fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>
              <span>Current level: <strong>{item.currentLevel}</strong></span>
              <Button variant="danger" size="sm" onClick={() => handleRemove(item.id)}>
                Remove
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Add Learning Interest Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Add a Learning Goal"
      >
        <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <Input
            label="What do you want to learn?"
            required
            placeholder="e.g. Conversational Italian or Docker DevOps"
            value={newInterest.name}
            onChange={(e) => setNewInterest({ ...newInterest, name: e.target.value })}
          />

          <Select
            label="Category"
            options={MOCK_SKILL_CATEGORIES.filter(c => c !== 'All Categories')}
            value={newInterest.category}
            onChange={(e) => setNewInterest({ ...newInterest, category: e.target.value })}
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
            <Select
              label="Current Level"
              options={['BEGINNER', 'INTERMEDIATE', 'ADVANCED']}
              value={newInterest.currentLevel}
              onChange={(e) => setNewInterest({ ...newInterest, currentLevel: e.target.value })}
            />

            <Select
              label="Target Goal Level"
              options={['INTERMEDIATE', 'ADVANCED', 'EXPERT']}
              value={newInterest.targetLevel}
              onChange={(e) => setNewInterest({ ...newInterest, targetLevel: e.target.value })}
            />
          </div>

          <Textarea
            label="Specific Goal or Learning Objectives"
            rows={3}
            placeholder="What would you like to achieve in your exchange sessions?"
            value={newInterest.goal}
            onChange={(e) => setNewInterest({ ...newInterest, goal: e.target.value })}
          />

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)', marginTop: 'var(--space-4)' }}>
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Save Goal
            </Button>
          </div>
        </form>
      </Modal>
    </AppLayout>
  );
}
