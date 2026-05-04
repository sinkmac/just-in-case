import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://just-in-case.vercel.app/",
      lastModified: new Date("2026-05-03"),
    },
    {
      url: "https://just-in-case.vercel.app/about",
      lastModified: new Date("2026-05-03"),
    },
  ];
}
