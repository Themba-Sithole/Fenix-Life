import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const domainSrc = path.resolve(__dirname, '../packages/domain/src');

/** ISO 4217 default currency per country (includes territories). */
const COUNTRY_CURRENCY = {
  AD: 'EUR', AE: 'AED', AF: 'AFN', AG: 'XCD', AI: 'XCD', AL: 'ALL', AM: 'AMD', AO: 'AOA', AQ: 'USD',
  AR: 'ARS', AS: 'USD', AT: 'EUR', AU: 'AUD', AW: 'AWG', AX: 'EUR', AZ: 'AZN', BA: 'BAM', BB: 'BBD',
  BD: 'BDT', BE: 'EUR', BF: 'XOF', BG: 'BGN', BH: 'BHD', BI: 'BIF', BJ: 'XOF', BL: 'EUR', BM: 'BMD',
  BN: 'BND', BO: 'BOB', BQ: 'USD', BR: 'BRL', BS: 'BSD', BT: 'BTN', BV: 'NOK', BW: 'BWP', BY: 'BYN',
  BZ: 'BZD', CA: 'CAD', CC: 'AUD', CD: 'CDF', CF: 'XAF', CG: 'XAF', CH: 'CHF', CI: 'XOF', CK: 'NZD',
  CL: 'CLP', CM: 'XAF', CN: 'CNY', CO: 'COP', CR: 'CRC', CU: 'CUP', CV: 'CVE', CW: 'ANG', CX: 'AUD',
  CY: 'EUR', CZ: 'CZK', DE: 'EUR', DJ: 'DJF', DK: 'DKK', DM: 'XCD', DO: 'DOP', DZ: 'DZD', EC: 'USD',
  EE: 'EUR', EG: 'EGP', EH: 'MAD', ER: 'ERN', ES: 'EUR', ET: 'ETB', FI: 'EUR', FJ: 'FJD', FK: 'FKP',
  FM: 'USD', FO: 'DKK', FR: 'EUR', GA: 'XAF', GB: 'GBP', GD: 'XCD', GE: 'GEL', GF: 'EUR', GG: 'GBP',
  GH: 'GHS', GI: 'GIP', GL: 'DKK', GM: 'GMD', GN: 'GNF', GP: 'EUR', GQ: 'XAF', GR: 'EUR', GS: 'GBP',
  GT: 'GTQ', GU: 'USD', GW: 'XOF', GY: 'GYD', HK: 'HKD', HM: 'AUD', HN: 'HNL', HR: 'EUR', HT: 'HTG',
  HU: 'HUF', ID: 'IDR', IE: 'EUR', IL: 'ILS', IM: 'GBP', IN: 'INR', IO: 'USD', IQ: 'IQD', IR: 'IRR',
  IS: 'ISK', IT: 'EUR', JE: 'GBP', JM: 'JMD', JO: 'JOD', JP: 'JPY', KE: 'KES', KG: 'KGS', KH: 'KHR',
  KI: 'AUD', KM: 'KMF', KN: 'XCD', KP: 'KPW', KR: 'KRW', KW: 'KWD', KY: 'KYD', KZ: 'KZT', LA: 'LAK',
  LB: 'LBP', LC: 'XCD', LI: 'CHF', LK: 'LKR', LR: 'LRD', LS: 'LSL', LT: 'EUR', LU: 'EUR', LV: 'EUR',
  LY: 'LYD', MA: 'MAD', MC: 'EUR', MD: 'MDL', ME: 'EUR', MF: 'EUR', MG: 'MGA', MH: 'USD', MK: 'MKD',
  ML: 'XOF', MM: 'MMK', MN: 'MNT', MO: 'MOP', MP: 'USD', MQ: 'EUR', MR: 'MRU', MS: 'XCD', MT: 'EUR',
  MU: 'MUR', MV: 'MVR', MW: 'MWK', MX: 'MXN', MY: 'MYR', MZ: 'MZN', NA: 'NAD', NC: 'XPF', NE: 'XOF',
  NF: 'AUD', NG: 'NGN', NI: 'NIO', NL: 'EUR', NO: 'NOK', NP: 'NPR', NR: 'AUD', NU: 'NZD', NZ: 'NZD',
  OM: 'OMR', PA: 'PAB', PE: 'PEN', PF: 'XPF', PG: 'PGK', PH: 'PHP', PK: 'PKR', PL: 'PLN', PM: 'EUR',
  PN: 'NZD', PR: 'USD', PS: 'ILS', PT: 'EUR', PW: 'USD', PY: 'PYG', QA: 'QAR', RE: 'EUR', RO: 'RON',
  RS: 'RSD', RU: 'RUB', RW: 'RWF', SA: 'SAR', SB: 'SBD', SC: 'SCR', SD: 'SDG', SE: 'SEK', SG: 'SGD',
  SH: 'SHP', SI: 'EUR', SJ: 'NOK', SK: 'EUR', SL: 'SLE', SM: 'EUR', SN: 'XOF', SO: 'SOS', SR: 'SRD',
  SS: 'SSP', ST: 'STN', SV: 'USD', SX: 'ANG', SY: 'SYP', SZ: 'SZL', TC: 'USD', TD: 'XAF', TF: 'EUR',
  TG: 'XOF', TH: 'THB', TJ: 'TJS', TK: 'NZD', TL: 'USD', TM: 'TMT', TN: 'TND', TO: 'TOP', TR: 'TRY',
  TT: 'TTD', TV: 'AUD', TW: 'TWD', TZ: 'TZS', UA: 'UAH', UG: 'UGX', UM: 'USD', US: 'USD', UY: 'UYU',
  UZ: 'UZS', VA: 'EUR', VC: 'XCD', VE: 'VES', VG: 'USD', VI: 'USD', VN: 'VND', VU: 'VUV', WF: 'XPF',
  WS: 'WST', YE: 'YER', YT: 'EUR', ZA: 'ZAR', ZM: 'ZMW', ZW: 'ZWL',
};

