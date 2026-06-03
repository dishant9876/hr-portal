"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

export default function Home() {
  const router = useRouter();
  const { role } = useAuthStore();

  const targetPath = useMemo(() => {
    if (role === "recruiter") return "/recruiter/dashboard";
    if (role === "candidate") return "/candidate/dashboard";
    return "/auth/login";
  }, [role]);

  const handleGetStarted = () => {
    router.push(targetPath);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4 py-10">
      <div className="w-full max-w-6xl rounded-3xl bg-white p-10 shadow-xl ring-1 ring-slate-200">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-blue-600">TalentBridge</p>
            <h1 className="mt-4 text-4xl font-bold text-slate-900">Hire smarter. Apply faster. Build stronger teams with TalentBridge.</h1>
            <p className="mt-6 text-lg leading-8 text-slate-600">
              TalentBridge streamlines hiring with recruiter dashboards, candidate tracking, job management, and seamless application workflows — all in one modern platform.
            </p>
            <button
              onClick={handleGetStarted}
              className="mt-8 rounded-2xl bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Get Started
            </button>
          </div>
          <div className="rounded-3xl bg-slate-950 p-8 text-white shadow-lg">
            <h2 className="text-2xl font-semibold">Everything your hiring workflow needs.</h2>
            <ul className="mt-6 space-y-4 text-slate-300">
              <li>✔ Manage jobs and applications from one dashboard</li>
              <li>✔ Dedicated portals for recruiters and candidates</li>
              <li>✔ Track applications through every hiring stage</li>
              <li>✔ Secure authentication with role-based access</li>
              <li>✔ Modern, scalable platform built for growing teams</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
