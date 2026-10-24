import { beforeEach, expect, it } from "vitest";
import { keywordMatches } from "./store.svelte";
import { continentFor } from "./regions";
import * as store from "./store.svelte";
import type { ServerRow } from "./bindings";

const row = (endpoint: string, changes: Partial<ServerRow> = {}): ServerRow => ({
  endpoint,
  hostname: "[VIP] Classic | Discord.gg",
  map: "de_dust2",
  gamedir: "cstrike",
  game: "www.adserver.net",
  players: 4,
  max_players: 16,
  bots: 0,
  bot_plugin: null,
  ping_ms: 30,
  secure: true,
  password: false,
  os: 1,
  live: true,
  outcome: "ok",
  banned: false,
  fake: false,
  verified: true,
  reasons: [],
  soft_reasons: [],
  country: "US",
  version: "",
  players_list: [],
  ...changes,
});

beforeEach(() => {
  store.reset();
  store.ui.tab = 0;
  store.ui.discovery.name = "";
  store.ui.discovery.game = "";
  store.ui.discovery.map = "";
  store.ui.discovery.secure = "<All>";
  store.ui.discovery.latency = "<All>";
  store.clearGeoFilter();
  for (const key of Object.keys(store.ui.checks) as (keyof typeof store.ui.checks)[])
    store.ui.checks[key] = false;
});

it("matches game descriptions with comma-separated exclude keywords", () => {
  expect(keywordMatches("www.adserver.net", "!www,!discord")).toBe(false);
  expect(keywordMatches("Counter-Strike", "!www,!discord")).toBe(true);
  expect(keywordMatches("Server | VIP", "classic,vip,!discord")).toBe(true);
  expect(keywordMatches("VIP Discord", "classic,vip,!discord")).toBe(false);
});

it("filters Game column independently from server Name", () => {
  store.upsert(row("ads"));
  store.upsert(row("clean", { game: "Counter-Strike" }));
  store.recompute();
  expect(store.ui.order).toHaveLength(2);
  store.ui.discovery.game = "!www";
  store.recompute();
  expect(store.ui.order.map((i) => store.ui.rows[i].endpoint)).toEqual(["clean"]);
  store.ui.discovery.name = "!Discord";
  store.recompute();
  expect(store.ui.order).toHaveLength(0);
});

it("limits countries and continents while preserving banned view", () => {
  store.upsert(row("us", { country: "US" }));
  store.upsert(row("fr", { country: "FR" }));
  store.upsert(row("au", { country: "AU" }));
  store.filterContinent("Europe");
  expect(store.ui.order.map((i) => store.ui.rows[i].endpoint)).toEqual(["fr"]);
  store.filterCountry("US");
  expect(store.ui.order.map((i) => store.ui.rows[i].endpoint)).toEqual(["us"]);
  store.clearGeoFilter();
  expect(store.ui.order).toHaveLength(3);
  expect(continentFor("AU")).toBe("Oceania");
});
