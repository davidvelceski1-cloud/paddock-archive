/**
 * The LMGT3 class (2024–): its teams, crews and drivers. Entry lists, winners and champions
 * from the 2024–2026 FIA WEC season articles on Wikipedia (read 16 November 2026).
 * PLACEHOLDER SEED — pending verification against the official classifications.
 */
import type { ArchiveInput } from "../schema.ts";
import { WEC_SOURCES } from "./reference.ts";

type T = ArchiveInput["teams"][number];
type E = ArchiveInput["teamEntries"][number];
type D = ArchiveInput["drivers"][number];
type DE = ArchiveInput["driverEntries"][number];

const SRC = [...WEC_SOURCES, "wikipedia-wec-2026"];
const GT3 = "lmgt3" as const;

export const gt3Teams: T[] = [
  {
    id: "manthey",
    names: [{ name: "Manthey", from: 2024, to: null }],
    country: "DE",
    status: "active",
    firstSeason: 2024,
    lastSeason: null,
    manufacturerIds: ["porsche"],
    tagline: "Porsche's leading GT3 team: LMGT3 champions in 2024 and 2025 and class winners at Le Mans both years.",
    history: {
      founding:
        "Founded by Olaf Manthey in the 1990s, Manthey became Porsche's closest racing partner, famous for its green-and-yellow 'Grello' 911s at the Nürburgring. When LMGT3 replaced GTE in 2024 it entered two Porsche 911 GT3 Rs in the WEC, under different sponsors' names each year.",
      peak:
        "In 2024 the #92 Manthey PureRxcing car of Klaus Bachler, Alex Malykhin and Joel Sturm won the LMGT3 title, and the #91 Manthey EMA car of Richard Lietz, Morris Schuring and Yasser Shahin won the class at Spa and Le Mans. In 2025 the #92, now Manthey 1st Phorm, won Le Mans again and the title with Ryan Hardwick, Richard Lietz and Riccardo Pera. In 2026 the cars ran as Manthey DK Engineering (#91, in Grello colours) and The Bend Manthey (#92), which won the last two races of the season.",
    },
    moments: [
      { year: 2024, text: "LMGT3 champions with the #92, and Le Mans class winners with the #91." },
      { year: 2025, text: "Second straight LMGT3 title and Le Mans class win, with the #92 of Hardwick, Lietz and Pera." },
      { year: 2026, text: "Both cars raced at Le Mans in a one-off livery recalling Porsche's first class win there, in 1951." },
    ],
    sources: SRC,
  },
  {
    id: "tf-sport",
    names: [{ name: "TF Sport", from: 2024, to: null }],
    country: "GB",
    status: "active",
    firstSeason: 2024,
    lastSeason: null,
    manufacturerIds: ["chevrolet"],
    tagline: "Corvette's LMGT3 partner: Le Mans class winners and champions in 2026.",
    history: {
      founding: "Tom Ferrier's British team, long an Aston Martin GT customer in the WEC, became Chevrolet's LMGT3 partner with the Corvette Z06 GT3.R when the class began in 2024.",
      peak: "The #33 won the 2025 season opener in Qatar. In 2026 Jonny Edgar, Nicky Catsburg and Ben Keating won LMGT3 at Le Mans, Edgar took the drivers' title and the #33 the class trophy; the team's second car ran as Racing Team Turkey by TF and won in São Paulo.",
    },
    moments: [
      { year: 2025, text: "LMGT3 wins in Qatar (#33) and at Fuji (#81)." },
      { year: 2026, text: "LMGT3 class win at Le Mans and the drivers' title for Jonny Edgar." },
    ],
    sources: SRC,
  },
  {
    id: "team-wrt",
    names: [{ name: "Team WRT", from: 2024, to: null }],
    country: "BE",
    status: "active",
    firstSeason: 2024,
    lastSeason: null,
    manufacturerIds: ["bmw"],
    tagline: "WRT's BMW M4 GT3 squad — the team that brought Valentino Rossi to the WEC.",
    history: {
      founding: "Alongside BMW's Hypercar programme (see BMW M Team WRT), the Belgian team runs two BMW M4 GT3s in LMGT3.",
      peak: "The #31 won at Imola in 2024. The #46 was driven by nine-time motorcycle world champion Valentino Rossi in 2024 and 2025. In 2026 the team won at Imola (#69) and Fuji (#32).",
    },
    moments: [
      { year: 2024, text: "First LMGT3 win, at Imola, for Farfus, Gelael and Leung." },
      { year: 2026, text: "Wins at Imola and Fuji." },
    ],
    sources: SRC,
  },
  {
    id: "heart-of-racing",
    names: [{ name: "Heart of Racing Team", from: 2024, to: null }],
    country: "US",
    status: "active",
    firstSeason: 2024,
    lastSeason: null,
    manufacturerIds: ["aston-martin"],
    tagline: "Aston Martin's American LMGT3 team, twice a winner at COTA.",
    history: {
      founding: "The American team runs Aston Martin Vantage AMR GT3s in the WEC and IMSA.",
      peak: "Its #27 won the LMGT3 class at the Lone Star Le Mans in 2024 and again in 2026. A second car joined in 2026.",
    },
    moments: [
      { year: 2024, text: "LMGT3 win at COTA with James, Mancinelli and Riberas." },
      { year: 2026, text: "Second COTA win, with Drudi, James and Robichon." },
    ],
    sources: SRC,
  },
  {
    id: "iron-lynx",
    names: [{ name: "Iron Lynx", from: 2024, to: null }],
    country: "IT",
    status: "active",
    firstSeason: 2024,
    lastSeason: null,
    manufacturerIds: ["lamborghini", "mercedes-benz"],
    tagline: "Italian GT team: Lamborghini in 2024, Mercedes-AMG from 2025.",
    history: {
      founding: "Iron Lynx ran a Lamborghini Huracán GT3 in the first LMGT3 season.",
      peak: "It switched to two Mercedes-AMG GT3s in 2025 and kept them for 2026.",
    },
    moments: [],
    sources: SRC,
  },
  {
    id: "iron-dames",
    names: [{ name: "Iron Dames", from: 2024, to: 2025 }],
    country: "IT",
    status: "defunct",
    firstSeason: 2024,
    lastSeason: 2025,
    manufacturerIds: ["lamborghini", "porsche"],
    tagline: "The all-women crew of the #85, with a Lamborghini in 2024 and a Porsche in 2025.",
    history: {
      founding: "An all-female programme in the WEC's GT classes, with drivers such as Sarah Bovy, Michelle Gatting and Rahel Frey.",
      peak: "In LMGT3 it raced a Lamborghini Huracán GT3 in 2024 and a Porsche 911 GT3 R in 2025.",
      exit: "The team left the WEC after five seasons, because of financial problems at its parent company, DC Racing Solutions.",
    },
    whyLeft: "Financial problems at its parent company, DC Racing Solutions, ended the programme after 2025.",
    moments: [],
    sources: SRC,
  },
  {
    id: "proton-competition",
    names: [{ name: "Proton Competition", from: 2024, to: null }],
    country: "DE",
    status: "active",
    firstSeason: 2024,
    lastSeason: null,
    manufacturerIds: ["ford"],
    tagline: "The German team that brought the Ford Mustang GT3 to the WEC.",
    history: {
      founding: "A long-time Porsche customer team, Proton ran Ford's Mustang GT3 in LMGT3 from the class's first season.",
      peak: "Its two Mustangs have raced every season since 2024; the car was updated to Evo specification for 2026.",
    },
    moments: [],
    sources: SRC,
  },
  {
    id: "akkodis-asp",
    names: [{ name: "Akkodis ASP Team", from: 2024, to: null }],
    country: "FR",
    status: "active",
    firstSeason: 2024,
    lastSeason: null,
    manufacturerIds: ["lexus"],
    tagline: "Lexus's LMGT3 team, twice a winner in 2025.",
    history: {
      founding: "The French ASP team runs two Lexus RC F GT3s.",
      peak: "The #87 of José María López, Clemens Schmid and Petru Umbrărescu won in São Paulo and Bahrain in 2025.",
    },
    moments: [{ year: 2025, text: "LMGT3 wins in São Paulo and Bahrain." }],
    sources: SRC,
  },
  {
    id: "garage-59",
    names: [{ name: "Garage 59", from: 2026, to: null }],
    country: "GB",
    status: "active",
    firstSeason: 2026,
    lastSeason: null,
    manufacturerIds: ["mclaren"],
    tagline: "McLaren's LMGT3 partner from 2026, winners at Spa in their first season.",
    history: {
      founding: "The British GT team took over McLaren's LMGT3 programme from United Autosports in 2026.",
      peak: "The #10 of Antares Au, Tom Fleming and Marvin Kirchhöfer won the class at Spa.",
    },
    moments: [{ year: 2026, text: "LMGT3 win at Spa-Francorchamps." }],
    sources: SRC,
  },
];

