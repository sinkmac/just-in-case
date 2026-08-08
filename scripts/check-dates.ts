/**
 * Build-time check: fail the build if any guide page's verification is overdue,
 * or if the changelog's "last checked" date has gone stale.
 *
 * Reads verification metadata from src/lib/guide-verification.ts and the
 * changelog data from data/changelog.json, compares each against today's date,
 * and exits with code 1 if anything is stale.
 *
 * Guide pages: each carries lastVerified (YYYY-MM) + verifyWithin (months).
 * Changelog: lastChecked (YYYY-MM) is checked against a fixed 6-month window,
 * matching the guide pattern's conservative default.
 *
 * Wired into package.json as part of the build sequence, so a stale date
 * blocks a Netlify deploy.
 */

import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const CWD = process.cwd();
const DATA_FILE = join(CWD, 'src', 'lib', 'guide-verification.ts');
const CHANGELOG_FILE = join(CWD, 'data', 'changelog.json');

// Changelog staleness window in months. Aligned with the guide pattern's
// conservative default (6) — prices and guidance are the same risk class.
const CHANGELOG_CHECK_WITHIN_MONTHS = 6;

interface GuideVerification {
  slug: string;
  lastVerified: string; // YYYY-MM
  verifyWithin: number; // months
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

function monthToDate(ym: string): Date {
  const [y, m] = ym.split('-').map(Number);
  return new Date(y, m - 1, 1);
}

function isOverdue(v: GuideVerification, now: Date): boolean {
  const verified = monthToDate(v.lastVerified);
  const due = new Date(verified.getFullYear(), verified.getMonth() + v.verifyWithin, 1);
  return now >= due;
}

function monthsOverdue(v: GuideVerification, now: Date): number {
  const verified = monthToDate(v.lastVerified);
  const due = new Date(verified.getFullYear(), verified.getMonth() + v.verifyWithin, 1);
  const totalMonths = (now.getFullYear() - due.getFullYear()) * 12 + (now.getMonth() - due.getMonth());
  return Math.max(0, totalMonths);
}

interface ChangelogState {
  lastChecked: string; // YYYY-MM
}

function parseChangelog(source: string): ChangelogState | null {
  try {
    const data = JSON.parse(source);
    if (typeof data.lastChecked === 'string' && /^\d{4}-\d{2}$/.test(data.lastChecked)) {
      return { lastChecked: data.lastChecked };
    }
    return null;
  } catch {
    return null;
  }
}

function changelogIsOverdue(lastChecked: string, now: Date): boolean {
  const checked = monthToDate(lastChecked);
  const due = new Date(checked.getFullYear(), checked.getMonth() + CHANGELOG_CHECK_WITHIN_MONTHS, 1);
  return now >= due;
}

function changelogMonthsOverdue(lastChecked: string, now: Date): number {
  const checked = monthToDate(lastChecked);
  const due = new Date(checked.getFullYear(), checked.getMonth() + CHANGELOG_CHECK_WITHIN_MONTHS, 1);
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
  const errors: string[] = [];

  const overdue = pages.filter((p) => isOverdue(p, now));
  for (const page of overdue) {
    errors.push(
      `  /guides/${page.slug}  — last verified ${page.lastVerified} (${page.verifyWithin}-month window), ${monthsOverdue(page, now)} months overdue`,
    );
  }

  let changelogLine = '';
  try {
    const changelogSource = readFileSync(CHANGELOG_FILE, 'utf-8');
    const changelog = parseChangelog(changelogSource);
    if (changelog && changelogIsOverdue(changelog.lastChecked, now)) {
      errors.push(
        `  changelog "last checked"  — last checked ${changelog.lastChecked} (${CHANGELOG_CHECK_WITHIN_MONTHS}-month window), ${changelogMonthsOverdue(changelog.lastChecked, now)} months overdue`,
      );
    } else if (!changelog) {
      errors.push('  changelog "last checked"  — data/changelog.json missing or lastChecked field malformed');
    }
    changelogLine = changelog ? `; changelog "last checked" ${changelog.lastChecked}` : '; changelog: MISSING/MALFORMED';
  } catch (e) {
    errors.push(`  changelog "last checked"  — could not read data/changelog.json: ${(e as Error).message}`);
    changelogLine = '; changelog: UNREADABLE';
  }

  if (errors.length > 0) {
    console.error('BUILD BLOCKED: The following are stale or unverifiable:');
    for (const err of errors) {
      console.error(err);
    }
    process.exit(1);
  }

  console.log(`All ${pages.length} guide pages verified — dates are current${changelogLine}.`);
  console.log(`Pages checked: ${pages.map((p) => `/guides/${p.slug}`).join(', ')}`);
  process.exit(0);
}

main();