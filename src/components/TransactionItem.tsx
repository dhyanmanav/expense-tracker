import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Transaction } from '../types/transaction';
import { getCategoryById } from '../utils/categories';
import { Trash2, Edit2 } from 'lucide-react';
import { useTransactions } from '../contexts/TransactionsContext';
import { toast } from 'sonner@2.0.3';

interface TransactionItemProps {
  transaction: Transaction;
}

export const TransactionItem: React.FC<TransactionItemProps> = ({ transaction }) => {
  const { deleteTransaction } = useTransactions();
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const category = getCategoryById(transaction.category);
  const Icon = category?.icon;
  const date = new Date(transaction.date);
  const formattedDate = date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
  });

  const handleDelete = () => {
    deleteTransaction(transaction.id);
    toast.success('Transaction deleted');
  };

  return (
    <motion.div
      drag="x"
      dragConstraints={{ left: -120, right: 0 }}
      dragElastic={0.1}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={(e, info) => {
        setIsDragging(false);
        if (info.offset.x < -60) {
          setSwipeOffset(-120);
        } else {
          setSwipeOffset(0);
        }
      }}
      animate={{ x: swipeOffset }}
      className="relative mb-3"
    >
      {/* Delete Action Background */}
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-red-500 to-red-400 rounded-2xl flex items-center justify-end pr-6">
        <button
          onClick={handleDelete}
          className="flex items-center gap-2 text-white"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      {/* Transaction Card */}
      <motion.div
        className={`bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm relative ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
      >
        <div className="flex items-center gap-4">
          {/* Icon */}
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: `${category?.color}20` }}
          >
            {Icon && <Icon className="w-6 h-6" style={{ color: category?.color }} />}
          </div>

          {/* Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h4 className="text-gray-900 dark:text-white truncate">
                {category?.name || transaction.category}
              </h4>
              <span
                className={`${
                  transaction.type === 'income' ? 'text-green-500' : 'text-red-500'
                }`}
              >
                {transaction.type === 'income' ? '+' : '-'}₹{transaction.amount.toFixed(2)}
              </span>
            </div>
            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm">
              <span>{formattedDate}</span>
              {transaction.note && (
                <>
                  <span>•</span>
                  <span className="truncate">{transaction.note}</span>
                </>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
