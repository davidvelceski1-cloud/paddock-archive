/** The complete seed archive. Validated by scripts/import.ts --check. */
import type { ArchiveInput } from "../schema.ts";
import { championships, classes, eras, manufacturers, sources } from "./reference.ts";
import { cars } from "./cars.ts";
import { teamEntries, teams } from "./teams.ts";
import { driverEntries, drivers } from "./drivers.ts";
import { leMans } from "./lemans.ts";
import { seasons } from "./seasons.ts";
import { events } from "./events.ts";
import { stories } from "./stories.ts";

export const seed: ArchiveInput = {
  sources,
  classes,
  championships,
  eras,
  manufacturers,
  cars,
  teams,
  drivers,
  teamEntries,
  driverEntries,
  seasons,
  events,
  leMans,
  stories,
};
