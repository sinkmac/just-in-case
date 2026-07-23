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
    {
      url: "https://justincase.scot/guides/emergency-food-needs",
      lastModified: new Date(),
    },
    {
      url: "https://justincase.scot/guides/storage-without-bunker",
      lastModified: new Date(),
    },
    {
      url: "https://justincase.scot/guides/when-powers-out",
      lastModified: new Date(),
    },
    {
      url: "https://justincase.scot/guides/what-we-leave-out",
      lastModified: new Date(),
    },
  ];
}