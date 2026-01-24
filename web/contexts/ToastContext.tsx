import React, { createContext, useContext, useState, ReactNode } from "react";
import { CheckCircle2, AlertCircle, X, Info } from "lucide-react";

export type ToastType = "success" | "error" | "info";

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  toast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

export const ToastProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = (message: string, type: ToastType = "info") => {
    const id = Math.random().toString(36).substring(7);
    const newToast = { id, message, type };
    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      removeToast(id);
    }, 3000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const getIcon = (type: ToastType) => {
    switch (type) {
      case "success":
        return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      case "error":
        return <AlertCircle className="w-4 h-4 text-rose-400" />;
      default:
        return <Info className="w-4 h-4 text-blue-400" />;
    }
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed top-16 left-0 right-0 z-[100] flex flex-col items-center gap-2 pointer-events-none px-4">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="pointer-events-auto bg-[#1a1b26]/90 backdrop-blur-md border border-white/10 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 animate-in slide-in-from-top-2 fade-in duration-300 max-w-sm w-full"
          >
            {getIcon(t.type)}
            <span className="text-sm font-medium flex-1">{t.message}</span>
            <button
              onClick={() => removeToast(t.id)}
              className="p-1 hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-white"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