/** Capital or primary city per country. */
const COUNTRY_CAPITAL = {
  AD: 'Andorra la Vella', AE: 'Abu Dhabi', AF: 'Kabul', AG: "Saint John's", AI: 'The Valley',
  AL: 'Tirana', AM: 'Yerevan', AO: 'Luanda', AQ: 'McMurdo Station', AR: 'Buenos Aires', AS: 'Pago Pago',
  AT: 'Vienna', AU: 'Canberra', AW: 'Oranjestad', AX: 'Mariehamn', AZ: 'Baku', BA: 'Sarajevo',
  BB: 'Bridgetown', BD: 'Dhaka', BE: 'Brussels', BF: 'Ouagadougou', BG: 'Sofia', BH: 'Manama',
  BI: 'Gitega', BJ: 'Porto-Novo', BL: 'Gustavia', BM: 'Hamilton', BN: 'Bandar Seri Begawan',
  BO: 'Sucre', BQ: 'Kralendijk', BR: 'Brasília', BS: 'Nassau', BT: 'Thimphu', BV: 'No permanent settlement',
  BW: 'Gaborone', BY: 'Minsk', BZ: 'Belmopan', CA: 'Ottawa', CC: 'West Island', CD: 'Kinshasa',
  CF: 'Bangui', CG: 'Brazzaville', CH: 'Bern', CI: 'Yamoussoukro', CK: 'Avarua', CL: 'Santiago',
  CM: 'Yaoundé', CN: 'Beijing', CO: 'Bogotá', CR: 'San José', CU: 'Havana', CV: 'Praia', CW: 'Willemstad',
  CX: 'Flying Fish Cove', CY: 'Nicosia', CZ: 'Prague', DE: 'Berlin', DJ: 'Djibouti', DK: 'Copenhagen',
  DM: 'Roseau', DO: 'Santo Domingo', DZ: 'Algiers', EC: 'Quito', EE: 'Tallinn', EG: 'Cairo',
  EH: 'El Aaiún', ER: 'Asmara', ES: 'Madrid', ET: 'Addis Ababa', FI: 'Helsinki', FJ: 'Suva',
  FK: 'Stanley', FM: 'Palikir', FO: 'Tórshavn', FR: 'Paris', GA: 'Libreville', GB: 'London',
  GD: "Saint George's", GE: 'Tbilisi', GF: 'Cayenne', GG: 'Saint Peter Port', GH: 'Accra', GI: 'Gibraltar',
  GL: 'Nuuk', GM: 'Banjul', GN: 'Conakry', GP: 'Basse-Terre', GQ: 'Malabo', GR: 'Athens',
  GS: 'King Edward Point', GT: 'Guatemala City', GU: 'Hagåtña', GW: 'Bissau', GY: 'Georgetown',
  HK: 'Hong Kong', HM: 'No permanent settlement', HN: 'Tegucigalpa', HR: 'Zagreb', HT: 'Port-au-Prince',
  HU: 'Budapest', ID: 'Jakarta', IE: 'Dublin', IL: 'Jerusalem', IM: 'Douglas', IN: 'New Delhi',
  IO: 'Diego Garcia', IQ: 'Baghdad', IR: 'Tehran', IS: 'Reykjavik', IT: 'Rome', JE: 'Saint Helier',
  JM: 'Kingston', JO: 'Amman', JP: 'Tokyo', KE: 'Nairobi', KG: 'Bishkek', KH: 'Phnom Penh',
  KI: 'Tarawa', KM: 'Moroni', KN: 'Basseterre', KP: 'Pyongyang', KR: 'Seoul', KW: 'Kuwait City',
  KY: 'George Town', KZ: 'Astana', LA: 'Vientiane', LB: 'Beirut', LC: 'Castries', LI: 'Vaduz',
  LK: 'Sri Jayewardenepura Kotte', LR: 'Monrovia', LS: 'Maseru', LT: 'Vilnius', LU: 'Luxembourg City',
  LV: 'Riga', LY: 'Tripoli', MA: 'Rabat', MC: 'Monaco', MD: 'Chișinău', ME: 'Podgorica', MF: 'Marigot',
  MG: 'Antananarivo', MH: 'Majuro', MK: 'Skopje', ML: 'Bamako', MM: 'Naypyidaw', MN: 'Ulaanbaatar',
  MO: 'Macau', MP: 'Saipan', MQ: 'Fort-de-France', MR: 'Nouakchott', MS: 'Plymouth', MT: 'Valletta',
  MU: 'Port Louis', MV: 'Malé', MW: 'Lilongwe', MX: 'Mexico City', MY: 'Kuala Lumpur', MZ: 'Maputo',
  NA: 'Windhoek', NC: 'Nouméa', NE: 'Niamey', NF: 'Kingston', NG: 'Abuja', NI: 'Managua', NL: 'Amsterdam',
  NO: 'Oslo', NP: 'Kathmandu', NR: 'Yaren', NU: 'Alofi', NZ: 'Wellington', OM: 'Muscat', PA: 'Panama City',
  PE: 'Lima', PF: 'Papeete', PG: 'Port Moresby', PH: 'Manila', PK: 'Islamabad', PL: 'Warsaw', PM: 'Saint-Pierre',
  PN: 'Adamstown', PR: 'San Juan', PS: 'Ramallah', PT: 'Lisbon', PW: 'Ngerulmud', PY: 'Asunción',
  QA: 'Doha', RE: 'Saint-Denis', RO: 'Bucharest', RS: 'Belgrade', RU: 'Moscow', RW: 'Kigali',
  SA: 'Riyadh', SB: 'Honiara', SC: 'Victoria', SD: 'Khartoum', SE: 'Stockholm', SG: 'Singapore',
  SH: 'Jamestown', SI: 'Ljubljana', SJ: 'Longyearbyen', SK: 'Bratislava', SL: 'Freetown', SM: 'San Marino',
  SN: 'Dakar', SO: 'Mogadishu', SR: 'Paramaribo', SS: 'Juba', ST: 'São Tomé', SV: 'San Salvador',
  SX: 'Philipsburg', SY: 'Damascus', SZ: 'Mbabane', TC: 'Cockburn Town', TD: "N'Djamena", TF: 'Port-aux-Français',
  TG: 'Lomé', TH: 'Bangkok', TJ: 'Dushanbe', TK: 'Fakaofo', TL: 'Dili', TM: 'Ashgabat', TN: 'Tunis',
  TO: "Nuku'alofa", TR: 'Ankara', TT: 'Port of Spain', TV: 'Funafuti', TW: 'Taipei', TZ: 'Dodoma',
  UA: 'Kyiv', UG: 'Kampala', UM: 'Wake Island', US: 'Washington, D.C.', UY: 'Montevideo', UZ: 'Tashkent',
  VA: 'Vatican City', VC: 'Kingstown', VE: 'Caracas', VG: 'Road Town', VI: 'Charlotte Amalie', VN: 'Hanoi',
  VU: 'Port Vila', WF: 'Mata-Utu', WS: 'Apia', YE: "Sana'a", YT: 'Mamoudzou', ZA: 'Pretoria', ZM: 'Lusaka',
  ZW: 'Harare',
};

