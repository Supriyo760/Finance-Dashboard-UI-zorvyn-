import React, { useEffect, useState } from 'react';
import { Toast as ToastType } from '../types';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

interface ToastProps {
  toast: ToastType;
}

export const Toast: React.FC<ToastProps> = ({ toast }) => {
  const { dispatch } = useAppContext();
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      dispatch({ type: 'REMOVE_TOAST', payload: toast.id });
    }, 300);
  };

  const getIcon = () => {
    switch (toast.type) {
      case 'success': return <CheckCircle size={20} className="text-success" />;
      case 'error': return <XCircle size={20} className="text-danger" />;
      default: return <Info size={20} className="text-accent" />;
    }
  };

  return (
    <div className={`toast toast-${toast.type} ${isExiting ? 'exit' : ''}`}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1 }}>
        {getIcon()}
        <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>{toast.message}</span>
      </div>
      <button 
        onClick={handleClose}
        style={{ 
          background: 'none', 
          border: 'none', 
          padding: '0.25rem', 
          cursor: 'pointer', 
          color: 'var(--text-tertiary)',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <X size={16} />
      </button>
    </div>
  );
};
