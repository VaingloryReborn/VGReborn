import React from 'react';
import { VG_BACKGROUND } from '../../constants';

const HomeBanner: React.FC = () => {
  return (
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
          虚荣社区版第三方匹配平台（内侧中）
        </p>
      </div>
    </div>
  );
};

export default HomeBanner;
