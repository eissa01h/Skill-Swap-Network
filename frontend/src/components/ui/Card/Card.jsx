import React from 'react';
import './Card.css';

export function Card({
  title,
  subtitle,
  actions,
  children,
  hoverable = false,
  className = '',
  style = {},
  onClick,
}) {
  return (
    <div
      onClick={onClick}
      className={`ui-card ${hoverable ? 'ui-card-hover' : ''} ${className}`}
      style={style}
    >
      {(title || subtitle || actions) && (
        <div className="ui-card-header">
          <div>
            {title && <h3 className="ui-card-title">{title}</h3>}
            {subtitle && <p className="ui-card-subtitle">{subtitle}</p>}
          </div>
          {actions && <div className="ui-card-actions">{actions}</div>}
        </div>
      )}
      <div className="ui-card-body">{children}</div>
    </div>
  );
}
