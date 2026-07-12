export type MaintenanceLevel = 'Low' | 'Medium' | 'High';

export interface VehicleRecord {
  readonly id: string;
  readonly name: string;
  readonly category: string;
  readonly priceCents: number;
  readonly valueCents: number;
  readonly fuelLabel: string;
  readonly maintenanceLevel: MaintenanceLevel;
  readonly topSpeedMph: number;
  readonly horsepower: number;
  readonly emoji: string;
  readonly owned: boolean;
}

export interface TransportationState {
  readonly vehicles: VehicleRecord[];
  readonly monthlyTransportCostCents: number;
}

function vehicle(
  input: Omit<VehicleRecord, 'valueCents'> & { valueCents?: number },
): VehicleRecord {
  return {
    ...input,
    valueCents: input.valueCents ?? (input.owned ? input.priceCents : 0),
  };
}

const BASE_INVENTORY: Omit<VehicleRecord, 'owned' | 'valueCents'>[] = [
  {
    id: 'veh-tesla',
    name: 'Tesla Model S',
    category: 'Electric',
    priceCents: 8_999_000,
    fuelLabel: 'Electric',
    maintenanceLevel: 'Low',
    topSpeedMph: 200,
    horsepower: 1020,
    emoji: '🚗',
  },
  {
    id: 'veh-bmw',
    name: 'BMW M5',
    category: 'Luxury',
    priceCents: 10_500_000,
    fuelLabel: '15 MPG',
    maintenanceLevel: 'High',
    topSpeedMph: 190,
    horsepower: 617,
    emoji: '🏎️',
  },
  {
    id: 'veh-camry',
    name: 'Toyota Camry',
    category: 'Economy',
    priceCents: 2_800_000,
    fuelLabel: '32 MPG',
    maintenanceLevel: 'Low',
    topSpeedMph: 135,
    horsepower: 203,
    emoji: '🚙',
  },
  {
    id: 'veh-range',
    name: 'Range Rover Sport',
    category: 'SUV',
    priceCents: 8_500_000,
    fuelLabel: '19 MPG',
    maintenanceLevel: 'Medium',
    topSpeedMph: 155,
    horsepower: 518,
    emoji: '🚐',
  },
  {
    id: 'veh-porsche',
    name: 'Porsche 911',
    category: 'Sports',
    priceCents: 12_500_000,
    fuelLabel: '18 MPG',
    maintenanceLevel: 'High',
    topSpeedMph: 205,
    horsepower: 640,
    emoji: '🏁',
  },
  {
    id: 'veh-sprinter',
    name: 'Mercedes Sprinter',
    category: 'Commercial',
    priceCents: 4_500_000,
    fuelLabel: '17 MPG',
    maintenanceLevel: 'Medium',
    topSpeedMph: 95,
    horsepower: 188,
    emoji: '🚚',
  },
];

export function createFreshStartTransportation(): TransportationState {
  const vehicles = BASE_INVENTORY.map((item) =>
    vehicle({ ...item, owned: false }),
  );
  return { vehicles, monthlyTransportCostCents: 0 };
}

export function createDefaultTransportation(background = 'middle-class'): TransportationState {
  const vehicles = BASE_INVENTORY.map((item) =>
    vehicle({ ...item, owned: false }),
  );

  if (background === 'wealthy') {
    vehicles[1] = { ...vehicles[1]!, owned: true, valueCents: 9_800_000 };
    vehicles[4] = { ...vehicles[4]!, owned: true, valueCents: 11_900_000 };
    return { vehicles, monthlyTransportCostCents: 1_200_00 };
  }

  if (background === 'entrepreneur-family') {
    vehicles[1] = { ...vehicles[1]!, owned: true, valueCents: 9_500_000 };
    return { vehicles, monthlyTransportCostCents: 850_00 };
  }

  if (background === 'working-class' || background === 'orphan') {
    vehicles[2] = { ...vehicles[2]!, owned: true, valueCents: 2_400_000 };
    return { vehicles, monthlyTransportCostCents: 280_00 };
  }

  vehicles[2] = { ...vehicles[2]!, owned: true, valueCents: 2_650_000 };
  return { vehicles, monthlyTransportCostCents: 420_00 };
}

export function ownedVehicles(transportation: TransportationState): VehicleRecord[] {
  return transportation.vehicles.filter((vehicle) => vehicle.owned);
}

export function transportationTotalValueCents(transportation: TransportationState): number {
  return ownedVehicles(transportation).reduce((sum, vehicle) => sum + vehicle.valueCents, 0);
}
