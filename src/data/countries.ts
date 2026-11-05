/** ISO 3166-1 alpha-2 → display name and demonym (the demonym powers natural-language filters). */
export const COUNTRIES: Record<string, { name: string; demonym: string }> = {
  AR: { name: "Argentina", demonym: "Argentine" },
  AT: { name: "Austria", demonym: "Austrian" },
  AU: { name: "Australia", demonym: "Australian" },
  BE: { name: "Belgium", demonym: "Belgian" },
  BR: { name: "Brazil", demonym: "Brazilian" },
  CH: { name: "Switzerland", demonym: "Swiss" },
  CN: { name: "China", demonym: "Chinese" },
  DE: { name: "Germany", demonym: "German" },
  DK: { name: "Denmark", demonym: "Danish" },
  ES: { name: "Spain", demonym: "Spanish" },
  FI: { name: "Finland", demonym: "Finnish" },
  FR: { name: "France", demonym: "French" },
  GB: { name: "United Kingdom", demonym: "British" },
  IT: { name: "Italy", demonym: "Italian" },
  JP: { name: "Japan", demonym: "Japanese" },
  MC: { name: "Monaco", demonym: "Monegasque" },
  MX: { name: "Mexico", demonym: "Mexican" },
  NL: { name: "Netherlands", demonym: "Dutch" },
  NZ: { name: "New Zealand", demonym: "New Zealander" },
  PL: { name: "Poland", demonym: "Polish" },
  PT: { name: "Portugal", demonym: "Portuguese" },
  QA: { name: "Qatar", demonym: "Qatari" },
  BH: { name: "Bahrain", demonym: "Bahraini" },
  SE: { name: "Sweden", demonym: "Swedish" },
  US: { name: "United States", demonym: "American" },
};

export const countryName = (code: string) => COUNTRIES[code]?.name ?? code;
export const demonym = (code: string) => COUNTRIES[code]?.demonym ?? code;
