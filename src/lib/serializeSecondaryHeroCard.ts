import { SecondaryHeroCard } from "@/models/secondaryHeroCard";
import { fileOpen } from "browser-fs-access";
import saveAs from "file-saver";
import { normalizeString } from "./normalizeString";
import { upgradeCardAssets } from "./legacyAssets";

interface JsonFormat {
  herocreator: "0.1";
  secondaryHero: SecondaryHeroCard;
}

function parseSecondaryHeroCard(data: string): SecondaryHeroCard {
  const obj = JSON.parse(data);

  if (!obj.herocreator) {
    throw new Error("Invalid format!");
  }

  if (!obj.secondaryHero) {
    throw new Error("This file is not a secondary hero card!");
  }

  return upgradeCardAssets((obj as JsonFormat).secondaryHero);
}

export function stringifySecondaryHeroCard(card: SecondaryHeroCard): string {
  const data = { herocreator: "0.1", secondaryHero: card };
  return JSON.stringify(data, null, 2);
}

export async function loadSecondaryHeroCard(): Promise<SecondaryHeroCard> {
  const blob = await fileOpen({
    mimeTypes: ["application/json"],
    extensions: [".json"],
    description: "Secondary hero card",
  });
  const text = await blob.text();
  return parseSecondaryHeroCard(text);
}

export function saveSecondaryHeroCard(card: SecondaryHeroCard) {
  saveAs(
    new Blob([stringifySecondaryHeroCard(card)], {
      type: "application/json;charset=utf-8",
    }),
    `${normalizeString(`${card.front.name}.${card.back.name}`)}.secondary-hero.json`,
  );
}
