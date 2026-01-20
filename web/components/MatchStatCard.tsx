
import React from 'react';

interface MatchStatCardProps {
  label: string;
  value: number;
  subLabel?: string;
  color?: string;
}

const MatchStatCard: React.FC<MatchStatCardProps> = ({ label, value, subLabel, color = "blue" }) => {
  const colorMap: Record<string, string> = {
    blue: "from-blue-500/20 to-blue-600/5 border-blue-500/30 text-blue-400",
    purple: "from-purple-500/20 to-purple-600/5 border-purple-500/30 text-purple-400",
    green: "from-emerald-500/20 to-emerald-600/5 border-emerald-500/30 text-emerald-400",
    orange: "from-amber-500/20 to-amber-600/5 border-amber-500/30 text-amber-500",
    cyan: "from-cyan-400/20 to-cyan-600/5 border-cyan-400/30 text-cyan-400",
    red: "from-rose-500/20 to-rose-600/5 border-rose-500/30 text-rose-400",
  };

  return (
    <div className={`p-3 rounded-xl border glass-panel bg-gradient-to-br ${colorMap[color] || colorMap.blue} flex flex-col justify-center items-center shadow-sm`}>
      <span className="text-[10px] font-bold opacity-90 uppercase tracking-widest mb-1 text-center">{label}</span>
      <span className="text-2xl font-black">{value}</span>
      {subLabel && <span className="text-[10px] opacity-60 mt-1">{subLabel}</span>}
    </div>
  );
};

export default MatchStatCard;