/** Additional major cities beyond the capital (optional). */
const EXTRA_CITIES = {
  US: ['New York City', 'Los Angeles', 'Chicago', 'Houston', 'San Francisco', 'Miami', 'Seattle', 'Boston', 'Dallas', 'Atlanta'],
  CA: ['Toronto', 'Vancouver', 'Montreal', 'Calgary', 'Edmonton'],
  GB: ['Manchester', 'Birmingham', 'Edinburgh', 'Glasgow', 'Liverpool', 'Bristol'],
  AU: ['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide'],
  ZA: ['Johannesburg', 'Cape Town', 'Durban', 'Port Elizabeth'],
  IN: ['Mumbai', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad', 'Pune'],
  CN: ['Shanghai', 'Guangzhou', 'Shenzhen', 'Chengdu', 'Hong Kong'],
  JP: ['Osaka', 'Yokohama', 'Nagoya', 'Sapporo', 'Fukuoka'],
  DE: ['Munich', 'Hamburg', 'Frankfurt', 'Cologne', 'Stuttgart'],
  FR: ['Marseille', 'Lyon', 'Toulouse', 'Nice', 'Bordeaux'],
  IT: ['Milan', 'Naples', 'Turin', 'Florence', 'Bologna'],
  ES: ['Barcelona', 'Valencia', 'Seville', 'Bilbao'],
  BR: ['São Paulo', 'Rio de Janeiro', 'Salvador', 'Brasília', 'Fortaleza'],
  MX: ['Guadalajara', 'Monterrey', 'Puebla', 'Tijuana'],
  NG: ['Lagos', 'Kano', 'Ibadan', 'Port Harcourt'],
  EG: ['Alexandria', 'Giza', 'Luxor'],
  AE: ['Dubai', 'Sharjah', 'Abu Dhabi'],
  SA: ['Jeddah', 'Mecca', 'Dammam'],
  KR: ['Busan', 'Incheon', 'Daegu'],
  TR: ['Istanbul', 'Izmir', 'Bursa'],
  RU: ['Saint Petersburg', 'Novosibirsk', 'Yekaterinburg'],
  AR: ['Córdoba', 'Rosario', 'Mendoza'],
  CL: ['Valparaíso', 'Concepción'],
  CO: ['Medellín', 'Cali', 'Barranquilla'],
  PE: ['Arequipa', 'Trujillo', 'Cusco'],
  PH: ['Cebu City', 'Davao City', 'Quezon City'],
  ID: ['Surabaya', 'Bandung', 'Medan', 'Bali (Denpasar)'],
  MY: ['Penang', 'Johor Bahru', 'Ipoh'],
  TH: ['Chiang Mai', 'Phuket', 'Pattaya'],
  VN: ['Ho Chi Minh City', 'Da Nang', 'Hai Phong'],
  PK: ['Karachi', 'Lahore', 'Faisalabad'],
  BD: ['Chittagong', 'Khulna', 'Sylhet'],
  KE: ['Mombasa', 'Kisumu', 'Nakuru'],
  GH: ['Kumasi', 'Tamale'],
  ET: ['Dire Dawa', 'Mekelle'],
  NZ: ['Auckland', 'Christchurch', 'Hamilton'],
  IE: ['Cork', 'Galway', 'Limerick'],
  NL: ['Rotterdam', 'The Hague', 'Utrecht'],
  BE: ['Antwerp', 'Ghent', 'Bruges'],
  CH: ['Zurich', 'Geneva', 'Basel'],
  AT: ['Salzburg', 'Graz', 'Innsbruck'],
  SE: ['Gothenburg', 'Malmö', 'Uppsala'],
  NO: ['Bergen', 'Trondheim', 'Stavanger'],
  DK: ['Aarhus', 'Odense', 'Aalborg'],
  FI: ['Tampere', 'Turku', 'Oulu'],
  PL: ['Kraków', 'Wrocław', 'Gdańsk', 'Poznań'],
  CZ: ['Brno', 'Ostrava', 'Plzeň'],
  PT: ['Porto', 'Faro', 'Coimbra'],
  GR: ['Thessaloniki', 'Patras', 'Heraklion'],
  RO: ['Cluj-Napoca', 'Timișoara', 'Iași'],
  UA: ['Lviv', 'Odesa', 'Kharkiv', 'Dnipro'],
  IL: ['Tel Aviv', 'Haifa', 'Beersheba'],
  SG: ['Jurong', 'Woodlands'],
  HK: ['Kowloon', 'Sha Tin'],
};

function slugify(countryCode, cityName) {
  const slug = cityName
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  return `${countryCode.toLowerCase()}-${slug || 'city'}`;
}

function buildCities(countryCode, countryName) {
  const capital = COUNTRY_CAPITAL[countryCode] ?? `${countryName} (Main)`;
  const extras = EXTRA_CITIES[countryCode] ?? [];
  const names = [capital, ...extras.filter((name) => name !== capital)];
  const unique = [...new Set(names)];

  return unique.map((name, index) => ({
    id: slugify(countryCode, name),
    name,
    countryCode,
    isCapital: index === 0,
  }));
}

const countryCodes = Object.keys(COUNTRY_CURRENCY).sort();
const profiles = countryCodes.map((code) => {
  const displayNames = new Intl.DisplayNames(['en'], { type: 'region' });
  const countryName = displayNames.of(code) ?? code;
  return {
    code,
    defaultCurrency: COUNTRY_CURRENCY[code],
    cities: buildCities(code, countryName),
  };
});

const currencyCodes = [...new Set(Object.values(COUNTRY_CURRENCY))].sort();
const currencyDisplay = new Intl.DisplayNames(['en'], { type: 'currency' });
const currencies = currencyCodes.map((code) => ({
  code,
  name: currencyDisplay.of(code) ?? code,
  symbol: getCurrencySymbol(code),
}));

function getCurrencySymbol(code) {
  try {
    const parts = new Intl.NumberFormat('en', { style: 'currency', currency: code }).formatToParts(0);
    return parts.find((part) => part.type === 'currency')?.value ?? code;
  } catch {
    return code;
  }
}

const profilesTs = `/** Country default currency and cities — generated by scripts/generate-location-data.mjs */
import type { City } from './locations.js';

export interface CountryProfile {
  readonly code: string;
  readonly defaultCurrency: string;
  readonly cities: readonly City[];
}

export const COUNTRY_PROFILES: readonly CountryProfile[] = ${JSON.stringify(profiles, null, 2)};

const profileByCode = new Map(COUNTRY_PROFILES.map((profile) => [profile.code, profile]));

export function getCountryProfile(code: string): CountryProfile | undefined {
  return profileByCode.get(code);
}

export function getCitiesForCountry(code: string): readonly City[] {
  return getCountryProfile(code)?.cities ?? [];
}

export function getDefaultCurrencyForCountry(code: string): string {
  return getCountryProfile(code)?.defaultCurrency ?? 'USD';
}
`;

const currenciesTs = `/** ISO 4217 currencies used in Fenix Life — generated by scripts/generate-location-data.mjs */
export interface Currency {
  readonly code: string;
  readonly name: string;
  readonly symbol: string;
}

export const CURRENCIES: readonly Currency[] = ${JSON.stringify(currencies, null, 2)};

export function getCurrencyByCode(code: string): Currency | undefined {
  return CURRENCIES.find((currency) => currency.code === code);
}
`;

const locationsTs = `/** Shared location types for character origin (Doc 02, Doc 34). */
export interface City {
  readonly id: string;
  readonly name: string;
  readonly countryCode: string;
  readonly isCapital?: boolean;
}

export interface CharacterOrigin {
  readonly countryCode: string;
  readonly cityId: string;
  readonly currency: string;
}
`;

fs.writeFileSync(path.join(domainSrc, 'locations.ts'), locationsTs);
fs.writeFileSync(path.join(domainSrc, 'country-profiles.ts'), profilesTs);
fs.writeFileSync(path.join(domainSrc, 'currencies.ts'), currenciesTs);

console.log(`Wrote ${profiles.length} country profiles, ${currencies.length} currencies`);
