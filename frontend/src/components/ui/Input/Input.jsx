import React from 'react';
import './Input.css';

export function Input({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  helperText,
  required = false,
  startIcon = null,
  disabled = false,
  id,
  name,
  className = '',
  ...props
}) {
  const inputId = id || name || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className={`input-group ${className}`}>
      {label && (
        <label htmlFor={inputId} className="input-label">
          <span>
            {label}
            {required && <span className="input-required">*</span>}
          </span>
        </label>
      )}
      <div className="input-wrapper">
        {startIcon && <span className="input-icon-start">{startIcon}</span>}
        <input
          id={inputId}
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          className={`input-field ${error ? 'input-error-field' : ''} ${startIcon ? 'has-start-icon' : ''}`}
          {...props}
        />
      </div>
      {error ? (
        <span className="input-error-text">{error}</span>
      ) : helperText ? (
        <span className="input-helper">{helperText}</span>
      ) : null}
    </div>
  );
}

