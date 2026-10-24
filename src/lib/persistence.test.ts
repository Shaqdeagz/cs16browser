import { expect, it, vi } from "vitest";
import { flushSync } from "svelte";

it("restores custom filters and writes changes for the next launch", async () => {
  localStorage.clear();
  localStorage.setItem(
    "cs16browser.filters",
    JSON.stringify({ discovery: { name: "!VIP", game: "!www" }, checks: { no_bots: true } }),
  );
  localStorage.setItem("cs16browser.portable.geo", JSON.stringify({ country: "US" }));
  vi.resetModules();
  const first = await import("./store.svelte");
  expect(first.ui.discovery.name).toBe("!VIP");
  expect(first.ui.discovery.game).toBe("!www");
  expect(first.ui.checks.no_bots).toBe(true);
  expect(first.ui.geoCountry).toBe("US");
  flushSync(() => {
    first.ui.discovery.name = "classic,!discord";
    first.ui.discovery.game = "Counter-Strike,!VIP";
    first.filterContinent("Europe");
  });
  vi.resetModules();
  const next = await import("./store.svelte");
  expect(next.ui.discovery.name).toBe("classic,!discord");
  expect(next.ui.discovery.game).toBe("Counter-Strike,!VIP");
  expect(next.ui.checks.no_bots).toBe(true);
  expect(next.ui.geoCountry).toBeNull();
  expect(next.ui.geoContinent).toBe("Europe");
  localStorage.clear();
});
