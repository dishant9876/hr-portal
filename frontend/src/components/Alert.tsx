"use client";

interface AlertProps {
  type?: "success" | "error" | "info";
  message: string;
}

const alertClasses = {
  success: "bg-emerald-50 border-emerald-200 text-emerald-800",
  error: "bg-rose-50 border-rose-200 text-rose-800",
  info: "bg-sky-50 border-sky-200 text-sky-800",
};

export default function Alert({ type = "info", message }: AlertProps) {
  return (
    <div className={`rounded-2xl border px-4 py-3 text-sm font-medium ${alertClasses[type]}`}>
      {message}
    </div>
  );
}
