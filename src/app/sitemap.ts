import { MetadataRoute } from "next";
import { PAKISTANI_UNIVERSITIES } from "@/lib/mockData";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://techlo.pk";

  // Static core routes
  const staticRoutes = [
    "",
    "/marketplace",
    "/services",
    "/services/request",
    "/sell",
    "/universities",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "daily" as const,
    priority: route === "" ? 1.0 : route === "/marketplace" ? 0.9 : 0.8,
  }));

  // University campus directory routes
  const universityRoutes = PAKISTANI_UNIVERSITIES.map((uni) => ({
    url: `${baseUrl}/marketplace?uni=${encodeURIComponent(uni.shortName)}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  // Categories routes
  const categories = [
    "microcontrollers",
    "sensors",
    "motors_actuators",
    "power_bms",
    "wireless_iot",
    "development_boards",
    "displays",
    "test_tools",
    "passives_ics",
  ];

  const categoryRoutes = categories.map((cat) => ({
    url: `${baseUrl}/marketplace?category=${cat}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "daily" as const,
    priority: 0.75,
  }));

  return [...staticRoutes, ...categoryRoutes, ...universityRoutes];
}
