import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AppLayout } from '../../layouts/AppLayout';
import { Card } from '../../components/ui/Card/Card';
import { Input } from '../../components/ui/Input/Input';
import { Textarea } from '../../components/ui/Input/Textarea';
import { Button } from '../../components/ui/Button/Button';
import { ErrorMessage } from '../../components/ui/Feedback/ErrorMessage';
import { useAuth } from '../../hooks/useAuth';
import { authService } from '../../services/authService';

export function EditProfilePage() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    title: user?.title || '',
    location: user?.location || '',
    availability: user?.availability || '',
    bio: user?.bio || '',
    avatarUrl: user?.avatarUrl || '',
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullName.trim()) {
      setError('Full Name is required.');
      return;
    }

    setError('');
    setSaving(true);
    try {
      const updated = await authService.updateProfile(formData);
      setUser(updated);
      setSavedSuccess(true);
      setTimeout(() => {
        setSavedSuccess(false);
        navigate('/app/profile');
      }, 900);
    } catch (err) {
      setError(err.message || 'Failed to save profile changes.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppLayout
      title="Edit Member Profile"
      subtitle="Update your presentation, introduction, and scheduling availability for the community."
      actions={
        <Link to="/app/profile">
          <Button variant="outline" size="sm">Cancel & Return</Button>
        </Link>
      }
    >
      <div style={{ maxWidth: '680px' }}>
        <Card>
          <ErrorMessage message={error} />

          {savedSuccess && (
            <div style={{ padding: 'var(--space-3)', backgroundColor: 'var(--color-success-bg)', color: 'var(--color-success-text)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-4)', fontSize: 'var(--font-size-sm)', fontWeight: 600 }}>
              ✓ Profile successfully updated! Redirecting to profile view...
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
              <Input
                label="Full Name"
                name="fullName"
                required
                value={formData.fullName}
                onChange={handleChange}
              />
              <Input
                label="Location / Timezone"
                name="location"
                placeholder="e.g. San Francisco, CA (PST)"
                value={formData.location}
                onChange={handleChange}
              />
            </div>

            <Input
              label="Professional Title or Tagline"
              name="title"
              placeholder="e.g. Full-Stack Engineer & Amateur Pianist"
              value={formData.title}
              onChange={handleChange}
            />

            <Input
              label="Profile Picture URL"
              name="avatarUrl"
              placeholder="https://..."
              value={formData.avatarUrl}
              onChange={handleChange}
              helperText="Paste any valid image URL or keep default avatar."
            />

            <Input
              label="Weekly Availability"
              name="availability"
              placeholder="e.g. Weekday evenings (after 6 PM) and Saturday mornings"
              value={formData.availability}
              onChange={handleChange}
              helperText="Helps the match engine align overlapping schedules."
            />

            <Textarea
              label="Bio & Introduction"
              name="bio"
              rows={4}
              value={formData.bio}
              onChange={handleChange}
              helperText="Tell potential partners about your teaching background and learning enthusiasm."
            />

            <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end', marginTop: 'var(--space-2)' }}>
              <Button variant="outline" onClick={() => navigate('/app/profile')}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" loading={saving}>
                Save Changes
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </AppLayout>
  );
}
