/**
 * Map language codes to country ISO codes.
 * Uses ISO 3166-1 alpha-3 (e.g. USA) for react-simple-maps world-atlas compatibility.
 */
export const LANGUAGE_TO_COUNTRIES: Record<string, string[]> = {
  en: ['USA', 'GBR', 'AUS', 'CAN'],
  es: ['ESP', 'MEX', 'ARG', 'COL'],
  fr: ['FRA', 'BEL', 'CAN', 'CHE'],
  de: ['DEU', 'AUT', 'CHE'],
  it: ['ITA', 'CHE'],
  pt: ['PRT', 'BRA'],
  ru: ['RUS', 'UKR', 'KAZ'],
  ar: ['SAU', 'ARE', 'EGY', 'MAR'],
  tr: ['TUR'],
  hi: ['IND'],
  ja: ['JPN'],
  ko: ['KOR'],
  zh: ['CHN', 'TWN', 'HKG', 'SGP'],
  id: ['IDN'],
  vi: ['VNM'],
  th: ['THA'],
  el: ['GRC', 'CYP'],
  nl: ['NLD', 'BEL'],
  pl: ['POL'],
  sw: ['KEN', 'TZA', 'UGA'],
};
