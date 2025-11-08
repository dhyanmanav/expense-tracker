import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useTransactions } from '../contexts/TransactionsContext';
import { getExpenseCategories, getIncomeCategories } from '../utils/categories';
import { Check, X } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface AddTransactionProps {
  onClose: () => void;
}

export const AddTransaction: React.FC<AddTransactionProps> = ({ onClose }) => {
  const { addTransaction } = useTransactions();
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [note, setNote] = useState('');

  const categories = type === 'income' ? getIncomeCategories() : getExpenseCategories();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || !category) {
      toast.error('Please fill in all required fields');
      return;
    }

    addTransaction({
      type,
      amount: parseFloat(amount),
      category,
      date,
      note: note || undefined,
    });

    toast.success(`${type === 'income' ? 'Income' : 'Expense'} added successfully!`);
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: '100%', opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: '100%', opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="bg-white dark:bg-gray-900 w-full sm:max-w-lg sm:rounded-3xl rounded-t-3xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-gray-900 dark:text-white text-2xl">Add Transaction</h2>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Type Toggle */}
            <div className="flex gap-2 mb-6">
              <button
                type="button"
                onClick={() => {
                  setType('expense');
                  setCategory('');
                }}
                className={`flex-1 py-3 rounded-xl transition-all ${
                  type === 'expense'
                    ? 'bg-gradient-to-r from-orange-400 to-red-500 text-white shadow-lg'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                }`}
              >
                Expense
              </button>
              <button
                type="button"
                onClick={() => {
                  setType('income');
                  setCategory('');
                }}
                className={`flex-1 py-3 rounded-xl transition-all ${
                  type === 'income'
                    ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-lg'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                }`}
              >
                Income
              </button>
            </div>

            {/* Amount Input */}
            <div className="mb-6">
              <label className="block text-gray-700 dark:text-gray-300 text-sm mb-2">
                Amount *
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl">
                  ₹
                </span>
                <input
                  type="number"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full pl-10 pr-4 py-4 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white text-xl focus:outline-none focus:border-purple-500 dark:focus:border-purple-400"
                  required
                />
              </div>
            </div>

            {/* Category Selection */}
            <div className="mb-6">
              <label className="block text-gray-700 dark:text-gray-300 text-sm mb-3">
                Category *
              </label>
              <div className="grid grid-cols-3 gap-3">
                {categories.map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setCategory(cat.id)}
                      className={`p-4 rounded-xl flex flex-col items-center gap-2 transition-all ${
                        category === cat.id
                          ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg scale-105'
                          : 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      <Icon className="w-6 h-6" />
                      <span className="text-xs text-center">{cat.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Date Input */}
            <div className="mb-6">
              <label className="block text-gray-700 dark:text-gray-300 text-sm mb-2">
                Date *
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-purple-500 dark:focus:border-purple-400"
                required
              />
            </div>

            {/* Note Input */}
            <div className="mb-6">
              <label className="block text-gray-700 dark:text-gray-300 text-sm mb-2">
                Note (Optional)
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add a note..."
                rows={3}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-purple-500 dark:focus:border-purple-400 resize-none"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all"
            >
              <Check className="w-5 h-5" />
              Add Transaction
            </button>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
};
