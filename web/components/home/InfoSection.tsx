import React from "react";
import { Info } from "lucide-react";

const InfoSection: React.FC = () => {
  return (
    <div className="p-4 rounded-xl flex items-center gap-3 shadow-inner">
      <span className="shrink-0">
        <Info className="w-3 h-3 " />
      </span>
      <p className="text-[11px] text-slate-300 leading-relaxed">
        为减少 5v5 模式分流让匹配更困难，VGReborn{" "}
        <span className=" font-bold">不支持5v5匹配模式</span>
      </p>
    </div>
  );
};

export default InfoSection;
