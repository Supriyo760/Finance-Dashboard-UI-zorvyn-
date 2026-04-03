import React from 'react';

interface BudgetRingProps {
  current: number;
  limit: number;
  size?: number;
  strokeWidth?: number;
}

export const BudgetRing: React.FC<BudgetRingProps> = ({ current, limit, size = 120, strokeWidth = 10 }) => {
  const safeLimit = limit && limit > 0 ? limit : 1200;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const percent = Math.min((current / safeLimit) * 100, 100);
  const offset = circumference - (percent / 100) * circumference;
  
  let color = 'var(--success)';
  if (percent > 75) color = 'var(--accent-primary)';
  if (percent > 90) color = 'var(--danger)';

  return (
    <div style={{ position: 'relative', width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle
          stroke="var(--border-color)"
          fill="transparent"
          strokeWidth={strokeWidth}
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          stroke={color}
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          r={radius}
          cx={size / 2}
          cy={size / 2}
          style={{ transition: 'stroke-dashoffset 0.8s ease-in-out, stroke 0.3s ease' }}
        />
      </svg>
      <div style={{ position: 'absolute', textAlign: 'center', color: 'var(--text-primary)' }}>
        <span style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{Math.round(percent)}%</span>
        <br/>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>of Limit</span>
      </div>
    </div>
  );
};
