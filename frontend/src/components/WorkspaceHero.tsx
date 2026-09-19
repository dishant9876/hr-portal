"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { BriefcaseBusiness, Check, Compass, FileText, Layers3, Sparkles, UserRound } from "lucide-react";

type View = "dashboard" | "jobs" | "applications" | "profile";
const content = {
  candidate: {
    dashboard: ["YOUR NEXT CHAPTER", "Potential looks good on you.", "Your experience, ambitions, and next opportunity — all connected."],
    jobs: ["EXPLORE WHAT’S NEXT", "Find work that moves you.", "A new challenge. A fresh perspective. Your next possibility."],
    applications: ["EVERY STEP FORWARD", "Big moves start with small steps.", "Keep your opportunities in sight as your story unfolds."],
    profile: ["UNIQUELY YOU", "Give your potential a presence.", "Bring your experience to life and let your strengths stand out."],
  },
  recruiter: {
    dashboard: ["YOUR HIRING STUDIO", "Great teams start with a connection.", "A little perspective for the people and possibilities ahead."],
    jobs: ["ROOM FOR GREAT TALENT", "Open a door to something great.", "Turn your next opening into someone’s next chapter."],
    applications: ["PEOPLE BEHIND THE PROFILES", "Discover your team’s next spark.", "Make space for fresh perspectives and remarkable potential."],
    profile: ["YOUR COMPANY’S STORY", "Make a memorable first impression.", "Show future teammates who you are and what you’re building."],
  },
};
const icons = { dashboard: Layers3, jobs: BriefcaseBusiness, applications: FileText, profile: UserRound };

export default function WorkspaceHero({ role, view }: { role: "candidate" | "recruiter"; view: View }) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const depth = useTransform(scrollYProgress, [0, 1], [0, 65]);
  const rotateX = useSpring(0, { stiffness: 90, damping: 22 });
  const rotateY = useSpring(0, { stiffness: 90, damping: 22 });
  const Icon = icons[view];
  const [eyebrow, title, description] = content[role][view];
  return <section ref={ref} className={`workspace-hero hero-${view}`} onPointerMove={(event) => {
    if (reduced || event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    rotateY.set(((event.clientX - rect.left) / rect.width - .5) * 18);
    rotateX.set(-((event.clientY - rect.top) / rect.height - .5) * 12);
  }} onPointerLeave={() => { rotateX.set(0); rotateY.set(0); }}>
    <div className="workspace-hero-copy"><p className="eyebrow"><span className="status-dot" />{eyebrow}</p><h2>{title}</h2><p>{description}</p></div>
    <motion.div className="workspace-art" aria-hidden="true" style={{ y: reduced ? 0 : depth }}>
      <motion.div className="workspace-art-depth" style={{ rotateX: reduced ? 0 : rotateX, rotateY: reduced ? 0 : rotateY }}>
        <div className="graphic-orbit" /><div className="graphic-orbit orbit-offset" />
        <div className="graphic-platform" />
        <div className="graphic-tile tile-back"><span /><span /><span /></div>
        <div className="graphic-tile tile-front"><Icon size={44} strokeWidth={1.2} /><div className="tile-line" /><div className="tile-line short" /></div>
        <div className="graphic-bubble bubble-check"><Check size={19} /></div>
        <div className="graphic-bubble bubble-spark"><Sparkles size={21} /></div>
        <div className="graphic-compass"><Compass size={30} strokeWidth={1} /></div>
        <i className="graphic-pearl pearl-one" /><i className="graphic-pearl pearl-two" />
      </motion.div>
    </motion.div>
  </section>;
}
