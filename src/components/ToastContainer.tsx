import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Toast } from './Toast';

export const ToastContainer: React.FC = () => {
  const { state } = useAppContext();

  return (
    <div className="toast-container">
      {state.toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} />
      ))}
    </div>
  );
};
