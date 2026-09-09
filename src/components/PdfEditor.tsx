"use client";

import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Form,
  Table,
} from "react-bootstrap";
import clsx from "clsx";
import { fileOpen } from "browser-fs-access";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFilePdf,
  faFileImport,
  faTrash,
  faUpload,
} from "@fortawesome/free-solid-svg-icons";

import styles from "./PdfEditor.module.css";
import {
  LoadedCard,
  boardCount,
  cardCountFor,
  optionsOf,
  sheetCount,
} from "./PdfSheets";
import { CardKey, ParsedCardFile, parseCardFile } from "@/lib/detectCardFile";
import { importToEditors } from "@/lib/editorQueue";
import { showToast } from "@/lib/toast";

const LABELS: Record<CardKey, string> = {
  hero: "Hero",
  unit: "Neutral unit",
  factionUnit: "Faction unit",
  creatureBankUnit: "Creature bank",
  ability: "Ability",
  spell: "Spell",
  artifact: "Artifact",
  astrologer: "Astrologer",
  event: "Event",
  pandora: "Pandora's box",
  adventure: "Adventure",
  morale: "Morale",
};

function nameOf(payload: unknown, fallback: string): string {
  const name = (payload as { name?: unknown })?.name;
  return typeof name === "string" && name ? name : fallback;
}

let nextId = 0;

interface PickedCard extends ParsedCardFile {
  /** The file's own name, used when the card itself carries none. */
  fileName: string;
}

/**
 * Asks for card files and parses them. Resolves to null when the picker was
 * cancelled; files that are not readable cards are reported and left out.
 */
async function pickCardFiles(): Promise<PickedCard[] | null> {
  let blobs;
  try {
    blobs = await fileOpen({
      mimeTypes: ["application/json"],
      extensions: [".json"],
      description: "Hero Creator cards",
      multiple: true,
    });
  } catch (error) {
    // Cancelling the picker is not a failure.
    if (error instanceof DOMException && error.name === "AbortError") {
      return null;
    }
    throw error;
  }

  const picked: PickedCard[] = [];
  const failed: string[] = [];

  for (const blob of blobs) {
    try {
      const parsed = parseCardFile(await blob.text());
      picked.push({ ...parsed, fileName: blob.name.replace(/\.json$/i, "") });
    } catch (error) {
      failed.push(
        `${blob.name}: ${error instanceof Error ? error.message : "unreadable"}`,
      );
    }
  }

  if (failed.length) {
    showToast(
      `Skipped ${failed.length} file${failed.length > 1 ? "s" : ""} — ${failed
        .slice(0, 3)
        .join("; ")}`,
    );
  }

  return picked;
}

