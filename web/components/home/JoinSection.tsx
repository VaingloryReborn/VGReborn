import React, { useState } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { Play } from 'lucide-react';
import VideoModal from '../VideoModal';

interface JoinSectionProps {
  onJoinClick: () => void;
}

const JoinSection: React.FC<JoinSectionProps> = ({ onJoinClick }) => {
  const { t } = useTranslation();
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  return (
    <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 p-5 rounded-2xl shadow-2xl">
      <p className="text-sm text-slate-200 leading-relaxed text-center font-medium mb-4">
        <Trans i18nKey="home.joinDescription">
          Based on <span className="text-blue-400 font-bold">VPN+MITM</span> technology...
        </Trans>
      </p>
      <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
        <button
          onClick={onJoinClick}
          className="w-full sm:w-auto group relative inline-flex items-center justify-center px-8 py-2.5 font-bold text-white transition-all duration-200 bg-gradient-to-r from-red-600 to-red-500 rounded-full hover:from-red-500 hover:to-red-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 shadow-lg shadow-red-900/20 hover:shadow-red-900/40 hover:-translate-y-0.5"
        >
          <span>{t("home.joinLink")}</span>
          <svg
            className="w-4 h-4 ml-2 -mr-1 transition-transform duration-200 group-hover:translate-x-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M13 7l5 5m0 0l-5 5m5-5H6"
            />
          </svg>
        </button>

        <button 
          onClick={() => setIsVideoOpen(true)}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-white text-sm font-medium transition-all hover:scale-105 active:scale-95 group"
        >
          <div className="w-5 h-5 rounded-full bg-white/10 text-white flex items-center justify-center group-hover:bg-red-500 transition-colors">
            <Play className="w-2.5 h-2.5 fill-current ml-0.5" />
          </div>
          <span>{t('home.watchDemo')}</span>
        </button>
      </div>

      <VideoModal isOpen={isVideoOpen} onClose={() => setIsVideoOpen(false)} />
    </div>
  );
};

export default JoinSection;
