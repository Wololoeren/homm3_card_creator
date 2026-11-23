import { abilities as abilityIcons, Ability as AbilityIconRef } from "./ability";

export type AbilityIcon = AbilityIconRef;
export { abilityIcons };

/** Printed under the name on an empowered card, when the card names none. */
export const defaultEmpoweredLabel = "Empowered";

export interface AbilityCard {
  name: string;
  icon: AbilityIcon;
  regularEffect: string;
  expertEffect: string;
  empowered: boolean;
  /** Optional: cards saved before the label was editable carry none. */
  empoweredLabel?: string;
}

export const initialAbilityCard: AbilityCard = {
  name: "Air Magic",
  icon: abilityIcons[0],
  regularEffect: ":permanent: +1 :spell: for spells from School of Air Magic.",
  expertEffect:
    "When casting a spell from the School of Air, you can discard this card, then gain +3 :spell:.",
  empowered: false,
};
