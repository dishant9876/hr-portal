"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowUpRight, BriefcaseBusiness, FileText, Mail, Phone, Search, Sparkles, Users, X } from "lucide-react";
import ProtectedRoute from "@/components/ProtectedRoute";
import Sidebar from "@/components/Sidebar";
import WorkspaceHero from "@/components/WorkspaceHero";
import api from "@/services/api";
import { useToastStore } from "@/store/toastStore";
import type { PaginatedResults, RecruiterApplication } from "@/types";

type ProfileItem = string | Record<string, string>;
type Profile = { name: string; email: string; phone_number: string; years_of_experience: number; skills: ProfileItem[]; work_experience: ProfileItem[]; education: ProfileItem[]; certifications: ProfileItem[]; awards: ProfileItem[]; hobbies: ProfileItem[]; other_details: string; resume_url: string | null };
const statuses: RecruiterApplication["status"][] = ["APPLIED", "REVIEWED", "SHORTLISTED", "REJECTED", "HIRED"];
const statusLabel: Record<RecruiterApplication["status"], string> = { APPLIED: "Applied", REVIEWED: "In review", SHORTLISTED: "Shortlisted", REJECTED: "Not progressing", HIRED: "Hired" };

function Content() {
  const [items, setItems] = useState<RecruiterApplication[]>([]), [filter, setFilter] = useState<"" | RecruiterApplication["status"]>(""), [query, setQuery] = useState("");
  const [profile, setProfile] = useState<Profile | null>(null), [pending, setPending] = useState<{ id: number; status: RecruiterApplication["status"] } | null>(null), [note, setNote] = useState(""), [saving, setSaving] = useState(false);
  const toast = useToastStore((state) => state.addToast);
  const load = useCallback(async () => { try { const { data } = await api.get<PaginatedResults<RecruiterApplication>>("/recruiter/applications/", { params: filter ? { status: filter } : {} }); setItems(data.results); } catch { toast("Unable to load applications.", "error"); } }, [filter, toast]);
  useEffect(() => { const timer = window.setTimeout(() => void load(), 0); return () => window.clearTimeout(timer); }, [load]);
  const visible = useMemo(() => items.filter((item) => `${item.candidate_name} ${item.job_title} ${item.candidate_email}`.toLowerCase().includes(query.toLowerCase())), [items, query]);
  const openProfile = async (id: number) => { try { const { data } = await api.get<Profile>(`/recruiter/applications/${id}/candidate/`); setProfile(data); } catch { toast("Unable to load candidate profile.", "error"); } };
  const update = async () => { if (!pending || !note.trim()) { toast("Please enter an update for the candidate.", "error"); return; } setSaving(true); try { await api.patch(`/recruiter/applications/${pending.id}/`, { status: pending.status, status_note: note }); setItems((current) => current.map((item) => item.id === pending.id ? { ...item, status: pending.status, status_note: note } : item)); setPending(null); setNote(""); toast("Application updated.", "success"); } catch { toast("Unable to update application.", "error"); } finally { setSaving(false); } };
  return <div className="workspace-page flex"><Sidebar /><main className="workspace-content flex-1"><WorkspaceHero role="recruiter" view="applications" /><section className="recruiter-section">
    <div className="section-heading application-heading"><div><p className="section-kicker">TALENT PIPELINE</p><h1>Applications</h1><p>Review candidates, open profiles, and keep every conversation moving.</p></div><div className="application-count"><Users size={17} />{visible.length} candidates</div></div>
    <div className="application-tools"><label className="search-field"><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search candidates, roles, or email" /></label><select value={filter} onChange={(event) => setFilter(event.target.value as "" | RecruiterApplication["status"])}><option value="">All statuses</option>{statuses.map((status) => <option key={status} value={status}>{statusLabel[status]}</option>)}</select></div>
    {visible.length === 0 ? <div className="designer-empty"><span><Users /></span><h2>No applications found</h2><p>Try another search or status filter.</p></div> : <div className="candidate-grid">{visible.map((application) => <article key={application.id} className="candidate-card">
      <div className="candidate-card-top"><div className="candidate-avatar">{application.candidate_name.split(" ").slice(0, 2).map((part) => part[0]).join("").toUpperCase()}</div><div className="candidate-name"><button onClick={() => void openProfile(application.id)}>{application.candidate_name}</button><span>{application.candidate_experience} years experience</span></div><span className={`status-badge status-${application.status.toLowerCase()}`}>{statusLabel[application.status]}</span></div>
      <div className="role-pill"><BriefcaseBusiness size={15} /><div><span>Applied for</span><strong>{application.job_title}</strong></div></div>
      <div className="candidate-contact"><a href={`mailto:${application.candidate_email}`}><Mail size={15} />{application.candidate_email}</a><a href={`tel:${application.candidate_phone_number}`}><Phone size={15} />{application.candidate_phone_number}</a></div>
      {application.status_note && <div className="candidate-note"><Sparkles size={15} /><p><span>Latest update</span>{application.status_note}</p></div>}
      <div className="candidate-card-actions"><button onClick={() => void openProfile(application.id)}>View profile <ArrowUpRight size={15} /></button>{application.resume_url && <a target="_blank" rel="noreferrer" href={application.resume_url}><FileText size={15} /> Resume</a>}<select aria-label={`Update ${application.candidate_name} status`} value={application.status} onChange={(event) => event.target.value !== application.status && setPending({ id: application.id, status: event.target.value as RecruiterApplication["status"] })}>{statuses.map((status) => <option key={status} value={status}>{statusLabel[status]}</option>)}</select></div>
    </article>)}</div>}
  </section></main>
  {pending && <div className="designer-backdrop"><div className="designer-modal status-modal"><button onClick={() => setPending(null)} className="modal-close" aria-label="Close"><X /></button><span className="modal-icon"><Sparkles /></span><p className="section-kicker">CANDIDATE UPDATE</p><h2>Share a thoughtful update</h2><p>The candidate will see this note with their new status.</p><textarea required rows={4} value={note} onChange={(event) => setNote(event.target.value)} placeholder="Write a clear, helpful message…" /><div className="modal-actions"><button onClick={() => setPending(null)} className="ghost-button">Cancel</button><button disabled={saving} onClick={() => void update()} className="designer-button">{saving ? "Saving…" : "Save update"}</button></div></div></div>}
  {profile && <ProfileModal profile={profile} close={() => setProfile(null)} />}</div>;
}

