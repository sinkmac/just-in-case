# Just In Case

Emergency food calculator for UK households, part of the Lighthouse platform.

## Phase status
- Phase 1: data model + calculation engine complete
- Phase 2: UI complete
- Phase 3: deploy + verification in progress

## Product
Just In Case helps a household work out what long-life food to buy for a given budget and number of weeks. It balances staple carbs, protein, fats, vegetables, morale, and micronutrients instead of blindly optimising one food.

## Tech
- Next.js App Router
- Tailwind CSS
- Vercel hosting
- Amazon Associates links (`biteforecas00-21`) with search fallback when ASIN is placeholder

## Domains to check
- justincase.scot
- justincase.co.uk

## Notes
- `region` is stubbed on every food item for future localisation.
- `morale_score` and `variety_score` are reserved for a later engine revision, not implemented in V1.
- Email capture is intentionally excluded from V1 until there is a real newsletter behind it.
