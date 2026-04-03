import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { AppState, Action, Transaction, Role } from '../types';

const mockTransactions: Transaction[] = [
  { id: '1', date: '2026-01-15', amount: 1200, category: 'Salary', type: 'income', description: 'Monthly Salary' },
  { id: '2', date: '2026-04-02', amount: 45.5, category: 'Groceries', type: 'expense', description: 'Supermarket' },
  { id: '3', date: '2026-04-03', amount: 15.0, category: 'Transport', type: 'expense', description: 'Uber' },
  { id: '4', date: '2026-03-28', amount: 120.0, category: 'Utilities', type: 'expense', description: 'Electric Bill' },
  { id: '5', date: '2026-03-25', amount: 350.0, category: 'Shopping', type: 'expense', description: 'New Shoes' },
  { id: '6', date: '2026-03-22', amount: 80.0, category: 'Dining', type: 'expense', description: 'Dinner with friends' },
];

const initialState: AppState = {
  transactions: [],
  role: 'viewer',
  searchQuery: '',
  theme: 'light',
  isLoading: true,
  view: 'dashboard',
  selectedCategory: null,
  budgetLimit: 1200,
  budgetMultiplier: 0.8,
  toasts: [],
};

const appReducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case 'SET_TRANSACTIONS':
      return { ...state, transactions: action.payload };
    case 'ADD_TRANSACTION':
      return { ...state, transactions: [action.payload, ...state.transactions] };
    case 'EDIT_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.map((t) => (t.id === action.payload.id ? action.payload : t)),
      };
    case 'DELETE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.filter((t) => t.id !== action.payload),
      };
    case 'SET_ROLE':
      return { ...state, role: action.payload };
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload };
    case 'TOGGLE_THEME':
      return { ...state, theme: state.theme === 'light' ? 'dark' : 'light' };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_VIEW':
      return { ...state, view: action.payload };
    case 'SET_SELECTED_CATEGORY':
      return { ...state, selectedCategory: action.payload };
    case 'SET_BUDGET_LIMIT':
      return { ...state, budgetLimit: action.payload };
    case 'SET_BUDGET_MULTIPLIER':
      return { ...state, budgetMultiplier: action.payload };
    case 'ADD_TOAST':
      return { 
        ...state, 
        toasts: [...state.toasts, { ...action.payload, id: Math.random().toString(36).substr(2, 9) }] 
      };
    case 'REMOVE_TOAST':
      return { 
        ...state, 
        toasts: state.toasts.filter(t => t.id !== action.payload) 
      };
    default:
      return state;
  }
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<Action>;
} | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load initial data from localStorage if exists, else use mock data
  useEffect(() => {
    // Initial sync of theme
    const savedTheme = localStorage.getItem('finance-theme');
    if (savedTheme === 'dark') {
      dispatch({ type: 'TOGGLE_THEME' }); // assuming initial is light
    }

    setTimeout(() => {
      const saved = localStorage.getItem('finance-data');
      if (saved) {
        dispatch({ type: 'SET_TRANSACTIONS', payload: JSON.parse(saved) });
      } else {
        dispatch({ type: 'SET_TRANSACTIONS', payload: mockTransactions });
      }
      
      const savedRole = localStorage.getItem('finance-role') as Role;
      if (savedRole) {
        dispatch({ type: 'SET_ROLE', payload: savedRole });
      }
      dispatch({ type: 'SET_LOADING', payload: false });
    }, 800);
  }, []);

  // Save to localStorage recursively and sync theme to DOM
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', state.theme);
    localStorage.setItem('finance-theme', state.theme);
    
    if (state.transactions.length > 0) {
      localStorage.setItem('finance-data', JSON.stringify(state.transactions));
    }
    localStorage.setItem('finance-role', state.role);
  }, [state.transactions, state.role, state.theme]);

  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
