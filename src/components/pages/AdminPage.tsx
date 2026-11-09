"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import type { AdminUserRecord } from "@/lib/auth-users";
import {
  CircuitFlowBackdrop,
  MaskedReveal,
  SpotlightCard,
  TiltSpotlightCard,
  fadeUpVariants,
  EASE_PREMIUM,
} from "@/components/ui/MotionPrimitives";

interface AdminPageProps {
  initialUsers: AdminUserRecord[];
  initialStorage: "d1" | "local";
  adminEmail: string;
  initialFetchedAt: string;
}

type ProviderFilter = "all" | "google" | "credentials";
type SortOrder = "newest" | "updated" | "name";

function getInitials(name?: string | null, email?: string | null): string {
  const source = (name || email || "A").trim();
  const parts = source.split(/\s+/);
  if (parts.length >= 2 && parts[0][0] && parts[1][0]) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return source.slice(0, 2).toUpperCase();
}

function formatDateTimeColombo(iso?: string | null): string {
  if (!iso) return "—";
  try {
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return "—";
    return new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Colombo",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  } catch {
    return "—";
  }
}

function formatDateShortColombo(iso?: string | null): string {
  if (!iso) return "—";
  try {
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return "—";
    return new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Colombo",
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  } catch {
    return "—";
  }
}

function sanitizeCsvCell(value?: string | null): string {
  const raw = (value ?? "").replace(/\r?\n/g, " ").trim();
  const safe = /^[=+\-@\t\r]/.test(raw) ? `'${raw}` : raw;
  return `"${safe.replace(/"/g, '""')}"`;
}

