import { 
  ShoppingCart, 
  Home, 
  Car, 
  Utensils, 
  Film, 
  Heart, 
  GraduationCap,
  Briefcase,
  Gift,
  Zap,
  DollarSign,
  TrendingUp,
  Wallet,
  LucideIcon
} from 'lucide-react';

export interface Category {
  id: string;
  name: string;
  icon: LucideIcon;
  color: string;
  type: 'expense' | 'income' | 'both';
}

export const categories: Category[] = [
  // Expense categories
  { id: 'food', name: 'Food & Dining', icon: Utensils, color: '#FF6B6B', type: 'expense' },
  { id: 'transport', name: 'Transport', icon: Car, color: '#4ECDC4', type: 'expense' },
  { id: 'shopping', name: 'Shopping', icon: ShoppingCart, color: '#95E1D3', type: 'expense' },
  { id: 'bills', name: 'Bills & Utilities', icon: Zap, color: '#FFD93D', type: 'expense' },
  { id: 'entertainment', name: 'Entertainment', icon: Film, color: '#A8E6CF', type: 'expense' },
  { id: 'health', name: 'Health', icon: Heart, color: '#FFB6C1', type: 'expense' },
  { id: 'education', name: 'Education', icon: GraduationCap, color: '#C7CEEA', type: 'expense' },
  { id: 'housing', name: 'Housing', icon: Home, color: '#FFDAB9', type: 'expense' },
  { id: 'other_expense', name: 'Other', icon: Wallet, color: '#E0BBE4', type: 'expense' },
  
  // Income categories
  { id: 'salary', name: 'Salary', icon: Briefcase, color: '#A7F3D0', type: 'income' },
  { id: 'freelance', name: 'Freelance', icon: DollarSign, color: '#93C5FD', type: 'income' },
  { id: 'investment', name: 'Investment', icon: TrendingUp, color: '#C4B5FD', type: 'income' },
  { id: 'gift_income', name: 'Gift', icon: Gift, color: '#FCA5A5', type: 'income' },
  { id: 'other_income', name: 'Other Income', icon: Wallet, color: '#FDE68A', type: 'income' },
];

export const getCategoryById = (id: string): Category | undefined => {
  return categories.find(cat => cat.id === id);
};

export const getExpenseCategories = () => categories.filter(cat => cat.type === 'expense' || cat.type === 'both');
export const getIncomeCategories = () => categories.filter(cat => cat.type === 'income' || cat.type === 'both');
