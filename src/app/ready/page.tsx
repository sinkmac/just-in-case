'use client';

import { useState, useMemo, useEffect, useRef } from 'react';

/* ── Types ── */

type Q0 = 1 | 2 | 3 | 4 | 5;
type Answer = string | null;

type Answers = {
  q0: Q0 | null;
  q1: Answer;
  q2: Answer;
  q3: Answer;
  q4: Answer;
  q5: Answer;
  q6: Answer;
  q7: Answer;
  q8: Answer;
  q9: Answer;
  q10: Answer;
  q11: Answer;
  q12: Answer;
  q13: Answer;
  q14: Answer;
  q15: Answer;
  q16: Answer;
};

type DomainName = 'water' | 'food' | 'power-heat' | 'info-money' | 'people' | 'place';
type BarState = 'secured' | 'nearly-there' | 'worth-a-look';

type Band = 1 | 2 | 3 | 4 | 5;

/* ── Question configuration ── */

interface Option {
  value: string;
  label: string;
}

interface QuestionDef {
  id: keyof Answers;
  text: string;
  options: Option[];
  domain: DomainName | 'preamble';
}

const QUESTIONS: QuestionDef[] = [
  { id: 'q0', text: 'How many people live in your home, including you?', options: [
    { value: '1', label: '1' },
    { value: '2', label: '2' },
    { value: '3', label: '3' },
    { value: '4', label: '4' },
    { value: '5', label: '5+' },
  ], domain: 'preamble' },
  { id: 'q1', text: 'If the power went off, would your taps keep running?', options: [
    { value: 'yes', label: 'Yes — mains, gravity-fed' },
    { value: 'not-sure', label: 'Not sure' },
    { value: 'no', label: 'No — private supply or pumped building' },
  ], domain: 'water' },
  { id: 'q2', text: 'How much drinking water could you pour right now without a working tap — bottles, filled containers, anything?', options: [
    { value: 'none', label: 'None' },
    { value: 'few-litres', label: 'A few litres' },
    { value: 'day-or-two', label: 'A day or two per person' },
    { value: 'more', label: 'More than that' },
  ], domain: 'water' },
  { id: 'q3', text: 'If you couldn\u2019t shop, how many days could everyone in your home eat properly?', options: [
    { value: 'day-or-so', label: 'A day or so' },
    { value: '2-3-days', label: '2\u20133 days' },
    { value: 'about-week', label: 'About a week' },
    { value: 'two-weeks-plus', label: 'Two weeks or more' },
  ], domain: 'food' },
  { id: 'q4', text: 'Could any of that be eaten with no cooking at all \u2014 straight from tin or packet?', options: [
    { value: 'hardly-any', label: 'Hardly any' },
    { value: 'some', label: 'Some' },
    { value: 'plenty', label: 'Plenty' },
  ], domain: 'food' },
  { id: 'q5', text: 'How is your home heated?', options: [
    { value: 'mains-gas', label: 'Mains gas' },
    { value: 'electric', label: 'Electric' },
    { value: 'oil-lpg-solid', label: 'Oil, LPG or solid fuel' },
    { value: 'heat-pump', label: 'Heat pump' },
    { value: 'not-sure', label: 'Not sure' },
  ], domain: 'power-heat' },
  { id: 'q6', text: 'If the electricity went off tonight, could you still boil water?', options: [
    { value: 'yes', label: 'Yes \u2014 gas hob or camping stove' },
    { value: 'no', label: 'No' },
    { value: 'not-sure', label: 'Not sure' },
  ], domain: 'power-heat' },
  { id: 'q7', text: 'Do you have a working torch and spare batteries \u2014 not just your phone?', options: [
    { value: 'yes', label: 'Yes' },
    { value: 'phone-only', label: 'Phone only' },
    { value: 'no', label: 'No' },
  ], domain: 'power-heat' },
  { id: 'q8', text: 'Could you charge a phone with the power off \u2014 power bank, car, anything?', options: [
    { value: 'yes', label: 'Yes' },
    { value: 'no', label: 'No' },
  ], domain: 'power-heat' },
  { id: 'q9', text: 'Could you hear news with no power and no internet \u2014 battery radio, wind-up, or car radio?', options: [
    { value: 'yes', label: 'Yes' },
    { value: 'car-only', label: 'Car radio only' },
    { value: 'no', label: 'No' },
  ], domain: 'info-money' },
  { id: 'q10', text: 'Is there enough cash in the house to buy a few days\u2019 essentials if cards stopped working?', options: [
    { value: 'yes', label: 'Yes' },
    { value: 'little', label: 'A little' },
    { value: 'none', label: 'None' },
  ], domain: 'info-money' },
  { id: 'q11', text: 'Do you know where your stop-tap and fuse box are \u2014 and could you find them in the dark?', options: [
    { value: 'both', label: 'Both' },
    { value: 'one', label: 'One of them' },
    { value: 'neither', label: 'Neither' },
  ], domain: 'info-money' },
  { id: 'q12', text: 'If someone in your home takes regular medicine, how many days\u2019 supply is usually in the house?', options: [
    { value: 'week-or-less', label: 'A week or less' },
    { value: 'few-weeks', label: 'A few weeks' },
    { value: 'month-plus', label: 'A month or more' },
    { value: 'nobody', label: 'Nobody does' },
  ], domain: 'people' },
  { id: 'q13', text: 'Does anyone in your home depend on you \u2014 children, pets, or someone who needs care?', options: [
    { value: 'yes', label: 'Yes' },
    { value: 'no', label: 'No' },
  ], domain: 'people' },
  { id: 'q14', text: 'Is there a neighbour you could knock on \u2014 or who might knock on you?', options: [
    { value: 'yes', label: 'Yes' },
    { value: 'not-really', label: 'Not really' },
    { value: 'dont-know', label: 'Don\u2019t know them yet' },
  ], domain: 'people' },
  { id: 'q15', text: 'Could snow, flooding or a fallen tree cut off your road or street?', options: [
    { value: 'happened', label: 'Yes \u2014 it\u2019s happened' },
    { value: 'possibly', label: 'Possibly' },
    { value: 'unlikely', label: 'Unlikely' },
  ], domain: 'place' },
  { id: 'q16', text: 'Does getting in and out of your home depend on electricity \u2014 fob door, buzzer, electric gate \u2014 and could you leave with what matters in five minutes?', options: [
    { value: 'power-dependent', label: 'Power-dependent entry' },
    { value: 'free-slow', label: 'Free entry, but I\u2019d struggle to leave fast' },
    { value: 'free-quick', label: 'Free entry and I could go quickly' },
  ], domain: 'place' },
];

