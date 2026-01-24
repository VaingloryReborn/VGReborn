import React from 'react';
import { 
  Home as HomeIcon, 
  Users, 
  User, 
  Trophy,
  Download
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { AppTab } from '../../types';

interface BottomNavProps {
  activeTab: AppTab;
  onTabChange: (tab: AppTab) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  const { t } = useTranslation();
  const activeTabClass = "text-red-600 scale-110 font-bold";
  const inactiveTabClass = "text-slate-500";

  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto h-16 glass-panel border-t border-white/10 flex items-center justify-around px-1 z-20 rounded-t-3xl shadow-[0_-15px_50px_rgba(0,0,0,0.9)]">
      <button 
        onClick={() => onTabChange('home')}
        className={`flex-1 h-full flex flex-col items-center justify-center gap-1 transition-all duration-300 ${activeTab === 'home' ? activeTabClass : inactiveTabClass}`}
      >
        <HomeIcon className="w-5 h-5" />
        <span className="text-[11px]">{t('nav.home')}</span>
      </button>
      <button 
        onClick={() => onTabChange('install')}
        className={`flex-1 h-full flex flex-col items-center justify-center gap-1 transition-all duration-300 ${activeTab === 'install' ? activeTabClass : inactiveTabClass}`}
      >
        <Download className="w-5 h-5" />
        <span className="text-[11px]">{t('nav.guide')}</span>
      </button>
      <button 
        onClick={() => onTabChange('rooms')}
        className={`flex-1 h-full flex flex-col items-center justify-center gap-1 transition-all duration-300 ${activeTab === 'rooms' ? activeTabClass : inactiveTabClass}`}
      >
        <Users className="w-5 h-5" />
        <span className="text-[11px]">{t('nav.rooms')}</span>
      </button>
      <button 
        onClick={() => onTabChange('leaderboard')}
        className={`flex-1 h-full flex flex-col items-center justify-center gap-1 transition-all duration-300 ${activeTab === 'leaderboard' ? activeTabClass : inactiveTabClass}`}
      >
        <Trophy className="w-5 h-5" />
        <span className="text-[11px]">{t('nav.leaderboard')}</span>
      </button>
      <button 
        onClick={() => onTabChange('profile')}
        className={`flex-1 h-full flex flex-col items-center justify-center gap-1 transition-all duration-300 ${activeTab === 'profile' ? activeTabClass : inactiveTabClass}`}
      >
        <User className="w-5 h-5" />
        <span className="text-[11px]">{t('nav.profile')}</span>
      </button>
    </nav>
  );
};

export default BottomNav;
