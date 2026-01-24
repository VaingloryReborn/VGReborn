import { Player } from "../types";
import i18n from "../i18n";

export const getLobbyName = (lobby?: string | null) => {
  if (!lobby) return "";
  return i18n.t(`room.lobby.${lobby}`, { defaultValue: lobby });
};

export const getStatusDisplay = (user?: Player) => {
  if (!user)
    return {
      text: i18n.t("room.unknown"),
      color: "text-slate-400",
      dot: "bg-slate-500",
    };
  if (!user?.activated)
    return {
      text: i18n.t("common.notBound"),
      color: "text-slate-400",
      dot: "bg-slate-500",
    };
  const s = user.state?.toLowerCase();
  const lobby = user.lobby;
  if (s === "offline")
    return {
      text: i18n.t("room.offline"),
      color: "text-slate-400",
      dot: "bg-slate-500",
    };
  if (s === "online")
    return {
      text: i18n.t("room.online"),
      color: "text-emerald-400",
      dot: "bg-emerald-500",
    };
  if (s === "matching")
    return {
      text: i18n.t("room.matching", { lobby: getLobbyName(lobby) }),
      color: "text-amber-400",
      dot: "bg-amber-500",
    };
  if (s === "gaming")
    return {
      text: i18n.t("room.gaming", { lobby: getLobbyName(lobby) }),
      color: "text-white",
      dot: "bg-red-600",
    };
  if (s === "recording")
    return {
      text: i18n.t("room.recording", { lobby: getLobbyName(lobby) }),
      color: "text-white",
      dot: "bg-red-600",
    };
  return { text: s, color: "text-emerald-400", dot: "bg-emerald-500" };
};

export const getRegionName = (region?: string) => {
  if (!region) return null;
  return i18n.t(`room.region.${region}`, { defaultValue: region });
};

export const getReputationDisplay = (rep?: string) => {
  if (!rep) return "";
  const map: Record<string, string> = {
    "优": "excellent",
    "excellent": "excellent",
    "一般": "good",
    "good": "good",
    "差": "bad",
    "bad": "bad",
  };
  const key = map[rep];
  return key ? i18n.t(`room.reputationLevel.${key}`) : rep;
};

export const getReputationColor = (rep?: string) => {
  if (!rep) return "text-slate-400";
  const map: Record<string, string> = {
    "优": "text-emerald-400",
    "excellent": "text-emerald-400",
    "一般": "text-amber-400",
    "good": "text-amber-400",
    "差": "text-red-400",
    "bad": "text-red-400",
  };
  return map[rep] || "text-slate-400";
};

export const getRankTierDisplay = (tier?: string) => {
  if (!tier) return "";
  const map: Record<string, string> = {
    "初出茅庐": "t1",
    "t1": "t1",
    "逐步成长": "t2",
    "t2": "t2",
    "铜头铁臂": "t3",
    "t3": "t3",
    "值得一战": "t4",
    "t4": "t4",
    "深藏不露": "t5",
    "t5": "t5",
    "名不虚传": "t6",
    "t6": "t6",
    "炉火纯青": "t7",
    "t7": "t7",
    "神乎其技": "t8",
    "t8": "t8",
    "登峰造极": "t9",
    "t9": "t9",
    "至尊荣耀": "t10",
    "t10": "t10",
  };
  const key = map[tier];
  return key ? i18n.t(`room.rankTier.${key}`) : tier;
};
