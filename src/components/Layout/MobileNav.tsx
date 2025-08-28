import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Plus, Minus, History, Menu } from 'lucide-react';

interface MobileNavProps {
  onMenuClick: () => void;
}

const MobileNav: React.FC<MobileNavProps> = ({ onMenuClick }) => {
  const location = useLocation();

  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Deposit', href: '/deposit', icon: Plus },
    { name: 'Withdraw', href: '/withdraw', icon: Minus },
    { name: 'Transactions', href: '/transactions', icon: History },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-slate-800 border-t border-slate-700 safe-area-pb">
      <div className="flex items-center justify-around py-2">
        {navigation.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`
                flex flex-col items-center py-2 px-3 rounded-xl transition-all duration-200
                ${isActive(item.href)
                  ? 'text-neon-green'
                  : 'text-slate-400 hover:text-slate-200'
                }
              `}
            >
              <Icon className="w-5 h-5 mb-1" />
              <span className="text-xs font-medium">{item.name}</span>
            </Link>
          );
        })}
        <button
          onClick={onMenuClick}
          className="flex flex-col items-center py-2 px-3 text-slate-400 hover:text-slate-200 rounded-xl transition-all duration-200"
        >
          <Menu className="w-5 h-5 mb-1" />
          <span className="text-xs font-medium">Menu</span>
        </button>
      </div>
    </div>
  );
};

export default MobileNav;