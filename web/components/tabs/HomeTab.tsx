
import React, { useEffect, useState } from 'react';
import { Info } from 'lucide-react';
import { VG_BACKGROUND } from '../../constants';
import MatchStatCard from '../MatchStatCard';
import { supabase } from '../../supabase';
import { MatchStats } from '../../types';

interface HomeTabProps {
  onJoinClick: () => void;
}

const INITIAL_STATS: MatchStats = {
  onlineTotal: 0,
  idleCount: 0,
  gaming3v3: 0,
  matching3v3: 0,
  matching5v5Ranked: 0,
  gaming5v5: 0,
  matchingBrawl: 0,
  gamingBrawl: 0,
  matchingBlitz: 0,
  gamingBlitz: 0,
};

const HomeTab: React.FC<HomeTabProps> = ({ onJoinClick }) => {
  const [stats, setStats] = useState<MatchStats>(INITIAL_STATS);

  useEffect(() => {
    const fetchStats = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('state, region'); // Fetch region if we want to filter by region later

      if (data) {
        const newStats = { ...INITIAL_STATS };
        data.forEach((profile) => {
          const s = profile.state;
          if (s && s !== 'offline') {
            newStats.onlineTotal++;
            // Currently backend only sets "online", so we treat it as idle/generic online
            if (s === 'online') newStats.idleCount++;
            else if (s === 'matching') newStats.matching5v5Ranked++; // Example mapping if backend supported it
            else if (s === 'gaming') newStats.gaming5v5++; // Example mapping
            // Add more logic here when backend supports detailed states
          }
        });
        setStats(newStats);
      }
    };

    fetchStats();

    // Realtime subscription for global stats
    const channel = supabase
      .channel('public:profiles_global_stats')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles',
        },
        () => {
          // Re-fetch all stats on any change
          // For a small number of users this is fine. For large scale, we need a better approach (e.g. Edge Functions or materialized views)
          fetchStats();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="pb-24 animate-in fade-in duration-700">
      <div className="relative h-[240px] w-full flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0 bg-banner-mask banner-fade-in">
          <div 
            className="w-full h-full bg-cover bg-center opacity-60" 
            style={{ backgroundImage: `url(${VG_BACKGROUND})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/30 to-[#0f111a]" />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <div className="relative z-10 text-center px-6">
          <h1 className="text-6xl font-black italic text-gradient mb-2 drop-shadow-[0_4px_24px_rgba(255,255,255,0.2)] tracking-tighter">VGReborn</h1>
          <p className="text-xs font-bold text-white max-w-xs mx-auto drop-shadow-[0_2px_8px_rgba(0,0,0,1)] bg-red-900/60 backdrop-blur-lg border border-white/20 px-4 py-1.5 rounded-full uppercase tracking-widest">
            虚荣社区版第三方匹配平台
          </p>
        </div>
      </div>

      <div className="px-5 relative z-20 space-y-6 -mt-4">
        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 p-5 rounded-2xl shadow-2xl">
          <p className="text-sm text-slate-200 leading-relaxed text-center font-medium">
            基于 <span className="text-blue-400 font-bold">加速器 + MITM</span> 技术绑定游戏ID到 VGReborn，获得更好的游戏体验。
            <button 
              onClick={onJoinClick}
              className="ml-1 text-red-500 font-bold underline decoration-red-500/30 underline-offset-4 hover:text-red-400 transition-colors"
            >
              加入VGReborn
            </button>
          </p>
        </div>

        <div>
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-white">
            <div className="w-1.5 h-6 bg-red-800 rounded-full" />
            实时战场数据
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <MatchStatCard label="总计在线" value={stats.onlineTotal} color="cyan" />
            <MatchStatCard label="空闲人数" value={stats.idleCount} color="green" />
            <MatchStatCard label="3v3 排位匹配中" value={stats.matching3v3} color="orange" />
            <MatchStatCard label="3v3 游戏中" value={stats.gaming3v3} color="red" />
            <MatchStatCard label="5v5 排位匹配中" value={stats.matching5v5Ranked} color="orange" />
            <MatchStatCard label="5v5 游戏中" value={stats.gaming5v5} color="red" />
            <MatchStatCard label="大乱斗匹配中" value={stats.matchingBrawl} color="orange" />
            <MatchStatCard label="大乱斗游戏中" value={stats.gamingBrawl} color="red" />
            <MatchStatCard label="闪电战匹配中" value={stats.matchingBlitz} color="orange" />
            <MatchStatCard label="闪电战游戏中" value={stats.gamingBlitz} color="red" />
          </div>
        </div>

        <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl flex gap-3 shadow-inner">
          <span className="shrink-0"><Info className="w-6 h-6 text-red-500" /></span>
          <p className="text-[11px] text-slate-300 leading-relaxed">
            为减少 5v5 模式分流让匹配更困难，VGReborn 只支持 <span className="text-red-500 font-bold">5v5 排位模式</span>，并呼吁玩家们弃用 5v5 匹配模式。
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomeTab;
