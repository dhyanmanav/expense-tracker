import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ThemeProvider } from './contexts/ThemeContext';
import { TransactionsProvider } from './contexts/TransactionsContext';
import { Dashboard } from './components/Dashboard';
import { AddTransaction } from './components/AddTransaction';
import { TransactionsList } from './components/TransactionsList';
import { Analytics } from './components/Analytics';
import { Settings } from './components/Settings';
import { BottomNav } from './components/BottomNav';
import { Plus } from 'lucide-react';
import { Toaster } from 'sonner@2.0.3';

type Screen = 'dashboard' | 'transactions' | 'analytics' | 'settings';

function AppContent() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('dashboard');
  const [showAddTransaction, setShowAddTransaction] = useState(false);

  const renderScreen = () => {
    switch (currentScreen) {
      case 'dashboard':
        return <Dashboard />;
      case 'transactions':
        return <TransactionsList />;
      case 'analytics':
        return <Analytics />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
      {/* Main Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentScreen}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          {renderScreen()}
        </motion.div>
      </AnimatePresence>

      {/* Floating Add Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowAddTransaction(true)}
        className="fixed bottom-24 right-6 w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-full shadow-2xl flex items-center justify-center z-30 hover:shadow-purple-500/50 transition-shadow"
      >
        <Plus className="w-8 h-8" />
      </motion.button>

      {/* Bottom Navigation */}
      <BottomNav currentScreen={currentScreen} onNavigate={setCurrentScreen} />

      {/* Add Transaction Modal */}
      <AnimatePresence>
        {showAddTransaction && (
          <AddTransaction onClose={() => setShowAddTransaction(false)} />
        )}
      </AnimatePresence>

      {/* Toast Notifications */}
      <Toaster 
        position="top-center"
        toastOptions={{
          style: {
            background: 'rgba(0, 0, 0, 0.9)',
            color: '#fff',
            border: 'none',
            borderRadius: '12px',
          },
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <TransactionsProvider>
        <AppContent />
      </TransactionsProvider>
    </ThemeProvider>
  );
}
