import { getCountryByCode } from './countries.js';
import { COUNTRY_PROFILES } from './country-profiles.js';
import type { City } from './locations.js';

export function getCityById(cityId: string): City | undefined {
  for (const profile of COUNTRY_PROFILES) {
    const city = profile.cities.find((item) => item.id === cityId);
    if (city) {
      return city;
    }
  }
  return undefined;
}

export function getCountryName(code: string): string {
  return getCountryByCode(code)?.name ?? code;
}

export function formatOriginLocation(origin: {
  countryCode: string;
  cityId: string;
}): string {
  const city = getCityById(origin.cityId);
  const country = getCountryName(origin.countryCode);
  if (city) {
    return `${city.name}, ${country}`;
  }
  return country;
}
