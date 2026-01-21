import React from "react";
import ReactDOM from "react-dom";
import { X, Lock, Globe, FileCode, Swords, Users, Plus } from "lucide-react";

interface CreateRoomGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateRoomGuideModal: React.FC<CreateRoomGuideModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-sm bg-[#0f111a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/5 bg-white/5">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Plus className="w-5 h-5 text-amber-500" />
            如何创建房间
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-6 max-h-[80vh] overflow-auto">
          <p className="text-sm text-slate-400 leading-relaxed">
            匹配机制基于玩家名称的前缀代码，在游戏中更改名称后VGReborn将自动同步到房间列表。
            <br />
            代码规则如下：
          </p>

          <div className="bg-white/5 rounded-xl p-4 border border-white/5 relative overflow-hidden group transition-all">
            <div className="absolute top-0 right-0 p-2 opacity-10 transition-opacity">
              <Globe className="w-24 h-24 text-emerald-500" />
            </div>
            <div className="relative z-10">
              <h3 className="font-bold text-emerald-400 mb-2 flex items-center gap-2 text-sm">
                <Globe className="w-4 h-4" />
                公开房间
              </h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs">
                  <span className="bg-black/40 px-2 py-1 rounded text-emerald-300 font-mono border border-emerald-500/20">
                    1_你的名字
                  </span>
                  <span className="text-slate-500">代码 &lt; 3000</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  代码表示你的段位，虚荣会优先匹配段位相近的玩家。不保证一定在同一局，适合路人匹配。
                  <br />
                  1600+为征召模式，如不指定代码，默认为1200。
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/5 rounded-xl p-4 border border-white/5 relative overflow-hidden group transition-all">
            <div className="absolute top-0 right-0 p-2 opacity-10 transition-opacity">
              <Lock className="w-24 h-24 text-purple-500" />
            </div>
            <div className="relative z-10">
              <h3 className="font-bold text-purple-400 mb-2 flex items-center gap-2 text-sm">
                <Lock className="w-4 h-4" />
                私人房间
              </h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs">
                  <span className="bg-black/40 px-2 py-1 rounded text-purple-300 font-mono border border-purple-500/20">
                    3001_你的名字
                  </span>
                  <span className="text-slate-500">代码 &gt; 3000</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  只有相同代码的玩家才能匹配到一起。必须集齐所有玩家才能开始游戏。
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/5 rounded-xl p-4 border border-white/5 relative overflow-hidden group transition-all">
            <div className="absolute top-0 right-0 p-2 opacity-10 transition-opacity">
              <Swords className="w-24 h-24 text-blue-500" />
            </div>
            <div className="relative z-10">
              <h3 className="font-bold text-blue-400 mb-2 flex items-center gap-2 text-sm">
                <Swords className="w-4 h-4" />
                代码分队
              </h3>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs">
                  <span className="bg-black/40 px-2 py-1 rounded text-blue-300 font-mono border border-blue-500/20">
                    3001-1_名字
                  </span>
                  <span className="text-slate-500">指定分到 A 队</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="bg-black/40 px-2 py-1 rounded text-blue-300 font-mono border border-blue-500/20">
                    3001-2_名字
                  </span>
                  <span className="text-slate-500">指定分到 B 队</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed mt-2">
                  在代码后添加{" "}
                  <span className="text-blue-300 font-mono">-1</span> 或{" "}
                  <span className="text-blue-300 font-mono">-2</span>{" "}
                  可指定队伍。
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default CreateRoomGuideModal;
