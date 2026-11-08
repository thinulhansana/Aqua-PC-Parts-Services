"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  SITE_NAME,
  SITE_TAGLINE,
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
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-body-md text-on-surface-variant hover:text-primary transition-colors"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="bg-surface-container-lowest border-t border-outline-variant/20">
      {/* ── Main Footer Content ── */}
      <div className="max-w-7xl mx-auto px-4 md:px-margin-md lg:px-margin-lg pt-16 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          {/* Brand Column */}
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
            <p className="text-body-md text-on-surface-variant max-w-sm mb-6">
              Expert custom PC builds, precision liquid cooling, and
              professional repair services. Where performance meets
              craftsmanship.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3 mb-8">
              {["discord", "youtube", "twitter", "github"].map((platform) => {
                const icons: Record<string, string> = {
                  discord: "forum",
                  youtube: "play_circle",
                  twitter: "tag",
                  github: "code",
                };
                return (
                  <a
                    key={platform}
                    href={`https://${platform}.com`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-lg bg-surface-container border border-outline-variant/30 flex items-center justify-center text-on-surface-variant hover:text-primary hover:border-primary/40 transition-colors"
                    aria-label={platform}
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {icons[platform]}
                    </span>
                  </a>
                );
              })}
            </div>

            {/* Newsletter */}
            <div>
              <p className="font-mono text-label-tech uppercase text-primary tracking-widest mb-3">
                Newsletter
              </p>
              <form
                className="flex gap-2"
                onSubmit={(e) => e.preventDefault()}
              >
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="flex-1 bg-surface-container border border-outline-variant/30 rounded-lg px-4 py-2.5 text-body-md text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary/50 transition-colors"
                  aria-label="Email for newsletter"
                />
                <button
                  type="submit"
                  className="glass px-4 py-2.5 rounded-lg text-primary text-body-md font-semibold hover:bg-primary/10 hover:border-primary/40 transition-colors"
                >
                  Subscribe
                </button>
              </form>
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
            <p>© 2024 {SITE_NAME}. All rights reserved.</p>
            <p className="font-mono text-label-tech tracking-wider">
              {TECH_SPECS_LINE}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
