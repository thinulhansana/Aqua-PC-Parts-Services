export const SITE_NAME = "Aqua PC Parts & Services";
export const SITE_TAGLINE = "Precision Liquid Engineering";
export const SITE_EST = "EST. 2024";

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Pricing", href: "/pricing" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

export const FOOTER_LINKS = {
  products: {
    title: "Products",
    links: [
      { label: "CPUs", href: "/products/cpus" },
      { label: "GPUs", href: "/products/gpus" },
      { label: "Liquid Cooling", href: "/products/liquid-cooling" },
      { label: "Memory", href: "/products/memory" },
    ],
  },
  services: {
    title: "Services",
    links: [
      { label: "Diagnostics", href: "/services#diagnostics" },
      { label: "Micro-Soldering", href: "/services#micro-soldering" },
      { label: "Custom Builds", href: "/services#custom-builds" },
      { label: "Data Recovery", href: "/services#data-recovery" },
    ],
  },
  company: {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Careers", href: "/careers" },
      { label: "Press", href: "/press" },
      { label: "Contact", href: "/contact" },
    ],
  },
} as const;

export const TRUST_BADGES = [
  "Authorized Intel Partner",
  "Authorized AMD Partner",
  "Authorized NVIDIA Partner",
  "EKWB Certified Installer",
] as const;

export const TECH_SPECS_LINE =
  "ISO 9001 Certified · ESD Safe Zone · Clean-Room Grade";

export const LOGO_SRC =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDI1Q1HyOWyGrK0DT8kYcERFh_Hye61GnzbjWwrnP3o15FVmnOX4RObJLTaA8ujLStO5TrkkV4CANJMF0n9vt1k3oR5dpQGlsurCidaDYmwJQiYTsvo9ese5mPbMBnqXUHwc33EGLWDcdzSXddmj2cUR3U5GCT9FEWpnP91rjtQxRZ3mqJ5vPs0K9tJdPxMD47p5t2wI8dEqVpMp50BhGpXXYB5MumtzF7ZAZ-VN0nN";
