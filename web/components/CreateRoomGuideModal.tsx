import React from "react";
import ReactDOM from "react-dom";
import { X, Lock, Globe, FileCode, Swords, Users, Plus } from "lucide-react";
import { useTranslation, Trans } from "react-i18next";

interface CreateRoomGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateRoomGuideModal: React.FC<CreateRoomGuideModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { t } = useTranslation();
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
            {t("createRoom.title")}
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
          <p className="text-sm text-slate-400 leading-relaxed whitespace-pre-line">
            {t("createRoom.desc")}
          </p>

          <div className="bg-white/5 rounded-xl p-4 border border-white/5 relative overflow-hidden group transition-all">
            <div className="absolute top-0 right-0 p-2 opacity-10 transition-opacity">
              <Globe className="w-24 h-24 text-emerald-500" />
            </div>
            <div className="relative z-10">
              <h3 className="font-bold text-emerald-400 mb-2 flex items-center gap-2 text-sm">
                <Globe className="w-4 h-4" />
                {t("createRoom.public.title")}
              </h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs">
                  <span className="bg-black/40 px-2 py-1 rounded text-emerald-300 font-mono border border-emerald-500/20">
                    1_NAME
                  </span>
                  <span className="text-emerald-300">{t("createRoom.public.rule")}</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed whitespace-pre-line">
                  {t("createRoom.public.desc")}
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
                {t("createRoom.private.title")}
              </h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs">
                  <span className="bg-black/40 px-2 py-1 rounded text-purple-300 font-mono border border-purple-500/20">
                    3001_NAME
                  </span>
                  <span className="text-purple-300">{t("createRoom.private.rule")}</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {t("createRoom.private.desc")}
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
                {t("createRoom.team.title")}
              </h3>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs">
                  <span className="bg-black/40 px-2 py-1 rounded text-blue-300 font-mono border border-blue-500/20">
                    3001-1_NAME
                  </span>
                  <span className="text-blue-300">{t("createRoom.team.teamA")}</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="bg-black/40 px-2 py-1 rounded text-blue-300 font-mono border border-blue-500/20">
                    3001-2_NAME
                  </span>
                  <span className="text-blue-300">{t("createRoom.team.teamB")}</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed mt-2">
                  <Trans
                    i18nKey="createRoom.team.desc"
                    components={{
                      1: <span className="text-blue-300 font-mono" />,
                      3: <span className="text-blue-300 font-mono" />,
                    }}
                  />
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
