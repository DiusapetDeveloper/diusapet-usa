"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];

export function IntroSequence() {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem("introSeen") === "true") return;

    // Reduced motion: skip the intro entirely, mark as seen
    if (reduce) {
      sessionStorage.setItem("introSeen", "true");
      return;
    }

    setMounted(true);
    setVisible(true);
    document.body.style.overflow = "hidden";

    const hide = window.setTimeout(() => setVisible(false), 2000);

    return () => {
      window.clearTimeout(hide);
      document.body.style.overflow = "";
    };
  }, [reduce]);

  const onExitComplete = () => {
    sessionStorage.setItem("introSeen", "true");
    document.body.style.overflow = "";
    setMounted(false);
  };

  if (!mounted) return null;

  return (
    <AnimatePresence onExitComplete={onExitComplete}>
      {visible && (
        <motion.div
          key="intro"
          aria-hidden="true"
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: "#060B1A" }}
          initial={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 0.5, ease }}
        >
          <div className="flex flex-col items-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6, ease }}
              className="font-serif leading-none text-center"
              style={{
                color: "#F5F3EE",
                fontSize: 72,
                letterSpacing: "-0.02em",
              }}
            >
              DIUSAPET USA
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5, ease }}
              className="mt-8 uppercase text-center"
              style={{
                color: "#B8925A",
                fontSize: 11,
                letterSpacing: "0.3em",
              }}
            >
              Strategic business case · 2025
            </motion.p>

            <motion.span
              initial={{ width: 0 }}
              animate={{ width: 120 }}
              transition={{ delay: 1.0, duration: 0.6, ease }}
              className="mt-6 block"
              style={{ backgroundColor: "#B8925A", height: 1 }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
