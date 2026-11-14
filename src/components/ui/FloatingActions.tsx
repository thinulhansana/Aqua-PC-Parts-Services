"use client";

import React, { useEffect, useState } from "react";
import { motion, useScroll, useSpring, AnimatePresence } from "framer-motion";
import { WHATSAPP_LINK } from "@/lib/shopData";
import RoseAssistant from "@/components/ui/RoseAssistant";

export default function FloatingActions() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 220,
    damping: 32,
    restDelta: 0.001,
  });

  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 420);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {/* Top Scroll Progress Indicator */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-primary via-tertiary to-secondary origin-left z-[60] pointer-events-none shadow-[0_0_10px_rgba(76,215,246,0.65)]"
        style={{ scaleX }}
        aria-hidden="true"
      />

      {/* Floating Bottom-Right Quick Actions */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
        <AnimatePresence>
          {showTop && (
            <motion.button
              type="button"
              onClick={scrollToTop}
              initial={{ opacity: 0, scale: 0.75, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.75, y: 12 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ scale: 1.08, y: -2 }}
              whileTap={{ scale: 0.94 }}
              className="w-11 h-11 rounded-full bg-surface-container-high/90 backdrop-blur-xl border border-primary/30 text-primary shadow-glass hover:border-primary/60 hover:shadow-cyan-glow flex items-center justify-center transition-colors"
              aria-label="Scroll back to top"
              title="Back to top"
            >
              <span className="material-symbols-outlined text-[20px]">
                arrow_upward
              </span>
            </motion.button>
          )}
        </AnimatePresence>

        <RoseAssistant />

        <motion.a
          href={WHATSAPP_LINK}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.96 }}
          className="group sheen-hover relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-[#25D366] hover:bg-[#1ebe5a] text-white font-syne text-body-sm font-bold shadow-[0_8px_28px_rgba(37,211,102,0.4)] hover:shadow-[0_12px_34px_rgba(37,211,102,0.55)] transition-all"
          aria-label="Chat with Aqua PC Solutions on WhatsApp"
        >
          {/* Ambient Pulse Ring */}
          <span className="absolute -inset-1 rounded-full border border-[#25D366]/50 animate-pulse-ring pointer-events-none" />
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-5 h-5 shrink-0 relative z-10"
            aria-hidden="true"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          <span className="hidden sm:inline relative z-10">Quick Quote</span>
        </motion.a>
      </div>
    </>
  );
}

