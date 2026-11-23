export enum MoraleType {
  Positive = "Positive",
  Negative = "Negative",
}

export interface MoraleCard {
  type: MoraleType;
  /**
   * A title of the card's own. The printed templates carry "Positive Morale"
   * and "Negative Morale" in their art, so a card naming its own title is
   * drawn on a template with the plaque left blank and the title set over it.
   * Absent means the baked title is used.
   */
  title?: string;
  effect: string;
}

export const initialMoraleCard: MoraleCard = {
  type: MoraleType.Positive,
  effect: "Discard any number of cards from\nhand and draw as many.",
};
