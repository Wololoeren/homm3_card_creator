import { describe, expect, it } from "vitest";

import { parseCardFile } from "./detectCardFile";
import { upgradeAssetPath, upgradeCardAssets } from "./legacyAssets";
import { iconMap } from "./textToComponent";

/** A card file as it was written before the monster art became WEBP. */
function savedFile(key: string, payload: unknown): string {
  return JSON.stringify({ herocreator: "0.1", [key]: payload });
}

describe("upgradeAssetPath", () => {
  it("points a renamed monster path at the file that replaced it", () => {
    expect(upgradeAssetPath("monsters/boars.png")).toBe("monsters/boars.webp");
    expect(upgradeAssetPath("monsters/arch_devils.png")).toBe(
      "monsters/arch_devils.webp",
    );
    expect(upgradeAssetPath("monsters/gold-golems.png")).toBe(
      "monsters/gold-golems.webp",
    );
  });

  it("leaves art that was never renamed alone", () => {
    for (const path of [
      "monsters/boars.webp",
      "heroes/adela.png",
      "abilities/air_magic.png",
      "artifacts/angel_wings.png",
      "card_back.webp",
    ]) {
      expect(upgradeAssetPath(path)).toBe(path);
    }
  });

  it("leaves uploaded art alone", () => {
    const uploaded = "data:image/png;base64,iVBORw0KGgo=";
    expect(upgradeAssetPath(uploaded)).toBe(uploaded);
  });

  it("only rewrites a whole path, not a mention inside one", () => {
    expect(upgradeAssetPath("art/monsters/boars.png")).toBe(
      "art/monsters/boars.png",
    );
  });
});

describe("upgradeCardAssets", () => {
  it("reaches a path wherever it sits in the card", () => {
    const hero = {
      name: "Shakti",
      specialty: { name: "Troglodytes", path: "monsters/troglodytes.png" },
      portrait: { name: "Shakti", path: "heroes/shakti.png" },
      specialtyContent: { one: "Your :damage: rises." },
    };

    expect(upgradeCardAssets(hero)).toEqual({
      ...hero,
      specialty: { name: "Troglodytes", path: "monsters/troglodytes.webp" },
    });
  });

  it("carries numbers, booleans and nulls through untouched", () => {
    const unit = {
      statistics: { attack: 2, price: 4 },
      empowered: false,
      note: null,
      tags: ["monsters/liches.png", "keep me"],
    };

    expect(upgradeCardAssets(unit)).toEqual({
      ...unit,
      tags: ["monsters/liches.webp", "keep me"],
    });
  });

  it("does not change the card it was handed", () => {
    const unit = { portrait: { path: "monsters/nagas.png" } };
    upgradeCardAssets(unit);
    expect(unit.portrait.path).toBe("monsters/nagas.png");
  });
});

describe("parseCardFile", () => {
  it("upgrades a unit saved before the art was renamed", () => {
    const { key, payload } = parseCardFile(
      savedFile("unit", {
        name: "Boars",
        portrait: { name: "Boars", path: "monsters/boars.png" },
      }),
    );

    expect(key).toBe("unit");
    expect(payload).toMatchObject({
      portrait: { path: "monsters/boars.webp" },
    });
  });

  it("upgrades the specialty of a hero saved the same way", () => {
    const { payload } = parseCardFile(
      savedFile("hero", {
        name: "Shakti",
        specialty: { name: "Troglodytes", path: "monsters/troglodytes.png" },
      }),
    );

    expect(payload).toMatchObject({
      specialty: { path: "monsters/troglodytes.webp" },
    });
  });
});

describe("iconMap", () => {
  it("still knows the tokens a saved card can carry", () => {
    // Dropping one silently turns it into literal text on the printed card.
    for (const token of [":treasure:", ":2_treasure_die:", ":or:"]) {
      expect(iconMap[token]).toBeDefined();
    }
  });
});
