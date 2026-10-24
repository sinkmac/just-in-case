import type { Metadata } from "next";
import { PantryPlanner, type DurationTier } from "@/components/pantry-planner";
import { ThreeDayPlanner } from "@/components/three-day-planner";

export const metadata: Metadata = {
  title: "Three-day planner — Just In Case",
  description:
    "See what your household needs for three days, tick what you already have, and get a shopping list of what's missing. Nothing you enter is stored.",
  alternates: { canonical: "https://justincase.scot/planner" },
};

// The planner reads ?tier= from the URL to pre-select a longer-stores
// duration. Force dynamic rendering so searchParams is resolved per-request
// (not baked in at build time via SSG).
export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

const LONGER_TIERS: readonly string[] = ["fortnight", "month", "season"];

function longerTier(raw: string | string[] | undefined): DurationTier | undefined {
  const value = Array.isArray(raw) ? raw[0] : raw;
  return typeof value === "string" && LONGER_TIERS.includes(value) ? (value as DurationTier) : undefined;
}

// Opens at three days. ?tier=fortnight|month|season opens Longer stores on
// that tier; anything else (including ?tier=weekend) is the three-day planner.
export default async function PlannerPage({ searchParams }: PageProps) {
  const tier = longerTier((await searchParams).tier);
  return (
    <ThreeDayPlanner
      initialLongerOpen={tier != null}
      longerStores={<PantryPlanner initialTier={tier} embedded />}
    />
  );
}
