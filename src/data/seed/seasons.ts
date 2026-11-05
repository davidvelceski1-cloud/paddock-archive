/**
 * Seasons. Every year from 1923 has a record; featured seasons (2012, 2016, 2023, 2025) carry
 * race-by-race events (events.ts). PLACEHOLDER SEED — pending verification.
 */
import type { ArchiveInput, ClassId, Season } from "../schema.ts";
import { LEMANS_SOURCES, WEC_SOURCES } from "./reference.ts";
import { LE_MANS_NOT_HELD } from "./lemans.ts";

type S = ArchiveInput["seasons"][number];

const eraOf = (y: number) =>
  y <= 1939 ? "pre-war" : y <= 1981 ? "world-sportscar" : y <= 1992 ? "group-c" : y <= 2009 ? "gt-era" : y <= 2011 ? "ilmc" : y <= 2020 ? "lmp1-hybrid" : "hypercar";

const historicClasses = (y: number): ClassId[] => (y <= 1981 ? ["prototype"] : y <= 1992 ? ["group-c"] : y <= 1998 ? ["prototype", "gt1"] : ["lmp1", "gt1"]);

/** Le Mans-only years before 2010 (the world championship, when it existed, is not yet imported). */
const historic: S[] = [];
for (let y = 1923; y <= 2009; y++) {
  const notHeld = LE_MANS_NOT_HELD.includes(y);
  historic.push({
    year: y,
    championshipId: y >= 1953 && y <= 1992 ? "wsc" : null,
    eraSlug: eraOf(y),
    status: notHeld ? "not-held" : "le-mans-only",
    classes: notHeld ? [] : historicClasses(y),
    regulationChanges: [],
    sources: LEMANS_SOURCES,
  });
}

const P4 = ["lmp1", "lmp2", "lmgte-pro", "lmgte-am"] as ClassId[];

