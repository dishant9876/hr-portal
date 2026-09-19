import ParallaxScene from "@/components/ParallaxScene";
import { ShieldCheck } from "lucide-react";

export default function AuthShell({ children }: { children: React.ReactNode }) {
  return <main className="auth-shell">
    <section className="auth-story">
      <div className="eyebrow"><span className="status-dot" /> YOUR NEXT CHAPTER STARTS HERE</div>
      <h1>Great people.<br />New possibilities.<br /><span>One connection.</span></h1>
      <p className="story-description">A thoughtful space for ambitious people and growing teams to find each other.</p>
      <ParallaxScene />
      <div className="story-footer"><ShieldCheck size={17} /><span>Your talent. Your team. Your future.</span></div>
    </section>
    <section className="auth-form-panel">{children}<p className="auth-footnote"><ShieldCheck size={14} /> A secure space for your professional journey</p></section>
  </main>;
}
