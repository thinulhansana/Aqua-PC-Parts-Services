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
  process.env.NEXT_PUBLIC_SITE_URL || "https://aquapcsolutions.yyth.workers.dev";
export const SITE_FACEBOOK_URL =
  process.env.NEXT_PUBLIC_SITE_FACEBOOK_URL ||
  "https://www.facebook.com/aquapcsolutions";
export const SITE_FACEBOOK_HANDLE = "@aquapcsolutions";
export const SITE_INSTAGRAM_URL =
  process.env.NEXT_PUBLIC_SITE_INSTAGRAM_URL ||
  "https://www.instagram.com/aquapcsolutions/";
export const SITE_INSTAGRAM_HANDLE = "@aquapcsolutions";
export const AQUA_PC_PARTS_SITE_NAME = "Aqua PC Parts";
export const AQUA_PC_PARTS_URL =
  process.env.NEXT_PUBLIC_AQUA_PC_PARTS_URL || "https://aquapcparts.pages.dev";
export const AQUA_PC_PARTS_CONTACT_URL = `${AQUA_PC_PARTS_URL}/contact.html`;
export const AQUA_3D_PORTAL_URL =
  process.env.NEXT_PUBLIC_AQUA_3D_PORTAL_URL || "https://aquapc3dportal.pages.dev";

export function getAquaPcPartsUrl(category?: string): string {
  if (!category) return AQUA_PC_PARTS_URL;
  const sep = AQUA_PC_PARTS_URL.includes("?") ? "&" : "?";
  return `${AQUA_PC_PARTS_URL}${sep}category=${encodeURIComponent(category)}`;
}

export const SITE_HOURS = {
  weekdays: "8:00 AM – 7:00 PM",
  saturday: "10:00 AM – 5:00 PM",
  online: "24/7 WhatsApp & Online Intake",
} as const;

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Shop", href: AQUA_PC_PARTS_URL },
  { label: "3D Builder", href: AQUA_3D_PORTAL_URL },
  { label: "Services", href: "/services" },
  { label: "Pricing", href: "/pricing" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

export const FOOTER_LINKS = {
  products: {
    title: "Aqua PC Parts",
    links: [
      { label: "3D PC Builder Studio", href: AQUA_3D_PORTAL_URL },
      { label: "Used Parts (358+)", href: `${AQUA_PC_PARTS_URL}/used-parts` },
      { label: "Brand New Parts", href: `${AQUA_PC_PARTS_URL}/brand-new-parts` },
      { label: "Processors", href: getAquaPcPartsUrl("processors") },
      { label: "VGA Cards", href: getAquaPcPartsUrl("vga-cards") },
      { label: "Motherboards", href: getAquaPcPartsUrl("motherboards") },
      { label: "Storage & SSDs", href: getAquaPcPartsUrl("storage") },
      { label: "Monitors", href: getAquaPcPartsUrl("monitors") },
      { label: "RAM & Power Supplies", href: getAquaPcPartsUrl("ram") },
      { label: "Peripherals & Audio", href: getAquaPcPartsUrl("peripherals") },
      { label: "Parts Store Contact & Map", href: `${AQUA_PC_PARTS_URL}/contact.html` },
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
      { label: "Facebook Page", href: SITE_FACEBOOK_URL },
      { label: "Instagram Profile", href: SITE_INSTAGRAM_URL },
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

export const LOGO_SRC = "/logo.jpg";
