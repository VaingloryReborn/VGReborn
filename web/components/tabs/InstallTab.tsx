
import React, { useState } from 'react';
import { Apple, Chrome } from 'lucide-react';

const InstallTab: React.FC = () => {
  const [installPlatform, setInstallPlatform] = useState<'ios' | 'android'>('ios');
  const stepCircleStyle = "w-10 h-10 rounded-xl bg-red-800/10 flex items-center justify-center shrink-0 border border-red-800/20 text-red-500 font-black";

  return (
    <div className="p-5 pb-24 relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gradient italic mb-2">使用指南</h2>
        <div className="flex bg-white/5 p-1 rounded-xl border border-white/5 mb-6">
          <button 
            onClick={() => setInstallPlatform('ios')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all ${installPlatform === 'ios' ? 'bg-red-800 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <Apple className="w-4 h-4" />
            iOS
          </button>
          <button 
            onClick={() => setInstallPlatform('android')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all ${installPlatform === 'android' ? 'bg-red-800 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <Chrome className="w-4 h-4" />
            安卓
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {installPlatform === 'ios' ? (
          <>
            <div className="glass-panel p-5 rounded-2xl border-white/5">
              <div className="flex items-start gap-4">
                <div className={stepCircleStyle}>1</div>
                <div>
                  <h3 className="font-bold text-white mb-1 text-sm">安装游戏</h3>
                  <p className="text-xs text-slate-400">从 App Store 下载安装官方《虚荣》游戏。</p>
                </div>
              </div>
            </div>
            <div className="glass-panel p-5 rounded-2xl border-white/5">
              <div className="flex items-start gap-4">
                <div className={stepCircleStyle}>2</div>
                <div>
                  <h3 className="font-bold text-white mb-1 text-sm">信任描述文件</h3>
                  <p className="text-xs text-slate-400">下载并安装 MITM 证书，在设置中开启“证书信任”。</p>
                </div>
              </div>
            </div>
            <div className="glass-panel p-5 rounded-2xl border-white/5">
              <div className="flex items-start gap-4">
                <div className={stepCircleStyle}>3</div>
                <div>
                  <h3 className="font-bold text-white mb-1 text-sm">开启加速器</h3>
                  <p className="text-xs text-slate-400">连接专用加速器，确保拦截隧道正常建立。</p>
                </div>
              </div>
            </div>
            <div className="glass-panel p-5 rounded-2xl border-white/5">
              <div className="flex items-start gap-4">
                <div className={stepCircleStyle}>4</div>
                <div>
                  <h3 className="font-bold text-white mb-1 text-sm">开始游戏</h3>
                  <p className="text-xs text-slate-400">进入游戏大厅，VGReborn 将自动同步您的状态。</p>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="glass-panel p-5 rounded-2xl border-white/5">
              <div className="flex items-start gap-4">
                <div className={stepCircleStyle}>1</div>
                <div>
                  <h3 className="font-bold text-white mb-1 text-sm">下载游戏</h3>
                  <p className="text-xs text-slate-400">安装指定的《虚荣社区版》客户端。</p>
                </div>
              </div>
            </div>
            <div className="glass-panel p-5 rounded-2xl border-white/5">
              <div className="flex items-start gap-4">
                <div className={stepCircleStyle}>2</div>
                <div>
                  <h3 className="font-bold text-white mb-1 text-sm">开启加速器</h3>
                  <p className="text-xs text-slate-400">授予必要权限，并确保拦截服务处于运行状态。</p>
                </div>
              </div>
            </div>
            <div className="glass-panel p-5 rounded-2xl border-white/5">
              <div className="flex items-start gap-4">
                <div className={stepCircleStyle}>3</div>
                <div>
                  <h3 className="font-bold text-white mb-1 text-sm">开始游戏</h3>
                  <p className="text-xs text-slate-400">进入游戏大厅即可享受增强匹配与实时数据分析。</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default InstallTab;
