import React from 'react';
import './SkillTag.css';

export function SkillTag({
  name,
  level = null,
  type = 'offered', // 'offered' | 'wanted'
  onRemove = null,
  className = '',
}) {
  return (
    <span className={`skill-tag skill-tag-${type} ${className}`}>
      <span>{name}</span>
      {level && <span className="skill-level-pill">{level}</span>}
      {onRemove && (
        <button
          type="button"
          className="skill-remove-btn"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          aria-label={`Remove ${name}`}
        >
          ×
        </button>
      )}
    </span>
  );
}
