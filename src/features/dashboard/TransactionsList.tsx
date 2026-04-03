import React, { useState } from 'react';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { useAppContext } from '../../context/AppContext';
import { format } from 'date-fns';
import { Transaction, TransactionType } from '../../types';
import { Download, ChevronUp, ChevronDown, X, Search } from 'lucide-react';
import { exportToCsv } from '../../utils/exportCsv';

export const TransactionsList: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const [filterType, setFilterType] = useState<TransactionType | 'all'>('all');
  const [search, setSearch] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: keyof Transaction; direction: 'asc' | 'desc' } | null>({ key: 'date', direction: 'desc' });
  
  // New transaction form state simulating Admin actions
  const [showForm, setShowForm] = useState(false);
  const [newTx, setNewTx] = useState({ description: '', amount: '', category: '', type: 'expense', date: format(new Date(), 'yyyy-MM-dd') });

  const isAdmin = state.role === 'admin';

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTx.description || !newTx.amount || !newTx.category) return;
    
    const transaction: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      description: newTx.description,
      amount: parseFloat(newTx.amount),
      category: newTx.category,
      type: newTx.type as TransactionType,
      date: newTx.date
    };
    
    dispatch({ type: 'ADD_TRANSACTION', payload: transaction });
    dispatch({ type: 'ADD_TOAST', payload: { message: 'Transaction added successfully!', type: 'success' } });
    setShowForm(false);
    setNewTx({ description: '', amount: '', category: '', type: 'expense', date: format(new Date(), 'yyyy-MM-dd') });
  };

  const handleSort = (key: keyof Transaction) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const filtered = state.transactions.filter(t => {
    const matchType = filterType === 'all' || t.type === filterType;
    const matchSearch = t.description.toLowerCase().includes(search.toLowerCase()) || 
                        t.category.toLowerCase().includes(search.toLowerCase());
    const matchCategory = state.selectedCategory ? t.category === state.selectedCategory : true;
    return matchType && matchSearch && matchCategory;
  });

  const sortedTransactions = [...filtered].sort((a, b) => {
    if (!sortConfig) return 0;

    let valA: any = a[sortConfig.key];
    let valB: any = b[sortConfig.key];

    // Safely parse date strings evaluating misformats like '2026 04 01'
    if (sortConfig.key === 'date') {
      valA = new Date(valA.replace(/\s/g, '-')).getTime();
      valB = new Date(valB.replace(/\s/g, '-')).getTime();
    }

    if (valA < valB) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (valA > valB) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  if (state.isLoading) {
    return (
      <Card style={{ marginTop: '2rem' }}>
        <h3 style={{ color: 'var(--text-primary)', fontWeight: 600, marginBottom: '1.5rem' }}>Recent Transactions</h3>
        <div className="skeleton skeleton-title"></div>
        <div className="skeleton skeleton-text" style={{height: '40px', marginBottom: '1rem'}}></div>
        <div className="skeleton skeleton-text" style={{height: '40px', marginBottom: '1rem'}}></div>
        <div className="skeleton skeleton-text" style={{height: '40px', marginBottom: '1rem'}}></div>
      </Card>
    );
  }

  const SortIcon = ({ columnKey }: { columnKey: keyof Transaction }) => {
    if (sortConfig?.key !== columnKey) return null;
    return sortConfig.direction === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />;
  };

  return (
    <Card style={{ marginTop: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h3 style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Recent Transactions</h3>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Button variant="outline" onClick={() => {
            exportToCsv(sortedTransactions);
            dispatch({ type: 'ADD_TOAST', payload: { message: 'Transactions exported to CSV', type: 'success' } });
          }}>
            <Download size={16} /> Export CSV
          </Button>
          {isAdmin && (
            <Button onClick={() => setShowForm(!showForm)}>
              {showForm ? 'Cancel' : '+ New Transaction'}
            </Button>
          )}
        </div>
      </div>

      {showForm && isAdmin && (
        <form onSubmit={handleAdd} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '2rem', padding: '1.5rem', backgroundColor: 'var(--bg-primary)', borderRadius: 'var(--radius-md)' }}>
          <div className="input-group">
            <label className="input-label">Date</label>
            <input type="date" className="input-field" value={newTx.date} onChange={e => setNewTx({...newTx, date: e.target.value})} />
          </div>
          <div className="input-group">
            <label className="input-label">Description</label>
            <input type="text" className="input-field" value={newTx.description} onChange={e => setNewTx({...newTx, description: e.target.value})} placeholder="e.g. Salary" />
          </div>
          <div className="input-group">
            <label className="input-label">Amount</label>
            <input type="number" className="input-field" value={newTx.amount} onChange={e => setNewTx({...newTx, amount: e.target.value})} placeholder="0.00" />
          </div>
          <div className="input-group">
            <label className="input-label">Category</label>
            <input type="text" className="input-field" value={newTx.category} onChange={e => setNewTx({...newTx, category: e.target.value})} placeholder="e.g. Work" />
          </div>
          <div className="input-group">
            <label className="input-label">Type</label>
            <select className="input-field" value={newTx.type} onChange={e => setNewTx({...newTx, type: e.target.value as any})}>
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <Button type="submit" style={{ width: '100%' }}>Add</Button>
          </div>
        </form>
      )}

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '250px' }}>
          <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)', pointerEvents: 'none', display: 'flex', alignItems: 'center' }}>
            <Search size={18} />
          </div>
          <input 
            type="text" 
            placeholder="Search descriptions or categories..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ 
              width: '100%', 
              padding: '0.65rem 1rem 0.65rem 2.8rem', 
              borderRadius: 'var(--radius-full)', 
              border: '1px solid var(--border-color)', 
              background: 'var(--bg-primary)',
              color: 'var(--text-primary)',
              fontSize: '0.875rem',
              outline: 'none',
              boxShadow: 'var(--shadow-sm)',
              transition: 'all 0.2s ease',
              boxSizing: 'border-box'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = 'var(--accent-primary)';
              e.target.style.boxShadow = '0 0 0 3px var(--accent-light)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'var(--border-color)';
              e.target.style.boxShadow = 'var(--shadow-sm)';
            }}
          />
        </div>
        <select 
          value={filterType} 
          onChange={(e) => setFilterType(e.target.value as any)}
          style={{ 
            padding: '0.65rem 1rem', 
            borderRadius: 'var(--radius-full)', 
            border: '1px solid var(--border-color)', 
            background: 'var(--bg-primary)',
            color: 'var(--text-primary)',
            fontSize: '0.875rem',
            outline: 'none',
            cursor: 'pointer',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <option value="all">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        {state.selectedCategory && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', background: 'var(--accent-light)', color: 'var(--accent-primary)', padding: '0.25rem 0.5rem', borderRadius: 'var(--radius-full)', fontSize: '0.875rem' }}>
            <span>{state.selectedCategory}</span>
            <X size={14} style={{ cursor: 'pointer' }} onClick={() => dispatch({ type: 'SET_SELECTED_CATEGORY', payload: null })} />
          </div>
        )}
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
              <th style={{ padding: '1rem', cursor: 'pointer' }} onClick={() => handleSort('date')}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>Date <SortIcon columnKey="date" /></div>
              </th>
              <th style={{ padding: '1rem', cursor: 'pointer' }} onClick={() => handleSort('description')}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>Description <SortIcon columnKey="description" /></div>
              </th>
              <th style={{ padding: '1rem', cursor: 'pointer' }} onClick={() => handleSort('category')}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>Category <SortIcon columnKey="category" /></div>
              </th>
              <th style={{ padding: '1rem', cursor: 'pointer' }} onClick={() => handleSort('amount')}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>Amount <SortIcon columnKey="amount" /></div>
              </th>
              {isAdmin && <th style={{ padding: '1rem' }}>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {sortedTransactions.length > 0 ? sortedTransactions.map((t) => (
              <tr key={t.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{t.date}</td>
                <td style={{ padding: '1rem', fontWeight: 500, color: 'var(--text-primary)' }}>{t.description}</td>
                <td style={{ padding: '1rem' }}>
                  <span style={{ backgroundColor: 'var(--bg-primary)', padding: '0.25rem 0.5rem', borderRadius: '1rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    {t.category}
                  </span>
                </td>
                <td style={{ padding: '1rem', fontWeight: 600, color: t.type === 'income' ? 'var(--success)' : 'var(--danger)' }}>
                  {t.type === 'income' ? `+$${t.amount.toFixed(2)}` : `-$${t.amount.toFixed(2)}`}
                </td>
                {isAdmin && (
                  <td style={{ padding: '1rem' }}>
                    <Button variant="danger" onClick={() => {
                      dispatch({ type: 'DELETE_TRANSACTION', payload: t.id });
                      dispatch({ type: 'ADD_TOAST', payload: { message: 'Transaction deleted', type: 'info' } });
                    }} style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}>Delete</Button>
                  </td>
                )}
              </tr>
            )) : (
              <tr>
                <td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-tertiary)' }}>No transactions found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
};