export default function PdfEditor({
  cards,
  setCards,
  cropped,
  setCropped,
  cutoutLevels,
  setCutoutLevels,
}: {
  cards: LoadedCard[];
  setCards: (cards: LoadedCard[]) => void;
  cropped: boolean;
  setCropped: (cropped: boolean) => void;
  cutoutLevels: boolean;
  setCutoutLevels: (cutoutLevels: boolean) => void;
}) {
  const addFiles = async () => {
    const picked = await pickCardFiles();
    if (!picked?.length) return;

    setCards([
      ...cards,
      ...picked.map(({ key, payload, fileName }) => ({
        id: nextId++,
        key,
        name: nameOf(payload, fileName),
        payload,
      })),
    ]);
  };

  const importToTabs = async () => {
    const picked = await pickCardFiles();
    if (!picked?.length) return;

    const imported = importToEditors(picked);
    const skipped = picked.length - imported;
    if (imported) {
      showToast(
        `Imported ${imported} card${imported > 1 ? "s" : ""} into their tabs` +
          (skipped ? ` — ${skipped} had no editor` : ""),
        "success",
      );
    } else {
      showToast("Nothing could be imported.");
    }
  };

  const remove = (id: number) =>
    setCards(cards.filter((card) => card.id !== id));

  const update = (id: number, changes: Partial<LoadedCard>) =>
    setCards(
      cards.map((card) => (card.id === id ? { ...card, ...changes } : card)),
    );

  const faceCount = cards.reduce((n, card) => n + cardCountFor(card), 0);
  const sheets = sheetCount(cards, cropped);
  const boards = boardCount(cards);

  return (
    <div className={clsx("d-print-none", styles.editor)}>
      <Card>
        <CardHeader>
          <h2 className="mb-0">
            <FontAwesomeIcon icon={faFilePdf} /> PDF
          </h2>
        </CardHeader>
        <CardBody>
          <p className="text-muted">
            Add any saved card files — heroes, units, spells, artifacts and the
            rest, in any mix. Each card is printed next to its own back: cut the
            pair out as one piece and fold along the join for a double-sided
            card. Hero boards come at the end, each on a sheet of its own next
            to the tablet back it folds onto — turning a hero&apos;s back off
            leaves that tablet back out along with its card backs. Each row
            sets how many copies to print and whether its front, back and board
            are printed at all; a card printed on one side only is cut out on
            its own, with no fold. Everything goes to your browser&apos;s
            print dialog, where you can choose <em>Save as PDF</em>. To edit a
            pile of files instead of printing it,{" "}
            <em>Bulk import to editors</em> sends each one to the tab that edits
            that kind of card.
          </p>

          <div className="d-flex gap-2 mb-3">
            <Button variant="primary" onClick={addFiles}>
              <FontAwesomeIcon icon={faUpload} /> Add card files
            </Button>
            <Button variant="outline-primary" onClick={importToTabs}>
              <FontAwesomeIcon icon={faFileImport} /> Bulk import to editors
            </Button>
            <Button
              variant="success"
              disabled={!cards.length}
              onClick={() => window.print()}
            >
              <FontAwesomeIcon icon={faFilePdf} /> Create PDF
            </Button>
            <Button
              variant="outline-secondary"
              disabled={!cards.length}
              onClick={() => setCards([])}
              className="ms-auto"
            >
              <FontAwesomeIcon icon={faTrash} /> Clear
            </Button>
          </div>

          <Form.Check
            type="switch"
            id="pdf-cropped"
            className="mb-3"
            checked={cropped}
            onChange={(e) => setCropped(e.currentTarget.checked)}
            label={
              <>
                Cropped pages
                <span className="text-muted">
                  {" "}
                  — one card pair (or board) per page, blown up to fill the
                  whole sheet. No white border anywhere, but the cards come out
                  A4-sized, so print or cut them down to scale. Set the print
                  dialog&apos;s margins to <em>None</em> and turn off{" "}
                  <em>Fit to page</em>.
                </span>
              </>
            }
          />

          <Form.Check
            type="switch"
            id="pdf-cutout-levels"
            className="mb-3"
            checked={cutoutLevels}
            onChange={(e) => setCutoutLevels(e.currentTarget.checked)}
            label={
              <>
                Cut-out level track
                <span className="text-muted">
                  {" "}
                  — leaves the thirteen squares of every hero board&apos;s level
                  track blank, so nothing is printed there and you can cut them
                  open for an acrylic cube. Only affects the boards.
                </span>
              </>
            }
          />

          {cards.length ? (
            <>
              <p className="mb-2">
                <strong>{cards.length}</strong> file
                {cards.length > 1 ? "s" : ""} · <strong>{faceCount}</strong>{" "}
                card{faceCount > 1 ? "s" : ""}
                {boards > 0 ? (
                  <>
                    {" "}
                    · <strong>{boards}</strong> board
                    {boards > 1 ? "s" : ""}
                  </>
                ) : null}{" "}
                · <strong>{sheets}</strong> sheet{sheets > 1 ? "s" : ""}
              </p>
              <Table size="sm" striped hover className="mb-0 align-middle">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Type</th>
                    <th className="text-center">Copies</th>
                    <th className="text-center">Front</th>
                    <th className="text-center">Back</th>
                    <th className="text-center">Board</th>
                    <th className="text-end">Cards</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {cards.map((card) => {
                    const { copies, front, back, board } = optionsOf(card);
                    return (
                      <tr key={card.id}>
                        <td>{card.name}</td>
                        <td className="text-muted">{LABELS[card.key]}</td>
                        <td className="text-center">
                          <Form.Control
                            type="number"
                            size="sm"
                            min={1}
                            max={99}
                            value={copies}
                            className={styles.copies}
                            aria-label={`Copies of ${card.name}`}
                            onChange={(e) =>
                              update(card.id, {
                                copies: Math.min(
                                  99,
                                  Math.max(
                                    1,
                                    Math.floor(Number(e.currentTarget.value)) ||
                                      1,
                                  ),
                                ),
                              })
                            }
                          />
                        </td>
                        <td className="text-center">
                          <Form.Check
                            className="d-flex justify-content-center"
                            checked={front}
                            aria-label={`Print the front of ${card.name}`}
                            onChange={(e) =>
                              update(card.id, {
                                front: e.currentTarget.checked,
                              })
                            }
                          />
                        </td>
                        <td className="text-center">
                          <Form.Check
                            className="d-flex justify-content-center"
                            checked={back}
                            aria-label={`Print the back of ${card.name}`}
                            onChange={(e) =>
                              update(card.id, { back: e.currentTarget.checked })
                            }
                          />
                        </td>
                        <td className="text-center">
                          {card.key === "hero" ? (
                            <Form.Check
                              className="d-flex justify-content-center"
                              checked={board}
                              aria-label={`Print the hero board of ${card.name}`}
                              onChange={(e) =>
                                update(card.id, {
                                  board: e.currentTarget.checked,
                                })
                              }
                            />
                          ) : (
                            <span className="text-muted">—</span>
                          )}
                        </td>
                        <td className="text-end">{cardCountFor(card)}</td>
                        <td className="text-end">
                          <Button
                            size="sm"
                            variant="link"
                            className="p-0 text-danger"
                            onClick={() => remove(card.id)}
                            aria-label={`Remove ${card.name}`}
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </>
          ) : (
            <p className="text-muted fst-italic mb-0">No files added yet.</p>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
