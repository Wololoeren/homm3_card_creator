import { TownType } from "./town";
import { UnitPortrait, UnitTier, UnitType, unitPortraits } from "./unit";

export interface FactionUnitStats {
  attack: number;
  defense: number;
  health: number;
  initiative: number;
  type: UnitType;
}

export interface ResourceCost {
  gold: number;
  valuables: number;
}

/** Icon on a reinforcement box: the neutral-card hand-and-coin, or the
 *  up-arrows used for reinforcement. */
export enum PriceGlyph {
  Pay = "pay",
  Reinforce = "reinforce",
}

export interface FactionUnit {
  name: string;
  town: TownType;
  tier: UnitTier;
  few: FactionUnitStats;
  pack: FactionUnitStats;
  recruitCost: ResourceCost;
  reinforceCost: ResourceCost;
  portrait: UnitPortrait;
  fewSpecialty: string;
  packSpecialty: string;
  /** Override the town's colours, as hero.customClass does. */
  borderColor?: string;
  backgroundColor?: string;
  /**
   * Gives the back the same two-box cost row as the front instead of its
   * "# PACK" band: each face shows a price box beside a reinforcement box.
   * The front prices from recruitCost and the back from reinforceCost; both
   * reinforcement boxes are free text, defaulting to "#FEW" and "#PACK".
   * Stats are unaffected — the front still shows few, the back pack.
   */
  moreReinforcements?: boolean;
  /** Icon for the front's price box. Defaults to Pay. */
  frontPriceGlyph?: PriceGlyph;
  /** Icon for the back's price box. Defaults to Reinforce. */
  backPriceGlyph?: PriceGlyph;
  frontReinforcementText?: string;
  backReinforcementText?: string;
  /**
   * Lets the back carry its own name and portrait. While off, both faces use
   * the front's; the back fields are still kept so switching off and back on
   * restores whatever was set.
   */
  separateBackFace?: boolean;
  /** Used by the back when separateBackFace is on; falls back to the front. */
  backName?: string;
  backPortrait?: UnitPortrait;
}

/** Defaults for the reinforcement boxes in More Reinforcements format. */
export const DEFAULT_FRONT_REINFORCEMENT_TEXT = "#FEW";
export const DEFAULT_BACK_REINFORCEMENT_TEXT = "#PACK";

// Arch Devils (Inferno, Golden tier) is used as the default template.
export const initialFactionUnit: FactionUnit = {
  name: "Arch Devils",
  town: TownType.Inferno,
  tier: UnitTier.Golden,
  few: {
    attack: 6,
    defense: 3,
    health: 8,
    initiative: 11,
    type: UnitType.Flying,
  },
  pack: {
    attack: 7,
    defense: 3,
    health: 9,
    initiative: 15,
    type: UnitType.Flying,
  },
  recruitCost: { gold: 22, valuables: 1 },
  reinforceCost: { gold: 30, valuables: 2 },
  portrait: unitPortraits.find((p) => p.name === "Arch Devils")!,
  fewSpecialty: ":unit_attack: Ignores Retaliation Attacks.",
  packSpecialty:
    ":unit_attack: Ignores Retaliation Attacks.\n:unit_special: As a regular movement, the Arch Devils can move to any empty space.",
};
