import React from 'react';
import { useTranslation, Trans } from 'react-i18next';

interface JoinSectionProps {
  onJoinClick: () => void;
}

const JoinSection: React.FC<JoinSectionProps> = ({ onJoinClick }) => {
  const { t } = useTranslation();
  return (
    <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 p-5 rounded-2xl shadow-2xl">
      <p className="text-sm text-slate-200 leading-relaxed text-center font-medium mb-4">
        <Trans i18nKey="home.joinDescription">
          Based on <span className="text-blue-400 font-bold">VPN+MITM</span> technology...
        </Trans>
      </p>
      <div className="flex justify-center">
        <button
          onClick={onJoinClick}
          className="group relative inline-flex items-center justify-center px-8 py-2.5 font-bold text-white transition-all duration-200 bg-gradient-to-r from-red-600 to-red-500 rounded-full hover:from-red-500 hover:to-red-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 shadow-lg shadow-red-900/20 hover:shadow-red-900/40 hover:-translate-y-0.5"
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
      </div>
    </div>
  );
};

export default JoinSection;
