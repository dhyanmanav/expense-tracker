import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useTheme } from '../contexts/ThemeContext';
import { useTransactions } from '../contexts/TransactionsContext';
import { Moon, Sun, Download, Upload, Trash2, AlertTriangle, CheckCircle } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export const Settings: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { exportData, importData, clearAllData, transactions } = useTransactions();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleExportJSON = () => {
    const data = exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `expense-tracker-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Data exported successfully!');
  };

  const handleExportCSV = () => {
    if (transactions.length === 0) {
      toast.error('No data to export');
      return;
    }

    const headers = ['Date', 'Type', 'Category', 'Amount', 'Note'];
    const rows = transactions.map(t => [
      t.date,
      t.type,
      t.category,
      t.amount.toString(),
      t.note || ''
    ]);

    const csv = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `expense-tracker-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('CSV exported successfully!');
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        importData(content);
        toast.success('Data imported successfully!');
      } catch (error) {
        toast.error('Failed to import data. Please check the file format.');
      }
    };
    reader.readAsText(file);
  };

  const handleClearData = () => {
    clearAllData();
    setShowDeleteConfirm(false);
    toast.success('All data cleared');
  };

  return (
    <div className="min-h-screen pb-24 px-4 pt-6">
      {/* Header */}
      <h1 className="text-gray-900 dark:text-white text-2xl mb-6">Settings</h1>

      {/* Theme Toggle */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-md mb-4"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {theme === 'light' ? (
              <Sun className="w-6 h-6 text-yellow-500" />
            ) : (
              <Moon className="w-6 h-6 text-purple-500" />
            )}
            <div>
              <h3 className="text-gray-900 dark:text-white">Theme</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {theme === 'light' ? 'Light Mode' : 'Dark Mode'}
              </p>
            </div>
          </div>
          <button
            onClick={toggleTheme}
            className={`w-14 h-8 rounded-full transition-colors relative ${
              theme === 'dark' ? 'bg-purple-500' : 'bg-gray-300'
            }`}
          >
            <motion.div
              animate={{ x: theme === 'dark' ? 24 : 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              className="absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-md"
            />
          </button>
        </div>
      </motion.div>

      {/* Export Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-md mb-4"
      >
        <div className="flex items-center gap-3 mb-4">
          <Download className="w-6 h-6 text-blue-500" />
          <div>
            <h3 className="text-gray-900 dark:text-white">Export Data</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Download your data as a backup
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleExportJSON}
            className="flex-1 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-colors"
          >
            Export as JSON
          </button>
          <button
            onClick={handleExportCSV}
            className="flex-1 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl transition-colors"
          >
            Export as CSV
          </button>
        </div>
      </motion.div>

      {/* Import Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-md mb-4"
      >
        <div className="flex items-center gap-3 mb-4">
          <Upload className="w-6 h-6 text-green-500" />
          <div>
            <h3 className="text-gray-900 dark:text-white">Import Data</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Restore from a backup file
            </p>
          </div>
        </div>
        <label className="block w-full py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl transition-colors text-center cursor-pointer">
          <input
            type="file"
            accept=".json"
            onChange={handleImport}
            className="hidden"
          />
          Choose JSON File
        </label>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-md mb-4"
      >
        <div className="flex items-center gap-3">
          <CheckCircle className="w-6 h-6 text-purple-500" />
          <div>
            <h3 className="text-gray-900 dark:text-white">Data Statistics</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              You have {transactions.length} transaction{transactions.length !== 1 ? 's' : ''} stored locally
            </p>
          </div>
        </div>
      </motion.div>

      {/* Delete Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-md"
      >
        <div className="flex items-center gap-3 mb-4">
          <Trash2 className="w-6 h-6 text-red-500" />
          <div>
            <h3 className="text-gray-900 dark:text-white">Clear All Data</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Permanently delete all transactions
            </p>
          </div>
        </div>
        
        {!showDeleteConfirm ? (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="w-full py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-colors"
          >
            Clear All Data
          </button>
        ) : (
          <div className="space-y-3">
            <div className="flex items-start gap-2 p-3 bg-red-50 dark:bg-red-900/20 rounded-xl">
              <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
              <p className="text-red-700 dark:text-red-400 text-sm">
                This action cannot be undone. All your transaction data will be permanently deleted.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleClearData}
                className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-colors"
              >
                Yes, Delete All
              </button>
            </div>
          </div>
        )}
      </motion.div>

      {/* Info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-6 text-center"
      >
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          All data is stored locally on your device
        </p>
        <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
          No cloud sync • Complete privacy
        </p>
      </motion.div>
    </div>
  );
};
