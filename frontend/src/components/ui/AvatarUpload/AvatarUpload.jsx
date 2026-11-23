import React, { useState, useRef } from 'react';
import { Button } from '../Button/Button';

export function AvatarUpload({
  label = 'Profile Photo',
  value,
  onChange,
  userName = 'Member',
  helperText = 'Choose a photo from your device (JPG, PNG, WEBP) or enter a web URL.',
}) {
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [fileDetails, setFileDetails] = useState(null);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const fallbackAvatar = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80';
  const currentAvatar = value || fallbackAvatar;

  // Process, square-crop, and compress device image using HTML5 Canvas
  const processImageFile = (file) => {
    setError('');
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file (PNG, JPG, WEBP, or GIF).');
      return;
    }

    if (file.size > 12 * 1024 * 1024) {
      setError('Image file is larger than 12MB. Please select a smaller photo.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        try {
          const maxDim = 320;
          const width = img.width;
          const height = img.height;

          // Center-crop to square
          const minDim = Math.min(width, height);
          const startX = (width - minDim) / 2;
          const startY = (height - minDim) / 2;

          const canvas = document.createElement('canvas');
          const targetSize = Math.min(minDim, maxDim);
          canvas.width = targetSize;
          canvas.height = targetSize;

          const ctx = canvas.getContext('2d');
          ctx.drawImage(
            img,
            startX,
            startY,
            minDim,
            minDim,
            0,
            0,
            canvas.width,
            canvas.height
          );

          // Export compressed data URL (high quality, low byte weight ~25-45KB)
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.88);
          onChange(compressedDataUrl);
          setFileDetails({
            name: file.name,
            sizeKb: Math.round(file.size / 1024),
          });
        } catch {
          // Fallback to raw data URL if canvas manipulation fails
          onChange(e.target.result);
          setFileDetails({
            name: file.name,
            sizeKb: Math.round(file.size / 1024),
          });
        }
      };
      img.onerror = () => {
        setError('Could not decode this image file. Please try another photo.');
      };
      img.src = e.target.result;
    };
    reader.onerror = () => {
      setError('Could not read image from device.');
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleOpenFileDialog = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleResetToDefault = () => {
    onChange(fallbackAvatar);
    setFileDetails(null);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
      {label && (
        <label style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600, color: 'var(--text-primary)' }}>
          {label}
        </label>
      )}

      {/* Main Avatar Selection Card */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-5)',
          padding: 'var(--space-4)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          backgroundColor: 'var(--color-slate-50)',
          flexWrap: 'wrap',
        }}
      >
        {/* Avatar Preview */}
        <div style={{ position: 'relative' }}>
          <img
            src={currentAvatar}
            alt={userName}
            style={{
              width: '90px',
              height: '90px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '3px solid var(--color-primary-200)',
              boxShadow: 'var(--shadow-sm)',
              display: 'block',
              backgroundColor: '#e2e8f0',
            }}
            onError={(e) => {
              e.target.src = fallbackAvatar;
            }}
          />
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', flex: 1, minWidth: '220px' }}>
          <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/png,image/jpeg,image/jpg,image/webp,image/gif"
              style={{ display: 'none' }}
            />
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={handleOpenFileDialog}
            >
              📁 Choose from Device
            </Button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowUrlInput(!showUrlInput)}
            >
              {showUrlInput ? 'Hide Web URL' : '🔗 Web Link'}
            </Button>

            {value && value !== fallbackAvatar && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleResetToDefault}
              >
                Reset Default
              </Button>
            )}
          </div>

          {fileDetails && (
            <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-success-text, #059669)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span>✓ Photo loaded from device:</span>
              <strong>{fileDetails.name}</strong>
              <span style={{ color: 'var(--text-muted)' }}>({fileDetails.sizeKb} KB)</span>
            </div>
          )}

          {error && (
            <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-danger, #dc2626)', fontWeight: 500 }}>
              ⚠ {error}
            </div>
          )}

          {!fileDetails && !error && helperText && (
            <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>
              {helperText}
            </span>
          )}
        </div>
      </div>

      {/* Optional Web URL Input (Toggleable) */}
      {showUrlInput && (
        <div style={{ marginTop: 'var(--space-2)', padding: 'var(--space-3)', backgroundColor: '#fff', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)' }}>
          <label style={{ fontSize: 'var(--font-size-xs)', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
            Paste Image URL directly:
          </label>
          <input
            type="text"
            placeholder="https://..."
            value={value || ''}
            onChange={(e) => {
              setFileDetails(null);
              onChange(e.target.value);
            }}
            style={{
              width: '100%',
              padding: 'var(--space-2) var(--space-3)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-subtle)',
              fontSize: 'var(--font-size-sm)',
            }}
          />
        </div>
      )}
    </div>
  );
}
