export const SITE_NAME = "Aqua PC Solutions";
export const SITE_TAGLINE = "PC Parts, Custom Builds & Lab";
export const SITE_EST = "EST. 11.06.2026";
export const SITE_FOUNDED_DATE = "November 6, 2026";
export const SITE_FOUNDER = "S.L.K Thinul Hansana";
export const SITE_LOCATION = "Embilipitiya, Sri Lanka";
export const SITE_ADDRESS = {
  street: "Embilipitiya",
  locality: "Embilipitiya",
  region: "Sabaragamuwa",
  postalCode: "70200",
  country: "LK",
} as const;
export const SITE_PHONE_DISPLAY = "+94 78 819 4535";
export const SITE_PHONE_E164 = "+94788194535";
export const SITE_PHONE_HREF = "tel:+94788194535";
export const SITE_EMAIL = "thinulhansana.business@gmail.com";
export const SITE_EMAIL_HREF = "mailto:thinulhansana.business@gmail.com";
export const SITE_WHATSAPP_URL = "https://wa.me/message/CYZRQDEHLIRZF1";
export const SITE_MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=Embilipitiya,+Sri+Lanka";
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://aquapcsolutions.workers.dev";
export const SITE_HOURS = {
  weekdays: "8:00 AM – 7:00 PM",
  saturday: "10:00 AM – 5:00 PM",
  online: "24/7 WhatsApp & Online Intake",
} as const;

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
      { label: "Processors", href: "/shop?category=processors" },
      { label: "VGA Cards", href: "/shop?category=vga-cards" },
      { label: "Motherboards", href: "/shop?category=motherboards" },
      { label: "Storage & SSDs", href: "/shop?category=storage" },
      { label: "Monitors", href: "/shop?category=monitors" },
      { label: "RAM & Power Supplies", href: "/shop?category=ram" },
    ],
  },
  services: {
    title: "Services",
    links: [
      { label: "Diagnostics & Repair", href: "/services#srv-01" },
      { label: "Custom Builds & Liquid Cooling", href: "/services#srv-02" },
      { label: "Thermal & Cooling Upgrades", href: "/services#srv-03" },
      { label: "BIOS & Stability Tuning", href: "/services#srv-04" },
      { label: "Workstation Fleet Support", href: "/services#srv-05" },
    ],
  },
  company: {
    title: "Company",
    links: [
      { label: "About & Founder", href: "/about" },
      { label: "Pricing & Rates", href: "/pricing" },
      { label: "Contact & Workshop", href: "/contact" },
      { label: "Client Portal", href: "/account" },
      { label: "Sign In", href: "/login" },
      { label: "WhatsApp Support", href: SITE_WHATSAPP_URL },
    ],
  },
} as const;

export const TRUST_BADGES = [
  "Grade-A Bench Tested Hardware",
  "06-Month Testing Warranty",
  "24-Hour Stability Verified",
  "Island-wide Safe Delivery",
] as const;

export const TECH_SPECS_LINE =
  "ESD-Safe Precision Lab · Grade-A Tested Parts · Embilipitiya, Sri Lanka";

export const LOGO_SRC =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDI1Q1HyOWyGrK0DT8kYcERFh_Hye61GnzbjWwrnP3o15FVmnOX4RObJLTaA8ujLStO5TrkkV4CANJMF0n9vt1k3oR5dpQGlsurCidaDYmwJQiYTsvo9ese5mPbMBnqXUHwc33EGLWDcdzSXddmj2cUR3U5GCT9FEWpnP91rjtQxRZ3mqJ5vPs0K9tJdPxMD47p5t2wI8dEqVpMp50BhGpXXYB5MumtzF7ZAZ-VN0nN";
