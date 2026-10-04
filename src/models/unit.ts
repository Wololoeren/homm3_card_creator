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
  { name: "Marksmen", path: "monsters/marksmen.webp" },
  { name: "Griffins", path: "monsters/griffins.webp" },
  { name: "Crusaders", path: "monsters/crusaders.webp" },

  { name: "Wraiths", path: "monsters/wraiths.webp" },
  { name: "Vampires", path: "monsters/vampires.webp" },
  { name: "Liches", path: "monsters/liches.webp" },
  { name: "Ghost Dragons", path: "monsters/ghost-dragons.webp" },

  { name: "Troglodytes", path: "monsters/troglodytes.webp" },
  { name: "Harpies", path: "monsters/harpies.webp" },
  { name: "Evil Eyes", path: "monsters/evil_eyes.webp" },

  { name: "Pegasi", path: "monsters/pegasi.webp" },
  { name: 'Unicorns', path: "monsters/unicorns.webp" },

  { name: "Dragon Flies", path: "monsters/dragon_flies.webp" },

  { name: 'Cerberi', path: "monsters/cerberi.webp" },
  { name: 'Efreet', path: "monsters/efreet.webp" },
  { name: "Arch Devils", path: "monsters/arch_devils.webp" },

  { name: 'Sprites', path: "monsters/sprites.webp" },
  { name: 'Storm Elementals', path: "monsters/storm_elementals.webp" },
  { name: 'Ice Elementals', path: "monsters/ice_elementals.webp" },
  { name: 'Energy Elementals', path: "monsters/energy_elementals.webp" },
  { name: 'Magma Elementals', path: "monsters/magma_elementals.webp" },
  { name: 'Magic Elementals', path: "monsters/magic_elementals.webp" },

  { name: "Nagas", path: "monsters/nagas.webp" },

  { name: "Boars", path: "monsters/boars.webp" },
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
