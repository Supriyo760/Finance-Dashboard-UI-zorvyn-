import { Transaction } from '../types';

export const exportToCsv = (transactions: Transaction[], filename: string = 'transactions_export.csv') => {
  if (transactions.length === 0) {
    alert("No transactions to export");
    return;
  }

  // Define headers
  const headers = ['Date', 'Description', 'Category', 'Type', 'Amount'];
  
  // Map transactions to rows
  const csvRows = transactions.map(t => {
    // Quote strings to avoid issues with commas in description
    return [
      `"${t.date}"`,
      `"${t.description.replace(/"/g, '""')}"`,
      `"${t.category}"`,
      `"${t.type}"`,
      t.amount.toString()
    ].join(',');
  });

  // Combine headers and rows
  const csvContent = [headers.join(','), ...csvRows].join('\n');
  
  // Create Blob and trigger download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