const n = (...nums: string[]) => nums;

export const gt3TeamEntries: E[] = [
  // Manthey
  { teamId: "manthey", season: 2024, classId: GT3, car: "porsche-911-gt3-r", numbers: n("91", "92"), nameUsed: "Manthey EMA / Manthey PureRxcing" },
  { teamId: "manthey", season: 2025, classId: GT3, car: "porsche-911-gt3-r", numbers: n("92"), nameUsed: "Manthey 1st Phorm" },
  { teamId: "manthey", season: 2026, classId: GT3, car: "porsche-911-gt3-r", chassis: "Porsche 911 GT3 R (992.2)", numbers: n("91", "92"), nameUsed: "Manthey DK Engineering / The Bend Manthey" },
  // TF Sport
  { teamId: "tf-sport", season: 2024, classId: GT3, car: "chevrolet-corvette-z06-gt3r", numbers: n("81", "82") },
  { teamId: "tf-sport", season: 2025, classId: GT3, car: "chevrolet-corvette-z06-gt3r", numbers: n("33", "81") },
  { teamId: "tf-sport", season: 2026, classId: GT3, car: "chevrolet-corvette-z06-gt3r", numbers: n("33", "34"), note: "The #34 ran as Racing Team Turkey by TF." },
  // Team WRT
  { teamId: "team-wrt", season: 2024, classId: GT3, car: "bmw-m4-gt3-evo", chassis: "BMW M4 GT3", numbers: n("31", "46") },
  { teamId: "team-wrt", season: 2025, classId: GT3, car: "bmw-m4-gt3-evo", numbers: n("31", "46"), note: "The #31 ran as The Bend Team WRT." },
  { teamId: "team-wrt", season: 2026, classId: GT3, car: "bmw-m4-gt3-evo", numbers: n("32", "69") },
  // Heart of Racing
  ...[2024, 2025].map((season): E => ({ teamId: "heart-of-racing", season, classId: GT3, car: "aston-martin-vantage-amr-gt3", numbers: n("27") })),
  { teamId: "heart-of-racing", season: 2026, classId: GT3, car: "aston-martin-vantage-amr-gt3", numbers: n("23", "27") },
  // Iron Lynx and Iron Dames
  { teamId: "iron-lynx", season: 2024, classId: GT3, car: "lamborghini-huracan-gt3-evo2", numbers: n("60") },
  { teamId: "iron-lynx", season: 2025, classId: GT3, car: "mercedes-amg-gt3", chassis: "Mercedes-AMG GT3 Evo", numbers: n("60", "61") },
  { teamId: "iron-lynx", season: 2026, classId: GT3, car: "mercedes-amg-gt3", chassis: "Mercedes-AMG GT3 Evo", numbers: n("61", "79") },
  { teamId: "iron-dames", season: 2024, classId: GT3, car: "lamborghini-huracan-gt3-evo2", numbers: n("85") },
  { teamId: "iron-dames", season: 2025, classId: GT3, car: "porsche-911-gt3-r", numbers: n("85") },
  // Proton
  ...[2024, 2025].map((season): E => ({ teamId: "proton-competition", season, classId: GT3, car: "ford-mustang-gt3", chassis: "Ford Mustang GT3", numbers: n("77", "88") })),
  { teamId: "proton-competition", season: 2026, classId: GT3, car: "ford-mustang-gt3", numbers: n("77", "88") },
  // Akkodis ASP
  ...[2024, 2025, 2026].map((season): E => ({ teamId: "akkodis-asp", season, classId: GT3, car: "lexus-rc-f-gt3", numbers: n("78", "87") })),
  // Garage 59
  { teamId: "garage-59", season: 2026, classId: GT3, car: "mclaren-720s-gt3-evo", numbers: n("10", "58") },
  // AF Corse's Ferraris and United Autosports' McLarens (team records live elsewhere)
  { teamId: "ferrari-af-corse", season: 2024, classId: GT3, car: "ferrari-296-gt3", numbers: n("54", "55"), nameUsed: "Vista AF Corse" },
  { teamId: "ferrari-af-corse", season: 2025, classId: GT3, car: "ferrari-296-gt3", numbers: n("21", "54"), nameUsed: "Vista AF Corse" },
  { teamId: "ferrari-af-corse", season: 2026, classId: GT3, car: "ferrari-296-gt3", chassis: "Ferrari 296 GT3 Evo", numbers: n("21", "54"), nameUsed: "Vista AF Corse" },
  ...[2024, 2025].map((season): E => ({ teamId: "united-autosports", season, classId: GT3, car: "mclaren-720s-gt3-evo", numbers: n("59", "95") })),
];

