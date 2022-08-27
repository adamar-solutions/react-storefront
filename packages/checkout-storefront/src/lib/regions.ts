export const regions = {
  "en-US": "United States",
  "pl-PL": "Polska",
  "fr-FR": "France",
  "ru-KZ": "Kazakhstan",
};

const DEFAULT_REGION = "ru-KZ";

export const getCurrentRegion = (): keyof typeof regions => DEFAULT_REGION;

export type Region = keyof typeof regions;
