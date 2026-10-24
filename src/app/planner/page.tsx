import type { Metadata } from "next";
import { PantryPlanner } from "@/components/pantry-planner";

export const metadata: Metadata = {
  title: "Pantry Planner — Just In Case",
  description:
    "Calculate how much long-life food your household needs for three days or longer. Nothing you enter is stored.",
  alternates: { canonical: "https://justincase.scot/planner" },
};

// The planner reads ?tier= from the URL to pre-select a duration.
// Force dynamic rendering so searchParams is resolved per-request (not
// baked in at build time via SSG).
export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: { [key: string]: string | string[] | undefined };
};

const VALID_TIERS: readonly string[] = ["weekend", "fortnight", "month", "season"];

function normaliseTier(raw: string | string[] | undefined): string {
  const value = Array.isArray(raw) ? raw[0] : raw;
  return typeof value === "string" && VALID_TIERS.includes(value) ? value : "month";
};

export default function PlannerPage({ searchParams }: PageProps) {
  const tier = normaliseTier(searchParams.tier);
  return <PantryPlanner initialTier={tier as "weekend" | "fortnight" | "month" | "season"} />;
}
