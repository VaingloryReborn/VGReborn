import React, { useState } from "react";
import { Apple, Chrome } from "lucide-react";
import mitmCert from '../../assets/certificates/mitmproxy-ca-cert.pem?url';

import { useAuth } from "../../contexts/AuthContext";
import { DownloadModal } from "../DownloadModal";

interface InstallTabProps {
  onOpenLogin: () => void;
}

const InstallTab: React.FC<InstallTabProps> = ({ onOpenLogin }) => {
  const { user } = useAuth();
  const [installPlatform, setInstallPlatform] = useState<"ios" | "android">(
    "ios",
  );
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);

  const handleDownload = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (!user) {
      onOpenLogin();
    } else {
      setIsDownloadModalOpen(true);
    }
  };
  const stepCircleStyle =
    "w-10 h-10 rounded-xl bg-red-800/10 flex items-center justify-center shrink-0 border border-red-800/20 text-red-500 font-black";

  return (
    <div className="p-5 pb-24 relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gradient italic mb-2">
          使用指南
        </h2>
        <div className="flex bg-white/5 p-1 rounded-xl border border-white/5 mb-6">
          <button
            onClick={() => setInstallPlatform("ios")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all ${installPlatform === "ios" ? "bg-red-800 text-white shadow-lg" : "text-slate-500 hover:text-slate-300"}`}
          >
            <Apple className="w-4 h-4" />
            iOS
          </button>
          <button
            onClick={() => setInstallPlatform("android")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all ${installPlatform === "android" ? "bg-red-800 text-white shadow-lg" : "text-slate-500 hover:text-slate-300"}`}
          >
            <Chrome className="w-4 h-4" />
            安卓
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {installPlatform === "ios" ? (
          <>
            <div className="glass-panel p-5 rounded-2xl border-white/5">
              <div className="flex items-start gap-4">
                <div className={stepCircleStyle}>1</div>
                <div>
                  <h3 className="font-bold text-white mb-1 text-sm">
                    安装游戏
                  </h3>
                  <p className="text-xs text-slate-400">
                    从 App Store 下载安装官方《虚荣》游戏。
                  </p>
                </div>
              </div>
            </div>
            <div className="glass-panel p-5 rounded-2xl border-white/5">
              <div className="flex items-start gap-4">
                <div className={stepCircleStyle}>2</div>
                <div>
                  <h3 className="font-bold text-white mb-1 text-sm">
                    安装并信任证书
                  </h3>
                  <ol className="list-decimal list-outside pl-4 space-y-1.5 text-xs text-slate-400 marker:text-slate-500">
                    <li>
                      使用Safari浏览器
                      <a
                        href={mitmCert}
                        download
                        className="underline text-red-500 mx-1"
                      >
                        下载MITM证书
                      </a>
                    </li>
                    <li>
                      进入系统设置，搜索"描述文件"进入配置管理，安装刚才下载的mitmproxy证书
                    </li>
                    <li>
                      进入系统设置-通用-关于本机-证书信任设置，开启mitmproxy证书的信任
                    </li>
                  </ol>
                </div>
              </div>
            </div>
            <div className="glass-panel p-5 rounded-2xl border-white/5">
              <div className="flex items-start gap-4">
                <div className={stepCircleStyle}>3</div>
                <div>
                  <h3 className="font-bold text-white mb-1 text-sm">
                    安装加速器
                  </h3>
                  <ol className="list-decimal list-outside pl-4 space-y-1.5 text-xs text-slate-400 marker:text-slate-500">
                    <li>
                      目前没有App版的VGReborn一键加速，只能使用WireGuard进入加速隧道，在AppStore下载WireGuard
                    </li>
                    <li>
                      这是你的账号进入加速隧道的通行证：
                      <span
                        onClick={handleDownload}
                        className="underline text-red-500 mx-1 cursor-pointer"
                      >
                        下载WireGuard配置文件
                      </span>
                    </li>
                    <li>
                      打开WireGuard，点击右上角添加配置，导入刚才下载的配置文件
                    </li>
                    <li>
                      点击开关即可进入/退出加速隧道。(只有虚荣游戏内的流量才会走加速通道)
                    </li>
                  </ol>
                </div>
              </div>
            </div>
            <div className="glass-panel p-5 rounded-2xl border-white/5">
              <div className="flex items-start gap-4">
                <div className={stepCircleStyle}>4</div>
                <div>
                  <h3 className="font-bold text-white mb-1 text-sm">
                    开始游戏
                  </h3>
                  <p className="text-xs text-slate-400">
                    你已成功加入VGReborn，进入游戏VGReborn将自动同步你的游戏状态。
                  </p>
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
                  <h3 className="font-bold text-white mb-1 text-sm">
                    下载游戏
                  </h3>
                  <ol className="list-decimal list-outside pl-4 space-y-1.5 text-xs text-slate-400 marker:text-slate-500">
                    <li>
                      下载支持MITM的
                      <a
                        href="https://vgreborn.oss-cn-shenzhen.aliyuncs.com/output_patched.xapk"
                        download
                        className="underline text-red-500 mx-1 cursor-pointer"
                      >
                        虚荣游戏安装包(xapk)
                      </a>
                    </li>
                    <li>
                      你可以使用APKPure或XAPKS
                      Installer等应用打开下载的安装包进行安装
                    </li>
                  </ol>
                </div>
              </div>
            </div>

            <div className="glass-panel p-5 rounded-2xl border-white/5">
              <div className="flex items-start gap-4">
                <div className={stepCircleStyle}>2</div>
                <div>
                  <h3 className="font-bold text-white mb-1 text-sm">
                    安装加速器
                  </h3>
                  <ol className="list-decimal list-outside pl-4 space-y-1.5 text-xs text-slate-400 marker:text-slate-500">
                    <li>
                      目前没有App版的VGReborn一键加速，只能使用WireGuard进入加速隧道，在Google
                      Play或APKPure等平台下载WireGuard
                    </li>
                    <li>
                      这是你的账号进入加速隧道的通行证：
                      <span
                        onClick={handleDownload}
                        className="underline text-red-500 mx-1 cursor-pointer"
                      >
                        下载WireGuard配置文件
                      </span>
                    </li>
                    <li>
                      打开WireGuard，点击右上角添加配置，导入刚才下载的配置文件
                    </li>
                    <li>
                      点击开关即可进入/退出加速隧道。(只有虚荣游戏内的流量才会走加速通道)
                    </li>
                  </ol>
                </div>
              </div>
            </div>

            <div className="glass-panel p-5 rounded-2xl border-white/5">
              <div className="flex items-start gap-4">
                <div className={stepCircleStyle}>3</div>
                <div>
                  <h3 className="font-bold text-white mb-1 text-sm">
                    开始游戏
                  </h3>
                  <p className="text-xs text-slate-400">
                    你已成功加入VGReborn，进入游戏VGReborn将自动同步你的游戏状态。
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <DownloadModal 
        isOpen={isDownloadModalOpen} 
        onClose={() => setIsDownloadModalOpen(false)} 
      />
    </div>
  );
};

export default InstallTab;
