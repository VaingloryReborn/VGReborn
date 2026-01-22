import React, { useEffect, useState } from "react";
import { X, Download, Loader2 } from "lucide-react";
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
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000); // 3s timeout

        await fetch(`http://${ip}`, {
          method: "HEAD",
          signal: controller.signal,
          mode: "cors", // 确保使用了CORS
        });

        clearTimeout(timeoutId);
        const duration = Date.now() - start + (server.oversea ? 10000 : 0);
        return { ip, duration };
      } catch (e) {
        return null;
      }
    };

    if (async) {
      // 并发测试
      const promises = servers.map(testServer);
      const settled = await Promise.all(promises);
      settled.forEach((r) => {
        if (r) validResults.push(r);
      });
    } else {
      // 串行测试
      for (const server of servers) {
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
      const { data, error } = await supabase.functions.invoke(
        "create-wg-config",
        {
          body: { ip: bestIp },
        },
      );

      console.log("create-wg-config response:", data);

      if (error) {
        throw error;
      }

      // 假设返回的是配置文件内容文本
      // 如果是JSON包装的，请根据实际情况调整
      const content = typeof data === "object" ? JSON.stringify(data) : data;

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
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm p-4 rounded-xl bg-white/5 border border-white/5">
              <span className="text-slate-400">状态</span>
              <span
                className={
                  status === "completed"
                    ? "text-green-400 font-medium"
                    : "text-blue-400 font-medium animate-pulse"
                }
              >
                {status === "testing"
                  ? "正在匹配低延迟节点..."
                  : `匹配成功(≈${bestIp?.duration}ms)`}
              </span>
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
              请勿修改配置内容，以免造成无法使用VGReborn
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
