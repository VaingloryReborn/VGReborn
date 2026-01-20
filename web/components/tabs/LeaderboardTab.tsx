
import React from 'react';
import { Trophy, Medal, Swords, Shield } from 'lucide-react';
import { Player } from '../../types';
import { MOCK_LEADERBOARD_3V3, MOCK_LEADERBOARD_5V5 } from '../../constants';

const LeaderboardTab: React.FC = () => {
  const renderLeaderboardList = (list: Player[], mode: string) => {
    if (list.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-10 text-slate-600 opacity-60 bg-white/[0.02] border border-dashed border-white/5 rounded-2xl">
          <Medal className="w-8 h-8 mb-2" />
          <p className="text-[10px] font-bold uppercase tracking-wider">{mode} 暂无数据</p>
        </div>
      );
    }

    return (
      <div className="space-y-2">
        {list.map((player, index) => (
          <div 
            key={player.id} 
            className={`glass-panel p-2 rounded-xl flex items-center justify-between border-white/5 ${index < 3 ? 'bg-gradient-to-r from-red-900/10 to-transparent' : ''}`}
          >
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="w-5 flex justify-center font-black italic text-xs shrink-0">
                {index === 0 ? <Medal className="w-4 h-4 text-yellow-500" /> : 
                 index === 1 ? <Medal className="w-4 h-4 text-slate-300" /> : 
                 index === 2 ? <Medal className="w-4 h-4 text-amber-600" /> : 
                 <span className="text-slate-600 not-italic">{index + 1}</span>}
              </div>
              <div className="min-w-0">
                <div className="font-bold text-white text-[10px] truncate">{player.name}</div>
                <div className="text-[8px] text-slate-500 uppercase tracking-tighter truncate">LV.{player.level}</div>
              </div>
            </div>
            <div className="text-right shrink-0">
              <div className="text-[10px] font-black text-red-500 leading-tight truncate">{player.rankTier}</div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="p-5 pb-24 relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gradient italic">排位榜</h2>
      </div>

      <div className="grid grid-cols-2 gap-4 items-start">
        <div>
          <h3 className="text-xs font-black text-slate-400 mb-3 flex items-center gap-1.5 uppercase tracking-widest px-1">
            <Swords className="w-3.5 h-3.5 text-blue-500" />
            3v3 排行
          </h3>
          {renderLeaderboardList(MOCK_LEADERBOARD_3V3, '3v3')}
        </div>

        <div>
          <h3 className="text-xs font-black text-slate-400 mb-3 flex items-center gap-1.5 uppercase tracking-widest px-1">
            <Shield className="w-3.5 h-3.5 text-red-700" />
            5v5 排行
          </h3>
          {renderLeaderboardList(MOCK_LEADERBOARD_5V5, '5v5')}
        </div>
      </div>
    </div>
  );
};

export default LeaderboardTab;
