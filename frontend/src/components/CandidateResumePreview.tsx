"use client";

import { useEffect, useState } from "react";
import api from "@/services/api";
import { useToastStore } from "@/store/toastStore";

type ProfileItem = string | Record<string, string>;
type Profile = { name: string; email: string; phone_number: string; years_of_experience: number; skills: ProfileItem[]; work_experience: ProfileItem[]; education: ProfileItem[]; certifications: ProfileItem[]; awards: ProfileItem[]; hobbies: ProfileItem[]; other_details: string };
const sections: Array<{ key: keyof Pick<Profile, "work_experience" | "education" | "certifications" | "awards" | "hobbies">; title: string }> = [
  { key: "education", title: "Education" },
  { key: "work_experience", title: "Experience" },
  { key: "certifications", title: "Certifications" },
  { key: "awards", title: "Honors & Awards" },
  { key: "hobbies", title: "Hobbies" },
];

export default function CandidateResumePreview() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const addToast = useToastStore((state) => state.addToast);
  useEffect(() => { const timer = window.setTimeout(async () => { try { const { data } = await api.get<Profile>("/auth/profile/"); setProfile(data); } catch { addToast("Unable to load your profile.", "error"); } }, 0); return () => window.clearTimeout(timer); }, [addToast]);
  if (!profile) return <div className="flex justify-center rounded-3xl bg-white py-20 shadow-md"><div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900" /></div>;
  return <article className="mx-auto max-w-5xl bg-white px-8 py-10 font-serif text-slate-950 shadow-md sm:px-14"><header className="border-b border-slate-900 pb-5 text-center"><h1 className="text-3xl tracking-wide sm:text-4xl">{profile.name.toUpperCase()}</h1><p className="mt-2 text-sm">{profile.years_of_experience} years of professional experience</p><p className="mt-1 text-xs sm:text-sm">{profile.email} &nbsp;|&nbsp; {profile.phone_number}</p></header><div className="space-y-7 pt-6"><ResumeSection title="Education" items={profile.education} /><ResumeSection title="Experience" items={profile.work_experience} /><section><h2 className="border-b border-slate-900 pb-1 text-sm uppercase tracking-widest">Skills</h2>{profile.skills.length ? <div className="mt-4 grid grid-cols-2 gap-x-8 gap-y-1 text-sm sm:grid-cols-3">{profile.skills.map((skill, index) => <span key={index}>{formatItem(skill)}</span>)}</div> : <Empty />}</section>{sections.slice(2).map(({ key, title }) => <ResumeSection key={key} title={title} items={profile[key]} />)}{profile.other_details && <section><h2 className="border-b border-slate-900 pb-1 text-sm uppercase tracking-widest">Other Details</h2><p className="mt-3 whitespace-pre-wrap text-sm leading-6">{profile.other_details}</p></section>}</div></article>;
}
function formatItem(item: ProfileItem) { if (typeof item === "string") return item; return Object.values(item).filter(Boolean).join(" · "); }
function ResumeSection({ title, items }: { title: string; items: ProfileItem[] }) { return <section><h2 className="border-b border-slate-900 pb-1 text-sm uppercase tracking-widest">{title}</h2>{items.length ? <ul className="mt-3 space-y-2 text-sm leading-6">{items.map((item, index) => <li key={index} className="whitespace-pre-wrap">• {formatItem(item)}</li>)}</ul> : <Empty />}</section>; }
function Empty() { return <p className="mt-3 font-sans text-sm text-slate-500">Not added yet — update this in Profile.</p>; }
