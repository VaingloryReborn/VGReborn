import React from "react";
import { Room } from "../types";
import { Users, Lock, Globe } from "lucide-react";
import { getLobbyName, getStatusDisplay } from "../utils/status";

interface RoomCardProps {
  room: Room;
  onClick: (room: Room) => void;
}

const RoomCard: React.FC<RoomCardProps> = ({
  room,
  onClick,
}: RoomCardProps) => {
  const codeNum = parseInt(room.codePrefix);
  const isPrivate = codeNum >= 3000;

  // Style config based on room type (Public vs Private)
  const styleConfig = isPrivate
    ? {
        // Private Room Style (Purple)
        borderColor: "border-purple-500/20",
        hoverBorder: "hover:border-purple-500/50",
        titleColor: "text-purple-400",
        glow: "shadow-[0_0_15px_-3px_rgba(168,85,247,0.1)]",
        bgIcon: <Lock className="w-24 h-24 text-purple-500" />,
      }
    : {
        // Public Room Style (Emerald)
        borderColor: "border-emerald-500/20",
        hoverBorder: "hover:border-emerald-500/50",
        titleColor: "text-emerald-400",
        glow: "shadow-[0_0_15px_-3px_rgba(16,185,129,0.1)]",
        bgIcon: <Globe className="w-24 h-24 text-emerald-500" />,
      };
  // Get style for mode tag
  const getModeStyle = (mode: Room["mode"]) => {
    if (!mode) return "text-slate-300 bg-white/5 border-white/5";

    // Bots -> White
    if (mode.includes("bots")) {
      return "text-slate-200 bg-white/10 border-white/20";
    }
    // Blitz -> Amber
    if (mode.includes("blitz")) {
      return "text-amber-400 bg-amber-500/10 border-amber-500/20";
    }
    // ARAL -> Dark Red
    if (mode.includes("aral")) {
      return "text-red-400 bg-red-900/20 border-red-500/20";
    }
    // 5v5 -> Gold
    if (mode.includes("5v5")) {
      return "text-yellow-400 bg-yellow-500/10 border-yellow-500/20";
    }
    // 3v3 -> Purple
    if (mode.includes("3v3")) {
      return "text-purple-400 bg-purple-500/10 border-purple-500/20";
    }

    return "text-slate-300 bg-white/5 border-white/5";
  };

  return (
    <div
      // onClick={() => onClick(room)}
      className={`p-4 mb-3 rounded-xl border glass-panel active:scale-[0.98] transition-all cursor-pointer group relative overflow-hidden ${styleConfig.borderColor} ${styleConfig.hoverBorder} ${styleConfig.glow}`}
    >
      {/* Background decoration */}
      <div
        className={`absolute top-0 right-0 p-3 opacity-5 group-hover:opacity-10 transition-opacity`}
      >
        {styleConfig.bgIcon}
      </div>

      <div className="relative z-10">
        {/* Row 1: Room Code & Mode */}
        <div className="flex justify-between items-center mb-2">
          <h3
            className={`text-base whitespace-nowrap ${styleConfig.titleColor}`}
          >
            <span className="font-normal">房间代码: </span>
            <span className={`px-2 py-1 rounded font-mono font-bold`}>
              {isPrivate ? "****" : room.codePrefix}
              {room.codePrefix === "1200" ? "（默认）" : ""}
            </span>
          </h3>
        </div>

        {/* Row 2: Member Count */}
        <div className="mb-3 flex justify-start items-center gap-1.5">
          <span
            className={`text-xs font-medium px-2 py-1 rounded border flex items-center ${getModeStyle(room.mode)}`}
          >
            {getLobbyName(room.mode) || "空闲"}
            {room.members?.[0]?.state === "gaming"
              ? "(游戏中)"
              : room.members?.[0]?.state === "recording"
                ? "(结算中)"
                : room.members?.[0]?.state === "matching"
                  ? "(匹配中)"
                  : ""}
          </span>
          <div className="flex-grow"></div>
          <div className="flex items-center gap-1.5 bg-black/20 px-2 py-1 rounded-lg border border-white/5">
            <Users className="w-3 h-3 text-slate-400" />
            <span className="text-xs font-bold text-slate-200">
              {room.members.length}人
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/5 my-3"></div>

        {/* Row 3: Member List */}
        <div className="grid grid-cols-2 gap-y-1 gap-x-2">
          {room.members.map((member) => {
            // Remove code and team prefix (e.g. "1200-A_Name" -> "Name", "1200_Name" -> "Name")
            const displayName = member.handle.replace(/^\d+(?:-[ABab])?_/, "");
            const nickname = member.nickname ? `(${member.nickname})` : "";
            const statusDisplay = getStatusDisplay(member);
            return (
              <div
                key={member.id}
                className="flex items-center gap-2 overflow-hidden"
              >
                <div className="relative">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-[10px] font-bold text-white border border-white/10 shadow-sm">
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                  <div
                    className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-[#1a1b26] ${statusDisplay.dot}`}
                  ></div>
                </div>
                <span
                  className="text-xs text-slate-400 truncate flex-1"
                  title={member.handle}
                >
                  {displayName}
                  {nickname}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RoomCard;
