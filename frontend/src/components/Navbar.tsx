"use client";

import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

export default function Navbar() {
  const router = useRouter();
  const { logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push("/auth/login");
  };

  return (
    <div className="flex items-center justify-between rounded-3xl bg-white px-6 py-5 shadow-sm">
      <button
        onClick={handleLogout}
        className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
      >
        Logout
      </button>
    </div>
  );
}
