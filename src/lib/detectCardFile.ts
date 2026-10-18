import { upgradeCardAssets } from "./legacyAssets";

/**
 * Every saved card is `{ herocreator: "0.1", <key>: <payload> }`, so the key
 * present tells us which kind of card the file holds. That lets the PDF tab
 * take a mixed pile of .json files without asking what each one is.
 */
export const CARD_KEYS = [
  "hero",
  "unit",
  "factionUnit",
  "creatureBankUnit",
  "ability",
  "spell",
  "artifact",
  "astrologer",
  "event",
  "pandora",
  "adventure",
  "morale",
  "secondaryHero",
] as const;

export type CardKey = (typeof CARD_KEYS)[number];

export interface ParsedCardFile {
  key: CardKey;
  payload: unknown;
}

export function parseCardFile(text: string): ParsedCardFile {
  let obj: Record<string, unknown>;
  try {
    obj = JSON.parse(text);
  } catch {
    throw new Error("Not a JSON file.");
  }

  if (!obj || !obj.herocreator) {
    throw new Error("Not a Hero Creator file.");
  }

  const key = CARD_KEYS.find((candidate) => obj[candidate]);
  if (!key) {
    throw new Error("Unrecognised card type.");
  }

  return { key, payload: upgradeCardAssets(obj[key]) };
}
