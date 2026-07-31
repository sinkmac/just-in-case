/**
 * Build-time check: fail the build if any guide page's verification is overdue.
 *
 * Reads verification metadata from src/lib/guide-verification.ts,
 * compares each page's lastVerified + verifyWithin against today's date,
 * and exits with code 1 if any page is stale.
 *
 * Wired into package.json as part of the build sequence, so a stale page
 * blocks a Netlify deploy.
 */

import { readFileSync } from 'node:fs';
import { join } from 'node:path';

// We can't import the TS module directly at build-time without tsx in the
// build path, so we parse the source file for the data array.
// This is a plain Node.js check that runs before the SvelteKit/Next build.

const CWD = process.cwd();
const DATA_FILE = join(CWD, 'src', 'lib', 'guide-verification.ts');

interface GuideVerification {
  slug: string;
  lastVerified: string;
  verifyWithin: number;
}

function parseVerifications(source: string): GuideVerification[] {
  const results: GuideVerification[] = [];

  // Match lines like: { slug: 'when-its-over', lastVerified: '2026-07', verifyWithin: 6 },
  const regex = /\{\s*slug:\s*'([^']+)'\s*,\s*lastVerified:\s*'([^']+)'\s*,\s*verifyWithin:\s*(\d+)\s*\},?/g;
  let match;
  while ((match = regex.exec(source)) !== null) {
    results.push({
      slug: match[1],
      lastVerified: match[2],
      verifyWithin: parseInt(match[3], 10),
    });
  }

  return results;
}

function isOverdue(v: GuideVerification, now: Date): boolean {
  const [y, m] = v.lastVerified.split('-').map(Number);
  const verified = new Date(y, m - 1, 1);
  const due = new Date(verified.getFullYear(), verified.getMonth() + v.verifyWithin, 1);
  return now >= due;
}

function monthsOverdue(v: GuideVerification, now: Date): number {
  const [y, m] = v.lastVerified.split('-').map(Number);
  const verified = new Date(y, m - 1, 1);
  const due = new Date(verified.getFullYear(), verified.getMonth() + v.verifyWithin, 1);
  const totalMonths = (now.getFullYear() - due.getFullYear()) * 12 + (now.getMonth() - due.getMonth());
  return Math.max(0, totalMonths);
}

function main() {
  const source = readFileSync(DATA_FILE, 'utf-8');
  const pages = parseVerifications(source);

  if (pages.length === 0) {
    console.error('ERROR: No guide verification data found. Check that src/lib/guide-verification.ts exists.');
    process.exit(1);
  }

  const now = new Date();
  const overdue = pages.filter(p => isOverdue(p, now));

  if (overdue.length > 0) {
    console.error('BUILD BLOCKED: The following guide pages have overdue verification dates:');
    for (const page of overdue) {
      console.error(`  /guides/${page.slug}  — last verified ${page.lastVerified} (${page.verifyWithin}-month window), ${monthsOverdue(page, now)} months overdue`);
    }
    process.exit(1);
  }

  console.log(`All ${pages.length} guide pages verified — dates are current.`);
  console.log(`Pages checked: ${pages.map(p => `/guides/${p.slug}`).join(', ')}`);
  process.exit(0);
}

main();