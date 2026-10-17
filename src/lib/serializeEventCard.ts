import { EventCard } from "@/models/eventCard";
import { fileOpen } from "browser-fs-access";
import saveAs from "file-saver";
import { normalizeString } from "./normalizeString";

interface JsonFormat {
  herocreator: "0.1";
  event: EventCard;
}

function parseEventCard(data: string): EventCard {
  const obj = JSON.parse(data);

  if (!obj.herocreator) {
    throw new Error("Invalid format!");
  }

  if (!obj.event) {
    throw new Error("This file is not a event card!");
  }

  return (obj as JsonFormat).event;
}

export function stringifyEventCard(event: EventCard): string {
  const data = { herocreator: "0.1", event };
  return JSON.stringify(data, null, 2);
}

export async function loadEventCard(): Promise<EventCard> {
  const blob = await fileOpen({
    mimeTypes: ["application/json"],
    extensions: [".homm3event.json"],
  });
  const text = await blob.text();
  return parseEventCard(text);
}

export function saveEventCard(event: EventCard) {
  saveAs(
    new Blob([stringifyEventCard(event)], {
      type: "application/json;charset=utf-8",
    }),
    `${normalizeString(event.name)}.event.json`,
  );
}
