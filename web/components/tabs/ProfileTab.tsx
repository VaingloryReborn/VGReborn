import React from "react";
import {
  User,
  ShieldCheck,
  Zap,
  ChevronRight,
  LogOut,
  Loader2,
} from "lucide-react";
import { Player } from "../../types";

interface ProfileTabProps {
  user: Player | null;
  isAuthLoading: boolean;
  onOpenLogin: () => void;
  onLogout: () => void;
}

const ProfileTab: React.FC<ProfileTabProps> = ({
  user,
  isAuthLoading,
  onOpenLogin,
  onLogout,
}: ProfileTabProps) => {
  const getReputationColor = (rep: string) => {
    if (rep === "优") return "text-emerald-400";
    if (rep === "一般") return "text-amber-400";
    return "text-rose-400";
  };

  const getStatusDisplay = (status: string) => {
    const s = status.toLowerCase();
    if (s === "offline")
      return { text: "游戏离线", color: "text-slate-400", dot: "bg-slate-500" };
    if (s === "online")
      return { text: "游戏在线", color: "text-emerald-400", dot: "bg-emerald-500" };
    if (s === "matching")
      return { text: "匹配中", color: "text-amber-400", dot: "bg-amber-500" };
    if (s === "gaming")
      return { text: "游戏中", color: "text-blue-400", dot: "bg-blue-500" };
    return { text: status, color: "text-emerald-400", dot: "bg-emerald-500" };
  };

  const getRegionName = (region?: string) => {
    if (!region) return null;
    const map: Record<string, string> = {
      SEA: "东南亚服",
      NA: "北美服",
      EU: "欧服",
      EA: "东亚服",
      SA: "南美服",
    };
    return map[region.toUpperCase()] || region;
  };

  const statusInfo = user
    ? getStatusDisplay(user.state)
    : { text: "", color: "", dot: "" };

  if (isAuthLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-slate-500">
        <Loader2 className="w-8 h-8 animate-spin mb-4" />
        <p className="text-xs font-bold uppercase tracking-widest">
          验证身份中...
        </p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] p-8 text-center relative z-10 animate-in fade-in zoom-in-95 duration-500">
        <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6 border border-white/10">
          <User className="w-12 h-12 text-slate-600" />
        </div>
        <h2 className="text-xl font-bold mb-2 text-white">欢迎来到海希安</h2>
        <p className="text-sm text-slate-400 mb-8 max-w-xs leading-relaxed">
          登录 VGReborn 以同步您的玩家数据，查看排位等级和比赛记录。
        </p>
        <button
          onClick={onOpenLogin}
          className="w-full max-w-xs bg-red-800 py-4 rounded-2xl font-bold shadow-xl shadow-red-900/20 active:scale-95 transition-all text-white"
        >
          立即登录
        </button>
      </div>
    );
  }

  return (
    <div className="p-5 pb-24 relative z-10 animate-in slide-in-from-bottom-4 duration-500">
      <div className="relative glass-panel p-6 rounded-3xl overflow-hidden mb-6 border-red-800/20 shadow-2xl">
        <div className="absolute top-0 right-0 w-32 h-32 bg-red-800/10 blur-3xl -z-10" />

        <div className="flex items-center gap-5 mb-8">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-red-800 to-red-950 flex items-center justify-center text-2xl font-black text-white border-2 border-white/10 rotate-3 shadow-lg shadow-red-900/30">
            {user.name.charAt(0)}
          </div>
          <div>
            <h2 className="text-2xl font-black text-white mb-1 tracking-tight">
              {user.name}
            </h2>
            <div className="flex items-center gap-2">
              {user.region && (
                <span className="px-2 py-0.5 bg-purple-500/20 text-purple-400 text-[10px] font-bold rounded uppercase">
                  {getRegionName(user.region)}
                </span>
              )}
              <span
                className={`flex items-center gap-1 text-[10px] ${statusInfo.color}`}
              >
                <div
                  className={`w-1.5 h-1.5 rounded-full animate-pulse ${statusInfo.dot.replace("bg-", "") === "slate-500" ? "bg-slate-500" : statusInfo.dot}`}
                />
                {statusInfo.text}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 border-t border-white/5 pt-6">
          <div className="text-center">
            <p className="text-[10px] text-slate-500 mb-1 uppercase tracking-widest font-bold">
              信誉等级
            </p>
            <p
              className={`text-xl font-black ${getReputationColor(user.reputation)}`}
            >
              {user.reputation}
            </p>
          </div>
          <div className="text-center border-x border-white/5">
            <p className="text-[10px] text-slate-500 mb-1 uppercase tracking-widest font-bold">
              排位段位
            </p>
            <p className="text-[13px] font-black text-red-500 mt-1">
              {user.rankTier}
            </p>
          </div>
          <div className="text-center">
            <p className="text-[10px] text-slate-500 mb-1 uppercase tracking-widest font-bold">
              行为记录
            </p>
            <p className="text-xl font-black text-slate-100">良好</p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="glass-panel p-4 rounded-xl flex items-center justify-between active:bg-white/5 transition-all cursor-pointer">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-blue-400" />
            <span className="text-sm font-medium text-slate-200">
              MITM 绑定设置
            </span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-500" />
        </div>
        <div className="glass-panel p-4 rounded-xl flex items-center justify-between active:bg-white/5 transition-all cursor-pointer">
          <div className="flex items-center gap-3">
            <Zap className="w-5 h-5 text-amber-400" />
            <span className="text-sm font-medium text-slate-200">
              举报恶意拒绝行为
            </span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-500" />
        </div>
        <button
          onClick={onLogout}
          className="w-full mt-8 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center justify-center gap-2 text-rose-400 font-bold active:bg-rose-500/20 transition-all"
        >
          <LogOut className="w-5 h-5" />
          退出登录
        </button>
      </div>
    </div>
  );
};

export default ProfileTab;
