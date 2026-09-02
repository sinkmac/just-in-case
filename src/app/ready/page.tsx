import type { Metadata } from "next";
import ReadinessClient from "./ready-client";

export const metadata: Metadata = {
  title: "Readiness Score — How Prepared Is Your Household? — Just In Case",
  description:
    "Answer 17 quick questions on water, food, power, heat, documents and your home, and get a free readiness score for your household — plus the cheapest ways to improve it. Answers stay on your device.",
  alternates: { canonical: "https://justincase.scot/ready" },
  openGraph: {
    title: "Readiness Score — How Prepared Is Your Household?",
    description:
      "17 quick questions, about three minutes, an honest picture of where your household stands — and the cheapest ways to improve it. Nothing is stored or sent.",
    url: "https://justincase.scot/ready",
    type: "website",
    siteName: "Just In Case",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Just In Case readiness check — a household preparedness score",
      },
    ],
  },
};

export default function ReadyPage() {
  return <ReadinessClient />;
}
