/**
 * Page-level UI constants for the Homes list. The `Home` type and
 * `HOMES` / `HOME_ACTIVITY` seed data now live in
 * `src/services/home/homes.mock.ts` — the services tree owns all
 * domain data. This file is kept only for labels that are specific to
 * the Homes page UI.
 */
import type { Home } from "../../services/home/home.types"

export const RATING_LABEL: Record<Home["rating"], string> = {
  outstanding: "Outstanding",
  good: "Good",
  requires_improvement: "Requires improvement",
  inadequate: "Inadequate",
}
