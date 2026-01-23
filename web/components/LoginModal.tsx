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
      setError("请先阅读并同意服务协议");
      return;
    }
    if (!email || !email.includes("@")) {
      setError("请输入有效的电子邮箱");
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
      setError(err.message || "发送失败，请稍后重试");
    } finally {
      setLoadingCode(false);
    }
  };

  const handleLoginSubmit = async () => {
    if (!isAgreed) {
      setError("请先阅读并同意服务协议");
      return;
    }
    if (!email || !code) {
      setError("请完整填写邮箱和验证码");
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
      setError(err.message || "登录失败，请检查验证码是否正确");
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
            VGReborn 登录
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
                placeholder="请输入电子邮箱"
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
                  placeholder="验证码"
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
                    "获取验证码"
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
                  我已阅读并同意
                  <button
                    onClick={openAgreement}
                    className="text-slate-200 underline decoration-red-900 underline-offset-4 mx-1 hover:text-white transition-colors cursor-pointer"
                  >
                    VGReborn 服务协议
                  </button>
                  。授权平台捕获游戏状态数据以实现自动绑定与匹配功能。
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
              {loadingLogin ? "验证中..." : "登录"}
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
                  VGReborn 服务协议
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
              <section>
                <h4 className="font-bold text-slate-200 mb-2 uppercase tracking-widest">
                  1. 服务概述
                </h4>
                <p>
                  VGReborn 是针对《虚荣社区版 (Vainglory
                  CE)》开发的第三方匹配增强平台。本平台旨在通过技术手段提升玩家的联机匹配体验。
                </p>
              </section>
              <section>
                <h4 className="font-bold text-slate-200 mb-2 uppercase tracking-widest">
                  2. MITM 技术说明与授权
                </h4>
                <p>
                  为实现玩家 ID
                  自动识别、战绩统计、房间状态实时捕获等核心功能，VGReborn
                  需使用加速器配合
                  MITM（中间人攻击）代理技术。用户点击“同意”即表示明确授权平台拦截并读取游戏客户端与服务器之间的特定加密封包。
                </p>
              </section>
              <section>
                <h4 className="font-bold text-slate-200 mb-2 uppercase tracking-widest">
                  3. 数据收集与隐私
                </h4>
                <p>
                  平台仅收集与游戏匹配相关的必要数据，包括但不限于：玩家
                  ID、排位分数、当前游戏状态（匹配中、游戏中、接受/拒绝比赛）。我们承诺不会收集您的设备私有敏感信息或与本服务无关的其他网络流量。
                </p>
              </section>
              <section>
                <h4 className="font-bold text-slate-200 mb-2 uppercase tracking-widest">
                  4. 用户行为规范
                </h4>
                <p>
                  用户需遵守公平竞争原则。任何针对平台系统的恶意攻击、数据篡改或在匹配过程中频繁恶意拒绝比赛、不友好的的行为，平台有权对其账号实施封禁或降权处理。
                </p>
              </section>
              <section>
                <h4 className="font-bold text-slate-200 mb-2 uppercase tracking-widest">
                  5. 免责声明
                </h4>
                <p>
                  本平台为第三方非官方服务，与 Superevil Megacorp
                  无关联。因使用本平台技术手段可能导致的任何游戏账号异常、设备安全风险
                  or 连接不稳定问题，由用户自行承担。
                </p>
              </section>
            </div>

            <button
              onClick={() => {
                setShowAgreementDetail(false);
                setIsAgreed(true);
              }}
              className="w-full mt-6 py-4 bg-red-800 rounded-2xl font-black text-white hover:bg-red-700 transition-colors shadow-lg shadow-red-900/20"
            >
              我已阅读并同意
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default LoginModal;
