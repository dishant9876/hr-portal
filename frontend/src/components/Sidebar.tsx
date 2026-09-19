"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BriefcaseBusiness, LayoutDashboard, UserRound, Files, ArrowUpRight, Sparkles } from "lucide-react";
import { useAuthStore } from "@/store/authStore";

export default function Sidebar() {
  const { role, hydrated } = useAuthStore();
  const pathname = usePathname();
  if (!hydrated || !role) return null;
  const links = [
    { path: "dashboard", label: "Overview", icon: LayoutDashboard },
    { path: "jobs", label: role === "recruiter" ? "Manage jobs" : "Discover jobs", icon: BriefcaseBusiness },
    { path: "applications", label: "Applications", icon: Files },
    { path: "profile", label: "My profile", icon: UserRound },
  ];
  return <aside className="workspace-sidebar">
    <div className="sidebar-heading"><span className="eyebrow">WORKSPACE</span><h2>{role === "recruiter" ? "Recruiter studio" : "Your career space"}</h2><p>Make your next move matter.</p></div>
    <nav aria-label="Workspace navigation">{links.map(({ path, label, icon: Icon }) => {
      const href = `/${role}/${path}`;
      const active = pathname === href;
      return <Link key={path} href={href} aria-current={active ? "page" : undefined} className={`workspace-link ${active ? "is-active" : ""}`}><Icon size={19} /><span>{label}</span>{active && <span className="nav-dot" />}</Link>;
    })}</nav>
    <div className="sidebar-tip"><Sparkles size={21} /><h3>{role === "recruiter" ? "Build something great." : "Put your best self forward."}</h3><p>{role === "recruiter" ? "A complete company profile helps your next great hire get to know you." : "Tell your story with a complete profile and an up-to-date resume."}</p><Link href={`/${role}/profile`}>Review your profile <ArrowUpRight size={16} /></Link></div>
    <div className="sidebar-bottom"><span className="status-dot" /> Your next chapter, connected.</div>
  </aside>;
}
