/**
 * Race events for the featured seasons. PLACEHOLDER SEED — pending verification against
 * the official classifications. Only results we are confident about are filled in; rounds
 * with an empty `results` array show as "not yet in the archive".
 * Dates are the finishing day; "YYYY-MM" marks a date whose day is unverified.
 */
import type { ArchiveInput, ClassResult, EntryRef } from "../schema.ts";
import { WEC_SOURCES } from "./reference.ts";

type Ev = ArchiveInput["events"][number];

const AUDI = "audi-sport-team-joest";
const R18 = "audi-r18-e-tron-quattro";
const POR = "porsche-lmp1-team";
const TOY = "toyota-gazoo-racing";

const ref = (team: string, car: string, number: string, drivers: string[]): EntryRef => ({ team, car, number, drivers });

// Recurring crews
const AUDI1_2012 = ref(AUDI, R18, "1", ["marcel-fassler", "andre-lotterer", "benoit-treluyer"]);
const TOY7_2012 = ref(TOY, "toyota-ts030-hybrid", "7", ["alexander-wurz", "nicolas-lapierre"]);
const POR1_2016 = ref(POR, "porsche-919-hybrid", "1", ["timo-bernhard", "mark-webber", "brendon-hartley"]);
const POR2_2016 = ref(POR, "porsche-919-hybrid", "2", ["romain-dumas", "neel-jani", "marc-lieb"]);
const AUDI8_2016 = ref(AUDI, R18, "8", ["loic-duval", "lucas-di-grassi", "oliver-jarvis"]);
const TOY6_2016 = ref(TOY, "toyota-ts050-hybrid", "6", ["stephane-sarrazin", "mike-conway", "kamui-kobayashi"]);
const TOY7_2023 = ref(TOY, "toyota-gr010-hybrid", "7", ["mike-conway", "kamui-kobayashi", "jose-maria-lopez"]);
const TOY8_2023 = ref(TOY, "toyota-gr010-hybrid", "8", ["sebastien-buemi", "brendon-hartley", "ryo-hirakawa"]);

const win = (entry: EntryRef, extra: Partial<ClassResult> = {}) => [{ classId: "overall" as const, podium: [entry], ...extra }];

const ev = (season: number, round: number, slug: string, name: string, circuit: string, country: string, date: string, format: string, results: Ev["results"] = [], summary?: string): Ev => ({
  id: `${season}-${slug}`,
  season,
  round,
  name,
  circuit,
  country,
  date,
  format,
  results,
  summary,
  sources: WEC_SOURCES,
});

