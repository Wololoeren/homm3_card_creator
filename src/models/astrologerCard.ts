/** The lead-in printed before the name, when the card carries none. */
export const defaultAstrologerIntro = "Astrologers proclaim week of the";

export interface AstrologerCard {
  name: string;
  /** Optional: cards saved before the lead-in was editable carry none. */
  introText?: string;
  effect: string;
  flavorText: string;
}

export const initialAstrologerCard: AstrologerCard = {
  name: "Annoying Lizard",
  introText: defaultAstrologerIntro,
  effect:
    "Each player must shuffle all Artifact and Spell cards from their hand back into their deck and draw the same number of cards from the top of their deck of Might and Magic.",
  flavorText: "Hey, Hero! Hero! Hey, Hero! Hero! Hey!",
};
