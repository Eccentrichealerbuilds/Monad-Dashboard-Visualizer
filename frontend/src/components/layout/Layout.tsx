import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ThemeToggle } from '../ui/ThemeToggle';
import { LayoutDashboardIcon, BoxesIcon, ArrowLeftRightIcon, Heart } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();

  const [heartColor, setHeartColor] = useState('#FF0000');
  const colors = ['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#4B0082', '#9400D3'];

  useEffect(() => {
    let colorIndex = 0;
    const intervalId = setInterval(() => {
      colorIndex = (colorIndex + 1) % colors.length;
      setHeartColor(colors[colorIndex]);
    }, 1000); 

    return () => clearInterval(intervalId);
  }, []);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navItems = [{
    path: '/',
    icon: <LayoutDashboardIcon size={20} />,
    label: 'Dashboard'
  }, {
    path: '/blocks',
    icon: <BoxesIcon size={20} />,
    label: 'Blocks'
  }, {
    path: '/transactions',
    icon: <ArrowLeftRightIcon size={20} />,
    label: 'Transactions'
  }];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 transition-colors duration-200">
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center">
              <span className="text-white font-bold">M</span>
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
              Monad Explorer
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <nav className="hidden md:flex">
              <ul className="flex space-x-1">
                {navItems.map(item => <li key={item.path}>
                    <Link to={item.path} className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors duration-200 ${isActive(item.path) ? 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-200' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
                      {item.icon}
                      <span>{item.label}</span>
                    </Link>
                  </li>)}
              </ul>
            </nav>
            <ThemeToggle />
          </div>
        </div>
      </header>
      <div className="md:hidden bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-2">
          <nav>
            <ul className="flex justify-between">
              {navItems.map(item => <li key={item.path} className="flex-1">
                  <Link to={item.path} className={`flex flex-col items-center py-2 px-1 rounded-lg transition-colors duration-200 ${isActive(item.path) ? 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-200' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
                    {item.icon}
                    <span className="text-xs mt-1">{item.label}</span>
                  </Link>
                </li>)}
            </ul>
          </nav>
        </div>
      </div>
      <main className="flex-1 container mx-auto px-4 py-6">{children}</main>
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-4">
        <div className="container mx-auto px-4 text-center text-sm text-gray-500 dark:text-gray-400">
          <div>© {new Date().getFullYear()} Monad Blockchain Explorer</div>
          <div className="flex items-center justify-center gap-1.5 mt-2">
            Made with
            <Heart
              className="transition-colors duration-500"
              size={16}
              color={heartColor}
              fill={heartColor}
            />
            by
            {/* --- MODIFIED: Added link to Twitter profile --- */}
            <a
              href="https://x.com/eccentrichealer"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-600 hover:underline dark:text-purple-400 font-medium"
            >
              Eccentric Healer
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};