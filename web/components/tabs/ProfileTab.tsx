import React from "react";
import {
  User,
  ShieldCheck,
  Zap,
  ChevronRight,
  LogOut,
  Loader2,
  MessageSquareText,
  Github,
  Edit2,
  Users,
} from "lucide-react";
import { Player } from "../../types";
import { getRegionName, getStatusDisplay } from "../../utils/status";
import FeedbackModal from "../FeedbackModal";
import UpdateHandleModal from "../UpdateHandleModal";
import { DownloadModal } from "../DownloadModal";
import { useToast } from "@/contexts/ToastContext";

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
  const { toast } = useToast();
  const [isFeedbackOpen, setIsFeedbackOpen] = React.useState(false);
  const [isUpdateHandleOpen, setIsUpdateHandleOpen] = React.useState(false);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = React.useState(false);
  const menuItems = [
    {
      icon: ShieldCheck,
      color: "text-blue-400",
      label: "下载WireGuard配置文件",
      onClick: () => setIsDownloadModalOpen(true),
    },
    {
      icon: Users,
      color: "text-indigo-400",
      label: "好友",
      onClick: () => toast("功能开发中..."),
    },
    {
      icon: Zap,
      color: "text-amber-400",
      label: "举报",
      onClick: () => toast("功能开发中..."),
    },
    {
      icon: MessageSquareText,
      color: "text-purple-400",
      label: "反馈",
      onClick: () => setIsFeedbackOpen(true),
    },
    {
      icon: Github,
      color: "text-white",
      label: "开源&协议",
      onClick: () =>
        open("https://github.com/VaingloryReborn/VGReborn/blob/main/LICENSE"),
    },
  ];

  const MenuList = ({ disabled = false }: { disabled?: boolean }) => (
    <div className={`space-y-3`}>
      {menuItems.map((item, index) => (
        <div
          key={index}
          onClick={disabled ? onOpenLogin : item.onClick}
          className="glass-panel p-4 rounded-xl flex items-center justify-between active:bg-white/5 transition-all cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <item.icon className={`w-5 h-5 ${item.color}`} />
            <span className="text-sm font-medium text-slate-200">
              {item.label}
            </span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-500" />
        </div>
      ))}
      {disabled ? (
        <div className="glass-panel p-4 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <LogOut className="w-5 h-5 text-rose-400" />
            <span className="text-sm font-medium text-slate-200">退出登录</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-500" />
        </div>
      ) : (
        <button
          onClick={onLogout}
          className="w-full mt-8 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center justify-center gap-2 text-rose-400 font-bold active:bg-rose-500/20 transition-all"
        >
          <LogOut className="w-5 h-5" />
          退出登录
        </button>
      )}
    </div>
  );

  const getReputationColor = (rep: string) => {
    if (rep === "优") return "text-emerald-400";
    if (rep === "一般") return "text-amber-400";
    return "text-rose-400";
  };

  const statusInfo = user
    ? getStatusDisplay(user)
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
      <div className="p-5 pb-24 relative z-10 animate-in slide-in-from-bottom-4 duration-500">
        <div className="relative glass-panel p-6 rounded-3xl overflow-hidden mb-6 border-red-800/20 shadow-2xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-800/10 blur-3xl -z-10" />

          <div className="flex flex-col items-center justify-center py-4 text-center">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4 border border-white/10">
              <User className="w-8 h-8 text-slate-500" />
            </div>
            <p className="text-sm text-slate-400 mb-6 max-w-xs leading-relaxed">
              欢迎回到海希安
            </p>
            <button
              onClick={onOpenLogin}
              className="px-8 py-3 bg-red-800 rounded-xl font-bold shadow-lg shadow-red-900/20 active:scale-95 transition-all text-white text-sm"
            >
              立即登录
            </button>
          </div>
        </div>

        <MenuList disabled />
      </div>
    );
  }

  return (
    <div className="p-5 pb-24 relative z-10 animate-in slide-in-from-bottom-4 duration-500">
      <div className="relative glass-panel p-6 rounded-3xl overflow-hidden mb-6 border-red-800/20 shadow-2xl">
        <div className="absolute top-0 right-0 w-32 h-32 bg-red-800/10 blur-3xl -z-10" />

        <div className="flex items-center gap-5 mb-8">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-red-800 to-red-950 flex items-center justify-center text-2xl font-black text-white border-2 border-white/10 rotate-3 shadow-lg shadow-red-900/30">
            {user.handle?.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-black text-white mb-1 tracking-tight">
                {user.nickname || user.handle}
              </h2>
              <button
                onClick={() => setIsUpdateHandleOpen(true)}
                className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
              >
                <Edit2 className="w-3 h-3" />
              </button>
            </div>
            <div className="flex items-center gap-2">
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
          <div
            className="text-center"
            onClick={() => {
              toast("功能开发中...");
            }}
          >
            <p className="text-[10px] text-slate-500 mb-1 uppercase tracking-widest font-bold">
              信誉等级
            </p>
            <p
              className={`text-base font-black ${getReputationColor(user.reputation)}`}
            >
              {user.reputation}
            </p>
          </div>
          <div
            className="text-center border-x border-white/5"
            onClick={() => {
              toast("功能开发中...");
            }}
          >
            <p className="text-[10px] text-slate-500 mb-1 uppercase tracking-widest font-bold">
              排位段位
            </p>
            <p className="text-base font-black text-red-500 mt-1">
              {user.rankTier}
            </p>
          </div>
          <div className="text-center">
            <p className="text-[10px] text-slate-500 mb-1 uppercase tracking-widest font-bold">
              服务器
            </p>
            <p className="text-base font-black text-slate-100">
              {getRegionName(user.region) || (
                <span onClick={() => setIsDownloadModalOpen(true)}>未绑定</span>
              )}
            </p>
          </div>
        </div>
      </div>

      <MenuList />
      <FeedbackModal
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
        user={user}
      />
      <UpdateHandleModal
        isOpen={isUpdateHandleOpen}
        onClose={() => setIsUpdateHandleOpen(false)}
        user={user}
      />
      <DownloadModal
        isOpen={isDownloadModalOpen}
        onClose={() => setIsDownloadModalOpen(false)}
      />
    </div>
  );
};

export default ProfileTab;
