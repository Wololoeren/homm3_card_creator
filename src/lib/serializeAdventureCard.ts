import { AdventureCard } from "@/models/adventureCard";
import { fileOpen } from "browser-fs-access";
import saveAs from "file-saver";
import { normalizeString } from "./normalizeString";

interface JsonFormat {
  herocreator: "0.1";
  adventure: AdventureCard;
}

function parseAdventureCard(data: string): AdventureCard {
  const obj = JSON.parse(data);

  if (!obj.herocreator) {
    throw new Error("Invalid format!");
  }

  if (!obj.adventure) {
    throw new Error("This file is not a adventure card!");
  }

  return (obj as JsonFormat).adventure;
}

export function stringifyAdventureCard(adventure: AdventureCard): string {
  const data = { herocreator: "0.1", adventure };
  return JSON.stringify(data, null, 2);
}

export async function loadAdventureCard(): Promise<AdventureCard> {
  const blob = await fileOpen({
    mimeTypes: ["application/json"],
    extensions: [".json"],
    description: "Adventure card",
  });
  const text = await blob.text();
  return parseAdventureCard(text);
}

export function saveAdventureCard(adventure: AdventureCard) {
  saveAs(
    new Blob([stringifyAdventureCard(adventure)], {
      type: "application/json;charset=utf-8",
    }),
    `${normalizeString(adventure.name)}.adventure.json`,
  );
}