/* ── Domain labels ── */

const DOMAIN_LABELS: Record<DomainName, string> = {
  water: 'Water',
  food: 'Food',
  'power-heat': 'Power & heat',
  'info-money': 'Information & money',
  people: 'People',
  place: 'Place',
};

/* ── Scoring ── */

function computeWaterDays(a: Answers): number {
  if (!a.q1 || !a.q2) return 0;
  const q0 = a.q0 ?? 1;

  // Q2 base
  let base: number;
  switch (a.q2) {
    case 'none': base = 0; break;
    case 'few-litres': base = q0 >= 3 ? 0.25 : 0.5; break;
    case 'day-or-two': base = 1.5; break;
    case 'more': base = 3; break;
    default: base = 0;
  }

  // Q1 modifier
  switch (a.q1) {
    case 'yes': return 14;
    case 'not-sure': return base + 1;
    case 'no': return base;
    default: return base;
  }
}

function computeFoodDays(a: Answers): number {
  if (!a.q3 || !a.q4 || !a.q6) return 0;

  // Q3 base
  let base: number;
  switch (a.q3) {
    case 'day-or-so': base = 1; break;
    case '2-3-days': base = 2.5; break;
    case 'about-week': base = 7; break;
    case 'two-weeks-plus': base = 14; break;
    default: base = 0;
  }

  // Cooking penalty: only when Q6 = No or Not sure
  if (a.q6 === 'no' || a.q6 === 'not-sure') {
    switch (a.q4) {
      case 'hardly-any': return base * 0.5;
      case 'some': return base * 0.75;
      case 'plenty': return base * 1.0;
      default: return base;
    }
  }

  return base;
}

