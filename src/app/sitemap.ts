import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://justincase.scot/",
      lastModified: new Date("2026-05-03"),
    },
    {
      url: "https://justincase.scot/about",
      lastModified: new Date("2026-05-03"),
    },
    {
      url: "https://justincase.scot/privacy",
      lastModified: new Date("2026-05-25"),
    },
    {
      url: "https://justincase.scot/contact",
      lastModified: new Date("2026-05-25"),
    },
    {
      url: "https://justincase.scot/affiliate-disclosure",
      lastModified: new Date("2026-05-25"),
    },
  ];
}
