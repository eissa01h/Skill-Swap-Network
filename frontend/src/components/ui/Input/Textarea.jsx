import React from 'react';
import './Input.css';

export function Textarea({
  label,
  placeholder,
  value,
  onChange,
  error,
  helperText,
  required = false,
  rows = 4,
  disabled = false,
  id,
  name,
  className = '',
  ...props
}) {
  const textareaId = id || name || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className={`input-group ${className}`}>
      {label && (
        <label htmlFor={textareaId} className="input-label">
          <span>
            {label}
            {required && <span className="input-required">*</span>}
          </span>
        </label>
      )}
      <textarea
        id={textareaId}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        rows={rows}
        className={`input-field ${error ? 'input-error-field' : ''}`}
        style={{ resize: 'vertical', minHeight: '80px' }}
        {...props}
      />
      {error ? (
        <span className="input-error-text">{error}</span>
      ) : helperText ? (
        <span className="input-helper">{helperText}</span>
      ) : null}
    </div>
  );
}

