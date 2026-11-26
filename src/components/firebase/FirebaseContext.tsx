"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  type User,
} from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  onSnapshot,
  serverTimestamp,
  type Timestamp,
} from "firebase/firestore";
import {
  db,
  firebaseAuth,
  googleAuthProvider,
  OperationType,
  handleFirestoreError,
  clampString,
} from "@/lib/firebase";

export interface CloudUserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
  phone?: string;
  rigSpecs?: string;
  createdAt?: Timestamp | null;
  updatedAt?: Timestamp | null;
}

interface FirebaseContextValue {
  firebaseUser: User | null;
  profile: CloudUserProfile | null;
  authReady: boolean;
  authLoading: boolean;
  authError: string | null;
  profileSynced: boolean;
  signInWithGoogle: () => Promise<User | null>;
  signOutFirebase: () => Promise<void>;
  updateCloudProfile: (patch: {
    displayName?: string;
    phone?: string;
    rigSpecs?: string;
  }) => Promise<void>;
  clearAuthError: () => void;
}

const FirebaseContext = createContext<FirebaseContextValue>({
  firebaseUser: null,
  profile: null,
  authReady: false,
  authLoading: false,
  authError: null,
  profileSynced: false,
  signInWithGoogle: async () => null,
  signOutFirebase: async () => {},
  updateCloudProfile: async () => {},
  clearAuthError: () => {},
});

export function FirebaseProvider({ children }: { children: React.ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<CloudUserProfile | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [profileSynced, setProfileSynced] = useState(false);
  const syncedUidRef = useRef<string | null>(null);

  const ensureUserProfileDoc = useCallback(async (user: User): Promise<void> => {
    if (!user.emailVerified || !user.email) {
      return;
    }
    const profilePath = `users/${user.uid}`;
    const userRef = doc(db, "users", user.uid);
    try {
      const snap = await getDoc(userRef);
      if (!snap.exists()) {
        const displayName = clampString(
          user.displayName || user.email.split("@")[0] || "Aqua Member",
          80
        );
        const email = clampString(user.email, 254);
        const payload: Record<string, unknown> = {
          uid: user.uid,
          displayName,
          email,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        };
        if (user.photoURL && user.photoURL.length <= 500) {
          payload.photoURL = user.photoURL;
        }
        await setDoc(userRef, payload);
      }
      syncedUidRef.current = user.uid;
      setProfileSynced(true);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, profilePath);
    }
  }, []);

  useEffect(() => {
    let unsubProfile: (() => void) | null = null;

    const unsubAuth = onAuthStateChanged(firebaseAuth, async (user) => {
      if (unsubProfile) {
        unsubProfile();
        unsubProfile = null;
      }

      setFirebaseUser(user);
      setAuthReady(true);

      if (!user) {
        setProfile(null);
        setProfileSynced(false);
        syncedUidRef.current = null;
        return;
      }

      try {
        await ensureUserProfileDoc(user);
      } catch (err) {
        setAuthError(
          err instanceof Error
            ? "Could not sync cloud profile. Please try signing in again."
            : "Could not sync cloud profile."
        );
      }

      const profilePath = `users/${user.uid}`;
      const userRef = doc(db, "users", user.uid);
      unsubProfile = onSnapshot(
        userRef,
        (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.data() as CloudUserProfile;
            setProfile(data);
            setProfileSynced(true);
          }
        },
        (err) => {
          try {
            handleFirestoreError(err, OperationType.GET, profilePath);
          } catch {
            setAuthError("Unable to read cloud profile due to permissions.");
          }
        }
      );
    });

    return () => {
      unsubAuth();
      if (unsubProfile) {
        unsubProfile();
      }
    };
  }, [ensureUserProfileDoc]);

  const signInWithGoogle = useCallback(async (): Promise<User | null> => {
    setAuthError(null);
    setAuthLoading(true);
    try {
      const result = await signInWithPopup(firebaseAuth, googleAuthProvider);
      if (result.user) {
        await ensureUserProfileDoc(result.user);
      }
      return result.user;
    } catch (err: unknown) {
      const code =
        typeof err === "object" && err !== null && "code" in err
          ? String((err as { code?: unknown }).code)
          : "";
      if (code === "auth/popup-blocked") {
        setAuthError(
          "Popup was blocked by your browser. Allow popups for this site and click Sign in with Google again."
        );
      } else if (code === "auth/popup-closed-by-user" || code === "auth/cancelled-popup-request") {
        setAuthError("Google sign-in popup was closed before completing.");
      } else if (code === "auth/unauthorized-domain") {
        setAuthError(
          "This domain is not yet authorized in Firebase Auth settings."
        );
      } else {
        setAuthError("Google sign-in failed. Please try again.");
      }
      return null;
    } finally {
      setAuthLoading(false);
    }
  }, [ensureUserProfileDoc]);

  const signOutFirebase = useCallback(async (): Promise<void> => {
    setAuthError(null);
    await signOut(firebaseAuth);
    setProfile(null);
    setProfileSynced(false);
    syncedUidRef.current = null;
  }, []);

  const updateCloudProfile = useCallback(
    async (patch: { displayName?: string; phone?: string; rigSpecs?: string }) => {
      const user = firebaseAuth.currentUser;
      if (!user) throw new Error("Sign in with Google first to save your profile.");
      const profilePath = `users/${user.uid}`;
      const userRef = doc(db, "users", user.uid);
      const updatePayload: Record<string, unknown> = {
        updatedAt: serverTimestamp(),
      };
      if (typeof patch.displayName === "string") {
        const cleanName = clampString(patch.displayName, 80);
        if (cleanName.length >= 1) updatePayload.displayName = cleanName;
      }
      if (typeof patch.phone === "string") {
        updatePayload.phone = clampString(patch.phone, 40);
      }
      if (typeof patch.rigSpecs === "string") {
        updatePayload.rigSpecs = clampString(patch.rigSpecs, 400);
      }
      try {
        await updateDoc(userRef, updatePayload);
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, profilePath);
      }
    },
    []
  );

  const clearAuthError = useCallback(() => setAuthError(null), []);

  return (
    <FirebaseContext.Provider
      value={{
        firebaseUser,
        profile,
        authReady,
        authLoading,
        authError,
        profileSynced,
        signInWithGoogle,
        signOutFirebase,
        updateCloudProfile,
        clearAuthError,
      }}
    >
      {children}
    </FirebaseContext.Provider>
  );
}

export function useFirebaseAuth() {
  return useContext(FirebaseContext);
}
