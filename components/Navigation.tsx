
import React from 'react';
import { AppView } from '../types';
import { Home, BookOpen, CircleDot, Calendar, NotebookPen } from 'lucide-react';

interface NavigationProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentView, onNavigate }) => {
  const navItems = [
    { view: AppView.HOME, icon: Home, label: 'Início' },
    { view: AppView.PRAYERS, icon: BookOpen, label: 'Orações' },
    { view: AppView.ROSARIES, icon: CircleDot, label: 'Terços' },
    { view: AppView.JOURNAL, icon: NotebookPen, label: 'Diário' },
    { view: AppView.CALENDAR, icon: Calendar, label: 'Liturgia' },
  ];

  return (
    <div className="fixed bottom-6 left-6 right-6 z-50">
      <nav className="bg-white/80 backdrop-blur-xl border border-white/20 flex justify-around items-center px-2 py-3 rounded-[2.5rem] shadow-[0_10px_40px_rgba(0,0,0,0.1)]">
        {navItems.map((item) => {
          const isActive = currentView === item.view || 
                           (item.view === AppView.PRAYERS && currentView === AppView.PRAYER_DETAIL) ||
                           (item.view === AppView.ROSARIES && currentView === AppView.ROSARY_GUIDE);
          
          return (
            <button
              key={item.view}
              onClick={() => onNavigate(item.view)}
              className={`relative flex flex-col items-center gap-1.5 transition-all duration-300 flex-1 py-1 ${
                isActive ? 'text-purple-700' : 'text-gray-400'
              }`}
            >
              <div className={`transition-all duration-300 ${isActive ? 'scale-110' : 'scale-100'}`}>
                <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className={`text-[8px] font-bold uppercase tracking-widest transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-60'}`}>
                {item.label}
              </span>
              {isActive && (
                <div className="absolute -bottom-1 w-1 h-1 bg-purple-700 rounded-full animate-pulse" />
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default Navigation;
