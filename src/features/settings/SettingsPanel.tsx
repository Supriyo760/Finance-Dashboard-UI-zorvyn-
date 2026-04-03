import React from 'react';
import { Card } from '../../components/Card';
import { useAppContext } from '../../context/AppContext';
import { Sliders, RefreshCw, AlertTriangle } from 'lucide-react';

export const SettingsPanel: React.FC = () => {
  const { state, dispatch } = useAppContext();

  const handleMultiplierChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    dispatch({ type: 'SET_BUDGET_MULTIPLIER', payload: value });
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all data and settings? This will clear all transactions.')) {
      localStorage.removeItem('finance-data');
      localStorage.removeItem('finance-theme');
      localStorage.removeItem('finance-role');
      window.location.reload();
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <Card>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', color: 'var(--text-primary)' }}>
          <Sliders size={20} color="var(--accent-primary)" />
          Budget Configuration
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Budget Threshold (% of Income)</span>
            <span style={{ fontWeight: 600, color: 'var(--accent-primary)', fontSize: '1.125rem' }}>
              {Math.round(state.budgetMultiplier * 100)}%
            </span>
          </div>
          
          <input 
            type="range" 
            min="0.1" 
            max="1.0" 
            step="0.05" 
            value={state.budgetMultiplier} 
            onChange={handleMultiplierChange}
            style={{ 
              width: '100%', 
              cursor: 'pointer',
              accentColor: 'var(--accent-primary)'
            }}
          />
          
          <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', lineHeight: 1.4 }}>
            Adjust how strictly your budget ring monitors your spending relative to your income. 
            A lower percentage means a stricter budget threshold.
          </p>
        </div>
      </Card>

      <Card style={{ borderColor: 'var(--danger-light)' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', color: 'var(--danger)' }}>
          <AlertTriangle size={20} />
          Danger Zone
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Resetting the application will clear all your transaction history and restore default settings.
          </p>
          
          <button 
            onClick={handleReset}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.5rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--danger)',
              background: 'var(--danger-light)',
              color: 'var(--danger)',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'var(--danger)';
              e.currentTarget.style.color = 'white';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'var(--danger-light)';
              e.currentTarget.style.color = 'var(--danger)';
            }}
          >
            <RefreshCw size={18} />
            Reset All Data
          </button>
        </div>
      </Card>
    </div>
  );
};
