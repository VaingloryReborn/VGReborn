import React from "react";
import { Info } from "lucide-react";

const InfoSection: React.FC = () => {
  return (
    <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl flex gap-3 shadow-inner">
      <span className="shrink-0">
        <Info className="w-6 h-6 text-red-500" />
      </span>
      <p className="text-[11px] text-slate-300 leading-relaxed">
        为减少 5v5 模式分流让匹配更困难，VGReborn{" "}
        <span className="text-red-500 font-bold">不支持5v5匹配模式</span>
        ，并呼吁玩家们弃用 5v5 匹配模式。
      </p>
    </div>
  );
};

export default InfoSection;
