export enum MoraleType {
  Positive = "Positive",
  Negative = "Negative",
}

export interface MoraleCard {
  type: MoraleType;
  effect: string;
}

export const initialMoraleCard: MoraleCard = {
  type: MoraleType.Positive,
  effect: "Discard any number of cards from\nhand and draw as many.",
};
