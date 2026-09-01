import React from "react";

interface OrganizationJsonLdProps {
  url?: string;
  name?: string;
}

export const OrganizationJsonLd: React.FC<OrganizationJsonLdProps> = ({
  url = "https://techlo.pk",
  name = "TECHLO - a product of arix",
}) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: name,
    url: url,
    logo: "https://techlo.pk/logo.png",
    description:
      "Pakistan's premier hardware marketplace and prototyping platform for university engineering students. Buy & sell ESP32, STM32, sensors, and order PCB fabrication and 3D CAD modeling.",
    founder: {
      "@type": "Organization",
      name: "arix",
    },
    areaServed: {
      "@type": "Country",
      name: "Pakistan",
    },
    knowsAbout: [
      "Printed Circuit Board Design",
      "PCB Fabrication Batching",
      "3D CAD Modeling",
      "3D Printing",
      "Microcontroller Engineering",
      "Embedded Systems",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};

export const MarketplaceJsonLd: React.FC = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "TECHLO Hardware Marketplace",
    url: "https://techlo.pk",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://techlo.pk/marketplace?search={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};
