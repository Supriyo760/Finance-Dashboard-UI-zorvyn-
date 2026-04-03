import React from 'react';
import { AppProvider, useAppContext } from './context/AppContext';
import { Layout } from './components/Layout';
import { DashboardOverview } from './features/dashboard/DashboardOverview';
import { TransactionsList } from './features/dashboard/TransactionsList';
import { InsightsPanel } from './features/dashboard/InsightsPanel';
import { SettingsPanel } from './features/settings/SettingsPanel';

function AppContent() {
  const { state } = useAppContext();
  return (
    <Layout>
      {state.view === 'dashboard' && <DashboardOverview />}
      {state.view === 'insights' && <InsightsPanel />}
      {state.view === 'transactions' && <TransactionsList />}
      {state.view === 'settings' && <SettingsPanel />}
    </Layout>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
