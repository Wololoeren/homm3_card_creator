"use client";

import React from "react";
import clsx from "clsx";
import { CardKey } from "@/lib/detectCardFile";

import HeroCard from "./HeroCard";
import HeroBoard from "./HeroBoard";
import HeroBoardBack from "./HeroBoardBack";
import UnitCard from "./UnitCard";
import UnitCardBack from "./UnitCardBack";
import FactionUnitCard from "./FactionUnitCard";
import FactionUnitCardPack from "./FactionUnitCardPack";
import CreatureBankUnitCard from "./CreatureBankUnitCard";
import CreatureBankUnitCardBack from "./CreatureBankUnitCardBack";
import AbilityCard from "./AbilityCard";
import AbilityCardBack from "./AbilityCardBack";
import SpellCard from "./SpellCard";
import SpellCardBack from "./SpellCardBack";
import ArtifactCard from "./ArtifactCard";
import ArtifactCardBack from "./ArtifactCardBack";
import AstrologerCard from "./AstrologerCard";
import AstrologerCardBack from "./AstrologerCardBack";
import EventCard from "./EventCard";
import EventCardBack from "./EventCardBack";
import PandoraCard from "./PandoraCard";
import PandoraCardBack from "./PandoraCardBack";
import AdventureCard from "./AdventureCard";
import AdventureCardBack from "./AdventureCardBack";
import MoraleCard from "./MoraleCard";
import MoraleCardBack from "./MoraleCardBack";

import { Hero } from "@/models/hero";
import { SpecialtyLevel } from "@/models/specialty";
import { Unit } from "@/models/unit";
import { FactionUnit } from "@/models/factionUnit";
import { CreatureBankUnit } from "@/models/creatureBankUnit";
import { AbilityCard as AbilityCardModel } from "@/models/abilityCard";
import { SpellCard as SpellCardModel } from "@/models/spellCard";
import { ArtifactCard as ArtifactCardModel } from "@/models/artifactCard";
import { AstrologerCard as AstrologerCardModel } from "@/models/astrologerCard";
import { EventCard as EventCardModel } from "@/models/eventCard";
import { PandoraCard as PandoraCardModel } from "@/models/pandoraCard";
import { AdventureCard as AdventureCardModel } from "@/models/adventureCard";
import { MoraleCard as MoraleCardModel } from "@/models/moraleCard";

export interface LoadedCard {
  id: number;
  key: CardKey;
  name: string;
  payload: unknown;
  /** How many of this card to print. Absent means one. */
  copies?: number;
  /** Whether the card's face is printed. Absent means yes. */
  front?: boolean;
  /** Whether the card's back is printed. Absent means yes. */
  back?: boolean;
  /** Heroes only: whether the hero board is printed. Absent means yes. */
  board?: boolean;
}

/** The per-card print options, with their defaults filled in. */
export function optionsOf(card: LoadedCard) {
  return {
    copies: Math.max(1, Math.floor(card.copies ?? 1)),
    front: card.front ?? true,
    back: card.back ?? true,
    board: card.board ?? true,
  };
}

type Shape = "portrait";

/**
 * A front and its back, printed side by side. Cut the pair out as one piece
 * and fold along the line between them: the back panel turns to face the other
 * way, giving a double-sided card.
 *
 * Folding about a vertical line does not mirror the back — the rear viewer's
 * left/right reverses along with the panel, and the two cancel. (The hero
 * print sheet folds about a *horizontal* line instead, which is why it has to
 * rotate its backs 180 degrees.)
 */
interface Pair {
  shape: Shape;
  front: React.ReactNode;
  back: React.ReactNode;
}

/** Fold-pairs per landscape A4 sheet (273mm x 186mm printable). */
const PER_SHEET: Record<Shape, { cols: number; rows: number }> = {
  // A pair is 125mm x 87.9mm.
  portrait: { cols: 2, rows: 2 },
};

/** Heroes have no dedicated back component; they use the shared card back. */
const GenericBack = AbilityCardBack;

/**
 * Astrologer and event cards are laid out landscape (87.9mm x 62.5mm) in
 * their editor tab, but every other card pair glues along its long edge.
 * Rotate them 90 degrees into a portrait footprint so they fold the same
 * way as the rest of the deck.
 */
function Rotated({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ width: "62.5mm", height: "87.9mm", position: "relative" }}>
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: "87.9mm",
          height: "62.5mm",
          transform: "translate(-50%, -50%) rotate(90deg)",
        }}
      >
        {children}
      </div>
    </div>
  );
}

