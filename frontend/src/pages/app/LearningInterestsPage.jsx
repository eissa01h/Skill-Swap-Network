import React, { useState, useEffect } from 'react';
import { AppLayout } from '../../layouts/AppLayout';
import { Card } from '../../components/ui/Card/Card';
import { Button } from '../../components/ui/Button/Button';
import { Input } from '../../components/ui/Input/Input';
import { Textarea } from '../../components/ui/Input/Textarea';
import { Select } from '../../components/ui/Select/Select';
import { Modal } from '../../components/ui/Modal/Modal';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog/ConfirmDialog';
import { SkillTag } from '../../components/ui/SkillTag/SkillTag';
import { ErrorMessage } from '../../components/ui/Feedback/ErrorMessage';
import { Spinner } from '../../components/ui/Feedback/Spinner';
import { skillService } from '../../services/skillService';
import { MOCK_SKILL_CATEGORIES } from '../../utils/mockData';

export function LearningInterestsPage() {
  const [interests, setInterests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Add / Edit Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Languages',
    currentLevel: 'BEGINNER',
    targetLevel: 'INTERMEDIATE',
    goal: '',
  });

  // Delete dialog state
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    loadInterests();
  }, []);

  async function loadInterests() {
    try {
      const data = await skillService.getLearningInterests();
      setInterests(data);
    } finally {
      setLoading(false);
    }
  }

  const openAddModal = () => {
    setEditingId(null);
    setFormData({
      name: '',
      category: 'Languages',
      currentLevel: 'BEGINNER',
      targetLevel: 'INTERMEDIATE',
      goal: '',
    });
    setError('');
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingId(item.id);
    setFormData({
      name: item.name,
      category: item.category,
      currentLevel: item.currentLevel,
      targetLevel: item.targetLevel,
      goal: item.goal,
    });
    setError('');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError('Skill name is required.');
      return;
    }

    try {
      if (editingId) {
        await skillService.updateLearningInterest(editingId, formData);
      } else {
        await skillService.addLearningInterest(formData);
      }
      setIsModalOpen(false);
      loadInterests();
    } catch (err) {
      setError(err.message || 'Operation failed.');
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingId) return;
    await skillService.deleteLearningInterest(deletingId);
    setDeletingId(null);
    loadInterests();
  };

  return (
    <AppLayout
      title="My Learning Goals"
      subtitle="Skills you want to learn. Our engine scans for peers who offer these skills and want what you teach."
      actions={
        <Button variant="primary" size="md" onClick={openAddModal}>
          + Add Learning Goal
        </Button>
      }
    >
      <ErrorMessage message={error} />

      {loading ? (
        <Spinner size="lg" message="Loading learning goals..." />
      ) : interests.length === 0 ? (
        <Card>
          <div style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
            <p style={{ color: 'var(--text-muted)', marginBottom: 'var(--space-4)' }}>
              No learning goals added yet. Add a skill you'd like to learn from peers!
            </p>
            <Button variant="primary" onClick={openAddModal}>+ Add Your First Goal</Button>
          </div>
        </Card>
      ) : (
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
                <strong>Objective:</strong> {item.goal || 'General improvement and practical application.'}
              </p>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: 'var(--space-3)', borderTop: '1px solid var(--border-subtle)', fontSize: 'var(--font-size-xs)' }}>
                <span style={{ color: 'var(--text-muted)' }}>Current Level: <strong>{item.currentLevel}</strong></span>
                <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                  <Button variant="outline" size="sm" onClick={() => openEditModal(item)}>
                    Edit
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => setDeletingId(item.id)}>
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Edit Learning Goal' : 'Add a New Learning Goal'}
      >
        <ErrorMessage message={error} />

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <Input
            label="What skill do you want to learn?"
            required
            disabled={!!editingId}
            placeholder="e.g. Conversational Italian, Guitar Fingerpicking, Figma UI"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            helperText={editingId ? 'Goal name cannot be changed.' : 'Must be unique in your learning goals.'}
          />

          <Select
            label="Category"
            options={MOCK_SKILL_CATEGORIES.filter(c => c !== 'All Categories')}
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
            <Select
              label="Current Level"
              options={['BEGINNER', 'INTERMEDIATE', 'ADVANCED']}
              value={formData.currentLevel}
              onChange={(e) => setFormData({ ...formData, currentLevel: e.target.value })}
            />

            <Select
              label="Target Goal Level"
              options={['INTERMEDIATE', 'ADVANCED', 'EXPERT']}
              value={formData.targetLevel}
              onChange={(e) => setFormData({ ...formData, targetLevel: e.target.value })}
            />
          </div>

          <Textarea
            label="Specific Objectives"
            rows={3}
            placeholder="What specific tasks or milestones do you want to conquer?"
            value={formData.goal}
            onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
          />

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)', marginTop: 'var(--space-2)' }}>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {editingId ? 'Save Changes' : 'Add to Learning Goals'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={handleConfirmDelete}
        title="Remove Learning Goal"
        message="Are you sure you want to remove this learning goal? It will no longer be considered for reciprocal matches."
        confirmText="Remove Goal"
      />
    </AppLayout>
  );
}
