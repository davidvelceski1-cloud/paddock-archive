/**
 * Drivers and driver-season entries. PLACEHOLDER SEED — pending verification.
 * `status: "active"` means racing in the WEC as of the latest loaded season.
 */
import type { ArchiveInput, DriverSeasonEntry } from "../schema.ts";
import { LEMANS_SOURCES, WEC_SOURCES } from "./reference.ts";

type D = ArchiveInput["drivers"][number];
const d = (id: string, name: string, nationality: string, birthYear: number, status: D["status"], bio: string, historic = false): D => ({
  id,
  name,
  nationality,
  birthYear,
  status,
  bio,
  sources: historic ? LEMANS_SOURCES : WEC_SOURCES,
});

export const drivers: ArchiveInput["drivers"] = [
  // Audi era
  d("tom-kristensen", "Tom Kristensen", "DK", 1967, "retired", "The most successful driver in Le Mans history with nine victories between 1997 and 2013, six of them consecutive (2000–2005). He won the 2013 world title with Audi and retired at the end of 2014."),
  d("allan-mcnish", "Allan McNish", "GB", 1969, "retired", "Three-time Le Mans winner — with Porsche in 1998 and Audi in 2008 and 2013 — who retired as world champion at the end of 2013."),
  d("rinaldo-capello", "Rinaldo Capello", "IT", 1964, "retired", "'Dindo' Capello won Le Mans three times, with Bentley in 2003 and Audi in 2004 and 2008, and raced in the WEC's first season before retiring."),
  d("andre-lotterer", "André Lotterer", "DE", 1981, "active", "Three-time Le Mans winner with Audi (2011, 2012, 2014) and world champion in 2012. He later raced for Porsche, Rebellion and Porsche Penske Motorsport, winning a second world title in 2024."),
  d("benoit-treluyer", "Benoît Tréluyer", "FR", 1976, "retired", "Won Le Mans three times with Audi (2011, 2012, 2014) as part of the Lotterer–Fässler–Tréluyer crew, and the 2012 world title."),
  d("marcel-fassler", "Marcel Fässler", "CH", 1976, "retired", "Swiss three-time Le Mans winner with Audi (2011, 2012, 2014) and 2012 world champion."),
  d("loic-duval", "Loïc Duval", "FR", 1982, "active", "Won Le Mans and the world championship with Audi in 2013. He missed the 2014 race after a heavy practice crash, and later became a lead driver in Peugeot's 9X8 programme."),
  d("lucas-di-grassi", "Lucas di Grassi", "BR", 1984, "retired", "Audi LMP1 driver from 2014 to 2016 alongside a Formula E career in which he became champion."),
  d("oliver-jarvis", "Oliver Jarvis", "GB", 1984, "retired", "Raced Audi's #8 R18 in 2015 and 2016, winning in the WEC's final Audi season."),
  // Porsche era
  d("neel-jani", "Neel Jani", "CH", 1983, "retired", "Won Le Mans and the 2016 world title with Porsche, having set a then-record Le Mans pole of 3:16.887 in 2015. He later raced for Rebellion."),
  d("romain-dumas", "Romain Dumas", "FR", 1977, "retired", "Two-time Le Mans winner, with Audi in 2010 and Porsche in 2016, and 2016 world champion."),
  d("marc-lieb", "Marc Lieb", "DE", 1980, "retired", "Porsche lifer who won Le Mans and the world title in 2016."),
  d("timo-bernhard", "Timo Bernhard", "DE", 1981, "retired", "Le Mans winner with Audi in 2010 and Porsche in 2017, and world champion in 2015 and 2017."),
  d("mark-webber", "Mark Webber", "AU", 1976, "retired", "Nine-time Formula 1 race winner who joined Porsche in 2014, won the 2015 world title, and retired at the end of 2016."),
  d("nico-hulkenberg", "Nico Hülkenberg", "DE", 1987, "retired", "Won Le Mans at his first attempt in 2015 in a third Porsche, while a full-time Formula 1 driver."),
  d("earl-bamber", "Earl Bamber", "NZ", 1990, "active", "Won Le Mans with Porsche in 2015 and again in 2017, when he also won the world title."),
  d("nick-tandy", "Nick Tandy", "GB", 1984, "active", "Won Le Mans in 2015 in the #19 Porsche on his top-class debut."),
  d("brendon-hartley", "Brendon Hartley", "NZ", 1989, "active", "World champion with Porsche (2015, 2017) and Toyota (2021, 2022, 2023), and a three-time Le Mans winner (2017, 2020, 2022). He also raced in Formula 1 for Toro Rosso."),
  // Toyota
  d("sebastien-buemi", "Sébastien Buemi", "CH", 1988, "active", "Toyota's longest-serving driver of the WEC era: world champion in 2014, 2018–19, 2021, 2022 and 2023, and a four-time Le Mans winner."),
  d("kazuki-nakajima", "Kazuki Nakajima", "JP", 1985, "retired", "The first Japanese driver to win Le Mans in a Japanese car (2018). He won it three times running and the world title twice before stepping back to a management role at Toyota."),
  d("fernando-alonso", "Fernando Alonso", "ES", 1981, "retired", "Two-time Formula 1 world champion who won Le Mans twice (2018, 2019) and the 2018–19 world title with Toyota during a break from Formula 1."),
  d("anthony-davidson", "Anthony Davidson", "GB", 1979, "retired", "Won the 2014 world title with Sébastien Buemi in Toyota's #8."),
  d("alexander-wurz", "Alexander Wurz", "AT", 1974, "retired", "Won Le Mans in 1996 with Joest Porsche and in 2009 with Peugeot, then drove for Toyota from 2012 to 2015."),
  d("nicolas-lapierre", "Nicolas Lapierre", "FR", 1984, "retired", "Toyota driver in the TS030 years who became a multiple LMP2 class winner at Le Mans with Alpine."),
  d("stephane-sarrazin", "Stéphane Sarrazin", "FR", 1975, "retired", "A Le Mans regular with Peugeot's 908 and Toyota, finishing second overall several times without winning."),
  d("mike-conway", "Mike Conway", "GB", 1983, "active", "Toyota driver since 2015; world champion in 2019–20 and Le Mans winner in 2021."),
  d("kamui-kobayashi", "Kamui Kobayashi", "JP", 1986, "active", "Set the Le Mans lap record in 2017, won the race in 2021 and the 2019–20 world title. He also became Toyota's team principal while still racing."),
  d("jose-maria-lopez", "José María López", "AR", 1983, "active", "Three-time World Touring Car champion who joined Toyota in 2017, won the 2019–20 world title and Le Mans 2021."),
  d("ryo-hirakawa", "Ryo Hirakawa", "JP", 1994, "active", "Won Le Mans in 2022 in his first season and the world title in 2022 and 2023."),
  d("nyck-de-vries", "Nyck de Vries", "NL", 1995, "active", "Former Formula E champion who joined Toyota's Hypercar line-up in 2024."),
  // Ferrari
  d("alessandro-pier-guidi", "Alessandro Pier Guidi", "IT", 1983, "active", "Long-time Ferrari GT driver who won Le Mans outright in 2023 and the 2025 world title."),
  d("james-calado", "James Calado", "GB", 1989, "active", "Ferrari works driver; Le Mans winner in 2023 and world champion in 2025."),
  d("antonio-giovinazzi", "Antonio Giovinazzi", "IT", 1993, "active", "Former Formula 1 driver who won Le Mans in 2023 and the 2025 world title with Ferrari."),
  d("antonio-fuoco", "Antonio Fuoco", "IT", 1996, "active", "Took pole for the centenary Le Mans in 2023 and won the race in 2024."),
  d("miguel-molina", "Miguel Molina", "ES", 1989, "active", "Le Mans winner with Ferrari in 2024."),
  d("nicklas-nielsen", "Nicklas Nielsen", "DK", 1997, "active", "Le Mans winner with Ferrari in 2024."),
  d("robert-kubica", "Robert Kubica", "PL", 1984, "active", "Formula 1 race winner whose career was interrupted by a 2011 rally accident. He rebuilt it in endurance racing and won Le Mans in 2025 in AF Corse's privately entered Ferrari."),
  d("yifei-ye", "Ye Yifei", "CN", 2000, "active", "The first Chinese driver to win Le Mans overall, in 2025."),
  d("phil-hanson", "Phil Hanson", "GB", 1999, "active", "Le Mans winner in 2025 in the #83 AF Corse Ferrari."),
  // Porsche Penske
  d("kevin-estre", "Kévin Estre", "FR", 1988, "active", "Porsche factory driver and 2024 world champion."),
  d("laurens-vanthoor", "Laurens Vanthoor", "BE", 1991, "active", "Porsche factory driver and 2024 world champion."),
  // Rebellion
  d("bruno-senna", "Bruno Senna", "BR", 1983, "retired", "Raced Rebellion's R13 from 2018, including the team's first outright win, at Shanghai in 2019."),
  d("gustavo-menezes", "Gustavo Menezes", "US", 1994, "retired", "Rebellion and Peugeot prototype driver."),
  d("norman-nato", "Norman Nato", "FR", 1992, "retired", "Part of Rebellion's winning crew at Shanghai in 2019."),
  // Historic greats (Le Mans honour roll)
  d("jacky-ickx", "Jacky Ickx", "BE", 1945, "retired", "Six-time Le Mans winner (1969, 1975, 1976, 1977, 1981, 1982), the record until Tom Kristensen. Famous for walking across the track at the start in 1969 in protest at the running Le Mans start.", true),
  d("derek-bell", "Derek Bell", "GB", 1941, "retired", "Five-time Le Mans winner (1975, 1981, 1982, 1986, 1987) and one of the defining drivers of the Porsche 956/962 era.", true),
  d("henri-pescarolo", "Henri Pescarolo", "FR", 1942, "retired", "Four-time Le Mans winner (1972, 1973, 1974, 1984) who made a record 33 starts and later ran his own team.", true),
  d("emanuele-pirro", "Emanuele Pirro", "IT", 1962, "retired", "Five-time Le Mans winner with Audi (2000–2002, 2006, 2007).", true),
  d("frank-biela", "Frank Biela", "DE", 1964, "retired", "Five-time Le Mans winner with Audi (2000–2002, 2006, 2007), including the first diesel win.", true),
  d("marco-werner", "Marco Werner", "DE", 1966, "retired", "Three consecutive Le Mans wins with Audi, 2005–2007.", true),
  d("yannick-dalmas", "Yannick Dalmas", "FR", 1961, "retired", "Won Le Mans four times with four different cars: Peugeot, Dauer-Porsche, McLaren and BMW.", true),
  d("hans-joachim-stuck", "Hans-Joachim Stuck", "DE", 1951, "retired", "Won Le Mans in 1986 and 1987 with the Porsche 962C.", true),
  d("marc-gene", "Marc Gené", "ES", 1974, "retired", "Won Le Mans with Peugeot in 2009.", true),
  d("david-brabham", "David Brabham", "AU", 1965, "retired", "Won Le Mans with Peugeot in 2009, sixteen years after his brother Geoff won it for the same manufacturer.", true),
];