export const events: ArchiveInput["events"] = [
  // ── 2012 ──
  ev(2012, 1, "sebring", "12 Hours of Sebring", "Sebring International Raceway", "US", "2012-03-17", "12 Hours", win(ref(AUDI, "audi-r18-ultra", "2", ["tom-kristensen", "allan-mcnish", "rinaldo-capello"])), "The first round of the new world championship, run alongside the American Le Mans Series race. Audi won with the non-hybrid R18 ultra."),
  ev(2012, 2, "spa", "6 Hours of Spa-Francorchamps", "Circuit de Spa-Francorchamps", "BE", "2012-05-05", "6 Hours", win(AUDI1_2012), "Race debut of the R18 e-tron quattro hybrid, which won first time out."),
  ev(
    2012,
    3,
    "le-mans",
    "24 Hours of Le Mans",
    "Circuit de la Sarthe",
    "FR",
    "2012-06-17",
    "24 Hours",
    [
      { classId: "overall", podium: [AUDI1_2012, ref(AUDI, R18, "2", ["tom-kristensen", "allan-mcnish", "rinaldo-capello"])], laps: 378 },
      { classId: "lmgte-pro", podium: [ref("ferrari-af-corse", "Ferrari 458 Italia GTE", "51", ["Giancarlo Fisichella", "Gianmaria Bruni", "Toni Vilander"])] },
    ],
    "The first hybrid victory at Le Mans. Toyota's TS030 made its debut and led before both cars retired.",
  ),
  ev(2012, 4, "silverstone", "6 Hours of Silverstone", "Silverstone Circuit", "GB", "2012-08-26", "6 Hours", win(AUDI1_2012)),
  ev(2012, 5, "sao-paulo", "6 Hours of São Paulo", "Autódromo José Carlos Pace (Interlagos)", "BR", "2012-09-15", "6 Hours", win(TOY7_2012), "Toyota's first world-championship win since its return, in the TS030's third race."),
  ev(2012, 6, "bahrain", "6 Hours of Bahrain", "Bahrain International Circuit", "BH", "2012-09-29", "6 Hours", win(AUDI1_2012)),
  ev(2012, 7, "fuji", "6 Hours of Fuji", "Fuji Speedway", "JP", "2012-10-14", "6 Hours", win(TOY7_2012), "Toyota won on home ground."),
  ev(2012, 8, "shanghai", "6 Hours of Shanghai", "Shanghai International Circuit", "CN", "2012-10-28", "6 Hours", win(TOY7_2012)),

  // ── 2016 ──
  ev(2016, 1, "silverstone", "6 Hours of Silverstone", "Silverstone Circuit", "GB", "2016-04-17", "6 Hours", win(POR2_2016, { note: "The #7 Audi took the chequered flag first but was disqualified for excessive skid-block wear." })),
  ev(2016, 2, "spa", "6 Hours of Spa-Francorchamps", "Circuit de Spa-Francorchamps", "BE", "2016-05-07", "6 Hours", win(AUDI8_2016)),
  ev(
    2016,
    3,
    "le-mans",
    "24 Hours of Le Mans",
    "Circuit de la Sarthe",
    "FR",
    "2016-06-19",
    "24 Hours",
    [
      { classId: "overall", podium: [POR2_2016, TOY6_2016, AUDI8_2016], pole: POR2_2016, laps: 384, note: "The leading #5 Toyota lost power in the final minutes and did not complete the last lap within the required time." },
      { classId: "lmp2", podium: [ref("Signatech Alpine", "alpine-a460", "36", ["nicolas-lapierre", "gustavo-menezes", "Stéphane Richelmi"])] },
      { classId: "lmgte-pro", podium: [ref("Ford Chip Ganassi Racing", "ford-gt", "68", ["Joey Hand", "Dirk Müller", "Sébastien Bourdais"])] },
      { classId: "lmgte-am", podium: [ref("Scuderia Corsa", "Ferrari 458 Italia GTE", "62", ["Bill Sweedler", "Townsend Bell", "Jeff Segal"])] },
    ],
    "Toyota's #5 led with minutes to go, then lost power and stopped on the main straight. Porsche's #2 won; Ford won GTE Pro fifty years after the GT40's first victory.",
  ),
  ev(2016, 4, "nurburgring", "6 Hours of Nürburgring", "Nürburgring", "DE", "2016-07-24", "6 Hours", win(POR1_2016)),
  ev(2016, 5, "mexico", "6 Hours of Mexico", "Autódromo Hermanos Rodríguez", "MX", "2016-09-03", "6 Hours", win(POR1_2016)),
  ev(2016, 6, "cota", "6 Hours of Circuit of the Americas", "Circuit of the Americas", "US", "2016-09-17", "6 Hours", win(AUDI8_2016)),
  ev(2016, 7, "fuji", "6 Hours of Fuji", "Fuji Speedway", "JP", "2016-10-16", "6 Hours", win(TOY6_2016), "Toyota's only win of the season, at home."),
  ev(2016, 8, "shanghai", "6 Hours of Shanghai", "Shanghai International Circuit", "CN", "2016-11-06", "6 Hours", win(POR1_2016)),
  ev(2016, 9, "bahrain", "6 Hours of Bahrain", "Bahrain International Circuit", "BH", "2016-11-19", "6 Hours", win(AUDI8_2016), "Audi's final LMP1 race ended in victory."),

  // ── 2023 ──
  ev(2023, 1, "sebring", "1000 Miles of Sebring", "Sebring International Raceway", "US", "2023-03-17", "1000 Miles", win(TOY8_2023)),
  ev(2023, 2, "portimao", "6 Hours of Portimão", "Algarve International Circuit", "PT", "2023-04-16", "6 Hours", win(TOY7_2023)),
  ev(2023, 3, "spa", "6 Hours of Spa-Francorchamps", "Circuit de Spa-Francorchamps", "BE", "2023-04-29", "6 Hours", win(TOY7_2023)),
  ev(
    2023,
    4,
    "le-mans",
    "24 Hours of Le Mans",
    "Circuit de la Sarthe",
    "FR",
    "2023-06-11",
    "24 Hours",
    [
      {
        classId: "overall",
        podium: [
          ref("ferrari-af-corse", "ferrari-499p", "51", ["alessandro-pier-guidi", "james-calado", "antonio-giovinazzi"]),
          TOY8_2023,
          ref("Cadillac Racing", "Cadillac V-Series.R", "2", ["earl-bamber", "Alex Lynn", "Richard Westbrook"]),
        ],
        pole: ref("ferrari-af-corse", "ferrari-499p", "50", ["antonio-fuoco", "miguel-molina", "nicklas-nielsen"]),
        laps: 342,
      },
      { classId: "lmp2", podium: [ref("Inter Europol Competition", "Oreca 07", "34", ["Jakub Śmiechowski", "Albert Costa", "Fabio Scherer"])] },
      { classId: "lmgte-am", podium: [ref("Corvette Racing", "Chevrolet Corvette C8.R", "33", ["Ben Keating", "Nicolás Varrone", "Nicky Catsburg"])] },
    ],
    "The centenary race. Ferrari won on its return to the top class, its first outright Le Mans win since 1965.",
  ),
  ev(2023, 5, "monza", "6 Hours of Monza", "Autodromo Nazionale Monza", "IT", "2023-07", "6 Hours"),
  ev(2023, 6, "fuji", "6 Hours of Fuji", "Fuji Speedway", "JP", "2023-09", "6 Hours"),
  ev(2023, 7, "bahrain", "8 Hours of Bahrain", "Bahrain International Circuit", "BH", "2023-11", "8 Hours"),

  // ── 2025 ──
  ev(2025, 1, "qatar", "Qatar 1812 km", "Lusail International Circuit", "QA", "2025-02-28", "1812 km", win(ref("ferrari-af-corse", "ferrari-499p", "50", ["antonio-fuoco", "miguel-molina", "nicklas-nielsen"]))),
  ev(2025, 2, "imola", "6 Hours of Imola", "Autodromo Enzo e Dino Ferrari", "IT", "2025-04", "6 Hours"),
  ev(2025, 3, "spa", "6 Hours of Spa-Francorchamps", "Circuit de Spa-Francorchamps", "BE", "2025-05", "6 Hours"),
  ev(
    2025,
    4,
    "le-mans",
    "24 Hours of Le Mans",
    "Circuit de la Sarthe",
    "FR",
    "2025-06-15",
    "24 Hours",
    [{ classId: "overall", podium: [ref("ferrari-af-corse", "ferrari-499p", "83", ["robert-kubica", "yifei-ye", "phil-hanson"])], laps: 387 }],
    "AF Corse's separately entered #83 gave Ferrari a third straight win. Ye Yifei became the first Chinese driver to win Le Mans outright.",
  ),
  ev(2025, 5, "sao-paulo", "6 Hours of São Paulo", "Autódromo José Carlos Pace (Interlagos)", "BR", "2025-07", "6 Hours"),
  ev(2025, 6, "cota", "Lone Star Le Mans", "Circuit of the Americas", "US", "2025-09", "6 Hours"),
  ev(2025, 7, "fuji", "6 Hours of Fuji", "Fuji Speedway", "JP", "2025-09", "6 Hours"),
  ev(2025, 8, "bahrain", "8 Hours of Bahrain", "Bahrain International Circuit", "BH", "2025-11", "8 Hours"),
];
