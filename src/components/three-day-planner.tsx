"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import foods from "../../data/foods.json";
import { printOnly } from "@/lib/print";
import { scrollBehavior } from "@/lib/motion";
import {
  ADULT_DAILY_CALORIES,
  CHILD_DAILY_CALORIES,
  type DietaryFlags,
  type FoodItem,
} from "@/lib/planner";
import {
  DEFAULT_HOUSEHOLD,
  TASKS,
  TASKS_HEADING,
  SHOPPING_LIST_NOTE,
  amountLeftText,
  basketCoverage,
  exampleBasket,
  fixedGroups,
  foodUnit,
  householdLabel,
  listName,
  noCookPool,
  packSize,
  people,
  plural,
  remaining,
  shoppingListHeading,
  shoppingListText,
  type Entries,
  type Group,
  type Household,
  type Line,
} from "@/lib/three-day";

const ALL_FOODS = foods as FoodItem[];
const OFFICIAL_ADVICE = "https://beready.campaign.gov.uk/be-ready-for-emergencies/";

const STORAGE_NOTE =
  "We don't store anything you enter. Your ticks will disappear if you refresh or close this page, so share or save your list first.";

function Stepper({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
}) {
  const btn =
    "h-11 w-11 shrink-0 rounded-full border border-[var(--strong-border)] bg-[var(--card)] text-xl text-[var(--brand-dark)] disabled:opacity-40";
  return (
    <div className="flex items-center gap-2">
      <button type="button" className={btn} aria-label={`${label}: fewer`} disabled={value <= min} onClick={() => onChange(Math.max(min, value - 1))}>
        −
      </button>
      <span className="min-w-8 text-center text-[19px] font-semibold tabular-nums" aria-live="polite" aria-label={`${label}: ${value}`}>
        {value}
      </span>
      <button type="button" className={btn} aria-label={`${label}: more`} disabled={value >= max} onClick={() => onChange(Math.min(max, value + 1))}>
        +
      </button>
    </div>
  );
}

function Tick({ checked, onChange, children }: { checked: boolean; onChange: (v: boolean) => void; children: React.ReactNode }) {
  return (
    <label className="flex min-h-11 cursor-pointer items-center gap-3 py-1 leading-6">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="h-6 w-6 shrink-0 accent-[var(--brand)]" />
      <span>{children}</span>
    </label>
  );
}

function HaveBox({ line, value, onChange }: { line: Line; value: number; onChange: (v: number) => void }) {
  return (
    <label className="flex min-h-11 items-center gap-2">
      <span>I have</span>
      <input
        type="number"
        inputMode="numeric"
        min={0}
        value={value === 0 ? "" : value}
        placeholder="0"
        onChange={(e) => onChange(Math.max(0, Math.floor(Number(e.target.value) || 0)))}
        className="h-11 w-20 rounded-lg border border-[var(--strong-border)] bg-[var(--card)] px-3 text-[17px]"
      />
      <span>{line.unit ? line.unit.many : ""}</span>
    </label>
  );
}

