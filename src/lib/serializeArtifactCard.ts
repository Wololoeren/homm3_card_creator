import { ArtifactCard } from "@/models/artifactCard";
import { fileOpen } from "browser-fs-access";
import saveAs from "file-saver";
import { normalizeString } from "./normalizeString";

interface JsonFormat {
  herocreator: "0.1";
  artifact: ArtifactCard;
}

function parseArtifactCard(data: string): ArtifactCard {
  const obj = JSON.parse(data);

  if (!obj.herocreator) {
    throw new Error("Invalid format!");
  }

  if (!obj.artifact) {
    throw new Error("This file is not a artifact card!");
  }

  return (obj as JsonFormat).artifact;
}

export function stringifyArtifactCard(artifact: ArtifactCard): string {
  const data = { herocreator: "0.1", artifact };
  return JSON.stringify(data, null, 2);
}

export async function loadArtifactCard(): Promise<ArtifactCard> {
  const blob = await fileOpen({
    mimeTypes: ["application/json"],
    extensions: [".json"],
    description: "Artifact card",
  });
  const text = await blob.text();
  return parseArtifactCard(text);
}

export function saveArtifactCard(artifact: ArtifactCard) {
  saveAs(
    new Blob([stringifyArtifactCard(artifact)], {
      type: "application/json;charset=utf-8",
    }),
    `${normalizeString(artifact.name)}.artifact.json`,
  );
}
