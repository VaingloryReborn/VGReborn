import React from "react";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();
  return (
    <div className="grid grid-cols-2 gap-3">
      <MatchStatCard
        label={t("home.stats.onlineTotal")}
        value={stats.onlineTotal}
        color="cyan"
        loading={loading}
      />
      <MatchStatCard
        label={t("home.stats.idleCount")}
        value={stats.idleCount}
        color="green"
        loading={loading}
      />
      <MatchStatCard
        label={t("home.stats.matching3v3")}
        value={stats.matching3v3}
        color="orange"
        loading={loading}
      />
      <MatchStatCard
        label={t("home.stats.gaming3v3")}
        value={stats.gaming3v3}
        color="red"
        loading={loading}
      />
      <MatchStatCard
        label={t("home.stats.matching5v5Ranked")}
        value={stats.matching5v5Ranked}
        color="orange"
        loading={loading}
      />
      <MatchStatCard
        label={t("home.stats.gaming5v5")}
        value={stats.gaming5v5}
        color="red"
        loading={loading}
      />
      <MatchStatCard
        label={t("home.stats.matchingAral")}
        value={stats.matchingAral}
        color="orange"
        loading={loading}
      />
      <MatchStatCard
        label={t("home.stats.gamingAral")}
        value={stats.gamingAral}
        color="red"
        loading={loading}
      />
      <MatchStatCard
        label={t("home.stats.matchingBlitz")}
        value={stats.matchingBlitz}
        color="orange"
        loading={loading}
      />
      <MatchStatCard
        label={t("home.stats.gamingBlitz")}
        value={stats.gamingBlitz}
        color="red"
        loading={loading}
      />
    </div>
  );
};

export default StatsGrid;
