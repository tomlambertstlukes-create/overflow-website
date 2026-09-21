import type { MetadataRoute } from "next";

const routes = [
  "",
  "/about",
  "/schools",
  "/funders",
  "/support",
  "/impact",
  "/how-it-works",
  "/projects",
  "/projects/wellbeing-centres",
  "/projects/overflow-dance",
  "/projects/overflow-create",
  "/projects/overflow-football",
  "/projects/drop-ins",
  "/churches",
  "/vacancies",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.kingdomoverflow.org";

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.7,
  }));
}
