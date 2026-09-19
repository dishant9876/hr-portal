"use client";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

/** Decoration stays outside content so scrolling never transforms dialogs or forms. */
export default function AmbientGraphics() {
  const reduced = useReducedMotion();
  const { scrollY } = useScroll();
  const near = useTransform(scrollY, [0, 2500], [0, -220]);
  const far = useTransform(scrollY, [0, 2500], [0, -85]);
  return <div className="ambient-graphics" aria-hidden="true">
    <motion.div className="ambient-glow glow-one" style={{ y: reduced ? 0 : far }} />
    <motion.div className="ambient-glow glow-two" style={{ y: reduced ? 0 : near }} />
    <motion.div className="ambient-outline" style={{ y: reduced ? 0 : near }} />
    <div className="ambient-dots" />
  </div>;
}
