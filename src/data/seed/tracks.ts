/**
 * Circuits. PLACEHOLDER SEED — written from general motorsport knowledge and pending
 * verification against the circuits' own data. Lengths and corner counts are for the
 * current layout. Events are matched to a track through `circuitNames`.
 */
import type { ArchiveInput } from "../schema.ts";
import { LEMANS_SOURCES, WEC_SOURCES } from "./reference.ts";

const SRC = [...WEC_SOURCES, "wikipedia-circuits"];

export const tracks: ArchiveInput["tracks"] = [
  {
    id: "circuit-de-la-sarthe",
    name: "Circuit de la Sarthe",
    circuitNames: ["Circuit de la Sarthe"],
    country: "FR",
    location: "Le Mans, Sarthe",
    lengthKm: 13.626,
    turns: 38,
    opened: 1923,
    usage: "24 Hours of Le Mans since 1923",
    lapRecord: "3:14.791 — Kamui Kobayashi, Toyota TS050 Hybrid, 2017 qualifying",
    tagline: "Closed public roads and permanent track: the 13.6 km stage of the 24 Hours since 1923.",
    history: `The first 24 Hours ran in May 1923 on a 17 km triangle of public roads south of Le Mans, through the outskirts of the city at Pontlieue, down the long road to Mulsanne and back through Arnage. Most of the lap was — and still is — ordinary road, closed only for the race.

The course was shortened in the late 1920s and again in 1932, when a purpose-built section from the Dunlop curve to Tertre Rouge bypassed the town and set the basic shape that survives today. The 1955 disaster, in which a Mercedes crashed into the crowd opposite the pits and more than 80 spectators died, led to rebuilt pits, wider straights and new safety barriers.

The Mulsanne Straight — the Ligne Droite des Hunaudières, part of a national road — became the race's signature. By the late 1980s Group C cars passed 400 km/h on it, and in 1990 two chicanes were added to break it into three parts. The Ford chicanes before the pits (1968), the Porsche Curves (1972) and a string of later safety changes have since reshaped the lap, but the run from Tertre Rouge to Mulsanne corner remains one of the longest flat-out sections in racing.`,
    layouts: [
      { years: "1923–1928", text: "17.262 km, running into the outskirts of Le Mans at Pontlieue." },
      { years: "1929–1931", text: "16.340 km, with a short-cut avoiding the Pontlieue hairpin." },
      { years: "1932–1989", text: "About 13.5 km after the new Dunlop–Tertre Rouge section; the Ford chicanes (1968) and Porsche Curves (1972) were added in this period." },
      { years: "1990–today", text: "Two chicanes on the Mulsanne Straight; small revisions since bring the lap to 13.626 km." },
    ],
    sources: [...LEMANS_SOURCES, "wikipedia-circuits"],
  },
  {
    id: "spa-francorchamps",
    name: "Circuit de Spa-Francorchamps",
    circuitNames: ["Circuit de Spa-Francorchamps"],
    country: "BE",
    location: "Stavelot, Liège province",
    lengthKm: 7.004,
    turns: 19,
    opened: 1921,
    usage: "WEC since 2012 (6 Hours of Spa-Francorchamps)",
    tagline: "The Ardennes classic: Eau Rouge, Raidillon and weather that can change from one valley to the next.",
    history: `Spa was laid out in the early 1920s on public roads between Francorchamps, Malmedy and Stavelot in the Belgian Ardennes — a fast, roughly triangular lap of almost 15 km. The Spa 24 Hours, first run in 1924, is one of the oldest endurance races in the world, and the Spa 1000 km became a long-standing round of the world sportscar championships.

The old course was very fast and very dangerous, with houses, trees and ditches beside the road. In 1979 a new, purpose-built section cut the lap to about 7 km, keeping the famous climb through Eau Rouge and Raidillon, the Kemmel straight and Blanchimont.

Spa has been a fixture of the FIA World Endurance Championship since the first season in 2012, usually as the final rehearsal before Le Mans. In 2026 BMW scored its first WEC one-two there.`,
    layouts: [
      { years: "1921–1978", text: "About 14–15 km of public roads through Malmedy and Stavelot." },
      { years: "1979–today", text: "About 7 km, with a new link from Les Combes to Blanchimont replacing the public-road section." },
    ],
    sources: SRC,
  },
  {
    id: "silverstone",
    name: "Silverstone Circuit",
    circuitNames: ["Silverstone Circuit"],
    country: "GB",
    location: "Silverstone, Northamptonshire",
    lengthKm: 5.891,
    turns: 18,
    opened: 1948,
    usage: "WEC 2012–2019",
    tagline: "A wartime bomber airfield that became the home of British motor racing.",
    history: `Silverstone began as RAF Silverstone, a Second World War bomber training airfield. Its perimeter roads and runways hosted the 1948 British Grand Prix, and in 1950 the first race of the new Formula One World Championship.

Sports-car racing has been part of its story for decades: the Silverstone 6 Hours and 1000 km were rounds of the world championships in the Group C era, and the circuit later hosted the Le Mans Series and the European Le Mans Series.

The current layout dates from 2010, when the "Arena" infield section was added, and a new pit and paddock complex (the Wing) opened in 2011. The 6 Hours of Silverstone was a WEC round from 2012 until the 2019–20 season; in 2016 the leading Audi was disqualified after the race for skid-block wear.`,
    layouts: [
      { years: "1948–1990", text: "The original fast perimeter-road circuit." },
      { years: "1991–2009", text: "Reshaped with the Becketts complex and slower infield sections." },
      { years: "2010–today", text: "The Arena layout, 5.891 km, with the pits moved to the Wing in 2011." },
    ],
    sources: SRC,
  },
  {
    id: "sebring",
    name: "Sebring International Raceway",
    circuitNames: ["Sebring International Raceway"],
    country: "US",
    location: "Sebring, Florida",
    lengthKm: 6.019,
    turns: 17,
    opened: 1950,
    usage: "WEC 2012, 2019, 2023–2024",
    tagline: "Old airfield concrete and some of the bumpiest corners in racing.",
    history: `Sebring was built on Hendricks Field, a wartime training base for B-17 bomber crews. The first race on its runways and access roads was held at the end of 1950, and the 12 Hours of Sebring followed in 1952.

In 1953 the 12 Hours opened the first season of the World Sportscar Championship, and it remained a championship classic for decades. Parts of the lap still run on the original concrete runway slabs, which make it notoriously rough and a severe test of a car before Le Mans.

The World Endurance Championship began here in 2012, sharing the weekend with the American Le Mans Series 12 Hours. The WEC returned for the 1000 Miles of Sebring in 2019 and again in 2023 and 2024.`,
    layouts: [{ years: "1950s–today", text: "Many variations of the airfield circuit; the current 6.019 km layout keeps the bumpy Turn 17 on runway concrete." }],
    sources: SRC,
  },
  {
    id: "interlagos",
    name: "Autódromo José Carlos Pace (Interlagos)",
    circuitNames: ["Autódromo José Carlos Pace (Interlagos)"],
    country: "BR",
    location: "São Paulo",
    lengthKm: 4.309,
    turns: 15,
    opened: 1940,
    usage: "WEC 2012–2014, 2024–2026",
    tagline: "Anticlockwise, undulating and set in a bowl between two reservoirs.",
    history: `Interlagos — "between lakes" — opened in 1940 on land between two reservoirs in the south of São Paulo. The original circuit was almost 8 km long, with banked corners and long, fast curves.

It was renamed in 1985 after José Carlos Pace, the Brazilian driver who won the 1975 Brazilian Grand Prix there and died in an air crash in 1977. In 1990 the lap was shortened to about 4.3 km, keeping the famous downhill Senna S and the long uphill run to the line.

Toyota scored its first WEC victory at Interlagos in 2012. The 6 Hours of São Paulo returned to the calendar in 2024, and in 2026 BMW won there with the #15 M Hybrid V8.`,
    layouts: [
      { years: "1940–1989", text: "About 7.9 km, with the fast outer loop." },
      { years: "1990–today", text: "About 4.3 km, anticlockwise." },
    ],
    sources: SRC,
  },
  {
    id: "bahrain",
    name: "Bahrain International Circuit",
    circuitNames: ["Bahrain International Circuit"],
    country: "BH",
    location: "Sakhir",
    lengthKm: 5.412,
    turns: 15,
    opened: 2004,
    usage: "WEC season finale in most years from 2012 to 2025",
    tagline: "A desert circuit that became the WEC's usual season finale, run into the night.",
    history: `Built in the desert at Sakhir and opened in 2004, the Bahrain International Circuit hosted the first Formula One race in the Middle East that year. Floodlights were later installed, allowing races to run into the night.

The World Endurance Championship first raced here in 2012 and Bahrain became its regular finale. The 8 Hours of Bahrain format, introduced at the end of the 2019–20 season, often decided the titles. Audi's final LMP1 race, in 2016, ended in victory here.

The 2026 round was cancelled amid tensions in the Middle East, and the season finished at Monza instead.`,
    layouts: [{ years: "2004–today", text: "The 5.412 km Grand Prix layout is used for endurance races." }],
    sources: SRC,
  },
  {
    id: "fuji",
    name: "Fuji Speedway",
    circuitNames: ["Fuji Speedway"],
    country: "JP",
    location: "Oyama, Shizuoka",
    lengthKm: 4.563,
    turns: 16,
    opened: 1965,
    usage: "WEC 2012–2019, 2022–2026",
    tagline: "Toyota's home circuit, at the foot of Mount Fuji, with a 1.5 km main straight.",
    history: `Fuji Speedway opened in the mid-1960s at the foot of Mount Fuji, originally with a steeply banked first corner. It hosted the first Formula One races in Japan, including the dramatic, rain-soaked 1976 Japanese Grand Prix.

Through the 1980s the Fuji 1000 km was Japan's round of the World Endurance and World Sportscar championships. Toyota bought the circuit in 2000, and it was rebuilt to a design by Hermann Tilke and reopened in 2005.

The 6 Hours of Fuji has been on the WEC calendar since 2012, apart from the pandemic years. Toyota won its first home race in 2012, and in 2026 the #8 crew's win at Fuji set up their championship.`,
    layouts: [
      { years: "1966–2004", text: "The original circuit, with a banked first corner in its early years." },
      { years: "2005–today", text: "Rebuilt 4.563 km layout, keeping the long main straight." },
    ],
    sources: SRC,
  },
  {
    id: "shanghai",
    name: "Shanghai International Circuit",
    circuitNames: ["Shanghai International Circuit"],
    country: "CN",
    location: "Jiading, Shanghai",
    lengthKm: 5.451,
    turns: 16,
    opened: 2004,
    usage: "WEC 2012–2019",
    tagline: "Built on marshland in the shape of the Chinese character shang.",
    history: `The Shanghai International Circuit was built on former marshland, on thousands of foundation piles, and opened in 2004 for the Chinese Grand Prix. Its layout, by Hermann Tilke, traces the Chinese character 上 (shang, "above"), the first character of the city's name, and includes a tightening first-corner spiral and one of the longest straights in Formula One.

The 6 Hours of Shanghai was a WEC round from 2012 to the 2019–20 season. Toyota won the first one in 2012; Porsche won in 2016 on the way to its second straight title.`,
    layouts: [{ years: "2004–today", text: "The 5.451 km Grand Prix layout." }],
    sources: SRC,
  },
  {
    id: "nurburgring",
    name: "Nürburgring",
    circuitNames: ["Nürburgring"],
    country: "DE",
    location: "Nürburg, Rhineland-Palatinate",
    lengthKm: 5.148,
    turns: 15,
    opened: 1927,
    usage: "WEC 2015–2017 (Grand Prix circuit)",
    tagline: "Home of the Nordschleife; the WEC raced on the modern Grand Prix circuit.",
    history: `The Nürburgring opened in 1927 in the Eifel mountains. Its Nordschleife — the North Loop — runs for almost 21 km through forests and villages, and the Nürburgring 1000 km was one of the great races of the world sportscar championships from the 1950s.

After Niki Lauda's fiery crash in 1976, Formula One left the Nordschleife. A new, safer Grand Prix circuit opened alongside it in 1984, and the old loop continued to host the Nürburgring 24 Hours and touring-car racing.

The WEC raced on the Grand Prix circuit from 2015 to 2017. Porsche won in 2016 with the #1 919 Hybrid.`,
    layouts: [
      { years: "1927–today", text: "The Nordschleife, about 20.8 km, still used for the Nürburgring 24 Hours." },
      { years: "1984–today", text: "The Grand Prix circuit; 5.148 km in the layout used by the WEC." },
    ],
    sources: SRC,
  },
  {
    id: "hermanos-rodriguez",
    name: "Autódromo Hermanos Rodríguez",
    circuitNames: ["Autódromo Hermanos Rodríguez"],
    country: "MX",
    location: "Mexico City",
    lengthKm: 4.304,
    turns: 17,
    opened: 1959,
    usage: "WEC 2016–2017",
    tagline: "High-altitude racing through a baseball stadium, named for two racing brothers.",
    history: `Opened in 1959 in a park in eastern Mexico City, the circuit was later named after Ricardo and Pedro Rodríguez, the brothers who were Mexico's first international racing stars. Both were killed racing; Pedro had won Le Mans in 1968 in a Ford GT40.

At about 2,200 metres above sea level, the thin air cuts engine power and downforce. The circuit was rebuilt for Formula One's return in 2015, replacing the banked Peraltada corner with a section through a baseball stadium.

The 6 Hours of Mexico was a WEC round in 2016 and 2017; Porsche won the first.`,
    layouts: [
      { years: "1959–2014", text: "The original layout with the fast, banked Peraltada." },
      { years: "2015–today", text: "Rebuilt 4.304 km layout with the stadium section." },
    ],
    sources: SRC,
  },
  {
    id: "cota",
    name: "Circuit of the Americas",
    circuitNames: ["Circuit of the Americas"],
    country: "US",
    location: "Austin, Texas",
    lengthKm: 5.513,
    turns: 20,
    opened: 2012,
    usage: "WEC 2013–2017, 2024–2026 (Lone Star Le Mans)",
    tagline: "A steep climb to Turn 1, then corners borrowed from Europe's great circuits.",
    history: `The Circuit of the Americas opened in 2012 as the first purpose-built Formula One circuit in the United States. Its signature is the steep climb to the hairpin at Turn 1; later sections echo famous corners elsewhere, such as Silverstone's Maggotts–Becketts sweepers.

The WEC first came in 2013 and raced here until 2017. It returned in 2024 as the Lone Star Le Mans, and in 2026 Ferrari's #50 499P won there.`,
    layouts: [{ years: "2012–today", text: "The 5.513 km full circuit, run anticlockwise." }],
    sources: SRC,
  },
  {
    id: "portimao",
    name: "Algarve International Circuit",
    circuitNames: ["Algarve International Circuit"],
    country: "PT",
    location: "Portimão",
    lengthKm: 4.653,
    turns: 15,
    opened: 2008,
    usage: "WEC 2021, 2023",
    tagline: "The roller-coaster: blind crests and steep drops in the hills of southern Portugal.",
    history: `Opened in 2008 near Portimão, the Algarve circuit is known for its dramatic changes of elevation, with blind crests and corners that drop away out of sight. It quickly became a popular test venue and hosted the Le Mans Series and European Le Mans Series.

Formula One raced here in 2020 and 2021. The WEC held an 8-hour race in 2021 and the 6 Hours of Portimão in 2023, won by Toyota.`,
    layouts: [{ years: "2008–today", text: "The 4.653 km Grand Prix layout." }],
    sources: SRC,
  },
  {
    id: "monza",
    name: "Autodromo Nazionale Monza",
    circuitNames: ["Autodromo Nazionale Monza"],
    country: "IT",
    location: "Monza, Lombardy",
    lengthKm: 5.793,
    turns: 11,
    opened: 1922,
    usage: "WEC 2021–2024, 2026",
    tagline: "The Temple of Speed, built in a royal park in 1922.",
    history: `Monza was built in 1922 in the park of the Royal Villa north of Milan, one of the first permanent racing circuits in the world. Alongside the road course it once had a high-speed banked oval; the steep bankings built in 1955 were last used in racing in the late 1960s and still stand.

The Monza 1000 km was a round of the world sportscar championships for decades. Chicanes were added from the 1970s to slow the cars, but it remains the fastest circuit on most calendars.

The WEC raced here from 2021 to 2024, and in 2026 Monza became the season finale after the Bahrain round was cancelled. Cadillac and Jota won that race.`,
    layouts: [
      { years: "1922–1969", text: "Road course, with the banked oval used in combination in some years." },
      { years: "1970s–today", text: "Road course with chicanes; 5.793 km today." },
    ],
    sources: SRC,
  },
  {
    id: "lusail",
    name: "Lusail International Circuit",
    circuitNames: ["Lusail International Circuit"],
    country: "QA",
    location: "Lusail",
    lengthKm: 5.419,
    turns: 16,
    opened: 2004,
    usage: "WEC 2024–2025 (Qatar 1812 km)",
    tagline: "A floodlit desert circuit that opened the WEC seasons of 2024 and 2025.",
    history: `Lusail was built in 2004 for motorcycle racing, and its floodlights made it the venue for MotoGP's first night race. Formula One arrived in 2021.

The Qatar 1812 km opened the WEC seasons of 2024 and 2025; Ferrari's #50 won the 2025 race. The 2026 round was postponed in March because of tensions in the Middle East and later cancelled.`,
    layouts: [{ years: "2004–today", text: "The 5.419 km circuit." }],
    sources: SRC,
  },
  {
    id: "imola",
    name: "Autodromo Enzo e Dino Ferrari (Imola)",
    circuitNames: ["Autodromo Enzo e Dino Ferrari"],
    country: "IT",
    location: "Imola, Emilia-Romagna",
    lengthKm: 4.909,
    turns: 19,
    opened: 1953,
    usage: "WEC 2024–2026",
    tagline: "An old-school, anticlockwise circuit in Ferrari country.",
    history: `Imola opened in 1953 and is named after Enzo Ferrari and his son Dino. It hosted the San Marino Grand Prix from 1981 to 2006.

The 1994 race, in which Roland Ratzenberger and Ayrton Senna were killed, led to the fast Tamburello and Villeneuve curves being turned into chicanes. Formula One returned as the Emilia Romagna Grand Prix from 2020.

The 6 Hours of Imola joined the WEC in 2024. In 2026 it opened the season, won by Toyota's #8.`,
    layouts: [
      { years: "1953–1994", text: "Fast layout with the flat-out Tamburello curve." },
      { years: "1995–today", text: "Chicanes at Tamburello and Villeneuve; 4.909 km today." },
    ],
    sources: SRC,
  },
  {
    id: "barcelona",
    name: "Circuit de Barcelona-Catalunya",
    circuitNames: ["Circuit de Barcelona-Catalunya"],
    country: "ES",
    location: "Montmeló, Barcelona",
    lengthKm: 4.657,
    turns: 14,
    opened: 1991,
    usage: "WEC 2026",
    tagline: "Formula One's favourite test track, and a first-time WEC venue in 2026.",
    history: `The Circuit de Barcelona-Catalunya opened in 1991 at Montmeló, north of Barcelona, and has hosted the Spanish Grand Prix ever since. Its mix of corners made it the standard pre-season test venue for Formula One teams.

The European Le Mans Series has raced here for years. The World Endurance Championship came for the first time in 2026, when the 6 Hours of Barcelona filled a gap left by the postponed Qatar round. Toyota's #8 won and moved to the brink of the title.`,
    layouts: [
      { years: "1991–2022", text: "Several variants, latterly with a slow chicane before the final corner." },
      { years: "2023–today", text: "The chicane removed, restoring the fast final corners; 4.657 km." },
    ],
    sources: SRC,
  },
];
