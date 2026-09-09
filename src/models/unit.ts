export enum UnitType {
  Melee = "melee",
  Flying = "flying",
  Ranged = "ranged",
}

export enum UnitTier {
  Bronze = "bronze",
  Silver = "silver",
  Golden = "golden",
  Azure = "azure",
}

export interface UnitPortrait {
  name: string;
  path: string;
}

export interface UnitStatistics {
  attack: number;
  defense: number;
  health: number;
  initiative: number;
  price: number;
}

export interface Unit {
  name: string;
  type: UnitType;
  tier: UnitTier;
  statistics: UnitStatistics;
  portrait: UnitPortrait;
  specialty: string;
}

// prettier-ignore
export const unitPortraits: UnitPortrait[] = [
  { name: "Halberdiers", path: "monsters/halberdiers.webp" },
  // todo: replace
  { name: "Boars", path: "monsters/boars.webp" },
  { name: "Arch Devils", path: "monsters/arch_devils.webp" },
  { name: "Evil Eyes", path: "monsters/evil_eyes.webp" },
  { name: "Harpies", path: "monsters/harpies.webp" },
  { name: "Liches", path: "monsters/liches.webp" },
  { name: "Nagas", path: "monsters/nagas.webp" },
  { name: "Pegasi", path: "monsters/pegasi.webp" },
  { name: "Troglodytes", path: "monsters/troglodytes.webp" },
];

// Boars (Neutral, Core Game) is used as the default template: it's the
// simplest real unit card (bronze tier, no specialty text).
export const initialUnit: Unit = {
  name: "Boars",
  type: UnitType.Melee,
  tier: UnitTier.Bronze,
  statistics: {
    attack: 2,
    defense: 0,
    health: 4,
    initiative: 6,
    price: 4,
  },
  portrait: unitPortraits[0],
  specialty: "",
};
