/**
 * A saved card stores the path of the art it uses, so a card written before
 * the monster art was republished as WEBP still asks for a PNG that is no
 * longer there — the portrait would come up blank. The path is rewritten as
 * the file is read instead, which keeps those saves working without keeping
 * the old art around.
 *
 * Only the monster art was renamed; every other file a card names — hero
 * portraits, ability and artifact icons — kept the name it was saved under,
 * and uploaded art is carried in the file as a data URL rather than a path.
 */
const RENAMED_ART = /^monsters\/([\w-]+)\.png$/;

/** The current name of a file a card may have been saved pointing at. */
export function upgradeAssetPath(path: string): string {
  return path.replace(RENAMED_ART, "monsters/$1.webp");
}

/**
 * Brings every renamed path inside a card up to date, wherever it sits in the
 * card: the portrait of a unit, the specialty of a hero, or a mention in the
 * text of either. Anything that is not a renamed path is handed back as it
 * came in.
 */
export function upgradeCardAssets<T>(card: T): T {
  if (typeof card === "string") return upgradeAssetPath(card) as T;

  if (Array.isArray(card)) return card.map(upgradeCardAssets) as T;

  if (card && typeof card === "object") {
    return Object.fromEntries(
      Object.entries(card).map(([key, value]) => [
        key,
        upgradeCardAssets(value),
      ]),
    ) as T;
  }

  return card;
}
