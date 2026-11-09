export const SITE_NAME = "Aqua PC Parts & Services";
export const SITE_TAGLINE = "Precision Liquid Engineering";
export const SITE_EST = "EST. 2024";

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "Services", href: "/services" },
  { label: "Pricing", href: "/pricing" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

export const FOOTER_LINKS = {
  products: {
    title: "Shop Parts",
    links: [
      { label: "Monitors", href: "/shop?category=monitors" },
      { label: "VGA Cards", href: "/shop?category=vga-cards" },
      { label: "Processors", href: "/shop?category=processors" },
      { label: "Motherboards", href: "/shop?category=motherboards" },
      { label: "Storage & SSDs", href: "/shop?category=storage" },
      { label: "RAM & Accessories", href: "/shop?category=ram" },
    ],
  },
  services: {
    title: "Services",
    links: [
      { label: "Diagnostics & Repair", href: "/services#srv-01" },
      { label: "Liquid Cooling Loops", href: "/services#srv-02" },
      { label: "Thermal & Delidding", href: "/services#srv-03" },
      { label: "Overclocking & BIOS", href: "/services#srv-04" },
      { label: "Enterprise Clusters", href: "/services#srv-05" },
    ],
  },
  company: {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Pricing & Rates", href: "/pricing" },
      { label: "Contact Lab", href: "/contact" },
      { label: "Client Portal", href: "/account" },
      { label: "Sign In", href: "/login" },
      { label: "WhatsApp Support", href: "https://wa.me/message/CYZRQDEHLIRZF1" },
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
