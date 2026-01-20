import React from "react";
import { MatchStats } from "../../types";
import MatchStatCard from "../MatchStatCard";

interface StatsGridProps {
  stats: MatchStats;
  loading: boolean;
}

const StatsGrid: React.FC<StatsGridProps> = ({
  stats,
  loading,
}: StatsGridProps) => {
  return (
    <div className="grid grid-cols-2 gap-3">
      <MatchStatCard
        label="总计在线"
        value={stats.onlineTotal}
        color="cyan"
        loading={loading}
      />
      <MatchStatCard
        label="空闲人数"
        value={stats.idleCount}
        color="green"
        loading={loading}
      />
      <MatchStatCard
        label="3v3 排位匹配中"
        value={stats.matching3v3}
        color="orange"
        loading={loading}
      />
      <MatchStatCard
        label="3v3 游戏中"
        value={stats.gaming3v3}
        color="red"
        loading={loading}
      />
      <MatchStatCard
        label="5v5 排位匹配中"
        value={stats.matching5v5Ranked}
        color="orange"
        loading={loading}
      />
      <MatchStatCard
        label="5v5 游戏中"
        value={stats.gaming5v5}
        color="red"
        loading={loading}
      />
      <MatchStatCard
        label="大乱斗匹配中"
        value={stats.matchingAral}
        color="orange"
        loading={loading}
      />
      <MatchStatCard
        label="大乱斗游戏中"
        value={stats.gamingAral}
        color="red"
        loading={loading}
      />
      <MatchStatCard
        label="闪电战匹配中"
        value={stats.matchingBlitz}
        color="orange"
        loading={loading}
      />
      <MatchStatCard
        label="闪电战游戏中"
        value={stats.gamingBlitz}
        color="red"
        loading={loading}
      />
    </div>
  );
};

export default StatsGrid;