export function pairsFor(card: LoadedCard): Pair[] {
  const p = card.payload;
  switch (card.key) {
    case "hero":
      return [SpecialtyLevel.One, SpecialtyLevel.Four, SpecialtyLevel.Six].map(
        (specialtyLevel) => ({
          shape: "portrait" as Shape,
          front: <HeroCard hero={p as Hero} specialtyLevel={specialtyLevel} />,
          back: <GenericBack />,
        }),
      );
    case "factionUnit":
      // The pack side is the card's back, so it needs no generic backing.
      return [
        {
          shape: "portrait",
          front: <FactionUnitCard unit={p as FactionUnit} />,
          back: <FactionUnitCardPack unit={p as FactionUnit} />,
        },
      ];
    case "unit":
      return [
        {
          shape: "portrait",
          front: <UnitCard unit={p as Unit} />,
          back: <UnitCardBack unit={p as Unit} />,
        },
      ];
    case "creatureBankUnit":
      return [
        {
          shape: "portrait",
          front: <CreatureBankUnitCard unit={p as CreatureBankUnit} />,
          back: <CreatureBankUnitCardBack />,
        },
      ];
    case "ability":
      return [
        {
          shape: "portrait",
          front: <AbilityCard ability={p as AbilityCardModel} />,
          back: <AbilityCardBack />,
        },
      ];
    case "spell":
      return [
        {
          shape: "portrait",
          front: <SpellCard spell={p as SpellCardModel} />,
          back: <SpellCardBack />,
        },
      ];
    case "artifact":
      return [
        {
          shape: "portrait",
          front: <ArtifactCard artifact={p as ArtifactCardModel} />,
          back: <ArtifactCardBack />,
        },
      ];
    case "pandora":
      return [
        {
          shape: "portrait",
          front: <PandoraCard pandora={p as PandoraCardModel} />,
          back: <PandoraCardBack />,
        },
      ];
    case "adventure":
      return [
        {
          shape: "portrait",
          front: <AdventureCard adventure={p as AdventureCardModel} />,
          back: <AdventureCardBack />,
        },
      ];
    case "morale":
      return [
        {
          shape: "portrait",
          front: <MoraleCard morale={p as MoraleCardModel} />,
          back: <MoraleCardBack type={(p as MoraleCardModel).type} />,
        },
      ];
    case "astrologer":
      return [
        {
          shape: "portrait",
          front: (
            <Rotated>
              <AstrologerCard astrologer={p as AstrologerCardModel} />
            </Rotated>
          ),
          back: (
            <Rotated>
              <AstrologerCardBack />
            </Rotated>
          ),
        },
      ];
    case "event":
      return [
        {
          shape: "portrait",
          front: (
            <Rotated>
              <EventCard event={p as EventCardModel} />
            </Rotated>
          ),
          back: (
            <Rotated>
              <EventCardBack />
            </Rotated>
          ),
        },
      ];
  }
}

/**
 * One piece to cut out. Normally a front and its back joined along the fold
 * line, but dropping either side leaves a single card face that is simply cut
 * out on its own. Width is counted in card faces, so a fold-pair is 2 and a
 * lone face is 1.
 */
interface Piece {
  width: 1 | 2;
  faces: React.ReactNode[];
}

/** The pieces a card contributes, honouring its front/back/copies options. */
export function piecesFor(card: LoadedCard): Piece[] {
  const { copies, front, back } = optionsOf(card);
  if (!front && !back) return [];

  const pieces: Piece[] = [];
  for (let copy = 0; copy < copies; copy++) {
    for (const pair of pairsFor(card)) {
      if (front && back)
        pieces.push({ width: 2, faces: [pair.front, pair.back] });
      else pieces.push({ width: 1, faces: [front ? pair.front : pair.back] });
    }
  }
  return pieces;
}

/** The faces of one piece, butted together: the join is the fold line. */
function PieceFaces({ piece }: { piece: Piece }) {
  return (
    <div style={{ display: "flex" }}>
      {piece.faces.map((face, fi) => (
        <React.Fragment key={fi}>{face}</React.Fragment>
      ))}
    </div>
  );
}

function chunk<T>(items: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < items.length; i += size)
    out.push(items.slice(i, i + size));
  return out;
}

/** A hero board to print, and whether its tablet back goes with it. */
interface Board {
  hero: Hero;
  back: boolean;
}

