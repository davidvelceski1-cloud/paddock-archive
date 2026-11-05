/**
 * Teams and team-season entries. PLACEHOLDER SEED — pending verification.
 * Season keys use the first calendar year: 2018 = 2018–19, 2019 = 2019–20.
 */
import type { ArchiveInput } from "../schema.ts";
import { LEMANS_SOURCES, WEC_SOURCES } from "./reference.ts";

export const teams: ArchiveInput["teams"] = [
  {
    id: "toyota-gazoo-racing",
    names: [
      { name: "Toyota Racing", from: 2012, to: 2015 },
      { name: "Toyota Gazoo Racing", from: 2016, to: null },
    ],
    country: "JP",
    status: "active",
    firstSeason: 2012,
    lastSeason: null,
    manufacturerIds: ["toyota"],
    tagline: "The constant of the WEC era: from heartbreak at Le Mans to a run of five straight wins.",
    history: {
      founding:
        "Toyota's endurance story long predates the WEC: the TS010 finished second at Le Mans in 1992 and the GT-One came close in 1998 and 1999. The company returned to top-class prototypes with the TS030 Hybrid in 2012, run from its motorsport base in Cologne, Germany.",
      peak:
        "The TS040 Hybrid won both world titles in 2014. After the agony of 2016 — the leading car stopped in the final minutes of Le Mans — the team won the 24 Hours five times running from 2018 to 2022, spanning the end of LMP1 and the first Hypercar seasons with the GR010 Hybrid.",
    },
    moments: [
      { year: 2012, text: "First WEC victory at São Paulo, in only the team's third race." },
      { year: 2014, text: "Drivers' and manufacturers' world titles with the TS040 Hybrid." },
      { year: 2016, text: "The leading #5 car lost power in the final minutes of Le Mans with victory in sight." },
      { year: 2017, text: "Kamui Kobayashi set the Le Mans lap record (3:14.791) in qualifying." },
      { year: 2018, text: "First Le Mans victory, at the 20th attempt, with Buemi, Nakajima and Alonso." },
      { year: 2021, text: "Won the first Le Mans of the Hypercar era with the GR010 Hybrid." },
    ],
    sources: WEC_SOURCES,
  },
  {
    id: "audi-sport-team-joest",
    names: [{ name: "Audi Sport Team Joest", from: 2012, to: 2016 }],
    country: "DE",
    status: "defunct",
    firstSeason: 2012,
    lastSeason: 2016,
    manufacturerIds: ["audi"],
    tagline: "Reinhold Joest's squad ran Audi's factory prototypes through the most successful run in modern endurance racing.",
    history: {
      founding:
        "Joest Racing won Le Mans as a Porsche privateer in 1984 and 1985 and again in 1996 and 1997, before running Audi's factory Le Mans programme from 1999. By the start of the WEC it had already delivered a string of Le Mans wins with the R8, R10 and R18.",
      peak:
        "In the WEC's opening seasons the team won the first two drivers' and manufacturers' titles, and Le Mans in 2012, 2013 and 2014 — the first with the R18 e-tron quattro, the first hybrid ever to win the race.",
      exit: "Audi announced in October 2016 that it would end its LMP1 programme at the end of the season. The team won the final race, in Bahrain.",
    },
    whyLeft:
      "Audi withdrew from the WEC at the end of 2016 to concentrate on Formula E, as the Volkswagen Group cut costs in the aftermath of the diesel-emissions scandal. With no Audi prototype to run, the Joest partnership in the WEC ended with it.",
    moments: [
      { year: 2012, text: "The R18 e-tron quattro became the first hybrid to win Le Mans." },
      { year: 2013, text: "Tom Kristensen's ninth Le Mans win, partnering Allan McNish and Loïc Duval to the world title." },
      { year: 2014, text: "Audi's 13th Le Mans victory." },
      { year: 2016, text: "Won the 6 Hours of Bahrain in the programme's final race." },
    ],
    sources: WEC_SOURCES,
  },
  {
    id: "porsche-lmp1-team",
    names: [{ name: "Porsche LMP1 Team", from: 2014, to: 2017 }],
    country: "DE",
    status: "defunct",
    firstSeason: 2014,
    lastSeason: 2017,
    manufacturerIds: ["porsche"],
    tagline: "Four seasons, three Le Mans wins and six world titles with the 919 Hybrid.",
    history: {
      founding: "Porsche returned to top-class prototype racing in 2014 with the 919 Hybrid, its first works car built to contest Le Mans outright since the 911 GT1-98 that won in 1998.",
      peak: "From 2015 to 2017 the team won Le Mans and both world championships every year — including the 2017 race, which the #2 car won after losing more than an hour in the garage.",
      exit: "Porsche announced in July 2017 that it would leave LMP1 at the end of the season.",
    },
    whyLeft:
      "Porsche ended its LMP1 programme after 2017 to enter Formula E. With Audi already gone, the hybrid arms race had become a very expensive contest for two manufacturers, and the parent group was redirecting its motorsport budget.",
    moments: [
      { year: 2014, text: "Debut season; first win at the São Paulo finale." },
      { year: 2015, text: "Le Mans 1-2, led by the Hülkenberg/Bamber/Tandy #19 car." },
      { year: 2016, text: "Won Le Mans after the leading Toyota stopped in the final minutes." },
      { year: 2017, text: "The #2 car recovered from an hour-long repair to win Le Mans." },
    ],
    sources: WEC_SOURCES,
  },
  {
    id: "peugeot-sport",
    names: [
      { name: "Peugeot Talbot Sport", from: 1990, to: 1993 },
      { name: "Team Peugeot Total", from: 2007, to: 2011 },
      { name: "Peugeot TotalEnergies", from: 2022, to: null },
    ],
    country: "FR",
    status: "active",
    firstSeason: 1990,
    lastSeason: null,
    manufacturerIds: ["peugeot"],
    tagline: "Group C champions, diesel rivals to Audi, and Hypercar entrants — three separate eras under one name.",
    history: {
      founding: "Peugeot first came to Le Mans as a works sports-car team with the 905 in the Group C era, winning the race in 1992 and 1993.",
      peak:
        "The 908 HDi FAP diesel was frequently the fastest car at Le Mans from 2007. The team beat Audi to a 1-2 in 2009, but lost 2008, 2010 and 2011 — the last by under 14 seconds.",
      exit: "In January 2012, weeks before the first WEC season, Peugeot cancelled its endurance programme. The 908 HYbrid4 never raced. The brand returned in 2022 with the 9X8 Hypercar.",
    },
    whyLeft:
      "Peugeot's 2012 withdrawal was driven by the parent company's financial position and weak European car sales, not by on-track results. The team was revived for the Hypercar rules ten years later.",
    moments: [
      { year: 1992, text: "First Le Mans victory with the 905." },
      { year: 2009, text: "908 HDi FAP 1-2 at Le Mans, ending Audi's run." },
      { year: 2010, text: "All four 908s retired at Le Mans; Audi finished 1-2-3." },
      { year: 2011, text: "Lost Le Mans to Audi by under 14 seconds." },
      { year: 2022, text: "Wingless 9X8 debuted at Monza." },
    ],
    sources: [...LEMANS_SOURCES, "fiawec-results"],
  },
  {
    id: "rebellion-racing",
    names: [{ name: "Rebellion Racing", from: 2012, to: 2020 }],
    country: "CH",
    status: "defunct",
    firstSeason: 2012,
    lastSeason: 2019,
    manufacturerIds: ["oreca"],
    tagline: "The leading LMP1 privateer of the hybrid era.",
    history: {
      founding: "The Swiss team arrived in the WEC as the strongest non-hybrid LMP1 entrant, first with Lola chassis and then with its own R-One.",
      peak:
        "With the Oreca-built R13 from 2018, Rebellion regularly ran close to Toyota under the equivalence-of-technology rules, finishing on the overall podium at Le Mans and winning outright in the WEC.",
      exit: "Rebellion ended its WEC programme after the 2019–20 season.",
    },
    whyLeft:
      "LMP1 was being replaced by the Hypercar rules for 2021, leaving no place for a non-hybrid privateer prototype. The R13 itself lived on as the basis of the Alpine A480.",
    moments: [
      { year: 2017, text: "Raced in LMP2 for one season while its new LMP1 car was built." },
      { year: 2019, text: "First outright WEC victory, at Shanghai." },
      { year: 2020, text: "Third overall at Le Mans in the team's final 24 Hours." },
    ],
    sources: WEC_SOURCES,
  },
  {
    id: "nissan-motorsports",
    names: [{ name: "Nissan Motorsports", from: 2015, to: 2015 }],
    country: "JP",
    status: "defunct",
    firstSeason: 2015,
    lastSeason: 2015,
    manufacturerIds: ["nissan"],
    tagline: "A front-engined, front-wheel-drive LMP1 that raced exactly once.",
    history: {
      founding: "Nissan entered LMP1 in 2015 with the GT-R LM Nismo, a deliberately unconventional design developed from a base in the United States.",
      peak: "The team's only race was Le Mans 2015. The cars ran far off the pace of the hybrid leaders and only one reached the finish, without being classified.",
      exit: "Nissan skipped the rest of 2015 to develop the car and cancelled the programme in December.",
    },
    whyLeft:
      "The GT-R LM Nismo's hybrid system never worked as designed and the car could not get near the lap times of Audi, Porsche and Toyota. Rather than continue into 2016, Nissan ended the programme.",
    moments: [{ year: 2015, text: "Three GT-R LM Nismos started Le Mans; one finished, unclassified." }],
    sources: WEC_SOURCES,
  },
  {
    id: "ferrari-af-corse",
    names: [
      { name: "AF Corse", from: 2012, to: 2022 },
      { name: "Ferrari AF Corse", from: 2023, to: null },
    ],
    country: "IT",
    status: "active",
    firstSeason: 2012,
    lastSeason: null,
    manufacturerIds: ["ferrari"],
    tagline: "Ferrari's GT partner for a decade, then its works Hypercar team — and three Le Mans wins in three years.",
    history: {
      founding: "AF Corse, founded by Amato Ferrari (no relation to the company), ran Ferrari's factory GT effort in the WEC from the championship's first season.",
      peak:
        "When Ferrari returned to the top class in 2023, AF Corse ran the 499P. It won Le Mans at the first attempt, in the race's centenary year, then again in 2024 and — with a separately entered third car — in 2025, the year Ferrari also won both world titles.",
    },
    moments: [
      { year: 2012, text: "Won the GTE Pro class at Le Mans with the 458 Italia." },
      { year: 2023, text: "Won Le Mans overall on the 499P's first visit — Ferrari's first outright win since 1965." },
      { year: 2024, text: "Second straight Le Mans victory." },
      { year: 2025, text: "Third straight Le Mans win and both world championships." },
    ],
    sources: WEC_SOURCES,
  },
  {
    id: "porsche-penske-motorsport",
    names: [{ name: "Porsche Penske Motorsport", from: 2023, to: 2025 }],
    country: "DE",
    status: "defunct",
    firstSeason: 2023,
    lastSeason: 2025,
    manufacturerIds: ["porsche"],
    tagline: "Porsche's LMDh works team, world drivers' champions in 2024.",
    history: {
      founding: "A joint operation between Porsche and Team Penske, created to run the Porsche 963 in both the WEC and IMSA from 2023.",
      peak: "Kévin Estre, André Lotterer and Laurens Vanthoor won the 2024 drivers' world championship in the #6 car.",
      exit: "Porsche ended its factory Hypercar entry in the WEC after the 2025 season, while continuing in IMSA.",
    },
    whyLeft: "Porsche concentrated its factory LMDh effort on the North American IMSA series after 2025. Verify the announcement date and wording before publication.",
    moments: [{ year: 2024, text: "Drivers' world title for Estre, Lotterer and Vanthoor." }],
    sources: WEC_SOURCES,
  },
  {
    id: "aston-martin-racing",
    names: [{ name: "Aston Martin Racing", from: 2012, to: 2020 }],
    country: "GB",
    status: "defunct",
    firstSeason: 2012,
    lastSeason: 2019,
    manufacturerIds: ["aston-martin"],
    tagline: "Aston Martin's works GTE squad, a fixture of the GT classes for a decade.",
    history: {
      founding: "Aston Martin Racing, run with Prodrive, entered the WEC's GTE Pro class from the first season with the Vantage GTE.",
      peak: "The team won the GTE Pro class at Le Mans in 2017, with a last-lap pass, and again in 2020 with the Vantage AMR.",
      exit: "The works GTE Pro programme ended after the 2019–20 season, with the 2020 Le Mans class win as its finale. The brand returned to the WEC's top class in 2025 with the Valkyrie, run by a partner team.",
    },
    whyLeft: "Aston Martin's motorsport focus moved to its new Formula 1 team for 2021, and GTE Pro was already being wound down by the rule makers, so the works GT entry ended after 2019–20.",
    moments: [
      { year: 2017, text: "GTE Pro win at Le Mans, decided on the final lap." },
      { year: 2020, text: "Second GTE Pro class win at Le Mans with the Vantage AMR." },
    ],
    sources: WEC_SOURCES,
  },
];

