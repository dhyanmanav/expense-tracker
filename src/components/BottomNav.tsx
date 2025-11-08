import React from 'react';
import { motion } from 'motion/react';
import { Home, List, BarChart3, Settings as SettingsIcon } from 'lucide-react';

type Screen = 'dashboard' | 'transactions' | 'analytics' | 'settings';

interface BottomNavProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentScreen, onNavigate }) => {
  const navItems: { id: Screen; icon: typeof Home; label: string }[] = [
    { id: 'dashboard', icon: Home, label: 'Home' },
    { id: 'transactions', icon: List, label: 'History' },
    { id: 'analytics', icon: BarChart3, label: 'Analytics' },
    { id: 'settings', icon: SettingsIcon, label: 'Settings' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 px-4 py-3 safe-area-pb z-40">
      <div className="max-w-2xl mx-auto flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentScreen === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className="flex flex-col items-center gap-1 relative"
            >
              <motion.div
                whileTap={{ scale: 0.9 }}
                className={`relative ${
                  isActive ? 'text-purple-500' : 'text-gray-400 dark:text-gray-600'
                }`}
              >
                <Icon className="w-6 h-6" />
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-purple-500 rounded-full"
                  />
                )}
              </motion.div>
              <span
                className={`text-xs ${
                  isActive
                    ? 'text-purple-500'
                    : 'text-gray-400 dark:text-gray-600'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
