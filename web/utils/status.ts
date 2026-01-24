import { Player } from "../types";

export const getLobbyName = (lobby?: string | null) => {
  if (!lobby) return "";
  const map: Record<string, string> = {
    "5v5_pvp_ranked": "5v5排位",
    "5v5_pvp_casual": "5v5匹配",
    ranked: "3v3排位",
    casual_aral: "大乱斗",
    blitz_pvp_ranked: "闪电战",
    "5v5_bots_solo": "5v5人机",
    blitz_bots_solo: "闪电战人机",
    solo_bots: "3v3人机",
  };
  return map[lobby] || "";
};

export const getStatusDisplay = (user?: Player) => {
  if (!user)
    return { text: "未知", color: "text-slate-400", dot: "bg-slate-500" };
  if (!user?.activated)
    return { text: "未绑定", color: "text-slate-400", dot: "bg-slate-500" };
  const s = user.state?.toLowerCase();
  const lobby = user.lobby;
  if (s === "offline")
    return { text: "游戏离线", color: "text-slate-400", dot: "bg-slate-500" };
  if (s === "online")
    return {
      text: "游戏在线",
      color: "text-emerald-400",
      dot: "bg-emerald-500",
    };
  if (s === "matching")
    return {
      text: `匹配中 (${getLobbyName(lobby)})`,
      color: "text-amber-400",
      dot: "bg-amber-500",
    };
  if (s === "gaming")
    return {
      text: `游戏中 (${getLobbyName(lobby)})`,
      color: "text-white",
      dot: "bg-red-600",
    };
  if (s === "recording")
    return {
      text: `结算中 (${getLobbyName(lobby)})`,
      color: "text-white",
      dot: "bg-red-600",
    };
  return { text: s, color: "text-emerald-400", dot: "bg-emerald-500" };
};

export const getRegionName = (region?: string) => {
  if (!region) return null;
  const map: Record<string, string> = {
    sea: "东南亚",
    na: "北美",
    eu: "欧",
    ea: "东亚",
    sa: "南美",
  };
  return map[region] || region;
};