function UserAvatar({
  name,
  email,
  image,
}: {
  name: string;
  email: string;
  image?: string;
}) {
  const [imgFailed, setImgFailed] = useState(false);

  if (image && !imgFailed) {
    return (
      <div className="w-10 h-10 rounded-xl bg-surface-container border border-primary/30 overflow-hidden shrink-0">
        <Image
          src={image}
          alt={name || email}
          width={40}
          height={40}
          unoptimized
          onError={() => setImgFailed(true)}
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  return (
    <div className="w-10 h-10 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center shrink-0">
      <span className="font-syne font-bold text-body-sm text-primary">
        {getInitials(name, email)}
      </span>
    </div>
  );
}

export default function AdminPage({
  initialUsers,
  initialStorage,
  adminEmail,
  initialFetchedAt,
}: AdminPageProps) {
  const [users, setUsers] = useState<AdminUserRecord[]>(initialUsers);
  const [storage, setStorage] = useState<"d1" | "local">(initialStorage);
  const [fetchedAt, setFetchedAt] = useState<string>(initialFetchedAt);
  const [searchQuery, setSearchQuery] = useState("");
  const [providerFilter, setProviderFilter] = useState<ProviderFilter>("all");
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");
  const [withDetailsOnly, setWithDetailsOnly] = useState(false);

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [statusNotice, setStatusNotice] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const stats = useMemo(() => {
    const total = users.length;
    const googleCount = users.filter((u) => u.provider === "google").length;
    const credentialsCount = total - googleCount;
    const withDetailsCount = users.filter(
      (u) => Boolean(u.phone?.trim() || u.rigSpecs?.trim())
    ).length;

    return {
      total,
      googleCount,
      credentialsCount,
      withDetailsCount,
      googlePct: total > 0 ? Math.round((googleCount / total) * 100) : 0,
      credentialsPct:
        total > 0 ? Math.round((credentialsCount / total) * 100) : 0,
    };
  }, [users]);

  const filteredUsers = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    const list = users.filter((user) => {
      if (providerFilter !== "all" && user.provider !== providerFilter) {
        return false;
      }

      if (withDetailsOnly && !user.phone?.trim() && !user.rigSpecs?.trim()) {
        return false;
      }

      if (!q) return true;

      return (
        user.name.toLowerCase().includes(q) ||
        user.email.toLowerCase().includes(q) ||
        (user.phone?.toLowerCase().includes(q) ?? false) ||
        (user.rigSpecs?.toLowerCase().includes(q) ?? false) ||
        user.id.toLowerCase().includes(q)
      );
    });

    return [...list].sort((a, b) => {
      if (sortOrder === "name") {
        return a.name.localeCompare(b.name, undefined, { sensitivity: "base" });
      }
      if (sortOrder === "updated") {
        return (
          new Date(b.updatedAt || b.createdAt).getTime() -
          new Date(a.updatedAt || a.createdAt).getTime()
        );
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [users, searchQuery, providerFilter, sortOrder, withDetailsOnly]);

  const handleCopy = async (key: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedKey(key);
      window.setTimeout(() => {
        setCopiedKey((current) => (current === key ? null : current));
      }, 1600);
    } catch {
      // Clipboard API unavailable
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setStatusNotice(null);

    try {
      const res = await fetch("/api/admin/users", { cache: "no-store" });
      const data = (await res.json().catch(() => ({}))) as {
        users?: AdminUserRecord[];
        storage?: "d1" | "local";
        fetchedAt?: string;
        error?: string;
      };

      if (!res.ok) {
        setStatusNotice({
          type: "error",
          text: data.error || "Unable to refresh user registry.",
        });
        return;
      }

      if (Array.isArray(data.users)) {
        setUsers(data.users);
      }
      if (data.storage === "d1" || data.storage === "local") {
        setStorage(data.storage);
      }
      if (data.fetchedAt) {
        setFetchedAt(data.fetchedAt);
      }

      setStatusNotice({
        type: "success",
        text: `Synced ${data.users?.length ?? users.length} registered user record(s) from ${
          data.storage === "d1" ? "Cloudflare D1" : "Local Store"
        }.`,
      });
    } catch {
      setStatusNotice({
        type: "error",
        text: "Network error while syncing registered users.",
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleExportCsv = () => {
    const headers = [
      "ID",
      "Name",
      "Email",
      "Provider",
      "Phone",
      "Saved Rig Specs",
      "Created At (UTC)",
      "Updated At (UTC)",
    ];

    const rows = filteredUsers.map((u) =>
      [
        sanitizeCsvCell(u.id),
        sanitizeCsvCell(u.name),
        sanitizeCsvCell(u.email),
        sanitizeCsvCell(u.provider),
        sanitizeCsvCell(u.phone),
        sanitizeCsvCell(u.rigSpecs),
        sanitizeCsvCell(u.createdAt),
        sanitizeCsvCell(u.updatedAt),
      ].join(",")
    );

    const csvContent = "\uFEFF" + [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const dateStamp = new Date().toISOString().slice(0, 10);
    link.href = url;
    link.download = `aqua-pc-users-${dateStamp}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleSignOut = async () => {
    setIsSigningOut(true);
    await signOut({ callbackUrl: "/" });
  };

  return (
    <div className="flex flex-col w-full">
      {/* ── Top Ambient Founder Console Banner ── */}
      <section className="relative w-full overflow-hidden bg-surface-container-lowest -mt-20 pt-28 pb-space-xl border-b border-outline-variant/15">
        <CircuitFlowBackdrop className="absolute inset-0 w-full h-full opacity-50" />
        <div className="pointer-events-none absolute -top-24 left-1/4 w-[540px] h-[320px] rounded-full bg-primary/10 blur-[120px] animate-orb-drift" />
        <div className="pointer-events-none absolute -top-16 right-1/4 w-[420px] h-[280px] rounded-full bg-secondary/10 blur-[100px] animate-orb-drift-delay" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-margin-md lg:px-margin-lg pt-space-lg">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-space-lg">
            <div className="flex flex-col gap-2 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-surface-container border border-primary/35 font-mono text-[10px] uppercase tracking-widest text-primary">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
                  FOUNDER CONSOLE // USER REGISTRY
                </span>
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-mono text-[10px] uppercase tracking-wider border ${
                    storage === "d1"
                      ? "bg-secondary/10 border-secondary/35 text-secondary"
                      : "bg-tertiary/10 border-tertiary/35 text-tertiary"
                  }`}
                >
                  <span className="material-symbols-outlined text-[12px]">
                    database
                  </span>
                  {storage === "d1" ? "Cloudflare D1 Live" : "Local Store Fallback"}
                </span>
              </div>

              <h1 className="font-syne text-headline-md sm:text-headline-lg text-on-surface uppercase tracking-tight">
                <MaskedReveal delay={0.04}>Registered Client Accounts</MaskedReveal>
              </h1>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[12px] text-on-surface-variant">
                <span className="inline-flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[15px] text-secondary">
                    verified_user
                  </span>
                  <span>Admin: {adminEmail}</span>
                </span>
                <span className="text-outline">•</span>
                <span className="inline-flex items-center gap-1.5 text-outline">
                  <span className="material-symbols-outlined text-[15px]">
                    schedule
                  </span>
                  <span>Synced {formatDateTimeColombo(fetchedAt)} (LK)</span>
                </span>
              </div>
            </div>

            {/* Action Toolbar */}
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="px-4 py-2.5 rounded-xl bg-surface-container-high hover:bg-surface-bright text-on-surface border border-outline-variant/35 hover:border-primary/45 font-jakarta font-semibold text-body-sm transition-all flex items-center gap-2 cursor-pointer disabled:opacity-60"
              >
                <span
                  className={`material-symbols-outlined text-[18px] text-primary ${
                    isRefreshing ? "animate-spin" : ""
                  }`}
                >
                  refresh
                </span>
                <span>{isRefreshing ? "Syncing..." : "Refresh"}</span>
              </button>

              <button
                type="button"
                onClick={handleExportCsv}
                disabled={filteredUsers.length === 0}
                className="px-4 py-2.5 rounded-xl bg-gradient-primary text-on-primary font-syne font-bold text-body-sm shadow-cyan-glow hover:shadow-cyan-glow-lg transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-[18px]">
                  download
                </span>
                <span>Export CSV ({filteredUsers.length})</span>
              </button>

              <Link
                href="/account"
                className="px-4 py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface border border-outline-variant/30 font-jakarta font-semibold text-body-sm transition-all flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[18px]">
                  account_circle
                </span>
                <span>My Portal</span>
              </Link>

              <button
                type="button"
                onClick={handleSignOut}
                disabled={isSigningOut}
                className="px-4 py-2.5 rounded-xl bg-error-container/20 hover:bg-error-container/35 text-on-error-container border border-error/35 font-jakarta font-semibold text-body-sm transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
              >
                <span className="material-symbols-outlined text-[18px]">
                  {isSigningOut ? "progress_activity" : "logout"}
                </span>
                <span>{isSigningOut ? "Signing Out..." : "Sign Out"}</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Main Admin Dashboard Workspace ── */}
      <section className="max-w-7xl mx-auto px-4 md:px-margin-md lg:px-margin-lg py-space-xl w-full flex flex-col gap-space-lg">
        {/* Live Sync Status Banner */}
        <AnimatePresence mode="wait">
          {statusNotice && (
            <motion.div
              key={statusNotice.text}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2, ease: EASE_PREMIUM }}
              className={`p-3.5 rounded-xl border text-body-sm flex items-center justify-between gap-3 ${
                statusNotice.type === "success"
                  ? "bg-secondary/15 border-secondary/35 text-secondary"
                  : "bg-error-container/25 border-error/45 text-on-error-container"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[18px]">
                  {statusNotice.type === "success" ? "check_circle" : "error"}
                </span>
                <span>{statusNotice.text}</span>
              </div>
              <button
                type="button"
                onClick={() => setStatusNotice(null)}
                aria-label="Dismiss notice"
                className="p-1 rounded-lg hover:bg-black/10 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">
                  close
                </span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Summary KPI Cards */}
        <motion.div
          variants={fadeUpVariants}
          initial="hidden"
          animate="visible"
          custom={1}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter"
        >
          <SpotlightCard className="p-5 rounded-xl bg-surface-container-low border border-outline-variant/20 flex flex-col gap-2">
            <div className="flex items-center justify-between relative z-10">
              <span className="font-mono text-[10px] uppercase tracking-widest text-primary">
                TOTAL ACCOUNTS
              </span>
              <span className="material-symbols-outlined text-[20px] text-primary">
                group
              </span>
            </div>
            <p className="font-syne font-bold text-headline-lg text-on-surface relative z-10">
              {stats.total}
            </p>
            <span className="font-mono text-[11px] text-on-surface-variant relative z-10">
              Registered in {storage === "d1" ? "aqua-pc-users D1" : "local store"}
            </span>
          </SpotlightCard>

          <SpotlightCard
            glowColor="rgb(var(--color-secondary) / 0.14)"
            className="p-5 rounded-xl bg-surface-container-low border border-outline-variant/20 flex flex-col gap-2"
          >
            <div className="flex items-center justify-between relative z-10">
              <span className="font-mono text-[10px] uppercase tracking-widest text-secondary">
                GOOGLE OAUTH
              </span>
              <span className="material-symbols-outlined text-[20px] text-secondary">
                verified_user
              </span>
            </div>
            <p className="font-syne font-bold text-headline-lg text-on-surface relative z-10">
              {stats.googleCount}
            </p>
            <span className="font-mono text-[11px] text-on-surface-variant relative z-10">
              {stats.googlePct}% via Google Sign-In
            </span>
          </SpotlightCard>

          <SpotlightCard className="p-5 rounded-xl bg-surface-container-low border border-outline-variant/20 flex flex-col gap-2">
            <div className="flex items-center justify-between relative z-10">
              <span className="font-mono text-[10px] uppercase tracking-widest text-tertiary">
                EMAIL &amp; PASSWORD
              </span>
              <span className="material-symbols-outlined text-[20px] text-tertiary">
                mail
              </span>
            </div>
            <p className="font-syne font-bold text-headline-lg text-on-surface relative z-10">
              {stats.credentialsCount}
            </p>
            <span className="font-mono text-[11px] text-on-surface-variant relative z-10">
              {stats.credentialsPct}% via Email Credentials
            </span>
          </SpotlightCard>

          <SpotlightCard className="p-5 rounded-xl bg-surface-container-low border border-outline-variant/20 flex flex-col gap-2">
            <div className="flex items-center justify-between relative z-10">
              <span className="font-mono text-[10px] uppercase tracking-widest text-primary">
                SAVED RIG / PHONE
              </span>
              <span className="material-symbols-outlined text-[20px] text-primary">
                memory
              </span>
            </div>
            <p className="font-syne font-bold text-headline-lg text-on-surface relative z-10">
              {stats.withDetailsCount}
            </p>
            <span className="font-mono text-[11px] text-on-surface-variant relative z-10">
              Clients with contact or PC specs saved
            </span>
          </SpotlightCard>
        </motion.div>

        {/* Filter & Search Toolbar */}
        <TiltSpotlightCard
          conicBorder
          maxTilt={0.8}
          className="rounded-2xl shadow-lg"
          innerClassName="rounded-2xl"
        >
          <div className="p-4 sm:p-5 bg-surface-container-low flex flex-col gap-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
              {/* Search Box */}
              <div className="relative flex-1 min-w-0">
                <span className="material-symbols-outlined text-[19px] text-outline absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                  search
                </span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name, email, phone, saved rig specs, or ID..."
                  aria-label="Search registered users"
                  className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-surface-container text-on-surface placeholder:text-outline text-body-md border border-outline-variant/30 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    aria-label="Clear search"
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded-md text-outline hover:text-on-surface cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      close
                    </span>
                  </button>
                )}
              </div>

              {/* Controls: Provider Filter Pills + Sort + Details Toggle */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="inline-flex p-1 rounded-xl bg-surface-container border border-outline-variant/25">
                  {(
                    [
                      { key: "all", label: `All (${stats.total})` },
                      { key: "google", label: `Google (${stats.googleCount})` },
                      {
                        key: "credentials",
                        label: `Email (${stats.credentialsCount})`,
                      },
                    ] as const
                  ).map((tab) => (
                    <button
                      key={tab.key}
                      type="button"
                      onClick={() => setProviderFilter(tab.key)}
                      className={`px-3 py-1.5 rounded-lg font-mono text-[11px] uppercase tracking-wider transition-all cursor-pointer ${
                        providerFilter === tab.key
                          ? "bg-primary text-on-primary font-bold shadow-sm"
                          : "text-on-surface-variant hover:text-on-surface"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => setWithDetailsOnly((prev) => !prev)}
                  className={`px-3 py-2 rounded-xl font-mono text-[11px] uppercase tracking-wider border transition-all flex items-center gap-1.5 cursor-pointer ${
                    withDetailsOnly
                      ? "bg-secondary/15 border-secondary/45 text-secondary font-bold"
                      : "bg-surface-container border-outline-variant/30 text-on-surface-variant hover:text-on-surface"
                  }`}
                >
                  <span className="material-symbols-outlined text-[15px]">
                    filter_alt
                  </span>
                  <span>Has Rig/Phone</span>
                </button>

                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value as SortOrder)}
                  aria-label="Sort users"
                  className="px-3 py-2 rounded-xl bg-surface-container text-on-surface font-mono text-[11px] uppercase tracking-wider border border-outline-variant/30 focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
                >
                  <option value="newest">Sort: Newest Joined</option>
                  <option value="updated">Sort: Recently Active</option>
                  <option value="name">Sort: Name (A–Z)</option>
                </select>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 text-body-sm font-mono text-[11px] text-outline pt-1 border-t border-outline-variant/15">
              <span>
                Showing <strong className="text-on-surface">{filteredUsers.length}</strong> of{" "}
                <strong className="text-on-surface">{users.length}</strong> registered accounts
              </span>
              {(searchQuery || providerFilter !== "all" || withDetailsOnly) && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setProviderFilter("all");
                    setWithDetailsOnly(false);
                  }}
                  className="text-primary hover:underline cursor-pointer"
                >
                  Reset Filters
                </button>
              )}
            </div>
          </div>
        </TiltSpotlightCard>

        {/* Empty State */}
        {filteredUsers.length === 0 ? (
          <div className="p-12 rounded-2xl bg-surface-container-low border border-outline-variant/20 flex flex-col items-center justify-center text-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-surface-container border border-outline-variant/30 flex items-center justify-center text-outline">
              <span className="material-symbols-outlined text-[28px]">
                person_search
              </span>
            </div>
            <h2 className="font-syne text-title-md text-on-surface">
              {users.length === 0
                ? "No Registered Users Yet"
                : "No Matching Accounts Found"}
            </h2>
            <p className="text-body-sm text-on-surface-variant max-w-md">
              {users.length === 0
                ? "As soon as customers sign in with Google or register with Email & Password, their accounts will appear here."
                : "Try adjusting your search query or clearing the active provider filter."}
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Users Table */}
            <div className="hidden lg:block rounded-2xl bg-surface-container-low border border-outline-variant/25 overflow-hidden shadow-lg">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-outline-variant/20 bg-surface-container text-on-surface-variant font-mono text-[10px] uppercase tracking-widest">
                      <th className="py-3.5 px-5">User / Identity</th>
                      <th className="py-3.5 px-4">Provider</th>
                      <th className="py-3.5 px-4">Phone / WhatsApp</th>
                      <th className="py-3.5 px-4">Saved Rig Blueprint</th>
                      <th className="py-3.5 px-4">Joined &amp; Updated (LK)</th>
                      <th className="py-3.5 px-5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/15 text-body-sm">
                    {filteredUsers.map((user) => {
                      const cleanTel = user.phone?.replace(/[^+\d]/g, "");
                      return (
                        <tr
                          key={user.id}
                          className="hover:bg-surface-container/60 transition-colors align-top"
                        >
                          <td className="py-4 px-5">
                            <div className="flex items-start gap-3">
                              <UserAvatar
                                name={user.name}
                                email={user.email}
                                image={user.image}
                              />
                              <div className="min-w-0">
                                <p className="font-syne font-bold text-body-md text-on-surface truncate max-w-[230px]">
                                  {user.name}
                                </p>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                  <span className="font-mono text-[12px] text-on-surface-variant truncate max-w-[210px]">
                                    {user.email}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleCopy(`email-${user.id}`, user.email)
                                    }
                                    title="Copy email"
                                    className="text-outline hover:text-primary transition-colors cursor-pointer"
                                  >
                                    <span className="material-symbols-outlined text-[14px]">
                                      {copiedKey === `email-${user.id}`
                                        ? "check"
                                        : "content_copy"}
                                    </span>
                                  </button>
                                </div>
                                <span
                                  className="font-mono text-[10px] text-outline/80 block mt-0.5"
                                  title={user.id}
                                >
                                  ID: {user.id.slice(0, 8)}…
                                </span>
                              </div>
                            </div>
                          </td>

                          <td className="py-4 px-4 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-mono text-[10px] uppercase tracking-wider border ${
                                user.provider === "google"
                                  ? "bg-secondary/10 border-secondary/35 text-secondary"
                                  : "bg-primary/10 border-primary/35 text-primary"
                              }`}
                            >
                              <span className="material-symbols-outlined text-[13px]">
                                {user.provider === "google"
                                  ? "verified_user"
                                  : "mail"}
                              </span>
                              {user.provider === "google" ? "Google" : "Email"}
                            </span>
                          </td>

                          <td className="py-4 px-4 whitespace-nowrap">
                            {user.phone ? (
                              <div className="flex items-center gap-1.5 font-mono text-[12px] text-on-surface">
                                {cleanTel ? (
                                  <a
                                    href={`tel:${cleanTel}`}
                                    className="hover:text-primary transition-colors"
                                  >
                                    {user.phone}
                                  </a>
                                ) : (
                                  <span>{user.phone}</span>
                                )}
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleCopy(`phone-${user.id}`, user.phone!)
                                  }
                                  title="Copy phone number"
                                  className="text-outline hover:text-primary transition-colors cursor-pointer"
                                >
                                  <span className="material-symbols-outlined text-[14px]">
                                    {copiedKey === `phone-${user.id}`
                                      ? "check"
                                      : "content_copy"}
                                  </span>
                                </button>
                              </div>
                            ) : (
                              <span className="font-mono text-[11px] text-outline/70">
                                —
                              </span>
                            )}
                          </td>

                          <td className="py-4 px-4 max-w-[300px]">
                            {user.rigSpecs ? (
                              <p className="font-mono text-[11px] text-on-surface-variant bg-surface-container/70 border border-outline-variant/20 rounded-lg px-2.5 py-1.5 leading-relaxed break-words">
                                {user.rigSpecs}
                              </p>
                            ) : (
                              <span className="font-mono text-[11px] text-outline/70">
                                No specs saved
                              </span>
                            )}
                          </td>

                          <td className="py-4 px-4 whitespace-nowrap">
                            <div className="flex flex-col gap-0.5 font-mono text-[11px]">
                              <span
                                className="text-on-surface"
                                title={formatDateTimeColombo(user.createdAt)}
                              >
                                {formatDateShortColombo(user.createdAt)}
                              </span>
                              <span
                                className="text-outline text-[10px]"
                                title={`Updated: ${formatDateTimeColombo(
                                  user.updatedAt || user.createdAt
                                )}`}
                              >
                                Upd: {formatDateShortColombo(user.updatedAt || user.createdAt)}
                              </span>
                            </div>
                          </td>

                          <td className="py-4 px-5 text-right whitespace-nowrap">
                            <div className="inline-flex items-center gap-1.5">
                              <a
                                href={`mailto:${encodeURIComponent(user.email)}`}
                                className="px-2.5 py-1.5 rounded-lg bg-surface-container hover:bg-primary/15 border border-outline-variant/25 hover:border-primary/40 text-on-surface-variant hover:text-primary font-mono text-[11px] transition-colors inline-flex items-center gap-1"
                                title={`Email ${user.email}`}
                              >
                                <span className="material-symbols-outlined text-[14px]">
                                  mail
                                </span>
                                <span>Email</span>
                              </a>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile & Tablet Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:hidden gap-4">
              {filteredUsers.map((user) => {
                const cleanTel = user.phone?.replace(/[^+\d]/g, "");
                return (
                  <div
                    key={user.id}
                    className="p-5 rounded-2xl bg-surface-container-low border border-outline-variant/25 flex flex-col gap-3.5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <UserAvatar
                          name={user.name}
                          email={user.email}
                          image={user.image}
                        />
                        <div className="min-w-0">
                          <h3 className="font-syne font-bold text-title-md text-on-surface truncate">
                            {user.name}
                          </h3>
                          <p className="font-mono text-[12px] text-on-surface-variant truncate">
                            {user.email}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-mono text-[10px] uppercase tracking-wider border shrink-0 ${
                          user.provider === "google"
                            ? "bg-secondary/10 border-secondary/35 text-secondary"
                            : "bg-primary/10 border-primary/35 text-primary"
                        }`}
                      >
                        <span className="material-symbols-outlined text-[12px]">
                          {user.provider === "google" ? "verified_user" : "mail"}
                        </span>
                        {user.provider === "google" ? "Google" : "Email"}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-outline-variant/15 font-mono text-[11px]">
                      <div>
                        <span className="text-[10px] uppercase text-outline block">
                          Phone
                        </span>
                        {user.phone ? (
                          cleanTel ? (
                            <a
                              href={`tel:${cleanTel}`}
                              className="text-on-surface hover:text-primary"
                            >
                              {user.phone}
                            </a>
                          ) : (
                            <span className="text-on-surface">{user.phone}</span>
                          )
                        ) : (
                          <span className="text-outline/70">—</span>
                        )}
                      </div>
                      <div>
                        <span className="text-[10px] uppercase text-outline block">
                          Joined (LK)
                        </span>
                        <span className="text-on-surface">
                          {formatDateShortColombo(user.createdAt)}
                        </span>
                      </div>
                    </div>

                    {user.rigSpecs && (
                      <div className="p-2.5 rounded-xl bg-surface-container border border-outline-variant/20">
                        <span className="font-mono text-[10px] uppercase text-outline block mb-1">
                          Saved Rig Blueprint
                        </span>
                        <p className="font-mono text-[11px] text-on-surface-variant break-words leading-relaxed">
                          {user.rigSpecs}
                        </p>
                      </div>
                    )}

                    <div className="flex items-center justify-between gap-2 pt-1">
                      <span className="font-mono text-[10px] text-outline">
                        ID: {user.id.slice(0, 8)}…
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleCopy(`m-email-${user.id}`, user.email)}
                          className="px-2.5 py-1.5 rounded-lg bg-surface-container border border-outline-variant/25 font-mono text-[11px] text-on-surface-variant hover:text-primary flex items-center gap-1 cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[14px]">
                            {copiedKey === `m-email-${user.id}`
                              ? "check"
                              : "content_copy"}
                          </span>
                          <span>
                            {copiedKey === `m-email-${user.id}` ? "Copied" : "Copy Email"}
                          </span>
                        </button>
                        <a
                          href={`mailto:${encodeURIComponent(user.email)}`}
                          className="px-2.5 py-1.5 rounded-lg bg-primary/15 border border-primary/35 font-mono text-[11px] text-primary flex items-center gap-1"
                        >
                          <span className="material-symbols-outlined text-[14px]">
                            mail
                          </span>
                          <span>Email</span>
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </section>
    </div>
  );
}
