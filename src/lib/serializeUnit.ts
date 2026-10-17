import { Unit } from "@/models/unit";
import { fileOpen } from "browser-fs-access";
import saveAs from "file-saver";
import { normalizeString } from "./normalizeString";
import { upgradeCardAssets } from "./legacyAssets";

interface JsonFormat {
  herocreator: "0.1";
  unit: Unit;
}

function parseUnit(data: string): Unit {
  const obj = JSON.parse(data);

  if (!obj.herocreator) {
    throw new Error("Invalid format!");
  }

  if (!obj.unit) {
    throw new Error("This file is not a neutral unit card!");
  }

  return upgradeCardAssets((obj as JsonFormat).unit);
}

export function stringifyUnit(unit: Unit): string {
  const data = { herocreator: "0.1", unit };
  return JSON.stringify(data, null, 2);
}

export async function loadUnit(): Promise<Unit> {
  const blob = await fileOpen({
    mimeTypes: ["application/json"],
    extensions: [".homm3unit.json"],
  });
  const text = await blob.text();
  return parseUnit(text);
}

export function saveUnit(unit: Unit) {
  saveAs(
    new Blob([stringifyUnit(unit)], {
      type: "application/json;charset=utf-8",
    }),
    `${normalizeString(unit.name)}.homm3unit.json`
  );
}
