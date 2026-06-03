"use client";

import { useToastStore } from "@/store/toastStore";
import { X } from "lucide-react";

export default function Toaster() {
  const { toasts, removeToast } = useToastStore();

  return (
    <div className="fixed right-4 top-4 z-50 flex max-w-xs flex-col gap-3">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`rounded-3xl border px-4 py-3 shadow-xl ring-1 ring-slate-200 transition ${
            toast.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-900"
              : toast.type === "error"
              ? "bg-rose-50 border-rose-200 text-rose-900"
              : "bg-sky-50 border-sky-200 text-sky-900"
          }`}
        >
          <div className="flex items-start gap-3">
            <div className="min-w-0 flex-1 text-sm font-medium leading-6">{toast.message}</div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-500 hover:text-slate-900"
              aria-label="Dismiss notification"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
