import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { useTransactions } from '../contexts/TransactionsContext';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp, TrendingDown, AlertCircle, Calendar } from 'lucide-react';
import { getCategoryById } from '../utils/categories';

type ViewMode = 'weekly' | 'monthly' | 'yearly';

export const Analytics: React.FC = () => {
  const { transactions, getMonthlyStats } = useTransactions();
  const [viewMode, setViewMode] = useState<ViewMode>('monthly');

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const currentMonthStats = getMonthlyStats(currentYear, currentMonth);
  const previousMonthStats = getMonthlyStats(
    currentMonth === 0 ? currentYear - 1 : currentYear,
    currentMonth === 0 ? 11 : currentMonth - 1
  );

  // Calculate weekly data for last 4 weeks
  const weeklyData = useMemo(() => {
    const weeks = [];
    const now = new Date();
    
    for (let i = 3; i >= 0; i--) {
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - (i * 7) - 7);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);

      const weekTransactions = transactions.filter(t => {
        const date = new Date(t.date);
        return date >= weekStart && date <= weekEnd;
      });

      const income = weekTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

      const expenses = weekTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

      weeks.push({
        name: `Week ${4 - i}`,
        income,
        expenses,
        savings: income - expenses,
      });
    }

    return weeks;
  }, [transactions]);

  // Calculate monthly data for last 6 months
  const monthlyData = useMemo(() => {
    const months = [];
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(currentYear, currentMonth - i, 1);
      const stats = getMonthlyStats(date.getFullYear(), date.getMonth());
      
      months.push({
        name: date.toLocaleDateString('en-US', { month: 'short' }),
        income: stats.income,
        expenses: stats.expenses,
        savings: stats.balance,
      });
    }

    return months;
  }, [transactions, currentYear, currentMonth]);

  // Top spending categories
  const topCategories = useMemo(() => {
    return Object.entries(currentMonthStats.categoryBreakdown)
      .map(([categoryId, amount]) => {
        const category = getCategoryById(categoryId);
        return {
          name: category?.name || categoryId,
          amount,
          color: category?.color || '#999',
          percentage: (amount / currentMonthStats.expenses) * 100,
        };
      })
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);
  }, [currentMonthStats]);

  const chartData = viewMode === 'weekly' ? weeklyData : monthlyData;

  const incomeChange = currentMonthStats.income - previousMonthStats.income;
  const expenseChange = currentMonthStats.expenses - previousMonthStats.expenses;
  const incomeChangePercent = previousMonthStats.income > 0 
    ? ((incomeChange / previousMonthStats.income) * 100).toFixed(1)
    : '0';
  const expenseChangePercent = previousMonthStats.expenses > 0
    ? ((expenseChange / previousMonthStats.expenses) * 100).toFixed(1)
    : '0';

  return (
    <div className="min-h-screen pb-24 px-4 pt-6">
      {/* Header */}
      <h1 className="text-gray-900 dark:text-white text-2xl mb-6">Analytics</h1>

      {/* View Mode Toggle */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setViewMode('weekly')}
          className={`flex-1 py-3 rounded-xl transition-colors ${
            viewMode === 'weekly'
              ? 'bg-purple-500 text-white shadow-lg'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
          }`}
        >
          Weekly
        </button>
        <button
          onClick={() => setViewMode('monthly')}
          className={`flex-1 py-3 rounded-xl transition-colors ${
            viewMode === 'monthly'
              ? 'bg-purple-500 text-white shadow-lg'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
          }`}
        >
          Monthly
        </button>
      </div>

      {/* Comparison Cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-md"
        >
          <div className="flex items-center gap-2 mb-2 text-gray-600 dark:text-gray-400">
            <TrendingUp className="w-4 h-4" />
            <span className="text-xs">Income Change</span>
          </div>
          <div className="text-gray-900 dark:text-white text-xl mb-1">
            ₹{Math.abs(incomeChange).toFixed(0)}
          </div>
          <div className={`text-sm flex items-center gap-1 ${
            incomeChange >= 0 ? 'text-green-500' : 'text-red-500'
          }`}>
            {incomeChange >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            {incomeChangePercent}% vs last month
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-md"
        >
          <div className="flex items-center gap-2 mb-2 text-gray-600 dark:text-gray-400">
            <TrendingDown className="w-4 h-4" />
            <span className="text-xs">Expense Change</span>
          </div>
          <div className="text-gray-900 dark:text-white text-xl mb-1">
            ₹{Math.abs(expenseChange).toFixed(0)}
          </div>
          <div className={`text-sm flex items-center gap-1 ${
            expenseChange <= 0 ? 'text-green-500' : 'text-red-500'
          }`}>
            {expenseChange <= 0 ? <TrendingDown className="w-4 h-4" /> : <TrendingUp className="w-4 h-4" />}
            {Math.abs(parseFloat(expenseChangePercent))}% vs last month
          </div>
        </motion.div>
      </div>

      {/* Trend Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-md mb-6"
      >
        <h3 className="text-gray-900 dark:text-white mb-4">Income vs Expenses</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
            <XAxis 
              dataKey="name" 
              stroke="#9CA3AF"
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              stroke="#9CA3AF"
              style={{ fontSize: '12px' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                border: 'none',
                borderRadius: '8px',
                color: 'white',
              }}
              formatter={(value: number) => `₹${value.toFixed(2)}`}
            />
            <Legend />
            <Bar dataKey="income" fill="#10B981" radius={[8, 8, 0, 0]} />
            <Bar dataKey="expenses" fill="#EF4444" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Savings Trend */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-md mb-6"
      >
        <h3 className="text-gray-900 dark:text-white mb-4">Savings Trend</h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
            <XAxis 
              dataKey="name" 
              stroke="#9CA3AF"
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              stroke="#9CA3AF"
              style={{ fontSize: '12px' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                border: 'none',
                borderRadius: '8px',
                color: 'white',
              }}
              formatter={(value: number) => `₹${value.toFixed(2)}`}
            />
            <Line 
              type="monotone" 
              dataKey="savings" 
              stroke="#8B5CF6" 
              strokeWidth={3}
              dot={{ fill: '#8B5CF6', r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Top Categories */}
      {topCategories.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-md"
        >
          <h3 className="text-gray-900 dark:text-white mb-4">Top Spending Categories</h3>
          <div className="space-y-4">
            {topCategories.map((category, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-700 dark:text-gray-300 text-sm">
                    {category.name}
                  </span>
                  <span className="text-gray-900 dark:text-white">
                    ₹{category.amount.toFixed(2)}
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${category.percentage}%` }}
                    transition={{ delay: 0.5 + index * 0.1, duration: 0.8 }}
                    className="h-2 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Insights */}
      {currentMonthStats.expenses > currentMonthStats.income && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-6 bg-gradient-to-r from-orange-400 to-red-500 rounded-2xl p-4 shadow-md"
        >
          <div className="flex items-start gap-3 text-white">
            <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="mb-1">Spending Alert</h4>
              <p className="text-sm text-white/90">
                You're spending ₹{(currentMonthStats.expenses - currentMonthStats.income).toFixed(2)} more than you earn this month. Consider reviewing your expenses.
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};
