export interface FamilyMemberRecord {
  readonly id: string;
  readonly name: string;
  readonly relationship: string;
  readonly ageYears: number;
  readonly happiness: number;
  readonly emoji: string;
}

export interface FamilyState {
  readonly members: FamilyMemberRecord[];
  readonly householdExpensesCents: number;
}

function lastNameFrom(displayName: string): string {
  const parts = displayName.trim().split(/\s+/);
  return parts.length > 1 ? parts[parts.length - 1]! : 'Family';
}

export function createDefaultFamily(playerName: string, background = 'middle-class'): FamilyState {
  const lastName = lastNameFrom(playerName);
  const firstName = playerName.trim().split(/\s+/)[0] || 'Citizen';

  if (background === 'orphan') {
    return {
      members: [
        {
          id: 'fam-mentor',
          name: 'Jordan Ellis',
          relationship: 'Mentor',
          ageYears: 45,
          happiness: 78,
          emoji: '🧑',
        },
      ],
      householdExpensesCents: 1_800_00,
    };
  }

  if (background === 'immigrant') {
    return {
      members: [
        {
          id: 'fam-parent',
          name: `Amina ${lastName}`,
          relationship: 'Parent',
          ageYears: 54,
          happiness: 82,
          emoji: '👩',
        },
        {
          id: 'fam-sibling',
          name: `Sam ${lastName}`,
          relationship: 'Sibling',
          ageYears: 26,
          happiness: 80,
          emoji: '🧑',
        },
      ],
      householdExpensesCents: 3_200_00,
    };
  }

  if (background === 'wealthy' || background === 'entrepreneur-family') {
    return {
      members: [
        {
          id: 'fam-partner',
          name: `Emma ${lastName}`,
          relationship: 'Partner',
          ageYears: 30,
          happiness: 95,
          emoji: '👩',
        },
        {
          id: 'fam-father',
          name: `Michael ${lastName}`,
          relationship: 'Father',
          ageYears: 62,
          happiness: 88,
          emoji: '👨',
        },
        {
          id: 'fam-mother',
          name: `Lisa ${lastName}`,
          relationship: 'Mother',
          ageYears: 59,
          happiness: 90,
          emoji: '👩',
        },
        {
          id: 'fam-sibling',
          name: `Sophie ${lastName}`,
          relationship: 'Sibling',
          ageYears: 28,
          happiness: 85,
          emoji: '👧',
        },
      ],
      householdExpensesCents: 6_500_00,
    };
  }

  return {
    members: [
      {
        id: 'fam-partner',
        name: `Alex ${lastName === firstName ? 'Rivera' : lastName}`,
        relationship: 'Partner',
        ageYears: 28,
        happiness: 84,
        emoji: '🧑',
      },
      {
        id: 'fam-mother',
        name: `Patricia ${lastName}`,
        relationship: 'Mother',
        ageYears: 56,
        happiness: 86,
        emoji: '👩',
      },
    ],
    householdExpensesCents: 3_800_00,
  };
}

export function familyDisplayName(playerName: string): string {
  return `The ${lastNameFrom(playerName)} Family`;
}

export function averageFamilyHappiness(family: FamilyState): number {
  if (family.members.length === 0) {
    return 0;
  }
  const total = family.members.reduce((sum, member) => sum + member.happiness, 0);
  return Math.round(total / family.members.length);
}