function computeBand(waterDays: number, foodDays: number): Band {
  const days = Math.min(waterDays, foodDays);
  if (days < 1) return 1;
  if (days < 3) return 2;
  if (days < 6) return 3;
  if (days < 14) return 4;
  return 5;
}

/* ── Domain bar states ── */

function getWaterBar(a: Answers): BarState {
  if (!a.q1 || !a.q2) return 'worth-a-look';
  if (a.q1 === 'yes' && (a.q2 === 'day-or-two' || a.q2 === 'more')) return 'secured';
  if (a.q1 !== 'yes' && (a.q2 === 'none' || a.q2 === 'few-litres')) return 'worth-a-look';
  return 'nearly-there';
}

function getFoodBar(a: Answers): BarState {
  if (!a.q3 || !a.q4) return 'worth-a-look';
  if ((a.q3 === 'about-week' || a.q3 === 'two-weeks-plus') && a.q4 !== 'hardly-any') return 'secured';
  if (a.q3 === 'day-or-so' || a.q3 === '2-3-days') return 'worth-a-look';
  return 'nearly-there';
}

function getPowerHeatScore(a: Answers): number {
  let score = 0;
  if (a.q6 === 'yes') score += 2;
  if (a.q7 === 'yes') score += 2;
  else if (a.q7 === 'phone-only') score += 1;
  if (a.q8 === 'yes') score += 1;
  if (a.q5 === 'mains-gas' || a.q5 === 'oil-lpg-solid') score += 1;
  return score;
}

function getPowerHeatBar(a: Answers): BarState {
  const score = getPowerHeatScore(a);
  if (score >= 5) return 'secured';
  if (score >= 3) return 'nearly-there';
  return 'worth-a-look';
}

function getInfoMoneyScore(a: Answers): number {
  let score = 0;
  if (a.q9 === 'yes') score += 2;
  else if (a.q9 === 'car-only') score += 1;
  if (a.q10 === 'yes') score += 2;
  else if (a.q10 === 'little') score += 1;
  if (a.q11 === 'both') score += 2;
  else if (a.q11 === 'one') score += 1;
  return score;
}

function getInfoMoneyBar(a: Answers): BarState {
  const score = getInfoMoneyScore(a);
  if (score >= 5) return 'secured';
  if (score >= 3) return 'nearly-there';
  return 'worth-a-look';
}

function getPeopleScore(a: Answers): { score: number; max: number } {
  let score = 0;
  let max = 4;

  if (a.q12 === 'nobody') {
    // Q12 removed from denominator — scored /2 on Q14 alone
    max = 2;
  } else {
    if (a.q12 === 'month-plus') score += 2;
    else if (a.q12 === 'few-weeks') score += 1;
  }

  if (a.q14 === 'yes') score += 2;
  else if (a.q14 === 'not-really') score += 1;

  return { score, max };
}

function getPeopleBar(a: Answers): BarState {
  const { score, max } = getPeopleScore(a);
  if (score === max) return 'secured';
  if (max === 2) return score >= 1 ? 'nearly-there' : 'worth-a-look';
  if (score >= 2) return 'nearly-there';
  return 'worth-a-look';
}

function getPlaceScore(a: Answers): number {
  let score = 0;
  if (a.q15 === 'unlikely') score += 2;
  else if (a.q15 === 'possibly') score += 1;
  if (a.q16 === 'free-quick') score += 2;
  else if (a.q16 === 'free-slow') score += 1;
  return score;
}

function getPlaceBar(a: Answers): BarState {
  const score = getPlaceScore(a);
  if (score === 4) return 'secured';
  if (score >= 2) return 'nearly-there';
  return 'worth-a-look';
}

/* ── Bar rendering helpers ── */

function barFillWidth(state: BarState): string {
  switch (state) {
    case 'secured': return 'w-full';
    case 'nearly-there': return 'w-3/5';
    case 'worth-a-look': return 'w-1/4';
  }
}

function barFillColor(state: BarState): string {
  switch (state) {
    case 'secured': return 'bg-[var(--success)]';
    case 'nearly-there': return 'bg-[var(--brand)]';
    case 'worth-a-look': return 'bg-[var(--muted)]';
  }
}

