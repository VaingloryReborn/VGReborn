import React, { useEffect, useState } from "react";
import { Player } from "../types";
import { getStatusDisplay } from "../utils/status";
import { Loader2 } from "lucide-react";

interface DynamicIslandProps {
  user: Player | null;
}

const DynamicIsland: React.FC<DynamicIslandProps> = ({
  user,
}: DynamicIslandProps) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (user?.state === "matching") {
      setShow(true);
    } else {
      setShow(false);
    }
  }, [user?.state]);

  if (!user || !show) return null;

  const statusInfo = getStatusDisplay(user);

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
      <div
        className={`bg-black rounded-full py-2 px-5 border border-white/10 shadow-2xl transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] flex items-center justify-center overflow-hidden pointer-events-auto`}
      >
        <div
          className={`flex items-center gap-3 px-4 transition-all duration-300 opacity-100 scale-100`}
        >
          <div className="relative flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-amber-500 animate-ping absolute opacity-75" />
            <div className="w-2 h-2 rounded-full bg-amber-500 relative z-10" />
          </div>
          <div className="flex flex-col">
            <span className="text-white text-xs font-bold whitespace-nowrap">
              正在匹配...
            </span>
            <span className="text-white/60 text-[10px] whitespace-nowrap">
              {statusInfo.text.replace("匹配中 (", "").replace(")", "")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DynamicIsland;
