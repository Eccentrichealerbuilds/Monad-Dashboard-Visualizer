import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { MoonIcon, SunIcon } from 'lucide-react';
export const ThemeToggle: React.FC = () => {
  const {
    theme,
    toggleTheme
  } = useTheme();
  return <button onClick={toggleTheme} className="p-2 rounded-full bg-opacity-20 hover:bg-opacity-30 transition-colors duration-200 bg-purple-500 text-purple-100 dark:text-purple-200" aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}>
      {theme === 'light' ? <MoonIcon size={20} /> : <SunIcon size={20} />}
    </button>;
};