const d = (id: string, name: string, nationality: string, bio: string, birthYear?: number): D => ({
  id,
  name,
  nationality,
  ...(birthYear ? { birthYear } : {}),
  status: "active",
  bio,
  sources: SRC,
});

export const gt3Drivers: D[] = [
  d("richard-lietz", "Richard Lietz", "AT", "A Porsche works GT driver for many years. With Manthey he won the LMGT3 class at Le Mans in 2024 and 2025, and the 2025 LMGT3 title.", 1984),
  d("riccardo-pera", "Riccardo Pera", "IT", "Italian Porsche driver who won the LMGT3 class at Le Mans and the class title with Manthey in 2025."),
  d("ryan-hardwick", "Ryan Hardwick", "US", "American driver who won the LMGT3 class at Le Mans and the class title with Manthey 1st Phorm in 2025."),
  d("klaus-bachler", "Klaus Bachler", "AT", "Austrian Porsche driver; LMGT3 champion in the class's first season, 2024, with Manthey PureRxcing's #92."),
  d("joel-sturm", "Joel Sturm", "DE", "German Porsche driver; LMGT3 champion in 2024 with Manthey PureRxcing's #92."),
  d("jonny-edgar", "Jonny Edgar", "GB", "British driver who won the LMGT3 class at Le Mans in 2026 with TF Sport's Corvette and took the LMGT3 drivers' title."),
  d("ben-keating", "Ben Keating", "US", "American amateur driver and car dealer; a Le Mans class winner in GTE Am with Corvette Racing in 2023 and in LMGT3 with TF Sport in 2026."),
  d("valentino-rossi", "Valentino Rossi", "IT", "Nine-time motorcycle world champion who moved to car racing and drove Team WRT's BMW M4 GT3 in the WEC's LMGT3 class in 2024 and 2025.", 1979),
];

