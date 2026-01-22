import React, { useState, useEffect } from "react";
import { X, Save, Loader2 } from "lucide-react";
import { supabase } from "../supabase";
import { Player } from "../types";

interface UpdateHandleModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: Player | null;
}

const UpdateHandleModal: React.FC<UpdateHandleModalProps> = ({
  isOpen,
  onClose,
  user,
}) => {
  const [handle, setHandle] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && user) {
      setHandle(user.handle || "");
      setError(null);
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!handle.trim() || !user) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ nickname: handle.trim() })
        .eq("id", user.id);

      if (updateError) throw updateError;

      onClose();
    } catch (err: any) {
      console.error("Update handle error:", err);
      setError(err.message || "更新失败，请稍后重试");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md glass-panel rounded-2xl p-6 relative shadow-2xl animate-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-2xl font-bold text-center mb-2 text-gradient italic">
          修改昵称
        </h2>
        <p className="text-xs text-slate-400 text-center mb-6">
          {/* 设置您在 VGReborn 的显示名称 */}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type="text"
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
              placeholder="请输入新的昵称"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:ring-2 focus:ring-white/20 outline-none transition-all"
              disabled={isSubmitting}
              maxLength={20}
            />
            {error && (
              <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[10px] text-center font-bold mt-2">
                {error}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={!handle.trim() || isSubmitting || handle === user?.handle}
            className={`w-full font-black py-3 rounded-xl transition-all border flex items-center justify-center gap-2 tracking-widest uppercase text-sm ${
              !handle.trim() || isSubmitting || handle === user?.handle
                ? "bg-black/50 border-white/5 text-slate-500 cursor-not-allowed"
                : "bg-black text-white border-white shadow-lg shadow-white/10 active:scale-95 hover:bg-zinc-900"
            }`}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                保存中...
              </>
            ) : (
              <>
                保存修改
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateHandleModal;
