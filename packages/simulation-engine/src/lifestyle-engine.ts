import type {
  BankingState,
  BankTransaction,
  EconomyState,
  FamilyState,
  HousingState,
  SimEvent,
  TransportationState,
  WorldInstance,
} from '@fenix/domain';
import { globalDomainEventBus, housingMonthlyRentalIncomeCents } from '@fenix/domain';
import { parseGameDate } from './time-engine.js';

export interface MonthlyBillBreakdown {
  utilitiesCents: number;
  subscriptionsCents: number;
  insuranceCents: number;
  foodCents: number;
  totalCents: number;
}

/** Derive realistic monthly bills from world context. */
export function computeMonthlyBillBreakdown(world: WorldInstance): MonthlyBillBreakdown {
  const ownedProps = world.housing.properties.filter((p) => p.owned).length;
  const hasVehicle = world.transportation.vehicles.some((v) => v.owned);
  const familySize = Math.max(1, world.family.members.length + 1);
  const inflationMultiplier = 1 + world.economy.inflationRateAnnual;

  const utilitiesCents = Math.round(8_000 * (1 + ownedProps * 0.4) * inflationMultiplier);
  const subscriptionsCents = Math.round(4_500 * inflationMultiplier);
  const insuranceCents = Math.round(
    (6_000 + (hasVehicle ? 8_500 : 0) + ownedProps * 5_000) * inflationMultiplier,
  );
  const foodCents = Math.round(12_000 * familySize * inflationMultiplier);

  return {
    utilitiesCents,
    subscriptionsCents,
    insuranceCents,
    foodCents,
    totalCents: utilitiesCents + subscriptionsCents + insuranceCents + foodCents,
  };
}

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

function appendTransaction(
  banking: BankingState,
  tx: Omit<BankTransaction, 'id'>,
): BankingState {
  const entry: BankTransaction = {
    ...tx,
    id: `tx-bills-${tx.date}-${banking.transactions.length}`,
  };
  return {
    ...banking,
    transactions: [entry, ...banking.transactions].slice(0, 30),
  };
}

function appendSimEvent(events: SimEvent[], event: SimEvent): SimEvent[] {
  globalDomainEventBus.publish(event);
  return [event, ...events].slice(0, 50);
}

/** Deducts computed monthly bills on the 1st of each game month. */
export function applyMonthlyBillsSettlement(world: WorldInstance): WorldInstance {
  const { day } = parseGameDate(world.currentDate);
  if (day !== 1) return world;

  const bills = computeMonthlyBillBreakdown(world);
  if (bills.totalCents <= 0) return world;

  let banking = updateAccountBalance(world.banking, 'checking', -bills.totalCents);
  banking = appendTransaction(banking, {
    date: world.currentDate,
    description: 'Monthly bills (utilities, food, insurance)',
    amountCents: -bills.totalCents,
    accountId: 'checking',
  });

  const checkingBalance = banking.accounts.find((a) => a.id === 'checking')?.balanceCents ?? 0;
  let events = world.events;
  if (checkingBalance < 0) {
    events = appendSimEvent(events, {
      id: `evt-overdraft-${world.clock.tickCount}`,
      tickCount: world.clock.tickCount,
      date: world.currentDate,
      category: 'finance',
      headline: `Account overdrawn — monthly bills of ${(bills.totalCents / 100).toLocaleString(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })} exceeded checking balance`,
      tone: 'warning',
    });
  }

  return { ...world, banking, events };
}

export function applyMonthlyHousingSettlement(world: WorldInstance): WorldInstance {
  const { day } = parseGameDate(world.currentDate);
  if (day !== 1) {
    return world;
  }

  const rentalIncome = housingMonthlyRentalIncomeCents(world.housing);
  const mortgage = world.housing.monthlyMortgageCents;
  const ownedCount = world.housing.properties.filter((property) => property.owned).length;
  const maintenanceCents = ownedCount > 0 ? ownedCount * 350_00 : 0;
  const net = rentalIncome - mortgage - maintenanceCents;

  let nextWorld = world;
  if (net !== 0) {
    nextWorld = {
      ...nextWorld,
      banking: updateAccountBalance(nextWorld.banking, 'checking', net),
    };
  }

  if (maintenanceCents > 0) {
    nextWorld = {
      ...nextWorld,
      events: appendSimEvent(nextWorld.events, {
        id: `evt-maint-${world.clock.tickCount}`,
        tickCount: world.clock.tickCount,
        date: world.currentDate,
        category: 'finance',
        headline: `Property maintenance bill — ${(maintenanceCents / 100).toLocaleString()}`,
        tone: 'warning',
      }),
    };
  }

  return nextWorld;
}

export function applyMonthlyTransportCosts(world: WorldInstance): WorldInstance {
  const { day } = parseGameDate(world.currentDate);
  if (day !== 1 || world.transportation.monthlyTransportCostCents <= 0) {
    return world;
  }

  let nextWorld: WorldInstance = {
    ...world,
    banking: updateAccountBalance(
      world.banking,
      'checking',
      -world.transportation.monthlyTransportCostCents,
    ),
  };

  const owned = world.transportation.vehicles.filter((vehicle) => vehicle.owned);
  if (owned.length > 0) {
    const roll = ((world.clock.tickCount * 1103515245 + 12345) >>> 0) / 4_294_967_296;
    if (roll < 0.08) {
      const repairCents = 4_500_00 + Math.round(roll * 8_000_00);
      nextWorld = {
        ...nextWorld,
        banking: updateAccountBalance(nextWorld.banking, 'checking', -repairCents),
        player: {
          ...nextWorld.player,
          traits: {
            ...nextWorld.player.traits,
            stress: clamp(nextWorld.player.traits.stress + 8, 0, 100),
          },
        },
        events: appendSimEvent(nextWorld.events, {
          id: `evt-breakdown-${world.clock.tickCount}`,
          tickCount: world.clock.tickCount,
          date: world.currentDate,
          category: 'life',
          headline: `Vehicle breakdown — repair cost ${(repairCents / 100).toLocaleString()} and commute stress`,
          tone: 'warning',
        }),
      };
    }
  }

  return nextWorld;
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
  if (avg < 55) {
    return `Family tension rising — household morale at ${avg}%`;
  }
  if (avg > 80) {
    return `Family support strong — household morale at ${avg}%`;
  }
  return `Household morale steady at ${avg}% across ${family.members.length} member${family.members.length === 1 ? '' : 's'}`;
}