function ProfileModal({ profile, close }: { profile: Profile; close: () => void }) {
  const groups: [string, ProfileItem[]][] = [["Skills", profile.skills], ["Experience", profile.work_experience], ["Education", profile.education], ["Certifications", profile.certifications], ["Awards", profile.awards], ["Interests", profile.hobbies]];
  return <div className="designer-backdrop"><div className="designer-modal profile-modal"><button onClick={close} className="modal-close" aria-label="Close"><X /></button><div className="modal-profile-head"><div className="candidate-avatar large-avatar">{profile.name.split(" ").slice(0, 2).map((part) => part[0]).join("").toUpperCase()}</div><div><p className="section-kicker">CANDIDATE PROFILE</p><h2>{profile.name}</h2><p>{profile.years_of_experience} years experience</p></div></div><div className="profile-contact-row"><a href={`mailto:${profile.email}`}><Mail size={15} />{profile.email}</a><a href={`tel:${profile.phone_number}`}><Phone size={15} />{profile.phone_number}</a>{profile.resume_url && <a href={profile.resume_url} target="_blank" rel="noreferrer"><FileText size={15} />View resume</a>}</div><div className="profile-group-grid">{groups.map(([name, values]) => <div key={name}><h3>{name}</h3>{values.length ? <div className="profile-tags">{values.map((value, index) => <span key={index}>{formatProfileItem(value)}</span>)}</div> : <p>Not added yet</p>}</div>)}</div>{profile.other_details && <div className="other-details"><h3>Additional details</h3><p>{profile.other_details}</p></div>}</div></div>;
}
function formatProfileItem(value: ProfileItem) { return typeof value === "string" ? value : Object.values(value).filter(Boolean).join(" · "); }
export default function RecruiterApplicationsPage() { return <ProtectedRoute requiredRole="recruiter"><Content /></ProtectedRoute>; }
