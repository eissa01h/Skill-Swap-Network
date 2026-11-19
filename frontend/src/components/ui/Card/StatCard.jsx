import React from 'react';
import './Card.css';

export function StatCard({
  label,
  value,
  trend,
  icon,
  iconBg,
  iconColor,
  className = '',
}) {
  return (
    <div className={`ui-card stat-card ${className}`}>
      <div>
        <span className="ui-card-subtitle">{label}</span>
        <div className="stat-value">{value}</div>
        {trend && (
          <div className="stat-trend stat-trend-up">
            <span>↑ {trend}</span>
          </div>
        )}
      </div>
      {icon && (
        <div
          className="stat-icon-bubble"
          style={{
            backgroundColor: iconBg || undefined,
            color: iconColor || undefined,
          }}
        >
          {icon}
        </div>
      )}
    </div>
  );
}

