import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { useTransactions } from '../contexts/TransactionsContext';
import { TransactionItem } from './TransactionItem';
import { Filter, Calendar, DollarSign } from 'lucide-react';
import { categories } from '../utils/categories';

type FilterType = 'all' | 'income' | 'expense';
type SortType = 'date' | 'amount';

export const TransactionsList: React.FC = () => {
  const { transactions } = useTransactions();
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortType>('date');
  const [showFilters, setShowFilters] = useState(false);

  const filteredAndSortedTransactions = useMemo(() => {
    let filtered = [...transactions];

    // Filter by type
    if (filterType !== 'all') {
      filtered = filtered.filter(t => t.type === filterType);
    }

    // Filter by category
    if (filterCategory !== 'all') {
      filtered = filtered.filter(t => t.category === filterCategory);
    }

    // Sort
    filtered.sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      } else {
        return b.amount - a.amount;
      }
    });

    return filtered;
  }, [transactions, filterType, filterCategory, sortBy]);

  // Group transactions by date
  const groupedTransactions = useMemo(() => {
    const groups: { [key: string]: typeof transactions } = {};
    
    filteredAndSortedTransactions.forEach(transaction => {
      const date = new Date(transaction.date);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      let dateKey: string;
      if (date.toDateString() === today.toDateString()) {
        dateKey = 'Today';
      } else if (date.toDateString() === yesterday.toDateString()) {
        dateKey = 'Yesterday';
      } else {
        dateKey = date.toLocaleDateString('en-US', { 
          month: 'long', 
          day: 'numeric',
          year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
        });
      }

      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(transaction);
    });

    return groups;
  }, [filteredAndSortedTransactions]);

  return (
    <div className="min-h-screen pb-24 px-4 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-gray-900 dark:text-white text-2xl">Transactions</h1>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
            showFilters
              ? 'bg-purple-500 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
          }`}
        >
          <Filter className="w-5 h-5" />
        </button>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-4 mb-6 shadow-md"
        >
          {/* Type Filter */}
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 text-sm mb-2">
              Type
            </label>
            <div className="flex gap-2">
              {(['all', 'income', 'expense'] as FilterType[]).map(type => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`flex-1 py-2 rounded-lg text-sm transition-colors ${
                    filterType === type
                      ? 'bg-purple-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                  }`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Category Filter */}
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 text-sm mb-2">
              Category
            </label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300 text-sm mb-2">
              Sort By
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setSortBy('date')}
                className={`flex-1 py-2 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors ${
                  sortBy === 'date'
                    ? 'bg-purple-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                }`}
              >
                <Calendar className="w-4 h-4" />
                Date
              </button>
              <button
                onClick={() => setSortBy('amount')}
                className={`flex-1 py-2 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors ${
                  sortBy === 'amount'
                    ? 'bg-purple-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                }`}
              >
                <DollarSign className="w-4 h-4" />
                Amount
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Transactions List */}
      {Object.entries(groupedTransactions).length > 0 ? (
        <div>
          {Object.entries(groupedTransactions).map(([date, dayTransactions]) => (
            <div key={date} className="mb-6">
              <h3 className="text-gray-600 dark:text-gray-400 text-sm mb-3 px-2">
                {date}
              </h3>
              {dayTransactions.map(transaction => (
                <TransactionItem key={transaction.id} transaction={transaction} />
              ))}
            </div>
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-md text-center"
        >
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-gray-900 dark:text-white mb-2">No transactions yet</h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Tap the + button to add your first transaction
          </p>
        </motion.div>
      )}
    </div>
  );
};