function barLabel(state: BarState): string {
  switch (state) {
    case 'secured': return 'Secured';
    case 'nearly-there': return 'Nearly there';
    case 'worth-a-look': return 'Worth a look';
  }
}

function barLabelColor(state: BarState): string {
  switch (state) {
    case 'secured': return 'text-[var(--success)]';
    case 'nearly-there': return 'text-[var(--brand)]';
    case 'worth-a-look': return 'text-[var(--muted)]';
  }
}

/* ── Verdict copy ── */

interface VerdictCopy {
  headline: string;
  supporting: string;
}

const VERDICT_COPY: Record<Band, VerdictCopy> = {
  1: {
    headline: 'Right now, a bad night would be hard going.',
    supporting: 'The good news: your two biggest gaps close tonight, for free.',
  },
  2: {
    headline: 'You\u2019d get through a rough weekend.',
    supporting: 'A short power cut or a storm that keeps you in \u2014 you\u2019d manage, a bit uncomfortably. You\u2019re closer to solid than you might think.',
  },
  3: {
    headline: 'You\u2019d cope for the best part of a week.',
    supporting: 'Most disruptions in Britain are over inside this window. You\u2019ve already secured the hard part; what\u2019s left is topping up, not starting over.',
  },
  4: {
    headline: 'You\u2019d hold steady through a hard week.',
    supporting: 'That puts your household ahead of most on the street \u2014 which also means you\u2019re the door someone else might knock on. Worth knowing.',
  },
  5: {
    headline: 'Your household is genuinely well set.',
    supporting: 'A long outage, a cut-off road, a bad cold snap \u2014 you\u2019d see it through. The job now is rotation, not accumulation.',
  },
};

/* ── Main component ── */

