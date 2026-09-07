import { UnitType } from "./unit";

export interface CreatureBankPortrait {
  name: string;
  path: string;
}

export interface CreatureBankStatistics {
  attack: number;
  defense: number;
  health: number;
  initiative: number;
}

export interface CreatureBankUnit {
  name: string;
  bankName: string;
  type: UnitType;
  statistics: CreatureBankStatistics;
  portrait: CreatureBankPortrait;
  specialty: string;
}

// prettier-ignore
export const creatureBankPortraits: CreatureBankPortrait[] = [
  { name: "Dragon Flies", path: "monsters/dragon_flies.webp" },
];

export const initialCreatureBankUnit: CreatureBankUnit = {
  name: "Dragon Flies",
  bankName: "Dragon Fly Hive",
  type: UnitType.Flying,
  statistics: {
    attack: 3,
    defense: 0,
    health: 2,
    initiative: 8,
  },
  portrait: creatureBankPortraits[0],
  specialty: ":unit_retaliate: Retaliation Attacks against Dragon Flies suffer -2 :attack:.",
};
