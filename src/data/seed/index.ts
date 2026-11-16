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
import { tracks } from "./tracks.ts";
import { historicTeamEntries, historicTeams } from "./historic-teams.ts";
import { gtCars } from "./gt-cars.ts";
import { gt3DriverEntries, gt3Drivers, gt3TeamEntries, gt3Teams } from "./gt3.ts";

export const seed: ArchiveInput = {
  tracks,
  sources,
  classes,
  championships,
  eras,
  manufacturers,
  cars: [...cars, ...gtCars],
  teams: [...teams, ...historicTeams, ...gt3Teams],
  drivers: [...drivers, ...gt3Drivers],
  teamEntries: [...teamEntries, ...historicTeamEntries, ...gt3TeamEntries],
  driverEntries: [...driverEntries, ...gt3DriverEntries],
  seasons,
  events,
  leMans,
  stories,
};
