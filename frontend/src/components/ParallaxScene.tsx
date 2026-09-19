"use client";
import { useRef } from "react";
import { ArrowUpRight, BriefcaseBusiness, Check, Layers3 } from "lucide-react";
export default function ParallaxScene() {
  const scene = useRef<HTMLDivElement>(null);
  return <div ref={scene} className="connection-art" aria-hidden="true" onPointerMove={(event) => {
    if (event.pointerType !== "mouse" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rect = event.currentTarget.getBoundingClientRect();
    scene.current?.style.setProperty("--rx", `${-(event.clientY - rect.top - rect.height / 2) / 35}deg`);
    scene.current?.style.setProperty("--ry", `${(event.clientX - rect.left - rect.width / 2) / 35}deg`);
  }} onPointerLeave={() => { scene.current?.style.setProperty("--rx", "0deg"); scene.current?.style.setProperty("--ry", "0deg"); }}>
    <div className="scene-depth"><div className="orbit orbit-one" /><div className="orbit orbit-two" />
      <div className="sculpture"><div className="sculpture-ring ring-a" /><div className="sculpture-ring ring-b" /><div className="sculpture-ring ring-c" /><div className="sculpture-core"><Layers3 size={38} strokeWidth={1.5} /></div></div>
      <div className="art-card art-profile"><div className="art-icon"><BriefcaseBusiness size={23} /></div><div><strong>Your next opportunity</strong><small>A new beginning, within reach</small></div><ArrowUpRight size={20} /></div>
      <div className="art-card art-match"><span className="match-check"><Check size={17} /></span><div><strong>Made for your next move</strong><small>People. Potential. Possibility.</small></div></div>
      <span className="scene-spark spark-one" /><span className="scene-spark spark-two" />
    </div>
  </div>;
}
