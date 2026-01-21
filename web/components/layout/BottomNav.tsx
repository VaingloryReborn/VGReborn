import React from 'react';
import { 
  Home as HomeIcon, 
  Users, 
  User, 
  Trophy,
  Download
} from 'lucide-react';
import { AppTab } from '../../types';

interface BottomNavProps {
  activeTab: AppTab;
  onTabChange: (tab: AppTab) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  const activeTabClass = "text-red-600 scale-110 font-bold";
  const inactiveTabClass = "text-slate-500";

  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto h-20 glass-panel border-t border-white/10 flex items-center justify-around px-1 z-20 rounded-t-3xl shadow-[0_-15px_50px_rgba(0,0,0,0.9)]">
      <button 
        onClick={() => onTabChange('home')}
        className={`flex flex-col items-center gap-1 transition-all duration-300 ${activeTab === 'home' ? activeTabClass : inactiveTabClass}`}
      >
        <HomeIcon className="w-5 h-5" />
        <span className="text-[9px]">首页</span>
      </button>
      <button 
        onClick={() => onTabChange('install')}
        className={`flex flex-col items-center gap-1 transition-all duration-300 ${activeTab === 'install' ? activeTabClass : inactiveTabClass}`}
      >
        <Download className="w-5 h-5" />
        <span className="text-[9px]">指南</span>
      </button>
      <button 
        onClick={() => onTabChange('rooms')}
        className={`flex flex-col items-center gap-1 transition-all duration-300 ${activeTab === 'rooms' ? activeTabClass : inactiveTabClass}`}
      >
        <Users className="w-5 h-5" />
        <span className="text-[9px]">房间</span>
      </button>
      <button 
        onClick={() => onTabChange('leaderboard')}
        className={`flex flex-col items-center gap-1 transition-all duration-300 ${activeTab === 'leaderboard' ? activeTabClass : inactiveTabClass}`}
      >
        <Trophy className="w-5 h-5" />
        <span className="text-[9px]">排行</span>
      </button>
      <button 
        onClick={() => onTabChange('profile')}
        className={`flex flex-col items-center gap-1 transition-all duration-300 ${activeTab === 'profile' ? activeTabClass : inactiveTabClass}`}
      >
        <User className="w-5 h-5" />
        <span className="text-[9px]">我</span>
      </button>
    </nav>
  );
};

export default BottomNav;
