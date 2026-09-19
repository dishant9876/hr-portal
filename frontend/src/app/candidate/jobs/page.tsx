"use client";

import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { BriefcaseBusiness, ChevronLeft, ChevronRight, FileUp, MapPin, X } from "lucide-react";
import ProtectedRoute from "@/components/ProtectedRoute";
import Sidebar from "@/components/Sidebar";
import WorkspaceHero from "@/components/WorkspaceHero";
import api from "@/services/api";
import { useToastStore } from "@/store/toastStore";
import type { CandidateJob, Experience, PaginatedResults, SalaryPeriod } from "@/types";

const experienceLabels: Record<Experience, string> = { fresher: "Fresher (0 years)", "1_2": "1–2 years", "3_5": "3–5 years", "6_9": "6–9 years", "10_plus": "10+ years" };
const salaryPeriodLabels: Record<SalaryPeriod, string> = { hour: "per hour", day: "per day", week: "per week", month: "per month", year: "per year" };
const salaryText = (job: CandidateJob) => `${job.salary.toLocaleString()} ${salaryPeriodLabels[job.salary_period]}`;

function CandidateJobsContent() {
  const [jobs, setJobs] = useState<CandidateJob[]>([]), [page, setPage] = useState(1), [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true), [selected, setSelected] = useState<CandidateJob | null>(null), [resume, setResume] = useState<File | null>(null), [applying, setApplying] = useState(false);
  const addToast = useToastStore((state) => state.addToast);
  const pages = Math.max(1, Math.ceil(total / 10));
  const loadJobs = useCallback(async () => { setLoading(true); try { const { data } = await api.get<PaginatedResults<CandidateJob>>("/candidate/jobs/", { params: { page } }); setJobs(data.results); setTotal(data.count); } catch { addToast("Unable to load jobs.", "error"); } finally { setLoading(false); } }, [addToast, page]);
  useEffect(() => { const timer = window.setTimeout(() => { void loadJobs(); }, 0); return () => window.clearTimeout(timer); }, [loadJobs]);
  const openJob = (job: CandidateJob) => { setSelected(job); setResume(null); };
  const apply = async () => {
    if (!selected || !resume) { addToast("Please upload your resume to apply.", "error"); return; }
    setApplying(true);
    try { const form = new FormData(); form.append("resume", resume); await api.post(`/candidate/jobs/${selected.id}/apply/`, form, { headers: { "Content-Type": "multipart/form-data" } }); setJobs((items) => items.map((job) => job.id === selected.id ? { ...job, is_applied: true } : job)); setSelected({ ...selected, is_applied: true }); addToast("Application submitted successfully.", "success"); }
    catch { addToast("Unable to submit your application. You may already have applied.", "error"); }
    finally { setApplying(false); }
  };
  return <div className="workspace-page flex"><Sidebar /><main className="workspace-content flex-1"><WorkspaceHero role="candidate" view="jobs" /><section className="mt-8 rounded-3xl bg-white p-8 shadow-md"><h1 className="text-2xl font-semibold">Browse Jobs</h1><p className="mt-2 text-slate-600">View open roles and apply to jobs that match your profile.</p>
    {loading ? <Loader /> : jobs.length === 0 ? <Empty /> : <><div className="mt-8 grid gap-4 lg:grid-cols-2">{jobs.map((job) => <button key={job.id} onClick={() => openJob(job)} className="rounded-2xl border border-slate-200 p-5 text-left transition hover:border-slate-400 hover:shadow-sm"><div className="flex items-start justify-between gap-3"><div><h2 className="text-lg font-semibold">{job.title}</h2><p className="mt-1 text-sm text-slate-600">{job.company_name}</p></div><span className="rounded-full bg-slate-100 px-3 py-1 text-xs capitalize">{job.job_type.replace("_", " ")}</span></div><p className="mt-4 flex items-center gap-1.5 text-sm text-slate-600"><MapPin size={16} />{job.location}</p><p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-600">{job.description}</p><p className="mt-4 border-t border-slate-100 pt-4 text-sm text-slate-600">{experienceLabels[job.experience]} · {salaryText(job)}</p></button>)}</div><Pager page={page} pages={pages} total={total} setPage={setPage} /></>}</section></main>
    {selected && <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/40 p-4" role="dialog" aria-modal="true"><div className="mx-auto my-8 max-w-2xl rounded-3xl bg-white p-6 shadow-2xl sm:p-8"><div className="flex justify-between gap-5"><div><h2 className="text-2xl font-semibold">{selected.title}</h2><p className="mt-1 text-slate-600">{selected.company_name} · {selected.location}</p></div><button onClick={() => setSelected(null)} className="h-fit rounded-lg p-2 hover:bg-slate-100" aria-label="Close"><X size={20} /></button></div><Details job={selected} /><div className="mt-7 border-t border-slate-200 pt-6">{selected.is_applied ? <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">You have already applied for this job.</p> : <><label className="grid gap-2 text-sm font-medium text-slate-700">Upload resume<input required type="file" accept=".pdf,.doc,.docx" onChange={(event: ChangeEvent<HTMLInputElement>) => setResume(event.target.files?.[0] ?? null)} className="rounded-xl border border-slate-300 p-2.5 text-sm" /></label><p className="mt-2 flex items-center gap-1 text-xs text-slate-500"><FileUp size={14} /> PDF, DOC, or DOCX</p><button disabled={applying} onClick={() => void apply()} className="mt-5 rounded-xl bg-slate-900 px-5 py-2.5 font-medium text-white disabled:opacity-60">{applying ? "Submitting…" : "Apply with resume"}</button></>}</div></div></div>}
  </div>;
}
function Details({ job }: { job: CandidateJob }) { return <div className="mt-7 space-y-5 text-sm leading-6 text-slate-700"><div><h3 className="font-semibold text-slate-900">About the role</h3><p className="mt-1 whitespace-pre-wrap">{job.description}</p></div><div><h3 className="font-semibold text-slate-900">Requirements</h3><p className="mt-1 whitespace-pre-wrap">{job.requirements}</p></div><div className="grid gap-3 rounded-xl bg-slate-50 p-4 sm:grid-cols-3"><p><b>Job type</b><br />{job.job_type.replace("_", " ")}</p><p><b>Experience</b><br />{experienceLabels[job.experience]}</p><p><b>Salary</b><br />{salaryText(job)}</p></div></div>; }
function Loader() { return <div className="flex justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900" /></div>; }
function Empty() { return <div className="mt-10 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-14 text-center"><BriefcaseBusiness className="mx-auto text-slate-400" size={34} /><h2 className="mt-4 text-lg font-semibold">No jobs found</h2><p className="mt-2 text-sm text-slate-600">New opportunities will appear here once recruiters post them.</p></div>; }
function Pager({ page, pages, total, setPage }: { page: number; pages: number; total: number; setPage: (value: number | ((value: number) => number)) => void }) { return <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-5"><p className="text-sm text-slate-600">{total} jobs · Page {page} of {pages}</p><div className="flex gap-2"><button aria-label="Previous page" disabled={page === 1} onClick={() => setPage((value) => value - 1)} className="rounded-lg border border-slate-200 p-2 disabled:opacity-40"><ChevronLeft size={18} /></button><button aria-label="Next page" disabled={page === pages} onClick={() => setPage((value) => value + 1)} className="rounded-lg border border-slate-200 p-2 disabled:opacity-40"><ChevronRight size={18} /></button></div></div>; }
export default function CandidateJobsPage() { return <ProtectedRoute requiredRole="candidate"><CandidateJobsContent /></ProtectedRoute>; }
