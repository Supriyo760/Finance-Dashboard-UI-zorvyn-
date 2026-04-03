import { Card } from '../../components/Card';
import { useAppContext } from '../../context/AppContext';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { BudgetRing } from '../../components/BudgetRing';

export const DashboardOverview: React.FC = () => {
  const { state, dispatch } = useAppContext();
  
  const transactions = state.transactions;
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
  const balance = totalIncome - totalExpense;

  // Chart Data preparation
  const expensesByCategory = transactions
    .filter(t => t.type === 'expense')
    .reduce<Record<string, number>>((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});

  const pieData = Object.keys(expensesByCategory).map(key => ({
    name: key,
    value: expensesByCategory[key]
  }));

  // Dynamically calculate running cumulative balance across exact transaction dates
  const COLORS = ['#38b2ac', '#4299e1', '#ed8936', '#9f7aea', '#f56565'];
  
  const dailyNet: Record<string, number> = {};
  transactions.forEach(t => {
    const amount = t.type === 'income' ? t.amount : -t.amount;
    if (!dailyNet[t.date]) dailyNet[t.date] = 0;
    dailyNet[t.date] += amount;
  });

  const sortedDates = Object.keys(dailyNet).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
  
  let currentCalc = 0;
  const trendData = sortedDates.map(dateStr => {
    currentCalc += dailyNet[dateStr];
    const d = new Date(dateStr);
    const label = `${d.toLocaleString('default', { month: 'short' })} ${d.getDate()}`;
    return { name: label, balance: currentCalc };
  });

  // Provide initial anchoring points if data is scarce so chart still renders nicely
  if (trendData.length === 0) {
    const d = new Date();
    trendData.push({ name: `${d.toLocaleString('default', { month: 'short' })} ${d.getDate()}`, balance: 0 });
  } else if (trendData.length === 1) {
    trendData.unshift({ name: 'Start', balance: 0 });
  }

  if (state.isLoading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
          <Card><div className="skeleton skeleton-title"></div><div className="skeleton skeleton-text" style={{height: '2rem'}}></div></Card>
          <Card><div className="skeleton skeleton-title"></div><div className="skeleton skeleton-text" style={{height: '2rem'}}></div></Card>
          <Card><div className="skeleton skeleton-title"></div><div className="skeleton skeleton-text" style={{height: '2rem'}}></div></Card>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
          <Card><div className="skeleton skeleton-chart"></div></Card>
          <Card><div className="skeleton skeleton-chart"></div></Card>
        </div>
      </div>
    );
  }

  const handlePieClick = (entry: any) => {
    dispatch({ type: 'SET_SELECTED_CATEGORY', payload: entry.name });
    dispatch({ type: 'SET_VIEW', payload: 'transactions' });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
        <Card>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Total Balance</div>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-primary)' }}>${balance.toFixed(2)}</div>
        </Card>
        <Card>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Total Income</div>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--success)' }}>${totalIncome.toFixed(2)}</div>
        </Card>
        <Card style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Total Expenses</span>
              <h2 style={{ fontSize: '2rem', fontWeight: 700, margin: '0.5rem 0', color: 'var(--danger)' }}>
                ${totalExpense.toFixed(2)}
              </h2>
            </div>
            <BudgetRing current={totalExpense} limit={totalIncome * state.budgetMultiplier} size={70} strokeWidth={6} />
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', background: 'var(--bg-primary)', padding: '0.5rem', borderRadius: 'var(--radius-md)' }}>
            <strong>Budget Limit:</strong> Dynamically set to {Math.round(state.budgetMultiplier * 100)}% of Income <br/>
            (${(totalIncome).toFixed(2)} × {state.budgetMultiplier.toFixed(2)} = ${(totalIncome * state.budgetMultiplier).toFixed(2)})
          </div>
        </Card>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        <Card style={{ height: '400px' }}>
          <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-primary)', fontWeight: 600 }}>Balance Trend</h3>
          <ResponsiveContainer width="100%" height="85%">
            <AreaChart data={trendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--accent-primary)" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="var(--accent-primary)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'var(--text-tertiary)'}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: 'var(--text-tertiary)'}} />
              <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="var(--border-color)" />
              <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-md)' }} />
              <Area type="monotone" dataKey="balance" stroke="var(--accent-primary)" fillOpacity={1} fill="url(#colorBalance)" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card style={{ height: '400px' }}>
          <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-primary)', fontWeight: 600 }}>Expenses by Category</h3>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                style={{ cursor: 'pointer' }}
              >
                {pieData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index % COLORS.length]} 
                    onClick={() => handlePieClick(entry)} 
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
            Click a category to filter transactions
          </div>
        </Card>
      </div>
    </div>
  );
};
