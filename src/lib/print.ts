// The planner page holds two printable lists: the three-day shopping list and
// the longer-stores plan. Mark which one is printing so CSS hides the other.
export function printOnly(which: "list" | "longer") {
  const root = document.documentElement;
  root.dataset.print = which;
  window.addEventListener("afterprint", () => delete root.dataset.print, { once: true });
  window.print();
}
