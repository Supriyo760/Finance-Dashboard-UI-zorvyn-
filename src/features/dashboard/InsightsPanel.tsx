import React, { useMemo } from 'react';
import { Card } from '../../components/Card';
import { useAppContext } from '../../context/AppContext';
import { Bot, Sparkles, AlertTriangle, TrendingUp } from 'lucide-react';

export const InsightsPanel: React.FC = () => {
  const { state } = useAppContext();

  const advice = useMemo(() => {
    if (state.isLoading) return [];
    
    let tips = [];
    const expenses = state.transactions.filter(t => t.type === 'expense');
    const income = state.transactions.filter(t => t.type === 'income');
    const totalIncome = income.reduce((acc, t) => acc + t.amount, 0);
    const totalExpense = expenses.reduce((acc, t) => acc + t.amount, 0);
    
    const expensesByCategory = expenses.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);
    
    const topCategoryKey = Object.keys(expensesByCategory).reduce((a, b) => expensesByCategory[a] > expensesByCategory[b] ? a : b, '');
    const topCategoryVal = expensesByCategory[topCategoryKey] || 0;

    if (totalExpense > totalIncome) {
      tips.push({
        id: 'warn-1',
        icon: <AlertTriangle color="var(--danger)" size={20} />,
        text: `Warning: You are operating at a net loss this month. You've spent $${(totalExpense - totalIncome).toFixed(2)} more than you earned.`
      });
    }

    if (topCategoryKey) {
      tips.push({
        id: 'opt-1',
        icon: <Bot color="var(--accent-primary)" size={20} />,
        text: `I noticed ${topCategoryKey} takes up the bulk of your expenses. Cutting this back by just 10% would save you $${(topCategoryVal * 0.1).toFixed(2)}!`
      });
    }

    const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome) * 100 : 0;
    if (savingsRate > 20) {
      tips.push({
        id: 'praise-1',
        icon: <Sparkles color="var(--success)" size={20} />,
        text: `Excellent work! Your savings rate is currently ${savingsRate.toFixed(1)}%. You are doing a fantastic job building capital.`
      });
    }

    if (tips.length === 0) {
      tips.push({
        id: 'default',
        icon: <TrendingUp color="var(--text-secondary)" size={20} />,
        text: `Your finances are stable. Keep logging transactions to get deeper personalized insights!`
      });
    }

    return tips;
  }, [state.transactions, state.isLoading]);

  if (state.isLoading) {
    return (
      <Card style={{ marginTop: '2rem' }}>
        <div className="skeleton skeleton-title"></div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="skeleton skeleton-text" style={{height: '3rem'}}></div>
          <div className="skeleton skeleton-text" style={{height: '3rem'}}></div>
        </div>
      </Card>
    );
  }

  return (
    <Card style={{ marginTop: '2rem', backgroundColor: 'var(--accent-light)', borderColor: 'var(--accent-primary)' }}>
      <h3 style={{ color: 'var(--text-primary)', fontWeight: 600, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Bot size={24} color="var(--accent-primary)" />
        Zorvyn AI Advisor
      </h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {advice.map(tip => (
          <div key={tip.id} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', background: 'var(--bg-primary)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
            <div style={{ marginTop: '0.25rem' }}>{tip.icon}</div>
            <p style={{ color: 'var(--text-primary)', lineHeight: 1.5, margin: 0 }}>{tip.text}</p>
          </div>
        ))}
      </div>
    </Card>
  );
};
