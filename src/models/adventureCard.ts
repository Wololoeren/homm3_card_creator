export enum AdventureCardType {
  Event = "Event",
  Combat = "Combat",
}

export const adventureCardColors: Record<AdventureCardType, string> = {
  [AdventureCardType.Event]: "#1e4b7d",
  [AdventureCardType.Combat]: "#a5202f",
};

export interface AdventurePortrait {
  name: string;
  path: string;
}

// prettier-ignore
export const adventurePortraits: AdventurePortrait[] = [
  { name: "Tree of Knowledge", path: "adventure/tree_of_knowledge.png" },
  { name: "Cyclops Stockpile", path: "adventure/cyclops_stockpile.png" },
];

export interface AdventureCard {
  name: string;
  type: AdventureCardType;
  /** Printed in place of the type's own name; the type still sets the colour. */
  typeLabel?: string;
  portrait: AdventurePortrait;
  effect: string;
}

export const initialAdventureCard: AdventureCard = {
  name: "Tree of Knowledge",
  type: AdventureCardType.Event,
  portrait: adventurePortraits[0],
  effect:
    ":pay: 10 :gold: to gain 2 :experience:.\n:or:\n:pay: 3 :valuable: to gain 2 :experience:.",
};
