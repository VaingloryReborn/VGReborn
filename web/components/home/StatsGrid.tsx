import React from 'react';
import { MatchStats } from '../../types';
import MatchStatCard from '../MatchStatCard';

interface StatsGridProps {
  stats: MatchStats;
}

const StatsGrid: React.FC<StatsGridProps> = ({ stats }) => {
  return (
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
  );
};

export default StatsGrid;
