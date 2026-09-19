"use client";
import Link from "next/link";
import { ArrowRight, BriefcaseBusiness, UsersRound, ChartNoAxesCombined } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import ParallaxScene from "@/components/ParallaxScene";
export default function Home() {
  const { role, hydrated } = useAuthStore();
  const target = hydrated && role ? `/${role}/dashboard` : "/auth/register";
  return <main className="landing-shell"><section className="landing-hero"><div className="landing-copy"><div className="eyebrow"><span className="status-dot" /> PEOPLE & POSSIBILITIES, CONNECTED</div><h1>A better place<br />to find your<br /><span>next great chapter.</span></h1><p>From your next career move to your next great hire. Bring your ambitions to life with a workspace built around people.</p><Link className="primary-button" href={target}>Find your next chapter <ArrowRight size={17} /></Link></div><div className="landing-visual"><ParallaxScene /></div></section><section className="landing-features" aria-label="Platform features">{[{ icon: BriefcaseBusiness, title: "Opportunity, without the noise.", text: "Explore open roles and find the opportunities that fit your experience and ambition." },{ icon: UsersRound, title: "Great teams start here.", text: "Publish your roles, meet your candidates, and manage hiring from one thoughtful workspace." },{ icon: ChartNoAxesCombined, title: "Every step, in perspective.", text: "Keep applications organized and follow progress through every stage of the hiring journey." }].map(({icon:Icon,title,text}) => <article className="landing-feature" key={title}><Icon size={23} strokeWidth={1.5} /><h2>{title}</h2><p>{text}</p></article>)}</section></main>;
}
