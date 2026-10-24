/** Country/continent grouping for the Geo right-click filter.
 * Used with IPv4 location data provided by Rust, not guessed from hostnames. */
const countries: Readonly<Record<string, string>> = {
  "North America":
    "US CA MX GL BM PM AG AI AW BB BL BS BZ CR CU CW DM DO GD GP GT HN HT JM KN KY LC MF MQ MS NI PA PR SV SX TC TT VC VG VI",
  "South America": "AR BO BR CL CO EC FK GF GY PE PY SR UY VE",
  Europe:
    "AD AL AT AX BA BE BG BY CH CZ DE DK EE ES FI FO FR GB GG GI GR HR HU IE IM IS IT JE LI LT LU LV MC MD ME MK MT NL NO PL PT RO RS RU SE SI SJ SK SM UA VA XK",
  Asia: "AE AF AM AZ BD BH BN BT CN CY GE HK ID IL IN IQ IR JO JP KG KH KP KR KZ LA LB LK MM MN MO MV MY NP OM PH PK PS QA SA SG SY TH TJ TL TM TR TW UZ VN YE",
  Africa:
    "AO BF BI BJ BW CD CF CG CI CM CV DJ DZ EG EH ER ET GA GH GM GN GQ GW KE KM LR LS LY MA MG ML MR MU MW MZ NA NE NG RE RW SC SD SH SL SN SO SS ST SZ TD TG TN TZ UG YT ZA ZM ZW",
  Oceania: "AS AU CK FJ FM GU KI MH MP NC NF NR NU NZ PF PG PN PW SB TK TO TV VU WF WS",
};
const mapped = new Map<string, string>();
for (const [continent, codes] of Object.entries(countries))
  for (const code of codes.split(" ")) if (code) mapped.set(code, continent);
export function continentFor(country: string | null): string | null {
  return country ? (mapped.get(country.toUpperCase()) ?? null) : null;
}
