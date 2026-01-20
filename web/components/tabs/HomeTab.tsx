import React from 'react';
import { useMatchStats } from '../../hooks/useMatchStats';
import HomeBanner from '../home/HomeBanner';
import JoinSection from '../home/JoinSection';
import StatsGrid from '../home/StatsGrid';
import InfoSection from '../home/InfoSection';

interface HomeTabProps {
  onJoinClick: () => void;
}

const HomeTab: React.FC<HomeTabProps> = ({ onJoinClick }) => {
  const { stats, loading } = useMatchStats();

  return (
    <div className="pb-24 animate-in fade-in duration-700">
      <HomeBanner />

      <div className="px-5 relative z-20 space-y-6 -mt-4">
        <JoinSection onJoinClick={onJoinClick} />

        <div>
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-white">
            <div className="w-1.5 h-6 bg-red-800 rounded-full" />
            实时战场数据
          </h2>
          <StatsGrid stats={stats} loading={loading} />
        </div>

        <InfoSection />
      </div>
    </div>
  );
};

export default HomeTab;
