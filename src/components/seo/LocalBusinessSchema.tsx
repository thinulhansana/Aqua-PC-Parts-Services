import React from "react";

export default function LocalBusinessSchema() {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": ["ComputerRepairService", "LocalBusiness"],
    "@id": "https://aquapcparts.com/#organization",
    "name": "Aqua PC Parts & Services",
    "alternateName": "Aqua Lab Austin",
    "description":
      "Austin's premier liquid-cooled PC engineering lab. Specializing in custom water loops, silicon binning, micro-soldering component diagnostics, and elite workstation builds.",
    "url": "https://aquapcparts.com",
    "telephone": "+1-800-840-2782",
    "email": "lab@aquapcparts.com",
    "image": [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCzAgT1ycU31D0XXng7zUxriWh_-AJeqiSxHggoL5n3OUn4967qRAk-8lipNJE3yhEI7S-rW0Vsvwu_WISzGD-15X3dYeF9K8GgkFpO0o95G7tY4kRuq23kMPeGXuxcIWu_DjNPW1oqvT0x2nL2DyfK_lPLNU9uUWFRgb9EIlVpHynrASnW-tXBGyJPMH-euBM4FfPsd68trJRjtrzVLpUxXR_f5_msEEoRUSf5azYx",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDp5XScZK4J0J5uZcjpWUe9tLQHruoNtDTru3Suf2QQO7OzsRmeNGxFYv0m7kUcGuQj93-k-oFAsXVhdM5yq_I7ELDoqXrKkZzS9zze64mlZroyW5zOBLo-zK44XVE789CnAk6nIlUwmE7MyekZpeBE9rkKcH3qNNWMTFysyb_1jtMfjLpUeu2pAAyCeN59NN_rKXKwLKGaHhneSjgKLO0rDfYMutiY9bfXvwM2qvBm"
    ],
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "1044 Hydro Silicon Parkway, Suite 400",
      "addressLocality": "Austin",
      "addressRegion": "TX",
      "postalCode": "78758",
      "addressCountry": "US"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 30.3842,
      "longitude": -97.7121
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "08:00",
        "closes": "19:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Saturday"],
        "opens": "10:00",
        "closes": "17:00"
      }
    ],
    "priceRange": "$$$",
    "currenciesAccepted": "USD",
    "paymentAccepted": "Credit Card, Debit Card, Wire Transfer, Crypto",
    "areaServed": [
      {
        "@type": "AdministrativeArea",
        "name": "Austin Metropolitan Area"
      },
      {
        "@type": "Country",
        "name": "United States (Mail-in Diagnostic Triage)"
      }
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.98",
      "reviewCount": "342",
      "bestRating": "5",
      "worstRating": "1"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "PC Engineering & Diagnostic Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Emergency Hardware Diagnostics & Micro-Soldering",
            "description":
              "Oscilloscope rail testing, short-circuit thermal cam imaging, BGA reballing, and component-level board recovery."
          },
          "price": "79.00",
          "priceCurrency": "USD"
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Custom Hardline & Soft-Tube Liquid Cooling Loop Assembly",
            "description":
              "CNC acrylic manifold fabrication, 2.0 BAR pressure certification, and sub-ambient fluid tuning."
          },
          "price": "249.00",
          "priceCurrency": "USD"
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Silicon Delidding & Direct-Die Liquid Metal Application",
            "description":
              "Surgical IHS removal, high-temp conformal coating, and gallium-indium thermal compound application."
          },
          "price": "89.00",
          "priceCurrency": "USD"
        }
      ]
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
}