/** The boards to print: one per hero card that still asks for its board. */
function boardsIn(cards: LoadedCard[]): Board[] {
  return cards
    .filter((card) => card.key === "hero" && optionsOf(card).board)
    .flatMap((card) => {
      // The same switch that drops the card backs drops the tablet back.
      const { copies, back } = optionsOf(card);
      return Array.from<unknown, Board>({ length: copies }, () => ({
        hero: card.payload as Hero,
        back,
      }));
    });
}

/**
 * Fills rows left to right, starting a new one when the next piece no longer
 * fits. A fold-pair takes two card faces' worth of room, a lone face one, so a
 * row holds two pairs, four singles, or a pair and two singles.
 */
function rowsFor(pieces: Piece[]): Piece[][] {
  const { cols } = PER_SHEET.portrait;
  const perRow = cols * 2;

  const rows: Piece[][] = [];
  let row: Piece[] = [];
  let used = 0;
  for (const piece of pieces) {
    if (used + piece.width > perRow) {
      rows.push(row);
      row = [];
      used = 0;
    }
    row.push(piece);
    used += piece.width;
  }
  if (row.length) rows.push(row);
  return rows;
}

function sheetsFor(cards: LoadedCard[]) {
  const { rows } = PER_SHEET.portrait;
  return chunk(rowsFor(cards.flatMap(piecesFor)), rows);
}

/**
 * Cropped output: one pair (or one board) per page, on a page sized to fit it
 * exactly. Nothing is laid out on A4, so there is no white border to trim.
 */
function CroppedSheets({
  cards,
  cutoutLevels,
}: {
  cards: LoadedCard[];
  cutoutLevels: boolean;
}) {
  return (
    <div style={{ ["--adjust-scale" as string]: "1" }}>
      {cards.flatMap(piecesFor).map((piece, pi) => (
        <div
          className={clsx(piece.width === 2 ? "cropPair" : "cropFace", "page")}
          key={pi}
        >
          <div>
            <PieceFaces piece={piece} />
          </div>
        </div>
      ))}

      {boardsIn(cards).map((board, bi) => (
        <React.Fragment key={`board-${bi}`}>
          <div className="cropBoard page">
            <div>
              <HeroBoard hero={board.hero} cutoutLevels={cutoutLevels} />
            </div>
          </div>
          {/* The tablet back, on its own page: a cropped page holds one piece. */}
          {board.back ? (
            <div className="cropBoard page">
              <div>
                <HeroBoardBack />
              </div>
            </div>
          ) : null}
        </React.Fragment>
      ))}
    </div>
  );
}

export default function PdfSheets({
  cards,
  cropped = false,
  cutoutLevels = false,
}: {
  cards: LoadedCard[];
  cropped?: boolean;
  cutoutLevels?: boolean;
}) {
  if (cropped)
    return <CroppedSheets cards={cards} cutoutLevels={cutoutLevels} />;

  const cardSheets = sheetsFor(cards);
  return (
    <div style={{ ["--adjust-scale" as string]: "1" }}>
      {cardSheets.map((sheet, si) => (
        <div className="landscape page" key={si}>
          <div>
            {sheet.map((row, ri) => (
              <div style={{ display: "flex", flexDirection: "row" }} key={ri}>
                {row.map((piece, pi) => (
                  <PieceFaces piece={piece} key={pi} />
                ))}
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Boards last, after every card sheet. A board is 134mm x 96mm, so it
          and its back sit side by side on one landscape sheet: cut the pair
          out as one piece and fold along the join, the same as a card. With
          the back left off, the board is cut out on its own. */}
      {boardsIn(cards).map((board, bi) => (
        <div className="landscape page" key={`board-${bi}`}>
          <div>
            <div style={{ display: "flex", flexDirection: "row" }}>
              <HeroBoard hero={board.hero} cutoutLevels={cutoutLevels} />
              {board.back ? <HeroBoardBack /> : null}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function sheetCount(cards: LoadedCard[], cropped = false): number {
  const boards = boardsIn(cards);

  // A board and its back share a sheet, but take a cropped page each.
  if (cropped)
    return (
      cards.reduce((n, card) => n + piecesFor(card).length, 0) +
      boards.length +
      boards.filter((board) => board.back).length
    );
  return sheetsFor(cards).length + boards.length;
}

export function boardCount(cards: LoadedCard[]): number {
  return boardsIn(cards).length;
}

/** How many cards this entry prints — one per piece cut out. */
export function cardCountFor(card: LoadedCard): number {
  return piecesFor(card).length;
}
