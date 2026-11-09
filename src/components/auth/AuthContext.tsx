"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { SessionProvider } from "next-auth/react";
import AuthModal from "@/components/auth/AuthModal";
import type { AuthMode } from "@/components/auth/AuthPanel";

interface AuthModalContextValue {
  isOpen: boolean;
  googleEnabled: boolean;
  openAuthModal: (mode?: AuthMode, callbackUrl?: string) => void;
  closeAuthModal: () => void;
}

const AuthModalContext = createContext<AuthModalContextValue>({
  isOpen: false,
  googleEnabled: false,
  openAuthModal: () => {},
  closeAuthModal: () => {},
});

export function AuthProvider({
  children,
  googleEnabled: initialGoogleEnabled,
}: {
  children: React.ReactNode;
  googleEnabled: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<AuthMode>("signin");
  const [callbackUrl, setCallbackUrl] = useState("/account");
  const [googleEnabled, setGoogleEnabled] = useState(initialGoogleEnabled);

  useEffect(() => {
    setGoogleEnabled(initialGoogleEnabled);
  }, [initialGoogleEnabled]);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/auth/providers")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (cancelled || !data || typeof data !== "object") return;
        setGoogleEnabled(Boolean((data as Record<string, unknown>).google));
      })
      .catch(() => {
        // Keep initial SSR flag if offline
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const openAuthModal = useCallback(
    (nextMode: AuthMode = "signin", nextCallbackUrl: string = "/account") => {
      setMode(nextMode);
      setCallbackUrl(nextCallbackUrl);
      setIsOpen(true);
    },
    []
  );

  const closeAuthModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <SessionProvider refetchOnWindowFocus={false}>
      <AuthModalContext.Provider
        value={{ isOpen, googleEnabled, openAuthModal, closeAuthModal }}
      >
        {children}
        <AuthModal
          isOpen={isOpen}
          onClose={closeAuthModal}
          initialMode={mode}
          callbackUrl={callbackUrl}
          googleEnabled={googleEnabled}
        />
      </AuthModalContext.Provider>
    </SessionProvider>
  );
}

export function useAuthModal() {
  return useContext(AuthModalContext);
}
