/**
 * Reference data: sources, classes, championships, eras and manufacturers.
 * PLACEHOLDER SEED — written from general motorsport knowledge and pending verification
 * against the primary sources listed below. See README → "Data status".
 */
import type { ArchiveInput } from "../schema.ts";

export const SEED_SOURCE = "seed-editorial";

export const sources: ArchiveInput["sources"] = [
  {
    id: SEED_SOURCE,
    title: "Paddock Archive editorial seed",
    publisher: "Paddock Archive",
    note: "Placeholder record compiled from general motorsport knowledge. Verify against the primary sources before relying on it.",
  },
  {
    id: "fiawec-results",
    title: "Official classifications and championship standings",
    publisher: "FIA World Endurance Championship",
    url: "https://www.fiawec.com",
    note: "Primary source for 2012 onwards.",
  },
  {
    id: "alkamel-timing",
    title: "Timing and scoring archive",
    publisher: "Al Kamel Systems",
    url: "https://fiawec.alkamelsystems.com",
    note: "Lap-by-lap timing, poles and fastest laps for WEC and ILMC events.",
  },
  {
    id: "aco-lemans",
    title: "24 Hours of Le Mans results archive",
    publisher: "Automobile Club de l'Ouest",
    url: "https://www.24h-lemans.com",
    note: "Primary source for every Le Mans since 1923.",
  },
  {
    id: "racingsportscars",
    title: "Sports-car results database",
    publisher: "Racing Sports Cars",
    url: "https://www.racingsportscars.com",
    note: "Secondary source for historic championship rounds.",
  },
];

/** The default citation pair for seed records: the seed itself and the source to verify against. */
export const WEC_SOURCES = [SEED_SOURCE, "fiawec-results"];
export const LEMANS_SOURCES = [SEED_SOURCE, "aco-lemans"];

export const classes: ArchiveInput["classes"] = [
  { id: "overall", name: "Overall", short: "Overall", family: "hist", from: 1923, to: null, description: "The outright classification across all classes." },
  {
    id: "hypercar",
    name: "Hypercar",
    short: "HY",
    family: "hyper",
    from: 2021,
    to: null,
    description: "The top class since 2021, combining bespoke Le Mans Hypercars (LMH) and, from 2023, LMDh cars built on spec LMP2-derived chassis — balanced against each other by Balance of Performance.",
  },
  {
    id: "lmp1",
    name: "LMP1",
    short: "LMP1",
    family: "lmp1",
    from: 2004,
    to: 2020,
    description: "Le Mans Prototype 1: the top prototype class until 2020. From 2012 it was split between manufacturer hybrids and non-hybrid privateers, and became the stage for the energy-recovery arms race of the hybrid era.",
  },
  {
    id: "lmp2",
    name: "LMP2",
    short: "LMP2",
    family: "lmp2",
    from: 2004,
    to: 2023,
    description: "The cost-capped prototype class for privateer teams, raced in the WEC until 2023 and still part of the Le Mans grid. Since 2017 it has used a single spec engine and four approved chassis constructors.",
  },
  {
    id: "lmgte-pro",
    name: "LMGTE Pro",
    short: "GTE Pro",
    family: "gt",
    from: 2011,
    to: 2022,
    description: "Factory-backed grand touring cars with professional line-ups. Dropped from the WEC after 2022.",
  },
  {
    id: "lmgte-am",
    name: "LMGTE Am",
    short: "GTE Am",
    family: "gt",
    from: 2011,
    to: 2023,
    description: "GTE cars of the previous specification with line-ups built around amateur and bronze-rated drivers. Replaced by LMGT3 for 2024.",
  },
  {
    id: "lmgt3",
    name: "LMGT3",
    short: "GT3",
    family: "gt",
    from: 2024,
    to: null,
    description: "GT3-based cars adapted for endurance racing, with mandatory amateur participation. Introduced in 2024 as the WEC's only GT class.",
  },
  {
    id: "gt1",
    name: "GT1",
    short: "GT1",
    family: "gt",
    from: 1993,
    to: 2010,
    description: "The top grand touring class of the 1990s and 2000s, home of road-car-derived racers that occasionally won Le Mans outright.",
  },
  {
    id: "group-c",
    name: "Group C",
    short: "Gr. C",
    family: "hist",
    from: 1982,
    to: 1992,
    description: "Closed-cockpit prototypes built to a fuel-consumption formula, the defining cars of the 1980s World Sportscar Championship.",
  },
  {
    id: "prototype",
    name: "Sports prototype",
    short: "Proto",
    family: "hist",
    from: 1923,
    to: 1981,
    description: "Catch-all for historic sports-racing cars and prototypes before the Group C era.",
  },
];

