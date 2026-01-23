import React, { useEffect, useState } from "react";
import { X, Download, Loader2, Info } from "lucide-react";
import { supabase } from "../supabase";
import servers from "../assets/ea-servers.json";

interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DownloadModal: React.FC<DownloadModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [status, setStatus] = useState<"idle" | "testing" | "completed">(
    "idle",
  );
  const [bestIp, setBestIp] = useState<{ ip: string; duration: number } | null>(
    null,
  );
  const [isDownloading, setIsDownloading] = useState(false);
  const [showLatencyInfo, setShowLatencyInfo] = useState(false);

  useEffect(() => {
    if (isOpen) {
      startSpeedTest();
    } else {
      setStatus("idle");
      setBestIp(null);
      setIsDownloading(false);
    }
  }, [isOpen]);

  const startSpeedTest = async (async = false) => {
    setStatus("testing");

    const validResults: { ip: string; duration: number }[] = [];

    const testServer = async (server: any) => {
      const { ip } = server;
      if (!ip) return null;

      try {
        const start = Date.now();
        // Use WebSocket for speed testing
        await new Promise<void>((resolve, reject) => {
          const ws = new WebSocket(`ws://${ip}`);
          const timeoutId = setTimeout(() => {
            ws.close();
            reject(new Error("Timeout"));
          }, 3000);

          ws.onopen = () => {
            ws.send("ping");
          };

          ws.onmessage = () => {
            clearTimeout(timeoutId);
            ws.close();
            resolve();
          };

          ws.onerror = (e) => {
            clearTimeout(timeoutId);
            reject(e);
          };
        });

        const duration = (Date.now() - start) / 2;
        return { ip, duration };
      } catch (e) {
        return null;
      }
    };

    if (async) {
      // 并发测试
      const promises = servers.filter((s) => !s.oversea).map(testServer);
      const settled = await Promise.all(promises);
      settled.forEach((r) => {
        if (r) validResults.push(r);
      });
    } else {
      // 串行测试
      for (const server of servers.filter((s) => !s.oversea)) {
        const result = await testServer(server);
        if (result) {
          validResults.push(result);
        }
      }
    }

    if (validResults.length > 0) {
      validResults.sort((a, b) => a.duration - b.duration);
      const best = validResults[0];
      setBestIp(best);
      console.log("Speed test results:", validResults);
      console.log("Best IP:", best.ip, best.duration + "ms");
    }
    setStatus("completed");
  };

  const handleDownloadClick = async () => {
    if (!bestIp) return;
    setIsDownloading(true);
    try {
      console.log("Requesting config for IP:", bestIp);
      const { data, error } = await supabase.functions.invoke<{
        userId: string;
        publicKey: string;
        address: string;
        clientConf: string;
      }>("create-wg-config", {
        body: { ip: bestIp },
      });

      console.log("create-wg-config response:", data);

      if (error) {
        throw error;
      }

      // 假设返回的是配置文件内容文本
      // 如果是JSON包装的，请根据实际情况调整
      const content = data.clientConf;
      const blob = new Blob([content], { type: "text/plain" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "vgreborn-wireguard.conf";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      onClose();
    } catch (err: any) {
      console.error("Download error:", err);
      alert("下载失败: " + (err.message || "未知错误"));
    } finally {
      setIsDownloading(false);
    }
  };

  const getLatencyColor = (latency: number) => {
    if (latency < 50) return "text-green-400";
    if (latency < 120) return "text-slate-300";
    if (latency < 200) return "text-slate-300";
    return "text-yellow-400";
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-[#1a1b26] border border-white/10 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-4 border-b border-white/5">
          <h3 className="text-lg font-bold text-white">下载</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {showLatencyInfo ? (
            <div className="space-y-4 animate-in fade-in slide-in-from-right duration-200">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-white">延迟说明</h4>
                <button
                  onClick={() => setShowLatencyInfo(false)}
                  className="text-xs text-blue-400 hover:text-blue-300"
                >
                  返回
                </button>
              </div>
              <div className="space-y-3 text-sm">
                <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                  <div className="font-medium text-green-400 mb-1">
                    极佳体验（0-50ms）
                  </div>
                  <div className="text-slate-300 text-xs leading-relaxed">
                    操作近乎实时，理想状态
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-slate-500/10 border border-slate-500/20">
                  <div className="font-medium text-slate-300 mb-1">
                    正常水平（50-120ms）
                  </div>
                  <div className="text-slate-300 text-xs leading-relaxed">
                    多数玩家的常态
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-slate-500/10 border border-slate-500/20">
                  <div className="font-medium text-slate-300 mb-1">
                    轻微延迟（120-200ms）
                  </div>
                  <div className="text-slate-300 text-xs leading-relaxed">
                    轻微延迟感，但通过预判仍可正常对线和参与团战
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                  <div className="font-medium text-yellow-400 mb-1">
                    无法忍受（200ms以上）
                  </div>
                  <div className="text-slate-300 text-xs leading-relaxed">
                    无法进行有效对局
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm p-4 rounded-xl bg-white/5 border border-white/5">
                  <span className="text-slate-400">配置</span>
                  <div className="flex items-center gap-2">
                    <span
                      className={
                        status === "completed"
                          ? `${getLatencyColor(
                              bestIp?.duration || 0,
                            )} font-medium`
                          : "text-blue-400 font-medium animate-pulse"
                      }
                    >
                      {status === "testing"
                        ? "正在匹配低延迟节点..."
                        : `匹配成功(≈${bestIp?.duration}ms)`}
                    </span>
                    {status === "completed" && (
                      <button
                        onClick={() => setShowLatencyInfo(true)}
                        className="text-slate-400 hover:text-white transition-colors"
                      >
                        <Info className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleDownloadClick}
                  disabled={isDownloading || !bestIp}
                  className="w-full py-3 px-4 bg-red-600 hover:bg-red-500 disabled:bg-red-600/50 disabled:cursor-not-allowed text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-red-900/20 disabled:!opacity-30"
                >
                  下载配置文件
                </button>
                <p className="text-xs text-slate-500 text-center mt-3 px-2">
                  目前仅支持东亚服
                </p>
                <p className="text-xs text-slate-500 text-center mt-3 px-2">
                  请勿修改配置内容，以免造成无法使用
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
