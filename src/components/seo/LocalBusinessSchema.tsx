import React from "react";
import {
  SITE_NAME,
  SITE_URL,
  SITE_PHONE_E164,
  SITE_EMAIL,
  SITE_ADDRESS,
  SITE_FOUNDED_DATE,
} from "@/lib/constants";

export default function LocalBusinessSchema() {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": ["ComputerRepairService", "ComputerStore", "LocalBusiness"],
    "@id": `${SITE_URL}/#organization`,
    name: SITE_NAME,
    alternateName: "Aqua PC Tech Lab",
    description:
      "Certified Grade-A PC hardware, custom gaming builds, precision liquid & thermal optimization, and component-level diagnostics in Embilipitiya, Sri Lanka.",
    url: SITE_URL,
    telephone: SITE_PHONE_E164,
    email: SITE_EMAIL,
    foundingDate: SITE_FOUNDED_DATE,
    image: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCzAgT1ycU31D0XXng7zUxriWh_-AJeqiSxHggoL5n3OUn4967qRAk-8lipNJE3yhEI7S-rW0Vsvwu_WISzGD-15X3dYeF9K8GgkFpO0o95G7tY4kRuq23kMPeGXuxcIWu_DjNPW1oqvT0x2nL2DyfK_lPLNU9uUWFRgb9EIlVpHynrASnW-tXBGyJPMH-euBM4FfPsd68trJRjtrzVLpUxXR_f5_msEEoRUSf5azYx",
    ],
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE_ADDRESS.street,
      addressLocality: SITE_ADDRESS.locality,
      addressRegion: SITE_ADDRESS.region,
      postalCode: SITE_ADDRESS.postalCode,
      addressCountry: SITE_ADDRESS.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 6.3438,
      longitude: 80.8504,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "08:00",
        closes: "19:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Saturday"],
        opens: "10:00",
        closes: "17:00",
      },
    ],
    priceRange: "$$",
    currenciesAccepted: "LKR",
    paymentAccepted: "Cash, Bank Transfer, Card Payment",
    areaServed: [
      {
        "@type": "City",
        name: "Embilipitiya",
      },
      {
        "@type": "AdministrativeArea",
        name: "Sabaragamuwa Province",
      },
      {
        "@type": "Country",
        name: "Sri Lanka",
      },
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "PC Engineering, Custom Builds & Diagnostic Services",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Hardware Diagnostics & Component-Level Repair",
            description:
              "Short-circuit tracing, oscilloscope signal verification, power rail testing, and board-level repair. Free inspection when repair is approved.",
          },
          price: "4500.00",
          priceCurrency: "LKR",
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Custom PC Assembly & Liquid Cooling Setup",
            description:
              "Precision custom desktop assembly, AIO or open liquid cooling integration, airflow tuning, and 24-hour stability testing.",
          },
          price: "8500.00",
          priceCurrency: "LKR",
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Thermal Overhaul & Cooling Service",
            description:
              "High-conductivity thermal repasting, deep chassis dust removal, and sustained full-load temperature optimization.",
          },
          price: "2500.00",
          priceCurrency: "LKR",
        },
      ],
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
}
