"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ArrowUpRight, BriefcaseBusiness, CircleCheck, Clock3, FileText, Sparkles, Trophy, UsersRound, XCircle } from "lucide-react";
import ProtectedRoute from "@/components/ProtectedRoute";
import Sidebar from "@/components/Sidebar";
import WorkspaceHero from "@/components/WorkspaceHero";
import api from "@/services/api";
import { useToastStore } from "@/store/toastStore";

type Status = "APPLIED" | "REVIEWED" | "SHORTLISTED" | "REJECTED" | "HIRED";
type DashboardStats = { total_jobs: number; total_applications: number; status_counts: Record<Status, number> };
const statusCards = [
  { key: "APPLIED" as const, label: "New applicants", icon: FileText, tone: "violet" },
  { key: "REVIEWED" as const, label: "In review", icon: Clock3, tone: "blue" },
  { key: "SHORTLISTED" as const, label: "Shortlisted", icon: Sparkles, tone: "amber" },
  { key: "HIRED" as const, label: "Hired", icon: Trophy, tone: "green" },
  { key: "REJECTED" as const, label: "Not progressing", icon: XCircle, tone: "rose" },
];

function RecruiterDashboardContent() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const addToast = useToastStore((state) => state.addToast);
  const loadStats = useCallback(async () => { try { const { data } = await api.get<DashboardStats>("/recruiter/dashboard/"); setStats(data); } catch { addToast("Unable to load dashboard statistics.", "error"); } }, [addToast]);
  useEffect(() => { const timer = window.setTimeout(() => void loadStats(), 0); return () => window.clearTimeout(timer); }, [loadStats]);
  return <div className="workspace-page flex"><Sidebar /><main className="workspace-content flex-1"><WorkspaceHero role="recruiter" view="dashboard" /><section className="recruiter-section">
    <div className="section-heading"><div><p className="section-kicker">LIVE OVERVIEW</p><h1>Hiring at a glance</h1><p>Track momentum across your open roles and candidate pipeline.</p></div><Link href="/recruiter/jobs" className="designer-button">Manage jobs <ArrowUpRight size={17} /></Link></div>
    {!stats ? <div className="designer-loader"><span /></div> : <><div className="overview-grid">
      <Link href="/recruiter/jobs" className="overview-card overview-primary"><div className="metric-icon"><BriefcaseBusiness /></div><div><span>Published jobs</span><strong>{stats.total_jobs}</strong><small>View all positions <ArrowUpRight size={14} /></small></div><div className="metric-orbit" /></Link>
      <Link href="/recruiter/applications" className="overview-card"><div className="metric-icon metric-lilac"><UsersRound /></div><div><span>Total applicants</span><strong>{stats.total_applications}</strong><small>Review your talent pool <ArrowUpRight size={14} /></small></div></Link>
      <div className="overview-card progress-card"><div className="metric-icon metric-mint"><CircleCheck /></div><div><span>Positive outcomes</span><strong>{stats.status_counts.SHORTLISTED + stats.status_counts.HIRED}</strong><small>Shortlisted and hired</small></div></div>
    </div><div className="pipeline-panel"><div className="panel-heading"><div><h2>Candidate pipeline</h2><p>Move quickly on the people who stand out.</p></div><span>{stats.total_applications} total</span></div><div className="pipeline-grid">{statusCards.map(({ key, label, icon: Icon, tone }) => <Link key={key} href={`/recruiter/applications?status=${key}`} className={`pipeline-card tone-${tone}`}><span className="pipeline-icon"><Icon size={18} /></span><strong>{stats.status_counts[key]}</strong><span>{label}</span><ArrowUpRight className="pipeline-arrow" size={16} /></Link>)}</div></div></>}
  </section></main></div>;
}
export default function RecruiterDashboard() { return <ProtectedRoute requiredRole="recruiter"><RecruiterDashboardContent /></ProtectedRoute>; }