export const championships: ArchiveInput["championships"] = [
  {
    id: "wsc",
    name: "World Sportscar Championship",
    short: "WSC",
    from: 1953,
    to: 1992,
    description:
      "The FIA's world championship for sports cars, contested under several names between 1953 and 1992 — among them the World Championship for Makes, the World Endurance Championship and the World Sports-Prototype Championship. Le Mans was a round in most, but not all, of those seasons.",
  },
  {
    id: "ilmc",
    name: "Intercontinental Le Mans Cup",
    short: "ILMC",
    from: 2010,
    to: 2011,
    description: "A two-season cup organised by the Automobile Club de l'Ouest that brought manufacturers back to a global calendar and became the blueprint for the FIA World Endurance Championship.",
  },
  {
    id: "wec",
    name: "FIA World Endurance Championship",
    short: "WEC",
    from: 2012,
    to: null,
    description: "The world championship for endurance racing since 2012, jointly run by the FIA and the ACO, with the 24 Hours of Le Mans as its centrepiece.",
  },
];

export const eras: ArchiveInput["eras"] = [
  {
    slug: "pre-war",
    name: "Pre-war Le Mans",
    short: "1923–1939",
    from: 1923,
    to: 1939,
    summary:
      "The 24 Hours began in May 1923 as a test of production touring cars' reliability. Bentley's 'Bentley Boys' made it famous in the late 1920s, Alfa Romeo dominated the early 1930s, and French marques Bugatti and Delahaye won the last races before the war.",
    hallmarks: ["Le Mans run as a standalone race", "Production-based touring and sports cars", "The Le Mans start"],
  },
  {
    slug: "world-sportscar",
    name: "World Sportscar Championship",
    short: "1949–1981",
    from: 1949,
    to: 1981,
    championshipId: "wsc",
    summary:
      "Le Mans resumed in 1949 and a world championship for sports cars followed in 1953. Jaguar, Ferrari, Ford, Porsche and Matra fought some of the sport's most celebrated battles, culminating in the 917 era and the rise of turbocharging.",
    hallmarks: ["World championship for makes from 1953", "Ferrari vs Ford in the 1960s", "Porsche 917 and the 5-litre era"],
  },
  {
    slug: "group-c",
    name: "Group C",
    short: "1982–1992",
    from: 1982,
    to: 1992,
    championshipId: "wsc",
    summary:
      "A fuel-efficiency formula that produced the Porsche 956 and 962, Jaguar's XJR series, Sauber-Mercedes and Mazda's rotary 787B. It ended with the 3.5-litre rules, spiralling costs and the collapse of the world championship after 1992.",
    hallmarks: ["Fuel-consumption formula", "Porsche 956/962 customer grids", "3.5-litre F1-style engines from 1991"],
  },
  {
    slug: "gt-era",
    name: "GT era",
    short: "1993–2009",
    from: 1993,
    to: 2009,
    summary:
      "With no world championship, Le Mans carried the sport. GT1 supercars briefly won outright, then the ACO's prototype rules gave rise to Audi's R8 and the diesel duel between the Audi R10 and the Peugeot 908.",
    hallmarks: ["No world championship", "GT1 homologation specials", "Audi's diesel revolution"],
  },
  {
    slug: "ilmc",
    name: "Intercontinental Le Mans Cup",
    short: "2010–2011",
    from: 2010,
    to: 2011,
    championshipId: "ilmc",
    summary: "A two-year bridge that brought Audi and Peugeot together on a global calendar and proved the case for a new world championship.",
    hallmarks: ["Audi vs Peugeot diesel rivalry", "Global calendar returns", "Blueprint for the WEC"],
  },
  {
    slug: "lmp1-hybrid",
    name: "LMP1 Hybrid era",
    short: "2012–2020",
    from: 2012,
    to: 2020,
    championshipId: "wec",
    summary:
      "The FIA WEC's first chapter. Audi, Toyota and Porsche built ever more powerful hybrid prototypes under an energy-allocation rulebook; Nissan tried a front-engined outlier. Audi left in 2016, Porsche in 2017, and Toyota closed out the class.",
    hallmarks: ["Hybrid energy classes", "Audi vs Toyota vs Porsche", "Privateer non-hybrid LMP1s"],
  },
  {
    slug: "hypercar",
    name: "Hypercar era",
    short: "2021–today",
    from: 2021,
    to: null,
    championshipId: "wec",
    summary:
      "Le Mans Hypercar rules from 2021, joined by the American-European LMDh platform in 2023, triggered the biggest manufacturer influx in decades. Balance of Performance replaced the spending race, and LMGT3 replaced GTE in 2024.",
    hallmarks: ["LMH and LMDh convergence", "Balance of Performance", "Ferrari's return to the top class"],
  },
];