export function ThreeDayPlanner({
  longerStores,
  initialLongerOpen = false,
}: {
  longerStores: React.ReactNode;
  initialLongerOpen?: boolean;
}) {
  const [household, setHousehold] = useState<Household>(DEFAULT_HOUSEHOLD);
  const [entries, setEntries] = useState<Entries>({ have: {}, got: {} });
  const [blanketsOverride, setBlanketsOverride] = useState<number | null>(null);
  const [basketOverrides, setBasketOverrides] = useState<Record<string, number>>({});
  const [dietaryFlags, setDietaryFlags] = useState<DietaryFlags>({ vegetarian: false, glutenFree: false, noDairy: false });
  const [showDietary, setShowDietary] = useState(false);
  const [tasksDone, setTasksDone] = useState<Record<string, boolean>>({});
  // Lines ticked on the shopping list, with what "I have" held before, so a
  // mis-tap can be undone from the list itself.
  const [bought, setBought] = useState<Record<string, Entries>>({});
  const [shareStatus, setShareStatus] = useState<string | null>(null);
  const [longerOpen, setLongerOpen] = useState(initialLongerOpen);

  const blankets = blanketsOverride ?? people(household);
  const groups = fixedGroups(household, blankets);

  const basket = useMemo(() => exampleBasket(household, ALL_FOODS, dietaryFlags), [household, dietaryFlags]);

  // Solver lines plus any line the person has changed, in that order.
  const basketLines = useMemo(() => {
    const eligible = new Map(noCookPool(ALL_FOODS).map((f) => [f.id, f]));
    const lines = basket.lines.map((l) => ({ item: l.item, quantity: basketOverrides[l.item.id] ?? l.quantity }));
    for (const [id, qty] of Object.entries(basketOverrides)) {
      const item = eligible.get(id);
      if (item && !lines.some((l) => l.item.id === id)) lines.push({ item, quantity: qty });
    }
    return lines;
  }, [basket, basketOverrides]);

  const coverage = basketCoverage(basketLines, basket.dailyCaloriesNeeded);

  const foodGroup: Group = {
    id: "food",
    heading: "Food",
    lines: basketLines.map(({ item, quantity }) => ({
      id: `food-${item.id}`,
      name: `${item.name}, ${packSize(item)}`,
      unit: foodUnit(item),
      amount: quantity,
      editable: true,
    })),
  };

  const allGroups = [...groups.before, foodGroup, ...groups.after];
  const allLines = allGroups.flatMap((g) => g.lines);

  const toGet = allLines
    .map((line) => ({ line, left: remaining(line, entries) }))
    .filter(({ line, left }) => left > 0 && !(line.amount === 0));
  const boughtLines = allLines.filter((line) => bought[line.id] && remaining(line, entries) === 0);
  const requiredLeft = toGet.filter(({ line }) => !line.optional).length;
  const finished = requiredLeft === 0;
  const tasksLeft = TASKS.filter((t) => !tasksDone[t.id]);

  const setHave = (id: string, v: number) => setEntries((e) => ({ ...e, have: { ...e.have, [id]: v } }));
  const setGot = (id: string, v: boolean) => setEntries((e) => ({ ...e, got: { ...e.got, [id]: v } }));

  const setAmount = (line: Line, v: number) => {
    if (line.id === "blankets") setBlanketsOverride(v);
    else setBasketOverrides((o) => ({ ...o, [line.id.replace(/^food-/, "")]: v }));
  };

  // Ticking on the list means bought: what they have rises to the full amount.
  const markBought = (line: Line) => {
    setBought((b) => ({ ...b, [line.id]: { have: { [line.id]: entries.have[line.id] ?? 0 }, got: { [line.id]: false } } }));
    if (line.amount == null) setGot(line.id, true);
    else setHave(line.id, line.amount);
  };
  const undoBought = (line: Line) => {
    const before = bought[line.id];
    if (line.amount == null) setGot(line.id, false);
    else setHave(line.id, before?.have[line.id] ?? 0);
    setBought((b) => {
      const next = { ...b };
      delete next[line.id];
      return next;
    });
  };

  const listText = () => shoppingListText(toGet, tasksLeft);

  const share = async () => {
    const text = listText();
    setShareStatus(null);
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ text });
        return;
      } catch (err) {
        if ((err as Error).name === "AbortError") return;
      }
    }
    try {
      await navigator.clipboard.writeText(text);
      setShareStatus("List copied. You can paste it into a message or note.");
    } catch {
      setShareStatus("Sharing didn't work on this device. Try Save list instead.");
    }
  };

  const save = () => {
    const blob = new Blob([listText()], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "shopping-list.txt";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    setShareStatus("List saved to your downloads.");
  };

  const print = () => printOnly("list");

  const openLonger = () => {
    setLongerOpen(true);
    requestAnimationFrame(() => document.getElementById("longer-stores")?.scrollIntoView({ behavior: scrollBehavior() }));
  };

  const linkClass = "inline-flex min-h-11 items-center text-[var(--brand)] underline underline-offset-2 hover:text-[var(--brand-dark)] transition-colors";

  function renderLine(line: Line) {
    const left = remaining(line, entries);
    return (
      <li key={line.id} className="border-b border-dashed border-[var(--border)] py-3 last:border-b-0">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4">
          <p className="font-semibold">{line.name}</p>
          {line.amount != null && !line.editable && (
            <p className="text-[var(--muted)]">
              {line.amount} {plural(line.amount, line.unit!)}
            </p>
          )}
        </div>
        {line.note && <p className="mt-1 text-[var(--secondary)]">{line.note}</p>}
        {line.editable && line.amount != null && (
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2">
            <Stepper label={line.name} value={line.amount} min={0} max={99} onChange={(v) => setAmount(line, v)} />
            <span>{plural(line.amount, line.unit!)}</span>
            {line.id.startsWith("food-") &&
              (line.amount > 0 ? (
                <button type="button" onClick={() => setAmount(line, 0)} className={linkClass}>
                  Remove
                </button>
              ) : (
                <button type="button" onClick={() => setAmount(line, 1)} className={linkClass}>
                  Add back
                </button>
              ))}
          </div>
        )}
        {line.amount == null ? (
          <div className="mt-1">
            <Tick checked={!!entries.got[line.id]} onChange={(v) => setGot(line.id, v)}>
              Got it
            </Tick>
          </div>
        ) : (
          line.amount > 0 && (
            <div className="mt-1 flex flex-wrap items-center gap-x-4">
              <HaveBox line={line} value={entries.have[line.id] ?? 0} onChange={(v) => setHave(line.id, v)} />
              <p className={left > 0 ? "font-semibold text-[var(--brand)]" : "text-[var(--success)]"}>{amountLeftText(line, left)}</p>
            </div>
          )
        )}
      </li>
    );
  }

  function renderGroup(group: Group) {
    return (
      <section key={group.id} className="border-t border-dashed border-[var(--border)] pt-5">
        <h3 className="font-serif text-[21px] font-semibold text-[var(--brand-dark)]">{group.heading}</h3>
        <ul className="mt-1">{group.lines.map(renderLine)}</ul>
      </section>
    );
  }

  const babiesAndPets = (
    <p className="keep-together mt-4 text-[var(--brand-dark)]">
      Babies or pets at home? Add ready-to-feed formula, nappies and wipes for babies, and food and bottled water for pets.
    </p>
  );

  return (
    <div className="py-8 text-[17px] leading-7 text-[var(--brand-dark)]">
      <div className="print-three-day mx-auto max-w-[760px] px-4 sm:px-6">
        <header className="no-print mb-8">
          <p className="font-serif text-3xl font-semibold tracking-tight">
            <Link href="/" className="inline-flex min-h-11 items-center">Just In Case</Link>
          </p>
          <nav className="mt-1 flex flex-wrap gap-x-4 text-sm">
            <Link href="/planner" className={linkClass}>Planner</Link>
            <Link href="/guides" className={linkClass}>Guides</Link>
            <Link href="/why" className={linkClass}>Why we built this</Link>
          </nav>
        </header>

        <div className="no-print">
          <h1 className="font-serif text-[30px] font-semibold leading-tight sm:text-[40px]">
            Three days for {householdLabel(household)}
          </h1>
          <p className="mt-3 text-[19px]">Tell us who&apos;s at home, then tick or count what you already have.</p>

          <section className="mt-6 rounded-2xl border border-[var(--strong-border)] bg-[var(--card)] p-4">
            <h2 className="font-serif text-[19px] font-semibold">Who&apos;s at home?</h2>
            <div className="mt-2 flex flex-wrap gap-x-8 gap-y-3">
              <div className="flex items-center gap-3">
                <span className="w-20 font-semibold">Adults</span>
                <Stepper label="Adults" value={household.adults} min={1} max={10} onChange={(v) => setHousehold((h) => ({ ...h, adults: v }))} />
              </div>
              <div className="flex items-center gap-3">
                <span className="w-20 font-semibold">Children</span>
                <Stepper label="Children" value={household.children} min={0} max={10} onChange={(v) => setHousehold((h) => ({ ...h, children: v }))} />
              </div>
            </div>
          </section>

          <p className="mt-4 lg:hidden">
            <a href="#shopping-list" className={linkClass}>Go to my shopping list</a>
          </p>

          <div className="mt-8 space-y-6">
            {groups.before.map(renderGroup)}

            <section className="border-t border-dashed border-[var(--border)] pt-5">
              <h3 className="font-serif text-[21px] font-semibold">An example food basket</h3>
              <p className="mt-1 text-[var(--secondary)]">
                Food you can eat cold, straight from the tin or packet. Change any line to suit your household. Food you already eat is best.
              </p>
              <div className="mt-3 rounded-xl border border-[var(--border)] bg-[var(--card)] px-4">
                <button type="button" onClick={() => setShowDietary((v) => !v)} className="min-h-11 w-full text-left font-semibold">
                  Dietary filters {showDietary ? "−" : "+"}
                </button>
                {showDietary && (
                  <div className="pb-2">
                    <Tick checked={!!dietaryFlags.vegetarian} onChange={(v) => setDietaryFlags((f) => ({ ...f, vegetarian: v }))}>Vegetarian</Tick>
                    <Tick checked={!!dietaryFlags.glutenFree} onChange={(v) => setDietaryFlags((f) => ({ ...f, glutenFree: v }))}>Gluten-free</Tick>
                    <Tick checked={!!dietaryFlags.noDairy} onChange={(v) => setDietaryFlags((f) => ({ ...f, noDairy: v }))}>No dairy</Tick>
                  </div>
                )}
              </div>
              <ul className="mt-1">{foodGroup.lines.map(renderLine)}</ul>
              <p className="mt-3 font-serif text-[19px] font-semibold">
                {!coverage.short
                  ? `This basket gives about ${coverage.label} days of energy for your household.`
                  : coverage.nearlyThere
                    ? "This basket gives just under three days of energy — a little short."
                    : `This basket gives about ${coverage.label} days of energy — short of three days.`}
              </p>
              <p className="mt-1 text-[var(--secondary)]">
                We&rsquo;ve used planning estimates of {ADULT_DAILY_CALORIES.toLocaleString()} kcal per
                adult and {CHILD_DAILY_CALORIES.toLocaleString()} per child each day:{" "}
                {basket.dailyCaloriesNeeded.toLocaleString()} kcal for your household. Actual needs vary.
                The child allowance does not account for age and may underestimate older
                children&rsquo;s and teenagers&rsquo; needs.
              </p>
              <p className="mt-2 text-[var(--secondary)]">
                Many tinned foods need refrigeration once opened. Follow the storage instructions on the
                label. If you cannot keep leftovers safely chilled, choose tins your household can
                finish at one meal. Transfer any leftovers you refrigerate into a suitable covered
                container.
              </p>
            </section>

            {groups.after.map((g) => (
              <div key={g.id}>
                {renderGroup(g)}
                {g.id === "first-aid" && <p className="mt-2 text-[var(--secondary)]">Any medicines you rely on. Your pharmacist or GP can advise.</p>}
                {g.id === "pets" && babiesAndPets}
              </div>
            ))}
          </div>
        </div>

        <section id="shopping-list" className="mt-10 rounded-2xl border-2 border-[var(--strong-border)] bg-[var(--card)] p-4 sm:p-6 print:border-0 print:p-0">
          {finished ? (
            <div className="no-print">
              <h2 className="font-serif text-[28px] font-semibold leading-tight">That&apos;s our three days sorted.</h2>
              <p className="mt-3 text-[19px]">
                Keep it together somewhere easy to reach. When the clocks change, check the dates, use anything close to its end, and replace it.
              </p>
              <p className="mt-4 text-[19px]">
                Is there a neighbour who might struggle? An older person, or someone living alone? A knock on the door could mean they&apos;re sorted too.
              </p>
              <p className="mt-6 text-[15px]">
                <button type="button" onClick={openLonger} className={linkClass}>Plan a longer store</button>
                <span aria-hidden="true"> · </span>
                <Link href="/guides/gear-worth-having" className={linkClass}>Optional gear</Link>
              </p>
              <p className="text-[15px] leading-6 text-[var(--secondary)]">Links marked &quot;affiliate&quot; earn us a small fee, at no cost to you.</p>
            </div>
          ) : (
            <>
              <h2 className="font-serif text-[28px] font-semibold leading-tight">{shoppingListHeading(toGet.length)}</h2>
              <p className="mt-2">{SHOPPING_LIST_NOTE}</p>

              <div className="no-print mt-4 flex flex-col gap-3 sm:flex-row sm:items-start">
                <div className="flex flex-wrap gap-2">
                  <button type="button" onClick={share} className="h-12 rounded-full bg-[var(--brand)] px-6 font-semibold text-white hover:bg-[var(--brand-dark)]">
                    Share list
                  </button>
                  <button type="button" onClick={save} className="h-12 rounded-full bg-[var(--brand)] px-6 font-semibold text-white hover:bg-[var(--brand-dark)]">
                    Save list
                  </button>
                  <button type="button" onClick={print} className="h-12 rounded-full border border-[var(--strong-border)] px-6 font-medium">
                    Print
                  </button>
                </div>
                <p className="text-[15px] leading-6 text-[var(--secondary)] sm:max-w-[260px]">{STORAGE_NOTE}</p>
              </div>
              {shareStatus && <p className="no-print mt-2 text-[15px] font-semibold" role="status">{shareStatus}</p>}

              <ul className="mt-4">
                {toGet.map(({ line, left }) => (
                  <li key={line.id} className="border-b border-dashed border-[var(--border)] last:border-b-0">
                    <Tick checked={false} onChange={() => markBought(line)}>
                      <span className="font-semibold">{listName(line)}</span>
                      {amountLeftText(line, left) && <span className="block text-[15px]">{amountLeftText(line, left)}</span>}
                    </Tick>
                  </li>
                ))}
                {boughtLines.map((line) => (
                  <li key={line.id} className="no-print border-b border-dashed border-[var(--border)] text-[var(--muted)] line-through last:border-b-0">
                    <Tick checked onChange={() => undoBought(line)}>{listName(line)}</Tick>
                  </li>
                ))}
              </ul>
            </>
          )}

          <div className="mt-6 border-t border-dashed border-[var(--border)] pt-4">
            <h3 className="font-serif text-[21px] font-semibold">{TASKS_HEADING}</h3>
            <ul className="mt-1">
              {TASKS.map((t) => (
                <li key={t.id} className={tasksDone[t.id] ? "print:hidden" : ""}>
                  <Tick checked={!!tasksDone[t.id]} onChange={(v) => setTasksDone((d) => ({ ...d, [t.id]: v }))}>{t.text}</Tick>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="no-print mt-10">
          <h2 className="font-serif text-[21px] font-semibold">How we worked this out</h2>
          <p className="mt-2">
            Water: 3 litres per person per day for drinking, as the government advises, plus more for washing and cooking. Food: three days of energy for your household, chosen from foods that keep and need no cooking. Calculations use the edible quantity and the nutrition information on the reference product&rsquo;s label, including drained weight where appropriate. Every food the three-day planner counts calories for has been checked against a named product label. Brands and pack sizes vary, so check what you buy. This counts energy (calories) only, so check it suits everyone&apos;s needs. Prices change, so check before you go.
          </p>
          <p className="mt-3">
            <a href={OFFICIAL_ADVICE} className={linkClass}>Read the official advice</a>
          </p>
        </section>
      </div>

      <details
        id="longer-stores"
        open={longerOpen}
        onToggle={(e) => setLongerOpen((e.target as HTMLDetailsElement).open)}
        className="print-longer mx-auto mt-12 max-w-6xl"
      >
        <summary className="no-print mx-4 min-h-11 cursor-pointer border-t border-dashed border-[var(--border)] pt-6 font-serif text-[21px] font-semibold sm:mx-6 lg:mx-8">
          Longer stores (optional)
        </summary>
        {longerOpen && longerStores}
      </details>

      <footer className="no-print mx-auto mt-16 max-w-[760px] border-t border-[var(--border)] px-4 pt-8 sm:px-6">
        <p className="text-sm font-semibold">Planning for the future you hope never comes. But just might.</p>
        <p className="mt-2 text-xs leading-5">
          Advice based on the UK Government&rsquo;s Be Ready campaign, 22 October 2026. Nothing you enter is stored.
        </p>
        <p className="mt-4 text-xs">Some wording on this site was drafted with AI and reviewed by us.</p>
        <p className="mt-4 flex flex-wrap gap-x-4 text-xs">
          <a href="/changelog" className="underline underline-offset-2">What&rsquo;s changed</a>
          <a href="/affiliate-disclosure" className="underline underline-offset-2">Affiliate disclosure</a>
        </p>
      </footer>
    </div>
  );
}
