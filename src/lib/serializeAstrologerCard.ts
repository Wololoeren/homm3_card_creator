import { AstrologerCard } from "@/models/astrologerCard";
import { fileOpen } from "browser-fs-access";
import saveAs from "file-saver";
import { normalizeString } from "./normalizeString";

interface JsonFormat {
  herocreator: "0.1";
  astrologer: AstrologerCard;
}

function parseAstrologerCard(data: string): AstrologerCard {
  const obj = JSON.parse(data);

  if (!obj.herocreator) {
    throw new Error("Invalid format!");
  }

  if (!obj.astrologer) {
    throw new Error("This file is not a astrologer card!");
  }

  return (obj as JsonFormat).astrologer;
}

export function stringifyAstrologerCard(astrologer: AstrologerCard): string {
  const data = { herocreator: "0.1", astrologer };
  return JSON.stringify(data, null, 2);
}

export async function loadAstrologerCard(): Promise<AstrologerCard> {
  const blob = await fileOpen({
    mimeTypes: ["application/json"],
    extensions: [".json"],
    description: "Astrologer card",
  });
  const text = await blob.text();
  return parseAstrologerCard(text);
}

export function saveAstrologerCard(astrologer: AstrologerCard) {
  saveAs(
    new Blob([stringifyAstrologerCard(astrologer)], {
      type: "application/json;charset=utf-8",
    }),
    `${normalizeString(astrologer.name)}.astrologer.json`,
  );
}