export const manufacturers: ArchiveInput["manufacturers"] = [
  { id: "audi", name: "Audi", country: "DE", summary: "Defined the modern era of prototype racing: the R8, the first diesel winner (R10 TDI) and the first hybrid winner (R18 e-tron quattro). Left at the end of 2016." },
  { id: "porsche", name: "Porsche", country: "DE", summary: "The most successful manufacturer at Le Mans, from the 917 through the 956/962 to the 919 Hybrid, and a Hypercar entrant with the LMDh 963." },
  { id: "toyota", name: "Toyota", country: "JP", summary: "Decades of near-misses at Le Mans before a run of victories from 2018. The constant of the WEC's hybrid and Hypercar eras." },
  { id: "peugeot", name: "Peugeot", country: "FR", summary: "Group C champion with the 905, diesel rival to Audi with the 908, and Hypercar entrant with the 9X8 from 2022." },
  { id: "ferrari", name: "Ferrari", country: "IT", summary: "Dominant at Le Mans in the late 1950s and early 1960s, a GT force for decades, and back in the top class with the 499P from 2023." },
  { id: "nissan", name: "Nissan", country: "JP", summary: "Group C contender and, in 2015, the radical front-engined GT-R LM Nismo LMP1." },
  { id: "aston-martin", name: "Aston Martin", country: "GB", summary: "Le Mans winner in 1959, a long-time GT class contender, and Hypercar entrant with the Valkyrie from 2025." },
  { id: "alpine", name: "Alpine", country: "FR", summary: "Renault's sports-car brand: LMP2 champions with Signatech, LMP1 with the A480, and Hypercar with the A424 LMDh." },
  { id: "ford", name: "Ford", country: "US", summary: "Won Le Mans four years running from 1966 with the GT40, and returned to win the GTE Pro class at Le Mans in 2016 with the Ford GT." },
  { id: "jaguar", name: "Jaguar", country: "GB", summary: "Five wins in the 1950s with the C-Type and D-Type, then two more in the Group C era with the TWR-run XJRs." },
  { id: "bentley", name: "Bentley", country: "GB", summary: "The 'Bentley Boys' won five times between 1924 and 1930; the Speed 8 returned the marque to victory in 2003." },
  { id: "mazda", name: "Mazda", country: "JP", summary: "The only rotary-engined Le Mans winner, with the 787B in 1991." },
  { id: "matra", name: "Matra", country: "FR", summary: "French aerospace company whose V12 MS670 won Le Mans three years running, 1972–1974." },
  { id: "mercedes-benz", name: "Mercedes-Benz", country: "DE", summary: "Won Le Mans in 1952 with the 300 SL and in 1989 with the Sauber C9." },
  { id: "bmw", name: "BMW", country: "DE", summary: "Won Le Mans in 1999 with the V12 LMR; returned to the top class with the LMDh M Hybrid V8 in 2024." },
  { id: "cadillac", name: "Cadillac", country: "US", summary: "LMDh entrant with the V-Series.R from 2023." },
  { id: "mclaren", name: "McLaren", country: "GB", summary: "Won Le Mans at the first attempt in 1995 with the F1 GTR road-car racer." },
  { id: "renault", name: "Renault", country: "FR", summary: "Won Le Mans in 1978 with the turbocharged Renault Alpine A442B." },
  { id: "rondeau", name: "Rondeau", country: "FR", summary: "Jean Rondeau remains the only driver to win Le Mans in a car bearing his own name (1980)." },
  { id: "bugatti", name: "Bugatti", country: "FR", summary: "Won Le Mans in 1937 and 1939 with the Type 57." },
  { id: "alfa-romeo", name: "Alfa Romeo", country: "IT", summary: "Won four consecutive Le Mans races with the 8C, 1931–1934." },
  { id: "lorraine-dietrich", name: "Lorraine-Dietrich", country: "FR", summary: "Won Le Mans in 1925 and 1926." },
  { id: "chenard-walcker", name: "Chenard & Walcker", country: "FR", summary: "Winner of the first 24 Hours of Le Mans in 1923." },
  { id: "delahaye", name: "Delahaye", country: "FR", summary: "Won Le Mans in 1938 with the 135." },
  { id: "lagonda", name: "Lagonda", country: "GB", summary: "Won Le Mans in 1935 with the M45R." },
  { id: "talbot-lago", name: "Talbot-Lago", country: "FR", summary: "Won Le Mans in 1950 with Louis Rosier and his son." },
  { id: "mirage", name: "Mirage", country: "GB", summary: "Gulf-backed constructor that won Le Mans in 1975." },
  { id: "dauer", name: "Dauer", country: "DE", summary: "Road-legal Porsche 962 conversion that won Le Mans in 1994 under GT rules." },
  { id: "oreca", name: "Oreca", country: "FR", summary: "French constructor and team; builder of the Rebellion R13 and the dominant LMP2 chassis of the spec-engine era." },
  { id: "chevrolet", name: "Chevrolet", country: "US", summary: "Corvette Racing's GT programme made it one of the most successful GT marques at Le Mans." },
  { id: "lamborghini", name: "Lamborghini", country: "IT", summary: "LMDh entrant with the SC63 in 2024." },
];