export default function Page() {
  const [answers, setAnswers] = useState<Answers>({
    q0: null, q1: null, q2: null, q3: null, q4: null,
    q5: null, q6: null, q7: null, q8: null, q9: null,
    q10: null, q11: null, q12: null, q13: null, q14: null,
    q15: null, q16: null,
  });
  const resultsRef = useRef<HTMLDivElement>(null);

  const totalQuestions = 17;
  const answeredCount = useMemo(() => {
    return Object.values(answers).filter((v) => v !== null).length;
  }, [answers]);

  const allAnswered = answeredCount === totalQuestions;

  const setAnswer = (id: keyof Answers, value: string) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  // Scroll to results when all answered
  useEffect(() => {
    if (allAnswered && resultsRef.current) {
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [allAnswered]);

  // ── Computed score ──

  const score = useMemo(() => {
    if (!allAnswered) return null;
    const waterDays = computeWaterDays(answers);
    const foodDays = computeFoodDays(answers);
    const band = computeBand(waterDays, foodDays);
    return { waterDays, foodDays, band };
  }, [answers, allAnswered]);

  // ── Domain bars ──

  const domainBars = useMemo(() => {
    if (!allAnswered) return null;
    return {
      water: getWaterBar(answers),
      food: getFoodBar(answers),
      'power-heat': getPowerHeatBar(answers),
      'info-money': getInfoMoneyBar(answers),
      people: getPeopleBar(answers),
      place: getPlaceBar(answers),
    } as Record<DomainName, BarState>;
  }, [answers, allAnswered]);

  // ── Find-out actions from "Not sure" answers ──

  const findOutActions = useMemo(() => {
    if (!allAnswered) return [];
    const actions: string[] = [];
    if (answers.q1 === 'not-sure') {
      actions.push('One call to your water company settles this.');
    }
    if (answers.q6 === 'not-sure') {
      actions.push('Check tonight \u2014 it changes your whole picture.');
    }
    return actions;
  }, [answers, allAnswered]);

  // ── Non-scoring steers ──

  const powerHeatSteer = useMemo(() => {
    if (!allAnswered) return null;
    if (answers.q5 === 'electric' || answers.q5 === 'heat-pump' || answers.q5 === 'not-sure') {
      return 'Your heat depends on the grid \u2014 warm layers, blankets and a filled flask matter more for your household than most.';
    }
    return null;
  }, [answers, allAnswered]);

  const powerEntryAction = useMemo(() => {
    if (!allAnswered) return null;
    if (answers.q16 === 'power-dependent') {
      return 'Find your door\u2019s manual release before you ever need it \u2014 the concierge, factor or manual will know.';
    }
    return null;
  }, [answers, allAnswered]);

  // ── Domain bar free-action lines ──

  const domainActions = useMemo(() => {
    if (!allAnswered || !domainBars) return [];
    const actions: string[] = [];

    // Q13 Yes: medicines/pet-food actions ordered first
    if (answers.q13 === 'yes') {
      actions.push('Check your medicine cabinet and pet food stock \u2014 those matter before anything else on this page.');
    }

    if (domainBars.water === 'worth-a-look') {
      actions.push('Two filled bottles per person changes this tonight.');
    }
    if (domainBars['info-money'] === 'worth-a-look') {
      actions.push('Find your stop-tap and fuse box before you need them in the dark \u2014 two minutes, no cost.');
    }
    if (domainBars.people === 'worth-a-look') {
      actions.push('Knowing one neighbour\u2019s name is worth more than most kit on this page.');
    }
    if (domainBars.place === 'worth-a-look') {
      actions.push('If your road can be cut, plan a tier up in the planner \u2014 a hard month, not a bad fortnight.');
    }

    if (powerEntryAction) {
      actions.push(powerEntryAction);
    }

    // Band 1: first action always fill bottles
    if (score && score.band === 1) {
      actions.unshift('Fill any bottles you have from the tap. That\u2019s drinking water secured \u2014 your single biggest gap, gone before bed.');
    }

    return actions;
  }, [allAnswered, domainBars, answers, score, powerEntryAction]);

  // ── Water sets the clock ──

  const showWaterSetsClock = useMemo(() => {
    if (!allAnswered || !score || !domainBars) return false;
    return score.waterDays < score.foodDays && (domainBars.food === 'secured' || domainBars.food === 'nearly-there');
  }, [allAnswered, score, domainBars]);

  // ── Render helpers ──

  const renderQuestion = (q: QuestionDef) => {
    const value = answers[q.id];
    return (
      <div key={q.id} className="mb-4">
        <p className="mb-2 text-sm font-medium text-[var(--foreground)]">{q.text}</p>
        <div className="flex flex-wrap gap-2">
          {q.options.map((opt) => {
            const isSelected = value === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => setAnswer(q.id, opt.value)}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                  isSelected
                    ? 'bg-[var(--brand)] text-white border-[var(--brand)]'
                    : 'border-[var(--border)] bg-[var(--card)] text-[var(--muted)] hover:bg-[var(--accent)]'
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const renderDomainSection = (domain: DomainName, questionIds: (keyof Answers)[]) => {
    const domainQuestions = QUESTIONS.filter((q) => questionIds.includes(q.id));
    return (
      <section className="mb-8">
        <h2 className="category-ticket mb-4">{DOMAIN_LABELS[domain]}</h2>
        {domainQuestions.map(renderQuestion)}
      </section>
    );
  };

  const renderBar = (domain: DomainName, state: BarState) => {
    return (
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-medium text-[var(--foreground)]">{DOMAIN_LABELS[domain]}</span>
          <span className={`text-xs font-medium ${barLabelColor(state)}`}>{barLabel(state)}</span>
        </div>
        <div className="h-2 w-full rounded-full bg-[var(--border)] overflow-hidden">
          <div className={`h-full rounded-full transition-all duration-500 ${barFillColor(state)} ${barFillWidth(state)}`} />
        </div>
      </div>
    );
  };

  // ── Render ──

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Intro */}
        <div className="mb-8">
          <h1 className="font-serif text-2xl font-medium text-[var(--foreground)] sm:text-3xl">
            How ready is your household?
          </h1>
          <p className="mt-2 text-sm italic text-[var(--muted)]">
            Seventeen quick questions. About three minutes. No right answers \u2014 just an honest picture and the cheapest ways to improve it.
          </p>
          <p className="mt-3 text-xs text-[var(--muted)] border-l-2 border-[var(--border)] pl-3 leading-relaxed">
            Your answers stay on your device. Nothing is stored, nothing is sent \u2014 we never see them.
          </p>
        </div>

        {/* Progress indicator */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-[var(--muted)]">
              {answeredCount} of {totalQuestions} answered
            </span>
            {allAnswered && (
              <span className="text-xs font-medium text-[var(--success)]">All done</span>
            )}
          </div>
          <div className="h-1.5 w-full rounded-full bg-[var(--border)] overflow-hidden">
            <div
              className="h-full rounded-full bg-[var(--brand)] transition-all duration-300"
              style={{ width: `${(answeredCount / totalQuestions) * 100}%` }}
            />
          </div>
        </div>

        {/* Q0 — Preamble */}
        {renderQuestion(QUESTIONS[0])}

        {/* Domain sections */}
        {renderDomainSection('water', ['q1', 'q2'])}
        {renderDomainSection('food', ['q3', 'q4'])}
        {renderDomainSection('power-heat', ['q5', 'q6', 'q7', 'q8'])}
        {renderDomainSection('info-money', ['q9', 'q10', 'q11'])}
        {renderDomainSection('people', ['q12', 'q13', 'q14'])}
        {renderDomainSection('place', ['q15', 'q16'])}

        {/* Results panel */}
        {allAnswered && score && domainBars && (
          <div ref={resultsRef} className="mt-8 scroll-mt-8">
            <div className="section-divider mb-6" />

            {/* Headline verdict */}
            <div className="verdict-panel mb-6">
              <p className="font-serif text-lg font-medium text-[var(--foreground)]">
                {VERDICT_COPY[score.band].headline}
              </p>
              <p className="mt-1 text-sm text-[var(--brand-dark)]">
                {VERDICT_COPY[score.band].supporting}
              </p>
              {showWaterSetsClock && (
                <p className="mt-2 text-sm text-[var(--brand)]">
                  Water sets the clock \u2014 everything else follows.
                </p>
              )}
            </div>

            {/* Domain bars */}
            <div className="mb-6">
              <h3 className="font-serif text-sm font-medium text-[var(--foreground)] mb-3">Where you stand</h3>
              {renderBar('water', domainBars.water)}
              {renderBar('food', domainBars.food)}
              {renderBar('power-heat', domainBars['power-heat'])}

              {/* Power heat steer */}
              {powerHeatSteer && (
                <p className="mb-3 ml-1 text-xs text-[var(--muted)] italic">{powerHeatSteer}</p>
              )}

              {renderBar('info-money', domainBars['info-money'])}
              {renderBar('people', domainBars.people)}
              {renderBar('place', domainBars.place)}
            </div>

            {/* Actions */}
            <div className="mb-6">
              <h3 className="font-serif text-sm font-medium text-[var(--foreground)] mb-3">What to do next</h3>
              {domainActions.length > 0 && (
                <ul className="space-y-2">
                  {domainActions.map((action, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-[var(--muted)]">
                      <span className="mt-0.5 shrink-0 text-[var(--brand)]">&rarr;</span>
                      <span>{action}</span>
                    </li>
                  ))}
                </ul>
              )}
              {findOutActions.length > 0 && (
                <div className="mt-4">
                  <p className="text-xs font-medium text-[var(--muted)] mb-2">Find out first</p>
                  <ul className="space-y-2">
                    {findOutActions.map((action, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-[var(--muted)]">
                        <span className="mt-0.5 shrink-0 text-[var(--brand)]">&rarr;</span>
                        <span>{action}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Bridge to planner */}
            <div className="section-divider pt-6">
              <p className="text-sm text-[var(--muted)] leading-relaxed">
                Your answers stay on your device \u2014 we never see them. Screenshot this page if you\u2019d like to keep it. When you\u2019re ready, the planner turns &lsquo;worth a look&rsquo; into a shopping list that fits your budget, built around what you already have.
              </p>
              <a
                href="/"
                className="mt-4 inline-block rounded-full bg-[var(--brand)] px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[var(--brand-dark)]"
              >
                Open the planner
              </a>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}