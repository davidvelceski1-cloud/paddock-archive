/** Editorial stories. PLACEHOLDER SEED — narrative copy pending editorial and factual review. */
import type { ArchiveInput } from "../schema.ts";

export const stories: ArchiveInput["stories"] = [
  {
    slug: "audi-peugeot-rivalry",
    title: "The Audi–Peugeot rivalry",
    dek: "Five years, two diesel philosophies and some of the closest finishes Le Mans has seen.",
    eraSlug: "gt-era",
    related: ["team:audi-sport-team-joest", "team:peugeot-sport", "car:audi-r10-tdi", "car:peugeot-908-hdi-fap", "car:audi-r18-tdi"],
    body: `When [Peugeot](/teams/peugeot-sport) arrived at Le Mans in 2007 with the V12 [908 HDi FAP](/cars/peugeot-908-hdi-fap), [Audi](/teams/audi-sport-team-joest) had already won the race the year before with the [R10 TDI](/cars/audi-r10-tdi) — the first diesel to do so. What followed was a five-year contest between two manufacturers who had both bet on diesel, and who approached it very differently.

The Peugeot was usually the faster car over a lap. Audi's answer was race craft and reliability. In 2008, in changeable and often wet conditions, [Allan McNish](/drivers/allan-mcnish), [Tom Kristensen](/drivers/tom-kristensen) and [Rinaldo Capello](/drivers/rinaldo-capello) held off quicker Peugeots to win.

Peugeot finally broke through in 2009 with a 1-2, led by [David Brabham](/drivers/david-brabham), [Marc Gené](/drivers/marc-gene) and [Alexander Wurz](/drivers/alexander-wurz). In 2010 it arrived as favourite and lost all four cars, while Audi's [R15 TDI](/cars/audi-r15-tdi) finished 1-2-3.

The last chapter was the most dramatic. In 2011 Audi lost two of its three new closed-cockpit [R18 TDIs](/cars/audi-r18-tdi) to violent accidents, leaving one car to hold off the Peugeots for the rest of the race. [Lotterer](/drivers/andre-lotterer), [Fässler](/drivers/marcel-fassler) and [Tréluyer](/drivers/benoit-treluyer) won by under 14 seconds.

Peugeot never got its rematch. In January 2012, weeks before the first [World Endurance Championship](/seasons/2012) season, it cancelled the programme and the hybrid 908 never raced.`,
  },
  {
    slug: "toyota-road-to-le-mans",
    title: "Toyota's road to Le Mans victory",
    dek: "Twenty attempts, a lap-record pole and a car that stopped with three minutes to go — then five wins in a row.",
    eraSlug: "lmp1-hybrid",
    related: ["team:toyota-gazoo-racing", "car:toyota-ts050-hybrid", "car:toyota-gr010-hybrid", "driver:sebastien-buemi", "driver:kazuki-nakajima"],
    body: `Toyota came close at Le Mans long before the WEC existed. Its Group C TS010 finished second in 1992, and in 1999 a GT-One was chasing down the leader late in the race when a puncture ended its challenge. When the company returned in 2012 with the [TS030 Hybrid](/cars/toyota-ts030-hybrid), it was racing against Audi's long experience — and soon Porsche's budget.

[Toyota](/teams/toyota-gazoo-racing) won the world championship in 2014 but kept losing Le Mans. The lowest point came in [2016](/seasons/2016): the #5 [TS050 Hybrid](/cars/toyota-ts050-hybrid) led with minutes left and stopped on the main straight. In 2017 [Kamui Kobayashi](/drivers/kamui-kobayashi) set the fastest lap in the race's history in qualifying, and all of the team's hopes unravelled overnight.

Victory came in 2018, at the twentieth attempt, after Audi and Porsche had left. [Sébastien Buemi](/drivers/sebastien-buemi), [Kazuki Nakajima](/drivers/kazuki-nakajima) and [Fernando Alonso](/drivers/fernando-alonso) won, and Nakajima became the first Japanese driver to win in a Japanese car.

The team kept winning into the Hypercar era with the [GR010 Hybrid](/cars/toyota-gr010-hybrid), five in a row from 2018 to 2022, until Ferrari's return in 2023.`,
  },
  {
    slug: "rise-of-the-hypercar",
    title: "Rise of the Hypercar class",
    dek: "How two rulebooks, one Balance of Performance and a centenary brought the manufacturers back.",
    eraSlug: "hypercar",
    related: ["car:ferrari-499p", "car:porsche-963", "car:peugeot-9x8", "team:ferrari-af-corse", "team:porsche-penske-motorsport"],
    body: `By 2018 LMP1 had become a one-manufacturer class. The hybrid arms race of the [LMP1 Hybrid era](/seasons?era=lmp1-hybrid) produced extraordinary cars, but at a cost only a few companies would pay. The answer was to cap the spending and let manufacturers compete on a level field.

The Le Mans Hypercar rules arrived in [2021](/seasons/2021): bespoke prototypes or road-car-based racers, with performance equalised by Balance of Performance rather than by unlimited development. [Toyota](/teams/toyota-gazoo-racing)'s [GR010 Hybrid](/cars/toyota-gr010-hybrid) won the first Hypercar Le Mans, and [Peugeot](/teams/peugeot-sport) arrived in 2022 with the wingless [9X8](/cars/peugeot-9x8).

The real turning point was convergence. From [2023](/seasons/2023), cars built to the American–European LMDh rules — on spec LMP2-derived chassis with a common hybrid system — could race alongside LMH cars. [Porsche](/teams/porsche-penske-motorsport) and Cadillac came with LMDh cars; [Ferrari](/teams/ferrari-af-corse) built the LMH [499P](/cars/ferrari-499p) and won the centenary Le Mans at its first attempt.

By [2024](/seasons/2024) BMW, Alpine, Lamborghini and Isotta Fraschini had joined, LMGT3 had replaced GTE, and the top class had its deepest manufacturer field in decades.`,
  },
];
