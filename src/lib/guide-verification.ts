/**
 * Guide page verification metadata.
 *
 * lastVerified: year-month of the last fact-check (no day).
 * verifyWithin: months until the next check is due.
 *   - 6 for pages with food safety, official guidance URLs, or emergency contacts.
 *   - 12 for all other guide pages.
 *
 * This file is imported by both the build-time check script (scripts/check-dates.ts)
 * and individual page components for visible copy.
 */

export interface GuideVerification {
  slug: string;
  lastVerified: string; // YYYY-MM
  verifyWithin: number; // months
}

/**
 * All guide pages under src/app/guides/.
 *
 * Pages not listed in the brief's table get 6 as the conservative default.
 * "power-out-changes" in the brief maps to the actual page "when-powers-out".
 */
export const guideVerifications: GuideVerification[] = [
  { slug: 'when-its-over',          lastVerified: '2026-07', verifyWithin: 6  },
  { slug: 'when-powers-out',        lastVerified: '2026-07', verifyWithin: 6  },
  { slug: 'emergency-food-needs',   lastVerified: '2026-07', verifyWithin: 12 },
  { slug: 'storage-without-bunker', lastVerified: '2026-07', verifyWithin: 12 },
  { slug: 'what-we-leave-out',      lastVerified: '2026-07', verifyWithin: 12 },
  { slug: 'if-things-get-really-bad', lastVerified: '2026-07', verifyWithin: 6 },
  // Pages not in the brief's table — conservative default 6:
  { slug: 'car-kit',                lastVerified: '2026-07', verifyWithin: 6  },
  { slug: 'gear-worth-having',      lastVerified: '2026-07', verifyWithin: 6  },
];

export function getVerification(slug: string): GuideVerification | undefined {
  return guideVerifications.find(v => v.slug === slug);
}

export function isOverdue(v: GuideVerification, now: Date = new Date()): boolean {
  const [y, m] = v.lastVerified.split('-').map(Number);
  const verified = new Date(y, m - 1, 1); // first day of that month
  const due = new Date(verified.getFullYear(), verified.getMonth() + v.verifyWithin, 1);
  return now >= due;
}

export function monthsOverdue(v: GuideVerification, now: Date = new Date()): number {
  const [y, m] = v.lastVerified.split('-').map(Number);
  const verified = new Date(y, m - 1, 1);
  const due = new Date(verified.getFullYear(), verified.getMonth() + v.verifyWithin, 1);
  const totalMonths = (now.getFullYear() - due.getFullYear()) * 12 + (now.getMonth() - due.getMonth());
  return Math.max(0, totalMonths);
}

export function formatCheckDate(lastVerified: string): string {
  const [y, m] = lastVerified.split('-').map(Number);
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return `${months[m - 1]} ${y}`;
}