const wec: S[] = [
  {
    year: 2010,
    championshipId: "ilmc",
    eraSlug: "ilmc",
    status: "complete",
    classes: ["lmp1", "lmp2", "gt1"],
    rounds: 3,
    regulations: "ACO prototype and GT rules. The three-round cup did not include Le Mans.",
    regulationChanges: ["Intercontinental Le Mans Cup created as a global series for ACO-rules cars."],
    story:
      "The first Intercontinental Le Mans Cup ran over three rounds — Silverstone, Petit Le Mans and Zhuhai — and did not include the 24 Hours itself. At Le Mans that June, every [Peugeot](/teams/peugeot-sport) retired and the [Audi R15 TDI](/cars/audi-r15-tdi) finished 1-2-3.",
    sources: WEC_SOURCES,
  },
  {
    year: 2011,
    championshipId: "ilmc",
    eraSlug: "ilmc",
    status: "complete",
    classes: P4,
    rounds: 7,
    regulations: "New ACO prototype rules: smaller engines (3.7-litre diesels) and closed cockpits favoured.",
    regulationChanges: ["Le Mans added to the calendar.", "GT2 class renamed LMGTE and split into Pro and Am."],
    story:
      "Audi and Peugeot both arrived with new, smaller diesel prototypes. At Le Mans, [Audi](/teams/audi-sport-team-joest) lost two of its three [R18 TDIs](/cars/audi-r18-tdi) to huge accidents, yet the surviving car of [Fässler](/drivers/marcel-fassler), [Lotterer](/drivers/andre-lotterer) and [Tréluyer](/drivers/benoit-treluyer) held off the Peugeots to win by under 14 seconds.",
    sources: WEC_SOURCES,
  },
  {
    year: 2012,
    championshipId: "wec",
    eraSlug: "lmp1-hybrid",
    status: "complete",
    classes: P4,
    rounds: 8,
    regulations: "LMP1 open to hybrid and non-hybrid prototypes. Front-axle hybrid systems could only deploy energy above 120 km/h.",
    regulationChanges: ["The FIA World Endurance Championship replaces the Intercontinental Le Mans Cup.", "World titles for drivers and a world cup for manufacturers.", "Hybrid systems race in LMP1 for the first time."],
    story:
      "The first FIA World Endurance Championship season lost its headline rivalry before it began: [Peugeot](/teams/peugeot-sport) withdrew in January. [Audi](/teams/audi-sport-team-joest) opened with the non-hybrid [R18 ultra](/cars/audi-r18-ultra) at Sebring, then introduced the [R18 e-tron quattro](/cars/audi-r18-e-tron-quattro), which became the first hybrid to win Le Mans.\n\n[Toyota](/teams/toyota-gazoo-racing) joined at Le Mans with the [TS030 Hybrid](/cars/toyota-ts030-hybrid) and won three of the last four races, but [Fässler](/drivers/marcel-fassler), [Lotterer](/drivers/andre-lotterer) and [Tréluyer](/drivers/benoit-treluyer) took the first drivers' title and Audi the manufacturers' crown.",
    champions: [
      { classId: "lmp1", drivers: ["marcel-fassler", "andre-lotterer", "benoit-treluyer"], manufacturer: "audi", team: "audi-sport-team-joest", car: "audi-r18-e-tron-quattro" },
    ],
    standings: [
      { classId: "lmp1", kind: "manufacturers", rows: [{ pos: 1, entrant: ["audi"] }, { pos: 2, entrant: ["toyota"] }], complete: true },
      { classId: "lmp1", kind: "drivers", rows: [{ pos: 1, entrant: ["marcel-fassler", "andre-lotterer", "benoit-treluyer"], car: "audi-r18-e-tron-quattro" }] },
    ],
    sources: WEC_SOURCES,
  },
  {
    year: 2013,
    championshipId: "wec",
    eraSlug: "lmp1-hybrid",
    status: "complete",
    classes: P4,
    rounds: 8,
    story:
      "Audi's last season before Porsche's arrival. [Tom Kristensen](/drivers/tom-kristensen) won Le Mans for a record ninth time in a race overshadowed by the death of Allan Simonsen in the GTE Am class, and shared the world title with [Allan McNish](/drivers/allan-mcnish) and [Loïc Duval](/drivers/loic-duval). McNish retired at the end of the year.",
    champions: [{ classId: "lmp1", drivers: ["tom-kristensen", "allan-mcnish", "loic-duval"], manufacturer: "audi", team: "audi-sport-team-joest", car: "audi-r18-e-tron-quattro" }],
    sources: WEC_SOURCES,
  },
  {
    year: 2014,
    championshipId: "wec",
    eraSlug: "lmp1-hybrid",
    status: "complete",
    classes: P4,
    rounds: 8,
    regulations: "New LMP1 rules built around an energy allocation per lap, with manufacturers choosing a hybrid energy class.",
    regulationChanges: ["LMP1 split into hybrid (LMP1-H) and non-hybrid (LMP1-L) subclasses.", "Fuel energy per lap limited, with more fuel for less hybrid energy.", "Porsche returns with the 919 Hybrid."],
    story:
      "The new energy-based rules suited [Toyota](/teams/toyota-gazoo-racing), whose four-wheel-drive [TS040 Hybrid](/cars/toyota-ts040-hybrid) won both titles for [Anthony Davidson](/drivers/anthony-davidson) and [Sébastien Buemi](/drivers/sebastien-buemi). [Audi](/teams/audi-sport-team-joest) still won Le Mans, and [Porsche](/teams/porsche-lmp1-team) took its first win at the São Paulo finale.",
    champions: [{ classId: "lmp1", drivers: ["anthony-davidson", "sebastien-buemi"], manufacturer: "toyota", team: "toyota-gazoo-racing", car: "toyota-ts040-hybrid" }],
    sources: WEC_SOURCES,
  },
  {
    year: 2015,
    championshipId: "wec",
    eraSlug: "lmp1-hybrid",
    status: "complete",
    classes: P4,
    rounds: 8,
    story:
      "[Porsche](/teams/porsche-lmp1-team) moved its [919 Hybrid](/cars/porsche-919-hybrid) into the 8-megajoule energy class and became the benchmark: a Le Mans 1-2 led by the third car of [Hülkenberg](/drivers/nico-hulkenberg), [Bamber](/drivers/earl-bamber) and [Tandy](/drivers/nick-tandy), and both titles. [Nissan](/teams/nissan-motorsports)'s front-engined LMP1 raced once.",
    champions: [{ classId: "lmp1", drivers: ["timo-bernhard", "mark-webber", "brendon-hartley"], manufacturer: "porsche", team: "porsche-lmp1-team", car: "porsche-919-hybrid" }],
    sources: WEC_SOURCES,
  },
  {
    year: 2016,
    championshipId: "wec",
    eraSlug: "lmp1-hybrid",
    status: "complete",
    classes: P4,
    rounds: 9,
    regulations: "Fuel energy per lap reduced for hybrid LMP1s to rein in lap times after 2015.",
    regulationChanges: ["Calendar grows to nine rounds with the 6 Hours of Mexico.", "Fuel-flow and energy allowances cut for LMP1-H cars."],
    story:
      "Three manufacturers, nine rounds and one of the cruellest finishes in Le Mans history. At the Silverstone opener the winning [Audi](/teams/audi-sport-team-joest) was disqualified for excessive skid-block wear, handing victory to the #2 [Porsche](/teams/porsche-lmp1-team).\n\nAt Le Mans, [Toyota](/teams/toyota-gazoo-racing)'s #5 led into the final minutes, then lost power and stopped; the #2 Porsche of [Dumas](/drivers/romain-dumas), [Jani](/drivers/neel-jani) and [Lieb](/drivers/marc-lieb) inherited the win. That crew's consistency won the title, Porsche took the manufacturers' crown, and Audi — having announced its withdrawal in October — won the final race in Bahrain.",
    champions: [{ classId: "lmp1", drivers: ["romain-dumas", "neel-jani", "marc-lieb"], manufacturer: "porsche", team: "porsche-lmp1-team", car: "porsche-919-hybrid" }],
    standings: [
      { classId: "lmp1", kind: "manufacturers", rows: [{ pos: 1, entrant: ["porsche"] }, { pos: 2, entrant: ["audi"] }, { pos: 3, entrant: ["toyota"] }], complete: true },
      { classId: "lmp1", kind: "drivers", rows: [{ pos: 1, entrant: ["romain-dumas", "neel-jani", "marc-lieb"], car: "porsche-919-hybrid" }] },
    ],
    sources: WEC_SOURCES,
  },
  {
    year: 2017,
    championshipId: "wec",
    eraSlug: "lmp1-hybrid",
    status: "complete",
    classes: P4,
    rounds: 9,
    story:
      "With Audi gone, [Porsche](/teams/porsche-lmp1-team) and [Toyota](/teams/toyota-gazoo-racing) went head to head. [Kamui Kobayashi](/drivers/kamui-kobayashi) set the Le Mans lap record in qualifying, but Toyota's race unravelled overnight and the #2 Porsche recovered from a long repair to win. Porsche took both titles, then announced its exit.",
    champions: [{ classId: "lmp1", drivers: ["timo-bernhard", "earl-bamber", "brendon-hartley"], manufacturer: "porsche", team: "porsche-lmp1-team", car: "porsche-919-hybrid" }],
    sources: WEC_SOURCES,
  },
  {
    year: 2018,
    label: "2018–19",
    championshipId: "wec",
    eraSlug: "lmp1-hybrid",
    status: "complete",
    classes: P4,
    rounds: 8,
    regulations: "Equivalence of technology rules aimed to balance non-hybrid privateer LMP1s against Toyota's hybrids.",
    regulationChanges: ["A 'super season' spanning May 2018 to June 2019, with two Le Mans races.", "Equivalence of technology introduced in LMP1."],
    story:
      "The only hybrid manufacturer left, [Toyota](/teams/toyota-gazoo-racing) finally won Le Mans — twice, in 2018 and 2019 — with [Fernando Alonso](/drivers/fernando-alonso), [Sébastien Buemi](/drivers/sebastien-buemi) and [Kazuki Nakajima](/drivers/kazuki-nakajima), who also took the title.",
    champions: [{ classId: "lmp1", drivers: ["fernando-alonso", "sebastien-buemi", "kazuki-nakajima"], manufacturer: "toyota", team: "toyota-gazoo-racing", car: "toyota-ts050-hybrid" }],
    sources: WEC_SOURCES,
  },
  {
    year: 2019,
    label: "2019–20",
    championshipId: "wec",
    eraSlug: "lmp1-hybrid",
    status: "complete",
    classes: P4,
    rounds: 8,
    regulationChanges: ["Success handicaps introduced in LMP1.", "Le Mans moved to September 2020 because of the COVID-19 pandemic."],
    story:
      "LMP1's final season. Success handicaps opened the door for [Rebellion](/teams/rebellion-racing) to win at Shanghai, the pandemic pushed Le Mans to September 2020, and [Conway](/drivers/mike-conway), [Kobayashi](/drivers/kamui-kobayashi) and [López](/drivers/jose-maria-lopez) won the title for Toyota.",
    champions: [{ classId: "lmp1", drivers: ["mike-conway", "kamui-kobayashi", "jose-maria-lopez"], manufacturer: "toyota", team: "toyota-gazoo-racing", car: "toyota-ts050-hybrid" }],
    sources: WEC_SOURCES,
  },
  {
    year: 2021,
    championshipId: "wec",
    eraSlug: "hypercar",
    status: "complete",
    classes: ["hypercar", "lmp2", "lmgte-pro", "lmgte-am"],
    rounds: 6,
    regulations: "Le Mans Hypercar (LMH) regulations, with Balance of Performance across the top class.",
    regulationChanges: ["Hypercar replaces LMP1 as the top class.", "Balance of Performance applied to the top class.", "Le Mans held in August."],
    story:
      "The first Hypercar season pitted [Toyota](/teams/toyota-gazoo-racing)'s [GR010 Hybrid](/cars/toyota-gr010-hybrid) against Glickenhaus and the grandfathered [Alpine A480](/cars/alpine-a480). The #7 crew won Le Mans in August; the #8 crew took the title.",
    champions: [{ classId: "hypercar", drivers: ["sebastien-buemi", "brendon-hartley", "kazuki-nakajima"], manufacturer: "toyota", team: "toyota-gazoo-racing", car: "toyota-gr010-hybrid" }],
    sources: WEC_SOURCES,
  },
  {
    year: 2022,
    championshipId: "wec",
    eraSlug: "hypercar",
    status: "complete",
    classes: ["hypercar", "lmp2", "lmgte-pro", "lmgte-am"],
    rounds: 6,
    regulationChanges: ["Peugeot's 9X8 debuts at Monza.", "Final season of GTE Pro."],
    story:
      "[Peugeot](/teams/peugeot-sport) returned mid-season with the wingless [9X8](/cars/peugeot-9x8). [Toyota](/teams/toyota-gazoo-racing) won Le Mans for a fifth straight year, and [Ryo Hirakawa](/drivers/ryo-hirakawa) won it and the title in his first season alongside [Buemi](/drivers/sebastien-buemi) and [Hartley](/drivers/brendon-hartley).",
    champions: [{ classId: "hypercar", drivers: ["sebastien-buemi", "brendon-hartley", "ryo-hirakawa"], manufacturer: "toyota", team: "toyota-gazoo-racing", car: "toyota-gr010-hybrid" }],
    sources: WEC_SOURCES,
  },
  {
    year: 2023,
    championshipId: "wec",
    eraSlug: "hypercar",
    status: "complete",
    classes: ["hypercar", "lmp2", "lmgte-am"],
    rounds: 7,
    regulations: "LMH and LMDh cars race together in Hypercar under a common Balance of Performance.",
    regulationChanges: ["LMDh cars (Porsche 963, Cadillac V-Series.R) join the Hypercar class.", "GTE Pro discontinued; GT racing continues in GTE Am.", "Le Mans centenary edition."],
    story:
      "The centenary of Le Mans and the first season of LMH–LMDh convergence. [Ferrari](/teams/ferrari-af-corse) returned to the top class with the [499P](/cars/ferrari-499p) and [Porsche](/teams/porsche-penske-motorsport) and Cadillac arrived with LMDh cars.\n\n[Toyota](/teams/toyota-gazoo-racing) won the opening three rounds, but at Le Mans the #51 Ferrari of [Pier Guidi](/drivers/alessandro-pier-guidi), [Calado](/drivers/james-calado) and [Giovinazzi](/drivers/antonio-giovinazzi) beat the #8 Toyota to give Ferrari its first outright win since 1965. Toyota still won both world titles with the #8 crew.",
    champions: [{ classId: "hypercar", drivers: ["sebastien-buemi", "brendon-hartley", "ryo-hirakawa"], manufacturer: "toyota", team: "toyota-gazoo-racing", car: "toyota-gr010-hybrid" }],
    standings: [
      { classId: "hypercar", kind: "manufacturers", rows: [{ pos: 1, entrant: ["toyota"] }, { pos: 2, entrant: ["ferrari"] }] },
      { classId: "hypercar", kind: "drivers", rows: [{ pos: 1, entrant: ["sebastien-buemi", "brendon-hartley", "ryo-hirakawa"], car: "toyota-gr010-hybrid" }] },
    ],
    sources: WEC_SOURCES,
  },
  {
    year: 2024,
    championshipId: "wec",
    eraSlug: "hypercar",
    status: "complete",
    classes: ["hypercar", "lmgt3"],
    rounds: 8,
    regulationChanges: ["LMGT3 replaces LMGTE Am as the only GT class.", "LMP2 leaves the WEC (it remains at Le Mans).", "BMW, Alpine, Lamborghini and Isotta Fraschini join Hypercar."],
    story:
      "The biggest Hypercar grid yet. [Ferrari](/teams/ferrari-af-corse)'s #50 won Le Mans, the [Porsche Penske](/teams/porsche-penske-motorsport) #6 crew of [Estre](/drivers/kevin-estre), [Lotterer](/drivers/andre-lotterer) and [Vanthoor](/drivers/laurens-vanthoor) won the drivers' title, and [Toyota](/teams/toyota-gazoo-racing) took the manufacturers' championship.",
    champions: [{ classId: "hypercar", drivers: ["kevin-estre", "andre-lotterer", "laurens-vanthoor"], manufacturer: "toyota", team: "porsche-penske-motorsport", car: "porsche-963" }],
    sources: WEC_SOURCES,
  },
  {
    year: 2025,
    championshipId: "wec",
    eraSlug: "hypercar",
    status: "complete",
    classes: ["hypercar", "lmgt3"],
    rounds: 8,
    regulationChanges: ["Aston Martin joins Hypercar with the Valkyrie."],
    story:
      "[Ferrari](/teams/ferrari-af-corse)'s strongest season of the Hypercar era. The 499P won the Qatar opener, and AF Corse's separately entered #83 won Le Mans — the third straight Ferrari victory — making [Robert Kubica](/drivers/robert-kubica) a Le Mans winner and [Ye Yifei](/drivers/yifei-ye) the first Chinese driver to win the race outright. The #51 crew of [Pier Guidi](/drivers/alessandro-pier-guidi), [Calado](/drivers/james-calado) and [Giovinazzi](/drivers/antonio-giovinazzi) won the drivers' title and Ferrari the manufacturers' championship.\n\nResults for several rounds are not yet in the archive.",
    champions: [{ classId: "hypercar", drivers: ["alessandro-pier-guidi", "james-calado", "antonio-giovinazzi"], manufacturer: "ferrari", team: "ferrari-af-corse", car: "ferrari-499p" }],
    standings: [
      { classId: "hypercar", kind: "manufacturers", rows: [{ pos: 1, entrant: ["ferrari"] }] },
      { classId: "hypercar", kind: "drivers", rows: [{ pos: 1, entrant: ["alessandro-pier-guidi", "james-calado", "antonio-giovinazzi"], car: "ferrari-499p" }] },
    ],
    sources: WEC_SOURCES,
  },
  {
    year: 2026,
    championshipId: "wec",
    eraSlug: "hypercar",
    status: "in-progress",
    classes: ["hypercar", "lmgt3"],
    story: "The current season. Results will appear here once they are imported and verified.",
    sources: WEC_SOURCES,
  },
];

export const seasons: ArchiveInput["seasons"] = [...historic, ...wec];

/** Season keys whose race calendars are in the archive. */
export const FEATURED_SEASONS = [2012, 2016, 2023, 2025];

export type { Season };
