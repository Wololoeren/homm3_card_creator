import { FactionUnit } from "@/models/factionUnit";
import { fileOpen } from "browser-fs-access";
import saveAs from "file-saver";
import { normalizeString } from "./normalizeString";

interface JsonFormat {
  herocreator: "0.1";
  factionUnit: FactionUnit;
}

function parseFactionUnit(data: string): FactionUnit {
  const obj = JSON.parse(data);

  if (!obj.herocreator) {
    throw new Error("Invalid format!");
  }

  if (!obj.factionUnit) {
    throw new Error("This file is not a faction unit card!");
  }

  return (obj as JsonFormat).factionUnit;
}

export function stringifyFactionUnit(factionUnit: FactionUnit): string {
  const data = { herocreator: "0.1", factionUnit };
  return JSON.stringify(data, null, 2);
}

export async function loadFactionUnit(): Promise<FactionUnit> {
  const blob = await fileOpen({
    mimeTypes: ["application/json"],
    extensions: [".json"],
    description: "Faction unit card",
  });
  const text = await blob.text();
  return parseFactionUnit(text);
}

export function saveFactionUnit(factionUnit: FactionUnit) {
  saveAs(
    new Blob([stringifyFactionUnit(factionUnit)], {
      type: "application/json;charset=utf-8",
    }),
    `${normalizeString(factionUnit.name)}.faction_unit.json`,
  );
}
