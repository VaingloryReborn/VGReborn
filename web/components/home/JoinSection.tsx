import React from 'react';

interface JoinSectionProps {
  onJoinClick: () => void;
}

const JoinSection: React.FC<JoinSectionProps> = ({ onJoinClick }) => {
  return (
    <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 p-5 rounded-2xl shadow-2xl">
      <p className="text-sm text-slate-200 leading-relaxed text-center font-medium">
        基于 <span className="text-blue-400 font-bold">加速器+MITM</span> 技术自动绑定游戏状态到VGReborn，为游戏带来排位、招募、好友、惩罚等机制。
        <button 
          onClick={onJoinClick}
          className="ml-1 text-red-500 font-bold underline decoration-red-500/30 underline-offset-4 hover:text-red-400 transition-colors"
        >
          加入VGReborn
        </button>
      </p>
    </div>
  );
};

export default JoinSection;
