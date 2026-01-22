import React, { useState } from "react";
import { X, Send, Loader2 } from "lucide-react";
import { supabase } from "../supabase";
import { Player } from "../types";

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: Player | null;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose, user }) => {
  const [content, setContent] = useState("");
  const [contact, setContact] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !user) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const { error: submitError } = await supabase.from("feedbacks").insert({
        user_id: user.id,
        content: content.trim(),
        contact: contact.trim() || null,
      });

      if (submitError) throw submitError;

      setSuccess(true);
      setTimeout(() => {
        onClose();
        setSuccess(false);
        setContent("");
        setContact("");
      }, 1500);
    } catch (err) {
      console.error("Feedback error:", err);
      setError("提交失败，请稍后重试");
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

        <h2 className="text-2xl font-bold text-center mb-2 text-gradient italic">反馈</h2>
        <p className="text-xs text-slate-400 text-center mb-6">一起改进 VGReborn</p>

        {success ? (
          <div className="py-12 flex flex-col items-center text-center animate-in fade-in zoom-in">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4 border border-white/10">
              <Send className="w-8 h-8 text-emerald-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">感谢您的反馈！</h3>
            <p className="text-sm text-slate-400">我们会认真阅读每一条建议。</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="请详细描述您遇到的问题或建议..."
                className="w-full h-32 bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white placeholder:text-slate-500 focus:ring-2 focus:ring-white/20 outline-none resize-none transition-all"
                disabled={isSubmitting}
              />
              <input
                type="text"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="联系方式（可选）"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 mt-3 text-sm text-white placeholder:text-slate-500 focus:ring-2 focus:ring-white/20 outline-none transition-all"
                disabled={isSubmitting}
              />
              {error && (
                <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[10px] text-center font-bold mt-2">
                  {error}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={!content.trim() || isSubmitting}
              className={`w-full font-black py-3 rounded-xl transition-all border flex items-center justify-center gap-2 tracking-widest uppercase text-sm ${
                !content.trim() || isSubmitting
                  ? "bg-black/50 border-white/5 text-slate-500 cursor-not-allowed"
                  : "bg-black text-white border-white shadow-lg shadow-white/10 active:scale-95 hover:bg-zinc-900"
              }`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  提交中...
                </>
              ) : (
                <>
                  提交反馈
                  <Send className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default FeedbackModal;
