import React from 'react';
import { LayoutDashboard, Receipt, PieChart, Wallet, Moon, Sun, Settings } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { ToastContainer } from './ToastContainer';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { state, dispatch } = useAppContext();

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <Wallet size={24} />
          <span>Zorvyn Finance</span>
        </div>
        <nav className="sidebar-nav">
          <div 
            className={`nav-item ${state.view === 'dashboard' ? 'active' : ''}`}
            onClick={() => dispatch({ type: 'SET_VIEW', payload: 'dashboard' })}
          >
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </div>
          <div 
            className={`nav-item ${state.view === 'transactions' ? 'active' : ''}`}
            onClick={() => dispatch({ type: 'SET_VIEW', payload: 'transactions' })}
          >
            <Receipt size={20} />
            <span>Transactions</span>
          </div>
          <div 
            className={`nav-item ${state.view === 'insights' ? 'active' : ''}`}
            onClick={() => dispatch({ type: 'SET_VIEW', payload: 'insights' })}
          >
            <PieChart size={20} />
            <span>Insights</span>
          </div>
          <div 
            className={`nav-item ${state.view === 'settings' ? 'active' : ''}`}
            onClick={() => dispatch({ type: 'SET_VIEW', payload: 'settings' })}
          >
            <Settings size={20} />
            <span>Settings</span>
          </div>
        </nav>
      </aside>
      
      <main className="main-content">
        <header className="top-header">
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Overview</h2>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button 
              onClick={() => dispatch({ type: 'TOGGLE_THEME' })}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', padding: '0.5rem' }}
              title="Toggle Theme"
            >
              {state.theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
            <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginLeft: '0.5rem' }}>View as:</span>
            <select 
              value={state.role}
              onChange={(e) => dispatch({ type: 'SET_ROLE', payload: e.target.value as any })}
              style={{
                padding: '0.5rem',
                borderRadius: '0.375rem',
                border: '1px solid var(--border-color)',
              }}
            >
              <option value="viewer">Viewer</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </header>
        <div className="content-area">
          {children}
        </div>
      </main>
      <ToastContainer />
    </div>
  );
};