const range = (a: number, b: number) => Array.from({ length: b - a + 1 }, (_, i) => a + i);

export const teamEntries: ArchiveInput["teamEntries"] = [
  // Toyota
  ...[2012, 2013].map((season) => ({ teamId: "toyota-gazoo-racing", season, classId: "lmp1" as const, car: "toyota-ts030-hybrid", numbers: ["7", "8"], nameUsed: "Toyota Racing" })),
  { teamId: "toyota-gazoo-racing", season: 2014, classId: "lmp1", car: "toyota-ts040-hybrid", numbers: ["7", "8"], nameUsed: "Toyota Racing" },
  { teamId: "toyota-gazoo-racing", season: 2015, classId: "lmp1", car: "toyota-ts040-hybrid", numbers: ["1", "2"], nameUsed: "Toyota Racing" },
  { teamId: "toyota-gazoo-racing", season: 2016, classId: "lmp1", car: "toyota-ts050-hybrid", numbers: ["5", "6"], nameUsed: "Toyota Gazoo Racing" },
  ...[2017, 2018, 2019].map((season) => ({ teamId: "toyota-gazoo-racing", season, classId: "lmp1" as const, car: "toyota-ts050-hybrid", numbers: ["7", "8"], nameUsed: "Toyota Gazoo Racing" })),
  ...range(2021, 2025).map((season) => ({ teamId: "toyota-gazoo-racing", season, classId: "hypercar" as const, car: "toyota-gr010-hybrid", numbers: ["7", "8"], nameUsed: "Toyota Gazoo Racing" })),
  // Audi
  { teamId: "audi-sport-team-joest", season: 2012, classId: "lmp1", car: "audi-r18-e-tron-quattro", numbers: ["1", "2"] },
  { teamId: "audi-sport-team-joest", season: 2012, classId: "lmp1", car: "audi-r18-ultra", numbers: [], note: "Non-hybrid sister model, raced early in the season and at Le Mans." },
  ...[2013, 2014].map((season) => ({ teamId: "audi-sport-team-joest", season, classId: "lmp1" as const, car: "audi-r18-e-tron-quattro", numbers: ["1", "2"] })),
  ...[2015, 2016].map((season) => ({ teamId: "audi-sport-team-joest", season, classId: "lmp1" as const, car: "audi-r18-e-tron-quattro", numbers: ["7", "8"] })),
  // Porsche LMP1
  { teamId: "porsche-lmp1-team", season: 2014, classId: "lmp1", car: "porsche-919-hybrid", numbers: ["14", "20"] },
  { teamId: "porsche-lmp1-team", season: 2015, classId: "lmp1", car: "porsche-919-hybrid", numbers: ["17", "18"], note: "A third car, #19, raced at Spa and Le Mans." },
  ...[2016, 2017].map((season) => ({ teamId: "porsche-lmp1-team", season, classId: "lmp1" as const, car: "porsche-919-hybrid", numbers: ["1", "2"] })),
  // Peugeot
  ...[1992, 1993].map((season) => ({ teamId: "peugeot-sport", season, classId: "group-c" as const, car: "Peugeot 905", numbers: [], nameUsed: "Peugeot Talbot Sport" })),
  ...range(2007, 2010).map((season) => ({ teamId: "peugeot-sport", season, classId: "lmp1" as const, car: "peugeot-908-hdi-fap", numbers: [], nameUsed: "Team Peugeot Total" })),
  { teamId: "peugeot-sport", season: 2011, classId: "lmp1", car: "peugeot-908", numbers: [], nameUsed: "Team Peugeot Total" },
  ...range(2022, 2025).map((season) => ({ teamId: "peugeot-sport", season, classId: "hypercar" as const, car: "peugeot-9x8", numbers: ["93", "94"], nameUsed: "Peugeot TotalEnergies" })),
  // Rebellion
  ...[2012, 2013].map((season) => ({ teamId: "rebellion-racing", season, classId: "lmp1" as const, car: "Lola B12/60", numbers: [] })),
  ...range(2014, 2016).map((season) => ({ teamId: "rebellion-racing", season, classId: "lmp1" as const, car: "Rebellion R-One", numbers: [] })),
  { teamId: "rebellion-racing", season: 2017, classId: "lmp2", car: "Oreca 07", numbers: [] },
  { teamId: "rebellion-racing", season: 2018, classId: "lmp1", car: "rebellion-r13", numbers: ["1", "3"] },
  { teamId: "rebellion-racing", season: 2019, classId: "lmp1", car: "rebellion-r13", numbers: ["1"] },
  // Nissan
  { teamId: "nissan-motorsports", season: 2015, classId: "lmp1", car: "nissan-gt-r-lm-nismo", numbers: ["21", "22", "23"], note: "Le Mans only." },
  // Ferrari / AF Corse
  ...range(2012, 2015).map((season) => ({ teamId: "ferrari-af-corse", season, classId: "lmgte-pro" as const, car: "Ferrari 458 Italia GTE", numbers: ["51"], nameUsed: "AF Corse" })),
  ...range(2016, 2022).filter((y) => y !== 2020).map((season) => ({ teamId: "ferrari-af-corse", season, classId: "lmgte-pro" as const, car: "ferrari-488-gte", numbers: ["51"], nameUsed: "AF Corse" })),
  ...range(2023, 2025).map((season) => ({ teamId: "ferrari-af-corse", season, classId: "hypercar" as const, car: "ferrari-499p", numbers: ["50", "51"], nameUsed: "Ferrari AF Corse" })),
  ...[2024, 2025].map((season) => ({ teamId: "ferrari-af-corse", season, classId: "hypercar" as const, car: "ferrari-499p", numbers: ["83"], nameUsed: "AF Corse", note: "Separately entered third car." })),
  // Porsche Penske
  ...range(2023, 2025).map((season) => ({ teamId: "porsche-penske-motorsport", season, classId: "hypercar" as const, car: "porsche-963", numbers: ["5", "6"] })),
  // Aston Martin Racing
  ...range(2012, 2017).map((season) => ({ teamId: "aston-martin-racing", season, classId: "lmgte-pro" as const, car: "aston-martin-vantage-gte", numbers: ["97"] })),
  ...[2018, 2019].map((season) => ({ teamId: "aston-martin-racing", season, classId: "lmgte-pro" as const, car: "aston-martin-vantage-amr", numbers: ["95", "97"] })),
];