const e = (driverIds: string[], season: number, team: string, classId: DriverSeasonEntry["classId"], car: string, number?: string, note?: string): ArchiveInput["driverEntries"] =>
  driverIds.map((driverId) => ({ driverId, season, team, classId, car, number, note }));

const AUDI = "audi-sport-team-joest";
const R18 = "audi-r18-e-tron-quattro";
const PORSCHE = "porsche-lmp1-team";
const TOYOTA = "toyota-gazoo-racing";
const FERRARI = "ferrari-af-corse";

export const driverEntries: ArchiveInput["driverEntries"] = [
  // Audi
  ...e(["andre-lotterer", "benoit-treluyer", "marcel-fassler"], 2012, AUDI, "lmp1", R18, "1"),
  ...e(["tom-kristensen", "allan-mcnish", "rinaldo-capello"], 2012, AUDI, "lmp1", R18, "2"),
  ...e(["andre-lotterer", "benoit-treluyer", "marcel-fassler"], 2013, AUDI, "lmp1", R18, "1"),
  ...e(["tom-kristensen", "allan-mcnish", "loic-duval"], 2013, AUDI, "lmp1", R18, "2"),
  ...e(["tom-kristensen", "lucas-di-grassi"], 2014, AUDI, "lmp1", R18, "1"),
  ...e(["loic-duval"], 2014, AUDI, "lmp1", R18, "1", "Missed Le Mans after a practice crash."),
  ...e(["andre-lotterer", "benoit-treluyer", "marcel-fassler"], 2014, AUDI, "lmp1", R18, "2"),
  ...[2015, 2016].flatMap((y) => [
    ...e(["andre-lotterer", "benoit-treluyer", "marcel-fassler"], y, AUDI, "lmp1", R18, "7"),
    ...e(["loic-duval", "lucas-di-grassi", "oliver-jarvis"], y, AUDI, "lmp1", R18, "8"),
  ]),
  // Porsche LMP1
  ...e(["romain-dumas", "neel-jani", "marc-lieb"], 2014, PORSCHE, "lmp1", "porsche-919-hybrid", "14"),
  ...e(["timo-bernhard", "mark-webber", "brendon-hartley"], 2014, PORSCHE, "lmp1", "porsche-919-hybrid", "20"),
  ...e(["timo-bernhard", "mark-webber", "brendon-hartley"], 2015, PORSCHE, "lmp1", "porsche-919-hybrid", "17"),
  ...e(["romain-dumas", "neel-jani", "marc-lieb"], 2015, PORSCHE, "lmp1", "porsche-919-hybrid", "18"),
  ...e(["nico-hulkenberg", "earl-bamber", "nick-tandy"], 2015, PORSCHE, "lmp1", "porsche-919-hybrid", "19", "Spa and Le Mans only."),
  ...e(["timo-bernhard", "mark-webber", "brendon-hartley"], 2016, PORSCHE, "lmp1", "porsche-919-hybrid", "1"),
  ...e(["romain-dumas", "neel-jani", "marc-lieb"], 2016, PORSCHE, "lmp1", "porsche-919-hybrid", "2"),
  ...e(["neel-jani", "andre-lotterer", "nick-tandy"], 2017, PORSCHE, "lmp1", "porsche-919-hybrid", "1"),
  ...e(["timo-bernhard", "earl-bamber", "brendon-hartley"], 2017, PORSCHE, "lmp1", "porsche-919-hybrid", "2"),
  // Toyota
  ...e(["alexander-wurz", "nicolas-lapierre", "kazuki-nakajima"], 2012, TOYOTA, "lmp1", "toyota-ts030-hybrid", "7"),
  ...e(["anthony-davidson", "sebastien-buemi", "stephane-sarrazin"], 2012, TOYOTA, "lmp1", "toyota-ts030-hybrid", "8", "Le Mans only."),
  ...e(["alexander-wurz", "nicolas-lapierre", "kazuki-nakajima"], 2013, TOYOTA, "lmp1", "toyota-ts030-hybrid", "7"),
  ...e(["anthony-davidson", "sebastien-buemi", "stephane-sarrazin"], 2013, TOYOTA, "lmp1", "toyota-ts030-hybrid", "8"),
  ...e(["alexander-wurz", "stephane-sarrazin", "kazuki-nakajima"], 2014, TOYOTA, "lmp1", "toyota-ts040-hybrid", "7"),
  ...e(["anthony-davidson", "sebastien-buemi", "nicolas-lapierre"], 2014, TOYOTA, "lmp1", "toyota-ts040-hybrid", "8"),
  ...e(["anthony-davidson", "sebastien-buemi", "kazuki-nakajima"], 2015, TOYOTA, "lmp1", "toyota-ts040-hybrid", "1"),
  ...e(["alexander-wurz", "stephane-sarrazin", "mike-conway"], 2015, TOYOTA, "lmp1", "toyota-ts040-hybrid", "2"),
  ...e(["anthony-davidson", "sebastien-buemi", "kazuki-nakajima"], 2016, TOYOTA, "lmp1", "toyota-ts050-hybrid", "5"),
  ...e(["stephane-sarrazin", "mike-conway", "kamui-kobayashi"], 2016, TOYOTA, "lmp1", "toyota-ts050-hybrid", "6"),
  ...e(["mike-conway", "kamui-kobayashi", "jose-maria-lopez"], 2017, TOYOTA, "lmp1", "toyota-ts050-hybrid", "7"),
  ...e(["stephane-sarrazin"], 2017, TOYOTA, "lmp1", "toyota-ts050-hybrid", "7", "Selected rounds."),
  ...e(["anthony-davidson", "sebastien-buemi", "kazuki-nakajima"], 2017, TOYOTA, "lmp1", "toyota-ts050-hybrid", "8"),
  ...e(["mike-conway", "kamui-kobayashi", "jose-maria-lopez"], 2018, TOYOTA, "lmp1", "toyota-ts050-hybrid", "7"),
  ...e(["fernando-alonso", "sebastien-buemi", "kazuki-nakajima"], 2018, TOYOTA, "lmp1", "toyota-ts050-hybrid", "8"),
  ...e(["mike-conway", "kamui-kobayashi", "jose-maria-lopez"], 2019, TOYOTA, "lmp1", "toyota-ts050-hybrid", "7"),
  ...e(["sebastien-buemi", "kazuki-nakajima", "brendon-hartley"], 2019, TOYOTA, "lmp1", "toyota-ts050-hybrid", "8"),
  ...e(["mike-conway", "kamui-kobayashi", "jose-maria-lopez"], 2021, TOYOTA, "hypercar", "toyota-gr010-hybrid", "7"),
  ...e(["sebastien-buemi", "kazuki-nakajima", "brendon-hartley"], 2021, TOYOTA, "hypercar", "toyota-gr010-hybrid", "8"),
  ...[2022, 2023].flatMap((y) => [
    ...e(["mike-conway", "kamui-kobayashi", "jose-maria-lopez"], y, TOYOTA, "hypercar", "toyota-gr010-hybrid", "7"),
    ...e(["sebastien-buemi", "brendon-hartley", "ryo-hirakawa"], y, TOYOTA, "hypercar", "toyota-gr010-hybrid", "8"),
  ]),
  ...[2024, 2025].flatMap((y) => [
    ...e(["mike-conway", "kamui-kobayashi", "nyck-de-vries"], y, TOYOTA, "hypercar", "toyota-gr010-hybrid", "7"),
    ...e(["sebastien-buemi", "brendon-hartley", "ryo-hirakawa"], y, TOYOTA, "hypercar", "toyota-gr010-hybrid", "8"),
  ]),
  // Ferrari
  ...[2023, 2024, 2025].flatMap((y) => [
    ...e(["antonio-fuoco", "miguel-molina", "nicklas-nielsen"], y, FERRARI, "hypercar", "ferrari-499p", "50"),
    ...e(["alessandro-pier-guidi", "james-calado", "antonio-giovinazzi"], y, FERRARI, "hypercar", "ferrari-499p", "51"),
  ]),
  ...e(["robert-kubica", "yifei-ye"], 2024, FERRARI, "hypercar", "ferrari-499p", "83"),
  ...e(["robert-kubica", "yifei-ye", "phil-hanson"], 2025, FERRARI, "hypercar", "ferrari-499p", "83"),
  // Porsche Penske
  ...[2023, 2024].flatMap((y) => e(["kevin-estre", "andre-lotterer", "laurens-vanthoor"], y, "porsche-penske-motorsport", "hypercar", "porsche-963", "6")),
  ...e(["kevin-estre", "laurens-vanthoor"], 2025, "porsche-penske-motorsport", "hypercar", "porsche-963", "6"),
  // Peugeot
  ...[2022, 2023].flatMap((y) => e(["loic-duval", "gustavo-menezes"], y, "peugeot-sport", "hypercar", "peugeot-9x8", "94")),
  // Rebellion
  ...e(["andre-lotterer", "neel-jani", "bruno-senna"], 2018, "rebellion-racing", "lmp1", "rebellion-r13", "1"),
  ...e(["gustavo-menezes"], 2018, "rebellion-racing", "lmp1", "rebellion-r13", "3"),
  ...e(["bruno-senna", "gustavo-menezes", "norman-nato"], 2019, "rebellion-racing", "lmp1", "rebellion-r13", "1"),
];
