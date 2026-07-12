import type { CompanyStage } from './company.js';

export interface PropertyRecord {
  readonly id: string;
  readonly type: string;
  readonly location: string;
  readonly priceCents: number;
  readonly valueCents: number;
  readonly monthlyRentCents: number;
  readonly rating: number;
  readonly emoji: string;
  readonly owned: boolean;
}

export interface HousingState {
  readonly properties: PropertyRecord[];
  readonly monthlyMortgageCents: number;
}

function property(
  input: Omit<PropertyRecord, 'valueCents'> & { valueCents?: number },
): PropertyRecord {
  return {
    ...input,
    valueCents: input.valueCents ?? (input.owned ? input.priceCents : 0),
  };
}

export function createFreshStartHousing(cityLabel: string): HousingState {
  const district = cityLabel.split(',')[0]?.trim() || 'Metro';

  const listings: PropertyRecord[] = [
    property({
      id: 'prop-mansion',
      type: 'Luxury Residence',
      location: `${district} Heights`,
      priceCents: 250_000_000,
      monthlyRentCents: 850_000,
      rating: 5,
      emoji: '🏛️',
      owned: false,
    }),
    property({
      id: 'prop-penthouse',
      type: 'Downtown Penthouse',
      location: `${district} Financial District`,
      priceCents: 120_000_000,
      monthlyRentCents: 0,
      rating: 5,
      emoji: '🏢',
      owned: false,
    }),
    property({
      id: 'prop-home',
      type: 'Family Home',
      location: `${district} Suburbs`,
      priceCents: 65_000_000,
      monthlyRentCents: 320_000,
      rating: 4,
      emoji: '🏡',
      owned: false,
    }),
    property({
      id: 'prop-office',
      type: 'Commercial Office',
      location: `${district} Tech District`,
      priceCents: 180_000_000,
      monthlyRentCents: 1_200_000,
      rating: 4,
      emoji: '🏬',
      owned: false,
    }),
    property({
      id: 'prop-condo',
      type: 'Waterfront Condo',
      location: `${district} Bayfront`,
      priceCents: 95_000_000,
      monthlyRentCents: 450_000,
      rating: 5,
      emoji: '🏖️',
      owned: false,
    }),
    property({
      id: 'prop-studio',
      type: 'City Studio',
      location: `${district} Central`,
      priceCents: 28_000_000,
      monthlyRentCents: 0,
      rating: 3,
      emoji: '🏠',
      owned: false,
    }),
  ];

  return { properties: listings, monthlyMortgageCents: 0 };
}

export function createDefaultHousing(
  cityLabel: string,
  background = 'middle-class',
  companyStage: CompanyStage = 'startup',
): HousingState {
  const district = cityLabel.split(',')[0]?.trim() || 'Metro';

  const listings: PropertyRecord[] = [
    property({
      id: 'prop-mansion',
      type: 'Luxury Residence',
      location: `${district} Heights`,
      priceCents: 250_000_000,
      monthlyRentCents: 850_000,
      rating: 5,
      emoji: '🏛️',
      owned: false,
    }),
    property({
      id: 'prop-penthouse',
      type: 'Downtown Penthouse',
      location: `${district} Financial District`,
      priceCents: 120_000_000,
      monthlyRentCents: 0,
      rating: 5,
      emoji: '🏢',
      owned: false,
    }),
    property({
      id: 'prop-home',
      type: 'Family Home',
      location: `${district} Suburbs`,
      priceCents: 65_000_000,
      monthlyRentCents: 320_000,
      rating: 4,
      emoji: '🏡',
      owned: false,
    }),
    property({
      id: 'prop-office',
      type: 'Commercial Office',
      location: `${district} Tech District`,
      priceCents: 180_000_000,
      monthlyRentCents: 1_200_000,
      rating: 4,
      emoji: '🏬',
      owned: false,
    }),
    property({
      id: 'prop-condo',
      type: 'Waterfront Condo',
      location: `${district} Bayfront`,
      priceCents: 95_000_000,
      monthlyRentCents: 450_000,
      rating: 5,
      emoji: '🏖️',
      owned: false,
    }),
    property({
      id: 'prop-studio',
      type: 'City Studio',
      location: `${district} Central`,
      priceCents: 28_000_000,
      monthlyRentCents: 0,
      rating: 3,
      emoji: '🏠',
      owned: false,
    }),
  ];

  if (background === 'wealthy' || companyStage === 'established') {
    listings[0] = { ...listings[0]!, owned: true, valueCents: 265_000_000 };
    listings[1] = { ...listings[1]!, owned: true, valueCents: 128_500_000 };
    return { properties: listings, monthlyMortgageCents: 12_000_00 };
  }

  if (background === 'entrepreneur-family' || companyStage === 'growth') {
    listings[2] = { ...listings[2]!, owned: true, valueCents: 68_000_000 };
    listings[1] = { ...listings[1]!, owned: true, valueCents: 125_000_000 };
    return { properties: listings, monthlyMortgageCents: 6_500_00 };
  }

  if (background === 'working-class' || background === 'orphan') {
    listings[5] = { ...listings[5]!, owned: true, valueCents: 29_500_000 };
    return { properties: listings, monthlyMortgageCents: 1_800_00 };
  }

  listings[5] = { ...listings[5]!, owned: true, valueCents: 30_500_000 };
  return { properties: listings, monthlyMortgageCents: 2_400_00 };
}

export function ownedProperties(housing: HousingState): PropertyRecord[] {
  return housing.properties.filter((property) => property.owned);
}

export function housingTotalValueCents(housing: HousingState): number {
  return ownedProperties(housing).reduce((sum, property) => sum + property.valueCents, 0);
}

export function housingMonthlyRentalIncomeCents(housing: HousingState): number {
  return ownedProperties(housing).reduce((sum, property) => sum + property.monthlyRentCents, 0);
}

export function housingTotalAppreciationCents(housing: HousingState): number {
  return ownedProperties(housing).reduce(
    (sum, property) => sum + (property.valueCents - property.priceCents),
    0,
  );
}