const e = (ids: string[], season: number, team: string, car: string, number: string, classId: DE["classId"] = GT3): DE[] =>
  ids.map((driverId) => ({ driverId, season, team, classId, car, number }));

export const gt3DriverEntries: DE[] = [
  ...e(["klaus-bachler", "joel-sturm"], 2024, "manthey", "porsche-911-gt3-r", "92"),
  ...e(["richard-lietz"], 2024, "manthey", "porsche-911-gt3-r", "91"),
  ...e(["ryan-hardwick", "richard-lietz", "riccardo-pera"], 2025, "manthey", "porsche-911-gt3-r", "92"),
  ...e(["richard-lietz", "riccardo-pera"], 2026, "manthey", "porsche-911-gt3-r", "92"),
  ...e(["jonny-edgar", "ben-keating"], 2025, "tf-sport", "chevrolet-corvette-z06-gt3r", "33"),
  ...e(["jonny-edgar", "ben-keating"], 2026, "tf-sport", "chevrolet-corvette-z06-gt3r", "33"),
  ...e(["ben-keating"], 2023, "corvette-racing", "chevrolet-corvette-c8-r", "33", "lmgte-am"),
  ...e(["valentino-rossi"], 2024, "team-wrt", "bmw-m4-gt3-evo", "46"),
  ...e(["valentino-rossi"], 2025, "team-wrt", "bmw-m4-gt3-evo", "46"),
];
