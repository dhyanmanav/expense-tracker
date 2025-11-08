import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { useTransactions } from '../contexts/TransactionsContext';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { TrendingUp, TrendingDown, Wallet, PiggyBank } from 'lucide-react';
import { getCategoryById } from '../utils/categories';

interface AnimatedNumberProps {
  value: number;
  prefix?: string;
}

const AnimatedNumber: React.FC<AnimatedNumberProps> = ({ value, prefix = '₹' }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1000;
    const increment = value / (duration / 16);
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(start);
      }
    }, 16);

    return () => clearInterval(timer);
  }, [value]);

  return <span>{prefix}{displayValue.toFixed(2)}</span>;
};

export const Dashboard: React.FC = () => {
  const { getMonthlyStats, getTotalBalance } = useTransactions();
  const currentDate = new Date();
  const stats = getMonthlyStats(currentDate.getFullYear(), currentDate.getMonth());
  const totalBalance = getTotalBalance();

  const chartData = Object.entries(stats.categoryBreakdown).map(([categoryId, amount]) => {
    const category = getCategoryById(categoryId);
    return {
      name: category?.name || categoryId,
      value: amount,
      color: category?.color || '#999',
    };
  }).filter(item => item.value > 0);

  return (
    <div className="min-h-screen pb-24 px-4 pt-6">
      {/* Balance Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-purple-500 via-purple-600 to-pink-500 dark:from-purple-700 dark:via-purple-800 dark:to-pink-700 rounded-3xl p-6 mb-6 shadow-lg"
      >
        <div className="flex items-center gap-2 mb-2 text-white/80">
          <Wallet className="w-5 h-5" />
          <span className="text-sm">Total Balance</span>
        </div>
        <div className="text-white text-4xl mb-2">
          <AnimatedNumber value={totalBalance} />
        </div>
        <div className="flex items-center gap-1 text-white/90 text-sm">
          {totalBalance >= 0 ? (
            <>
              <TrendingUp className="w-4 h-4" />
              <span>Looking good!</span>
            </>
          ) : (
            <>
              <TrendingDown className="w-4 h-4" />
              <span>Watch your spending</span>
            </>
          )}
        </div>
      </motion.div>

      {/* Monthly Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-green-400 to-emerald-500 dark:from-green-600 dark:to-emerald-700 rounded-2xl p-4 shadow-md"
        >
          <div className="flex items-center gap-2 mb-2 text-white/90">
            <TrendingUp className="w-4 h-4" />
            <span className="text-xs">This Month</span>
          </div>
          <div className="text-white text-2xl">
            <AnimatedNumber value={stats.income} />
          </div>
          <div className="text-white/80 text-xs mt-1">Income</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-orange-400 to-red-500 dark:from-orange-600 dark:to-red-700 rounded-2xl p-4 shadow-md"
        >
          <div className="flex items-center gap-2 mb-2 text-white/90">
            <TrendingDown className="w-4 h-4" />
            <span className="text-xs">This Month</span>
          </div>
          <div className="text-white text-2xl">
            <AnimatedNumber value={stats.expenses} />
          </div>
          <div className="text-white/80 text-xs mt-1">Expenses</div>
        </motion.div>
      </div>

      {/* Savings Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white dark:bg-gray-800 rounded-2xl p-4 mb-6 shadow-md"
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1 text-gray-600 dark:text-gray-400">
              <PiggyBank className="w-4 h-4" />
              <span className="text-sm">Monthly Savings</span>
            </div>
            <div className="text-gray-900 dark:text-white text-2xl">
              <AnimatedNumber value={stats.balance} />
            </div>
          </div>
          <div className={`text-4xl ${stats.balance >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {stats.balance >= 0 ? '😊' : '😰'}
          </div>
        </div>
      </motion.div>

      {/* Category Breakdown Chart */}
      {chartData.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-md"
        >
          <h3 className="text-gray-900 dark:text-white mb-4">Category Breakdown</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={5}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => `₹${value.toFixed(2)}`}
                contentStyle={{
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  border: 'none',
                  borderRadius: '8px',
                  color: 'white',
                }}
              />
              <Legend 
                verticalAlign="bottom" 
                height={36}
                formatter={(value) => <span className="text-xs text-gray-700 dark:text-gray-300">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      )}

      {chartData.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-md text-center"
        >
          <div className="text-6xl mb-4">📊</div>
          <h3 className="text-gray-900 dark:text-white mb-2">No expenses yet</h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Start tracking your expenses to see insights
          </p>
        </motion.div>
      )}
    </div>
  );
};
