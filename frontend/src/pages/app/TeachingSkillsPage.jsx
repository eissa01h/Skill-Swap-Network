import React, { useState } from 'react';
import { AppLayout } from '../../layouts/AppLayout';
import { Card } from '../../components/ui/Card/Card';
import { Button } from '../../components/ui/Button/Button';
import { Input } from '../../components/ui/Input/Input';
import { Textarea } from '../../components/ui/Input/Textarea';
import { Select } from '../../components/ui/Select/Select';
import { Modal } from '../../components/ui/Modal/Modal';
import { SkillTag } from '../../components/ui/SkillTag/SkillTag';
import { MOCK_TEACHING_SKILLS, MOCK_SKILL_CATEGORIES } from '../../utils/mockData';

export function TeachingSkillsPage() {
  const [skills, setSkills] = useState(MOCK_TEACHING_SKILLS);
  const [modalOpen, setModalOpen] = useState(false);
  const [newSkill, setNewSkill] = useState({
    name: '',
    category: 'Software Development',
    level: 'ADVANCED',
    experienceYears: '',
    description: '',
  });

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (!newSkill.name.trim()) return;

    setSkills([
      ...skills,
      {
        id: `ts_${Date.now()}`,
        ...newSkill,
        studentsHelped: 0,
      },
    ]);
    setNewSkill({
      name: '',
      category: 'Software Development',
      level: 'ADVANCED',
      experienceYears: '',
      description: '',
    });
    setModalOpen(false);
  };

  const handleRemove = (id) => {
    setSkills(skills.filter(s => s.id !== id));
  };

  return (
    <AppLayout
      title="My Teaching Skills"
      subtitle="Skills you can share with peers in exchange for topics you want to learn."
      actions={
        <Button variant="primary" size="md" onClick={() => setModalOpen(true)}>
          + Add New Skill
        </Button>
      }
    >
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
              {skill.description}
            </p>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: 'var(--space-3)', borderTop: '1px solid var(--border-subtle)', fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>
              <span>Experience: <strong>{skill.experienceYears || '3+ years'}</strong></span>
              <Button variant="danger" size="sm" onClick={() => handleRemove(skill.id)}>
                Delete
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Add Skill Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Add a Skill to Teach"
      >
        <form onSubmit={handleAddSkill} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <Input
            label="Skill Name"
            required
            placeholder="e.g. Modern React & State Management"
            value={newSkill.name}
            onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
          />

          <Select
            label="Category"
            options={MOCK_SKILL_CATEGORIES.filter(c => c !== 'All Categories')}
            value={newSkill.category}
            onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value })}
          />

          <Select
            label="Your Proficiency Level"
            options={['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT']}
            value={newSkill.level}
            onChange={(e) => setNewSkill({ ...newSkill, level: e.target.value })}
          />

          <Input
            label="Years of Experience"
            placeholder="e.g. 4 years"
            value={newSkill.experienceYears}
            onChange={(e) => setNewSkill({ ...newSkill, experienceYears: e.target.value })}
          />

          <Textarea
            label="Description & What You Can Teach"
            rows={3}
            placeholder="Outline the core topics or drills you are comfortable guiding someone through..."
            value={newSkill.description}
            onChange={(e) => setNewSkill({ ...newSkill, description: e.target.value })}
          />

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)', marginTop: 'var(--space-4)' }}>
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Add Teaching Skill
            </Button>
          </div>
        </form>
      </Modal>
    </AppLayout>
  );
}
