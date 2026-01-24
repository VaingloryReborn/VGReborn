import React from "react";
import { Info } from "lucide-react";
import { Trans } from "react-i18next";

const InfoSection: React.FC = () => {
  return (
    <div className="p-4 rounded-xl flex items-center gap-3 shadow-inner">
      <span className="shrink-0">
        <Info className="w-3 h-3 " />
      </span>
      <p className="text-[11px] text-slate-300 leading-relaxed">
        <Trans i18nKey="home.info5v5">
          To reduce 5v5 queue splitting, VGReborn <span className=" font-bold">does not support 5v5 Casual</span>
        </Trans>
      </p>
    </div>
  );
};

export default InfoSection;
