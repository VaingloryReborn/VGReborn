import React, { useState, useEffect } from "react";
import {
  X,
  Mail,
  Key,
  Info,
  CheckCircle2,
  Circle,
  Loader2,
} from "lucide-react";
import { useTranslation, Trans } from "react-i18next";
import { supabase } from "../supabase";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (email: string) => void;
}

const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLogin,
}) => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [isAgreed, setIsAgreed] = useState(false);
  const [showAgreementDetail, setShowAgreementDetail] = useState(false);

  const [loadingCode, setLoadingCode] = useState(false);
  const [loadingLogin, setLoadingLogin] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Reset form when modal closes or opens
  useEffect(() => {
    if (!isOpen) {
      setEmail("");
      setCode("");
      setIsAgreed(false);
      setError(null);
      setCooldown(0);
      setLoadingCode(false);
      setLoadingLogin(false);
      setShowAgreementDetail(false);
    }
  }, [isOpen]);

  useEffect(() => {
    let timer: number;
    if (cooldown > 0) {
      timer = window.setInterval(() => {
        setCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleToggleAgreed = (e: React.MouseEvent) => {
    const nextAgreed = !isAgreed;
    setIsAgreed(nextAgreed);
    if (nextAgreed) {
      setShowAgreementDetail(true);
    }
  };

  const openAgreement = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowAgreementDetail(true);
  };

  const handleSendCode = async () => {
    if (!isAgreed) {
      setError(t("login.error.agree"));
      return;
    }
    if (!email || !email.includes("@")) {
      setError(t("login.error.email"));
      return;
    }
    setError(null);
    setLoadingCode(true);

    try {
      const { error: otpError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: true,
        },
      });

      if (otpError) throw otpError;

      setCooldown(60);
      console.log("Verification code sent to:", email);
    } catch (err: any) {
      setError(err.message || t("login.error.sendFailed"));
    } finally {
      setLoadingCode(false);
    }
  };

  const handleLoginSubmit = async () => {
    if (!isAgreed) {
      setError(t("login.error.agree"));
      return;
    }
    if (!email || !code) {
      setError(t("login.error.incomplete"));
      return;
    }

    setError(null);
    setLoadingLogin(true);

    try {
      const { error: verifyError } = await supabase.auth.verifyOtp({
        email,
        token: code,
        type: "email",
      });

      if (verifyError) throw verifyError;

      onLogin(email);
    } catch (err: any) {
      setError(err.message || t("login.error.loginFailed"));
    } finally {
      setLoadingLogin(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <div className="w-full max-w-md glass-panel rounded-2xl p-6 relative animate-in fade-in zoom-in duration-300 shadow-2xl">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <h2 className="text-2xl font-bold text-center mb-6 text-gradient italic">
            {t("login.title")}
          </h2>

          <div className="space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[10px] text-center font-bold">
                {error}
              </div>
            )}

            <div className="relative">
              <Mail className="absolute left-3 top-3.5 w-5 h-5 text-slate-500" />
              <input
                type="email"
                placeholder={t("login.emailPlaceholder")}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 focus:ring-2 focus:ring-red-900 outline-none transition-all text-white text-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="relative">
              <Key className="absolute left-3 top-3.5 w-5 h-5 text-slate-500" />
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder={t("login.codePlaceholder")}
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 focus:ring-2 focus:ring-red-900 outline-none transition-all text-white text-sm"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                />
                <button
                  onClick={handleSendCode}
                  disabled={loadingCode || cooldown > 0}
                  className={`px-4 py-3 rounded-xl text-[10px] font-black whitespace-nowrap min-w-[100px] flex items-center justify-center transition-all ${
                    loadingCode || cooldown > 0
                      ? "bg-white/5 text-slate-600 cursor-not-allowed"
                      : "bg-white/10 text-white active:bg-white/20 hover:bg-white/15"
                  }`}
                >
                  {loadingCode ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : cooldown > 0 ? (
                    `${cooldown}s`
                  ) : (
                    t("login.getCode")
                  )}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <div className="flex items-start gap-3">
                <div
                  onClick={handleToggleAgreed}
                  className="shrink-0 mt-0.5 cursor-pointer"
                >
                  {isAgreed ? (
                    <CheckCircle2 className="w-5 h-5 text-red-600 animate-in zoom-in duration-200" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-600 hover:text-slate-400 transition-colors" />
                  )}
                </div>
                <div className="text-[10px] text-slate-400 leading-relaxed select-none">
                  {t("login.agree")}
                  <button
                    onClick={openAgreement}
                    className="text-slate-200 underline decoration-red-900 underline-offset-4 mx-1 hover:text-white transition-colors cursor-pointer"
                  >
                    {t("login.terms")}
                  </button>
                  。{t("login.authDesc")}
                </div>
              </div>
            </div>

            <button
              disabled={loadingLogin}
              onClick={handleLoginSubmit}
              className={`w-full font-black py-4 rounded-xl transition-all mt-2 border flex items-center justify-center gap-2 tracking-widest uppercase text-sm ${
                loadingLogin
                  ? "bg-black border-white/10 text-slate-500 cursor-not-allowed"
                  : "bg-black text-white border-white shadow-lg shadow-white/10 active:scale-95 hover:bg-zinc-900"
              }`}
            >
              {loadingLogin && <Loader2 className="w-4 h-4 animate-spin" />}
              {loadingLogin ? t("login.verifying") : t("login.submit")}
            </button>
          </div>
        </div>
      </div>

      {/* Agreement Detail Modal */}
      {showAgreementDetail && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/95 animate-in fade-in duration-300">
          <div className="w-full max-w-lg bg-[#0f111a] border border-white/10 rounded-3xl p-6 overflow-hidden flex flex-col max-h-[80vh]">
            <div className="flex justify-between items-center mb-6 shrink-0">
              <div className="flex items-center gap-2">
                <Info className="w-5 h-5 text-red-600" />
                <h3 className="text-xl font-bold text-white">
                  {t("terms.title")}
                </h3>
              </div>
              <button
                onClick={() => setShowAgreementDetail(false)}
                className="p-2 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 text-[13px] text-slate-400 space-y-4 leading-relaxed custom-scrollbar">
              {[1, 2, 3, 4, 5].map((i) => (
                <section key={i}>
                  <h4 className="font-bold text-slate-200 mb-2 uppercase tracking-widest">
                    {t(`terms.sections.${i}.title`)}
                  </h4>
                  <p>{t(`terms.sections.${i}.content`)}</p>
                </section>
              ))}
            </div>

            <button
              onClick={() => {
                setShowAgreementDetail(false);
                setIsAgreed(true);
              }}
              className="w-full mt-6 py-4 bg-red-800 rounded-2xl font-black text-white hover:bg-red-700 transition-colors shadow-lg shadow-red-900/20"
            >
              {t("terms.readAndAgree")}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default LoginModal;
