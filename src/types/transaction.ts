export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  date: string;
  note?: string;
  createdAt: string;
}

export interface MonthlyStats {
  income: number;
  expenses: number;
  balance: number;
  categoryBreakdown: { [key: string]: number };
}
