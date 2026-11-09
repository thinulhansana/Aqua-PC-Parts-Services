"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TiltSpotlightCard, EASE_PREMIUM } from "@/components/ui/MotionPrimitives";
import AuthPanel, { type AuthMode } from "@/components/auth/AuthPanel";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode: AuthMode;
  callbackUrl: string;
  googleEnabled: boolean;
}

export default function AuthModal({
  isOpen,
  onClose,
  initialMode,
  callbackUrl,
  googleEnabled,
}: AuthModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Account Authentication"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[70] flex items-center justify-center p-4 overflow-y-auto"
        >
          {/* Dim blurred backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/65 backdrop-blur-md"
          />

          {/* Modal container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 12 }}
            transition={{ duration: 0.32, ease: EASE_PREMIUM }}
            className="relative z-10 w-full max-w-md my-auto"
          >
            <TiltSpotlightCard
              conicBorder
              maxTilt={2}
              className="rounded-xl shadow-2xl"
              innerClassName="rounded-xl"
            >
              <AuthPanel
                initialMode={initialMode}
                callbackUrl={callbackUrl}
                googleEnabled={googleEnabled}
                onClose={onClose}
                onSuccess={() => {
                  onClose();
                }}
              />
            </TiltSpotlightCard>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

