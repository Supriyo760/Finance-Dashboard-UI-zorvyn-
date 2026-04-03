export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  category: string;
  type: TransactionType;
  description: string;
}

export type Role = 'viewer' | 'admin';

export type Theme = 'light' | 'dark';
export type View = 'dashboard' | 'transactions' | 'insights' | 'settings';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

export interface AppState {
  transactions: Transaction[];
  role: Role;
  searchQuery: string;
  theme: Theme;
  isLoading: boolean;
  view: View;
  selectedCategory: string | null;
  budgetLimit: number;
  budgetMultiplier: number;
  toasts: Toast[];
}

export type Action =
  | { type: 'ADD_TRANSACTION'; payload: Transaction }
  | { type: 'EDIT_TRANSACTION'; payload: Transaction }
  | { type: 'DELETE_TRANSACTION'; payload: string }
  | { type: 'SET_ROLE'; payload: Role }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'SET_TRANSACTIONS'; payload: Transaction[] }
  | { type: 'TOGGLE_THEME' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_VIEW'; payload: View }
  | { type: 'SET_SELECTED_CATEGORY'; payload: string | null }
  | { type: 'SET_BUDGET_LIMIT'; payload: number }
  | { type: 'SET_BUDGET_MULTIPLIER'; payload: number }
  | { type: 'ADD_TOAST'; payload: Omit<Toast, 'id'> }
  | { type: 'REMOVE_TOAST'; payload: string };
