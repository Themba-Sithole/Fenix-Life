import type {
  BankingState,
  EconomyState,
  FamilyState,
  HousingState,
  TransportationState,
  WorldInstance,
} from '@fenix/domain';
import { housingMonthlyRentalIncomeCents } from '@fenix/domain';
import { parseGameDate } from './time-engine.js';

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/** Housing Engine v0 — property value drift tied to macro conditions. */
export function applyDailyHousingTick(
  housing: HousingState,
  economy: EconomyState,
): HousingState {
  const sectorBoost = (economy.techSectorIndex - 100) / 50000;

  const properties = housing.properties.map((property) => {
    if (!property.owned) {
      return property;
    }

    const drift = (Math.random() - 0.45) * 0.0015 + sectorBoost;
    const nextValue = Math.max(
      Math.round(property.priceCents * 0.85),
      Math.round(property.valueCents * (1 + drift)),
    );

    return { ...property, valueCents: nextValue };
  });

  return { ...housing, properties };
}

/** Transportation Engine v0 — owned vehicle depreciation. */
export function applyDailyTransportationTick(
  transportation: TransportationState,
): TransportationState {
  const vehicles = transportation.vehicles.map((vehicle) => {
    if (!vehicle.owned) {
      return vehicle;
    }

    const depreciation = Math.random() > 0.7 ? Math.round(vehicle.valueCents * 0.0004) : 0;
    return {
      ...vehicle,
      valueCents: Math.max(Math.round(vehicle.priceCents * 0.35), vehicle.valueCents - depreciation),
    };
  });

  return { ...transportation, vehicles };
}

/** Family Engine v0 — household happiness drift. */
export function applyDailyFamilyTick(family: FamilyState, playerHappiness: number): FamilyState {
  const members = family.members.map((member) => ({
    ...member,
    happiness: clamp(
      member.happiness + (Math.random() > 0.55 ? 1 : -1) + Math.round((playerHappiness - 70) / 40),
      40,
      100,
    ),
  }));

  return { ...family, members };
}

function updateAccountBalance(
  banking: BankingState,
  accountId: string,
  deltaCents: number,
): BankingState {
  return {
    ...banking,
    accounts: banking.accounts.map((account) =>
      account.id === accountId
        ? { ...account, balanceCents: account.balanceCents + deltaCents }
        : account,
    ),
  };
}

export function applyMonthlyHousingSettlement(world: WorldInstance): WorldInstance {
  const { day } = parseGameDate(world.currentDate);
  if (day !== 1) {
    return world;
  }

  const rentalIncome = housingMonthlyRentalIncomeCents(world.housing);
  const mortgage = world.housing.monthlyMortgageCents;
  const net = rentalIncome - mortgage;

  if (net === 0) {
    return world;
  }

  return {
    ...world,
    banking: updateAccountBalance(world.banking, 'checking', net),
  };
}

export function applyMonthlyTransportCosts(world: WorldInstance): WorldInstance {
  const { day } = parseGameDate(world.currentDate);
  if (day !== 1 || world.transportation.monthlyTransportCostCents <= 0) {
    return world;
  }

  return {
    ...world,
    banking: updateAccountBalance(
      world.banking,
      'checking',
      -world.transportation.monthlyTransportCostCents,
    ),
  };
}

export function housingHeadline(housing: HousingState): string {
  const owned = housing.properties.filter((property) => property.owned).length;
  return `Property market update: ${owned} owned asset${owned === 1 ? '' : 's'} tracked in portfolio`;
}

export function familyHeadline(family: FamilyState): string {
  const avg =
    family.members.length === 0
      ? 0
      : Math.round(
          family.members.reduce((sum, member) => sum + member.happiness, 0) / family.members.length,
        );
  return `Household morale steady at ${avg}% across ${family.members.length} member${family.members.length === 1 ? '' : 's'}`;
}
