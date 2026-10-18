import { Portrait, portraits } from "./hero";
import { HeroType, TownType } from "./town";

/**
 * The levels the fixed XP track marks out. They are written into the effect
 * text as :level1:, :level3: and :level5: rather than being structure, so an
 * effect can run to as many lines as it needs.
 */
export const secondaryHeroLevels = ["I", "III", "V"] as const;

export interface SecondaryHeroStatistics {
  attack: number;
  defense: number;
  spellPower: number;
  knowledge: number;
}

/** One face of the card. A secondary hero card carries two, back to back. */
export interface SecondaryHeroSide {
  name: string;
  /** Colours the frame and the name band; nothing else follows from it. */
  town: TownType;
  type: HeroType;
  portrait: Portrait;
  /** Overrides the town colour on the panels; the border still follows town. */
  backgroundColor?: string;
  /** Colours the stat cells with the town colour instead of leaving them brown. */
  colouredStatPanels?: boolean;
  statistics: SecondaryHeroStatistics;
  /** Free text, the same as any other card's effect box. */
  effects: string;
}

export interface SecondaryHeroCard {
  front: SecondaryHeroSide;
  back: SecondaryHeroSide;
}

function portraitNamed(name: string): Portrait {
  return portraits.find((p) => p.name === name) ?? portraits[0];
}

const initialSide: SecondaryHeroSide = {
  name: "Aine",
  town: TownType.Tower,
  type: HeroType.Magic,
  portrait: portraitNamed("Aine"),
  statistics: { attack: 0, defense: 0, spellPower: 1, knowledge: 2 },
  effects: `:level1: :instant: When you would gain :gold:, gain +1 :gold:.
:level3: :ongoing: Resolve Water Wheel a second time (on a different Round). Place a second cube.
:level5: :instant: Set an Attack die to -1.`,
};

export const initialSecondaryHeroCard: SecondaryHeroCard = {
  front: initialSide,
  back: {
    ...initialSide,
    name: "Coronius",
    portrait: portraitNamed("Coronius"),
    effects: `:level1: :instant: Move an enemy unit to an adjacent empty space.
:level3: :ongoing: When searching for :artifact:, Search (X+1) instead.
:level5: :instant: Control an enemy :golden: unit activation.`,
  },
};
