"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  SITE_NAME,
  SITE_LOCATION,
  SITE_PHONE_DISPLAY,
  SITE_PHONE_HREF,
  SITE_EMAIL,
  SITE_EMAIL_HREF,
  SITE_WHATSAPP_URL,
  SITE_MAPS_URL,
  SITE_HOURS,
  LOGO_SRC,
  FOOTER_LINKS,
  TRUST_BADGES,
  TECH_SPECS_LINE,
} from "@/lib/constants";

function FooterLinkColumn({
  title,
  links,
}: {
  title: string;
  links: ReadonlyArray<{ label: string; href: string }>;
}) {
  return (
    <div>
      <h3 className="font-syne text-title-md text-on-surface mb-4">{title}</h3>
      <ul className="flex flex-col gap-2.5">
        {links.map((link) => {
          const isExternal = link.href.startsWith("http");
          return (
            <li key={link.href}>
              {isExternal ? (
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-body-md text-on-surface-variant hover:text-primary transition-colors inline-flex items-center gap-1.5 group"
                >
                  <span>{link.label}</span>
                  <span className="material-symbols-outlined text-[14px] opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all">
                    open_in_new
                  </span>
                </a>
              ) : (
                <Link
                  href={link.href}
                  className="text-body-md text-on-surface-variant hover:text-primary transition-colors relative inline-block group py-0.5"
                >
                  <span>{link.label}</span>
                  <span className="absolute left-0 bottom-0 h-px w-0 bg-primary group-hover:w-full transition-all duration-300" />
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default function Footer() {
  const contactChannels = [
    {
      name: "WhatsApp Inquiry",
      href: SITE_WHATSAPP_URL,
      external: true,
      iconType: "whatsapp",
      color: "hover:text-[#25D366] hover:border-[#25D366]/40",
    },
    {
      name: `Call ${SITE_PHONE_DISPLAY}`,
      href: SITE_PHONE_HREF,
      external: false,
      icon: "call",
      color: "hover:text-primary hover:border-primary/40",
    },
    {
      name: `Email ${SITE_EMAIL}`,
      href: SITE_EMAIL_HREF,
      external: false,
      icon: "mail",
      color: "hover:text-secondary hover:border-secondary/40",
    },
    {
      name: `Maps — ${SITE_LOCATION}`,
      href: SITE_MAPS_URL,
      external: true,
      icon: "location_on",
      color: "hover:text-primary hover:border-primary/40",
    },
  ];

  return (
    <footer className="relative bg-surface-container-lowest border-t border-outline-variant/20 overflow-hidden">
      {/* Subtle Top Luminous Hairline */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/45 to-transparent pointer-events-none" />

      {/* ── Main Footer Content ── */}
      <div className="max-w-7xl mx-auto px-4 md:px-margin-md lg:px-margin-lg pt-16 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          {/* Brand & Direct Workshop Contact Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-4">
              <Image
                src={LOGO_SRC}
                alt={`${SITE_NAME} logo`}
                width={36}
                height={36}
                className="rounded-lg"
              />
              <span className="font-syne text-title-md text-on-surface">
                {SITE_NAME}
              </span>
            </Link>
            <p className="text-body-md text-on-surface-variant max-w-sm mb-5">
              Certified Grade-A PC parts, custom gaming builds, thermal &amp; liquid cooling, and board-level repair diagnostics in{" "}
              <span className="text-on-surface font-medium">{SITE_LOCATION}</span>.
            </p>

            {/* Quick Contact Channels */}
            <div className="flex items-center gap-3 mb-6">
              {contactChannels.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  target={item.external ? "_blank" : undefined}
                  rel={item.external ? "noopener noreferrer" : undefined}
                  className={`w-9 h-9 rounded-lg bg-surface-container border border-outline-variant/30 flex items-center justify-center text-on-surface-variant transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${item.color}`}
                  aria-label={item.name}
                  title={item.name}
                >
                  {item.iconType === "whatsapp" ? (
                    <svg
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-4 h-4 shrink-0"
                      aria-hidden="true"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                  ) : (
                    <span className="material-symbols-outlined text-[18px]">
                      {item.icon}
                    </span>
                  )}
                </a>
              ))}
            </div>

            {/* Verified Workshop Details */}
            <div className="p-4 rounded-xl bg-surface-container border border-outline-variant/20 max-w-sm flex flex-col gap-2 text-body-sm">
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-label-tech uppercase text-primary tracking-wider">
                  Workshop &amp; Hours
                </span>
                <span className="font-mono text-[10px] text-secondary uppercase">
                  {SITE_LOCATION}
                </span>
              </div>
              <div className="flex items-center justify-between gap-2 text-on-surface-variant">
                <span>Mon – Fri</span>
                <span className="font-mono text-label-tech text-on-surface">
                  {SITE_HOURS.weekdays}
                </span>
              </div>
              <div className="flex items-center justify-between gap-2 text-on-surface-variant">
                <span>Saturday</span>
                <span className="font-mono text-label-tech text-on-surface">
                  {SITE_HOURS.saturday}
                </span>
              </div>
              <div className="pt-2 mt-1 border-t border-outline-variant/15 flex flex-wrap items-center justify-between gap-2">
                <a
                  href={SITE_PHONE_HREF}
                  className="font-mono text-label-tech text-primary hover:underline"
                >
                  {SITE_PHONE_DISPLAY}
                </a>
                <a
                  href={SITE_EMAIL_HREF}
                  className="font-mono text-[11px] text-on-surface-variant hover:text-primary transition-colors truncate"
                >
                  {SITE_EMAIL}
                </a>
              </div>
            </div>
          </div>

          {/* Link Columns */}
          <FooterLinkColumn
            title={FOOTER_LINKS.products.title}
            links={FOOTER_LINKS.products.links}
          />
          <FooterLinkColumn
            title={FOOTER_LINKS.services.title}
            links={FOOTER_LINKS.services.links}
          />
          <FooterLinkColumn
            title={FOOTER_LINKS.company.title}
            links={FOOTER_LINKS.company.links}
          />
        </div>
      </div>

      {/* ── Trust Badges ── */}
      <div className="border-t border-outline-variant/15">
        <div className="max-w-7xl mx-auto px-4 md:px-margin-md lg:px-margin-lg py-6">
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8">
            {TRUST_BADGES.map((badge) => (
              <div
                key={badge}
                className="flex items-center gap-2 text-on-surface-variant/70"
              >
                <span className="material-symbols-outlined text-[16px] text-primary/60">
                  verified
                </span>
                <span className="font-mono text-label-tech uppercase tracking-wider">
                  {badge}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Bottom Bar ── */}
      <div className="border-t border-outline-variant/10">
        <div className="max-w-7xl mx-auto px-4 md:px-margin-md lg:px-margin-lg py-5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-body-sm text-on-surface-variant/60">
            <p>© {new Date().getFullYear()} {SITE_NAME}. All rights reserved.</p>
            <div className="flex flex-wrap items-center justify-center md:justify-end gap-x-4 gap-y-2">
              <p className="font-mono text-label-tech tracking-wider text-center md:text-right">
                {TECH_SPECS_LINE}
              </p>
              <span
                className="hidden sm:inline text-outline-variant/40"
                aria-hidden="true"
              >
                •
              </span>
              <Link
                href="/admin"
                className="inline-flex items-center gap-1.5 font-mono text-label-tech uppercase tracking-wider text-on-surface-variant/75 hover:text-primary transition-colors"
                title="Founder Admin Console"
              >
                <span className="material-symbols-outlined text-[14px]">
                  admin_panel_settings
                </span>
                <span>Admin</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
