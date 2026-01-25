import React, { useState } from "react";
import { Apple, Chrome } from "lucide-react";
import { useTranslation, Trans } from "react-i18next";

import { useAuth } from "../../contexts/AuthContext";
import { DownloadModal } from "../DownloadModal";

interface InstallTabProps {
  onOpenLogin: () => void;
}

const InstallTab: React.FC<InstallTabProps> = ({ onOpenLogin }) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [installPlatform, setInstallPlatform] = useState<"ios" | "android">(
    "ios",
  );
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);

  const handleDownload = (e: React.MouseEvent<HTMLAnchorElement | HTMLSpanElement>) => {
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
          {t("guide.title")}
        </h2>
        <div className="flex bg-white/5 p-1 rounded-xl border border-white/5 mb-6">
          <button
            onClick={() => setInstallPlatform("ios")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all ${installPlatform === "ios" ? "bg-red-800 text-white shadow-lg" : "text-slate-500 hover:text-slate-300"}`}
          >
            <Apple className="w-4 h-4" />
            {t("guide.ios")}
          </button>
          <button
            onClick={() => setInstallPlatform("android")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all ${installPlatform === "android" ? "bg-red-800 text-white shadow-lg" : "text-slate-500 hover:text-slate-300"}`}
          >
            <Chrome className="w-4 h-4" />
            {t("guide.android")}
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
                    {t("guide.steps.installGame.title")}
                  </h3>
                  <p className="text-sm text-slate-400">
                    {t("guide.steps.installGame.desc")}
                  </p>
                </div>
              </div>
            </div>
            <div className="glass-panel p-5 rounded-2xl border-white/5">
              <div className="flex items-start gap-4">
                <div className={stepCircleStyle}>2</div>
                <div>
                  <h3 className="font-bold text-white mb-1 text-sm">
                    {t("guide.steps.installCert.title")}
                  </h3>
                  <ol className="list-decimal list-outside pl-4 space-y-1.5 text-sm text-slate-400 marker:text-slate-500">
                    <li>
                      <Trans i18nKey="guide.steps.installCert.desc1">
                        Use Safari to
                        <a
                          href='/certificates/mitmproxy-ca-cert.pem'
                          download
                          className="underline text-red-500 mx-1"
                        >
                          Download MITM Certificate
                        </a>
                      </Trans>
                    </li>
                    <li>
                      {t("guide.steps.installCert.desc2")}
                    </li>
                    <li>
                      {t("guide.steps.installCert.desc3")}
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
                    {t("guide.steps.installVpn.title")}
                  </h3>
                  <ol className="list-decimal list-outside pl-4 space-y-1.5 text-sm text-slate-400 marker:text-slate-500">
                    <li>
                      {t("guide.steps.installVpn.desc1")}
                    </li>
                    <li>
                      <Trans i18nKey="guide.steps.installVpn.desc2">
                        <span
                          onClick={handleDownload}
                          className="underline text-red-500 mx-1 cursor-pointer"
                        >
                          Download WireGuard Config
                        </span>
                        (This is your identity token)
                      </Trans>
                    </li>
                    <li>
                      {t("guide.steps.installVpn.desc3")}
                    </li>
                    <li>
                      {t("guide.steps.installVpn.desc4")}
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
                    {t("guide.steps.startGame.title")}
                  </h3>
                  <p className="text-sm text-slate-400">
                    {t("guide.steps.startGame.desc")}
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
                    {t("guide.steps.downloadGame.title")}
                  </h3>
                  <ol className="list-decimal list-outside pl-4 space-y-1.5 text-sm text-slate-400 marker:text-slate-500">
                    <li>
                      <Trans i18nKey="guide.steps.downloadGame.desc1">
                        Download MITM-patched
                        <a
                          href="https://vgreborn.oss-cn-shenzhen.aliyuncs.com/output_patched.xapk"
                          download
                          className="underline text-red-500 mx-1 cursor-pointer"
                        >
                          Vainglory XAPK
                        </a>
                      </Trans>
                    </li>
                    <li>
                      {t("guide.steps.downloadGame.desc2")}
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
                    {t("guide.steps.installVpn.title")}
                  </h3>
                  <ol className="list-decimal list-outside pl-4 space-y-1.5 text-sm text-slate-400 marker:text-slate-500">
                    <li>
                      {t("guide.steps.installVpn.desc1")}
                    </li>
                    <li>
                      <Trans i18nKey="guide.steps.installVpn.desc2">
                        <span
                          onClick={handleDownload}
                          className="underline text-red-500 mx-1 cursor-pointer"
                        >
                          Download WireGuard Config
                        </span>
                        (This is your identity token)
                      </Trans>
                    </li>
                    <li>
                      {t("guide.steps.installVpn.desc3")}
                    </li>
                    <li>
                      {t("guide.steps.installVpn.desc4")}
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
                    {t("guide.steps.startGame.title")}
                  </h3>
                  <p className="text-sm text-slate-400">
                    {t("guide.steps.startGame.desc")}
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
