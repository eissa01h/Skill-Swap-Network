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

export function TeachingSkillsPage() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Add / Edit Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Software Development',
    level: 'ADVANCED',
    experienceYears: '3 years',
    description: '',
  });

  // Delete dialog state
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    loadSkills();
  }, []);

  async function loadSkills() {
    try {
      const data = await skillService.getTeachingSkills();
      setSkills(data);
    } finally {
      setLoading(false);
    }
  }

  const openAddModal = () => {
    setEditingId(null);
    setFormData({
      name: '',
      category: 'Software Development',
      level: 'ADVANCED',
      experienceYears: '3 years',
      description: '',
    });
    setError('');
    setIsModalOpen(true);
  };

  const openEditModal = (skill) => {
    setEditingId(skill.id);
    setFormData({
      name: skill.name,
      category: skill.category,
      level: skill.level,
      experienceYears: skill.experienceYears,
      description: skill.description,
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
        await skillService.updateTeachingSkill(editingId, formData);
      } else {
        await skillService.addTeachingSkill(formData);
      }
      setIsModalOpen(false);
      loadSkills();
    } catch (err) {
      setError(err.message || 'Operation failed.');
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingId) return;
    await skillService.deleteTeachingSkill(deletingId);
    setDeletingId(null);
    loadSkills();
  };

  return (
    <AppLayout
      title="My Teaching Skills"
      subtitle="The skills and knowledge areas you offer to share with peers in reciprocal exchanges."
      actions={
        <Button variant="primary" size="md" onClick={openAddModal}>
          + Offer New Skill
        </Button>
      }
    >
      <ErrorMessage message={error} />

      {loading ? (
        <Spinner size="lg" message="Loading teaching skills..." />
      ) : skills.length === 0 ? (
        <Card>
          <div style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
            <p style={{ color: 'var(--text-muted)', marginBottom: 'var(--space-4)' }}>
              You haven't listed any teaching skills yet. Add a skill you are comfortable sharing!
            </p>
            <Button variant="primary" onClick={openAddModal}>+ Offer Your First Skill</Button>
          </div>
        </Card>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--space-6)' }}>
          {skills.map(skill => (
            <Card key={skill.id} hoverable>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-3)' }}>
                <div>
                  <span style={{ fontSize: '0.7rem', color: 'var(--color-primary-600)', fontWeight: 700, textTransform: 'uppercase' }}>
                    {skill.category}
                  </span>
                  <h3 style={{ fontSize: 'var(--font-size-md)', fontWeight: 700, marginTop: '2px' }}>
                    {skill.name}
                  </h3>
                </div>
                <SkillTag name={skill.level} type="offered" />
              </div>

              <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)', marginBottom: 'var(--space-4)', lineHeight: 1.6 }}>
                {skill.description || 'Experienced practitioner ready to mentor peers.'}
              </p>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: 'var(--space-3)', borderTop: '1px solid var(--border-subtle)', fontSize: 'var(--font-size-xs)' }}>
                <span style={{ color: 'var(--text-muted)' }}>Experience: <strong>{skill.experienceYears}</strong></span>
                <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                  <Button variant="outline" size="sm" onClick={() => openEditModal(skill)}>
                    Edit
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => setDeletingId(skill.id)}>
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
        title={editingId ? 'Edit Teaching Skill' : 'Offer a New Teaching Skill'}
      >
        <ErrorMessage message={error} />

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <Input
            label="Skill Name"
            required
            disabled={!!editingId}
            placeholder="e.g. Modern React Architecture, Classical Piano, Spanish"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            helperText={editingId ? 'Skill name cannot be changed once created.' : 'Must be unique in your teaching inventory.'}
          />

          <Select
            label="Category"
            options={MOCK_SKILL_CATEGORIES.filter(c => c !== 'All Categories')}
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          />

          <Select
            label="Proficiency Level"
            options={['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT']}
            value={formData.level}
            onChange={(e) => setFormData({ ...formData, level: e.target.value })}
          />

          <Input
            label="Years of Experience"
            placeholder="e.g. 5 years"
            value={formData.experienceYears}
            onChange={(e) => setFormData({ ...formData, experienceYears: e.target.value })}
          />

          <Textarea
            label="Description & What You Can Mentor"
            rows={3}
            placeholder="What concepts, drills, or projects will you help your learning partner with?"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)', marginTop: 'var(--space-2)' }}>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {editingId ? 'Save Changes' : 'Add to Teaching Skills'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Confirmation Dialog for Delete */}
      <ConfirmDialog
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={handleConfirmDelete}
        title="Remove Teaching Skill"
        message="Are you sure you want to remove this skill from your offerings? It will no longer appear in reciprocal matches."
        confirmText="Remove Skill"
      />
    </AppLayout>
  );
}
