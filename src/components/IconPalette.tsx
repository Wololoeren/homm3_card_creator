"use client";

import React, { useEffect, useRef } from "react";
import { iconMap } from "@/lib/textToComponent";
import { unitStatIcons } from "@/lib/unitIcons";
import styles from "./IconPalette.module.css";

/** A text field an icon can be dropped into. */
export interface IconTarget {
  /** The field's controlId, which is also the id react-bootstrap gives it. */
  id: string;
  value: string;
  setValue: (value: string) => void;
}

/** Glyphs kept for the cards that already use them, but left off the palette
 * because a construction below does the same job better, or because they
 * belong to one card type rather than to every card's text. */
const HIDDEN_ICONS = new Set([":or:", ":level3:", ":level5:"]);

/** The four glyphs a unit's stat row is drawn with, as the card prints them. */
const STATS_ICONS = [
  { alt: "Attack", src: unitStatIcons.attack },
  { alt: "Defense", src: unitStatIcons.defense },
  { alt: "Health", src: unitStatIcons.health },
  { alt: "Initiative", src: unitStatIcons.initiative },
];

/** An icon in a ring, the way a power table frames its columns. */
function Ringed({ icon }: { icon: string }) {
  return <span className={styles.circle}>{iconMap[icon]}</span>;
}

/** A power table read left to right: one column pointing at the other. */
function TableFace({
  left,
  right,
}: {
  left: React.ReactNode;
  right: React.ReactNode;
}) {
  return (
    <>
      {left}
      <TableArrow />
      {right}
    </>
  );
}

/** The row limits textToComponent holds a power table to. */
const TABLE_ROWS = "2 to 5 rows";

const desc = <span className={styles.desc}>desc</span>;

/**
 * Ready-made constructions, for the cards that can carry one but give no
 * hint of how it is written. Each is drawn the way it reads on the card.
 * :spell{}: always leads with the empower glyph; :scale{}: names its own.
 */
const CONSTRUCTIONS: {
  token: string;
  label: string;
  /** The tooltip, when the label and token together would say too much. */
  title?: string;
  face: React.ReactNode;
}[] = [
  {
    token: ":divide{OR}:",
    label: "Insert a divider",
    face: iconMap[":or:"],
  },
  {
    token: ":spell{{1;2;3};{1;2;3};{:damage:}}:",
    label: "Insert a power table with an icon",
    title: `Table with an icon: ${TABLE_ROWS}`,
    face: (
      <TableFace
        left={<Ringed icon=":empower:" />}
        right={
          <span className={`${styles.circle} ${styles.letter}`}>
            <span>x</span>
          </span>
        }
      />
    ),
  },
  {
    token: ":spell{{1;2;3};{effect 1;effect 2;effect 3}}:",
    label: "Insert a power table with text",
    title: `Table with text: ${TABLE_ROWS}`,
    face: <TableFace left={<Ringed icon=":empower:" />} right={desc} />,
  },
  {
    token: ":scale{{:event_battle:};{1;2;3};{effect 1;effect 2;effect 3}}:",
    label: "Insert a event-battle table",
    title: `Table for a event-battle: ${TABLE_ROWS}`,
    face: <TableFace left={<Ringed icon=":event_battle:" />} right={desc} />,
  },
  {
    token: ":scale{{:gold:};{1;2;3};{1;2;3};{:valuable:}}:",
    label: "Insert a table with icons on both sides",
    title: `Table with icons on both sides: ${TABLE_ROWS}`,
    face: (
      <TableFace
        left={<Ringed icon=":gold:" />}
        right={<Ringed icon=":valuable:" />}
      />
    ),
  },
  {
    token: ":stats{0;0;0;0}:",
    label: "Insert a unit stat row",
    face: (
      <span className={styles.square}>
        {STATS_ICONS.map(({ alt, src }) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={alt} src={src.src} alt={alt} className={styles.stat} />
        ))}
      </span>
    ),
  },
];

/** What an edit puts in place of the selection, and what it leaves selected
 * (offsets into the inserted text); the caret goes on the end without one. */
interface Edit {
  text: string;
  select?: [number, number];
}

/** Bold around the selection, or a placeholder to type over without one. */
function bold(selected: string): Edit {
  const inner = selected || "Bold";
  return { text: `**${inner}**`, select: [2, 2 + inner.length] };
}

/** The line breaks that put `text` on a line of its own, adding only the ones
 * the text around it does not already supply. */
function ownLine(text: string, before: string, after: string) {
  const lead = before === "" || before.endsWith("\n") ? "" : "\n";
  const tail = after === "" || after.startsWith("\n") ? "" : "\n";
  return { lead, text: `${lead}${text}${tail}` };
}

/** A heading needs a line of its own: the parser only reads "#" at a line's
 * start, and the heading runs to the end of that line. */
function heading(selected: string, before: string, after: string): Edit {
  const inner = selected.trim() || "Heading";
  const { lead, text } = ownLine(`# ${inner}`, before, after);
  const start = lead.length + 2;
  return { text, select: [start, start + inner.length] };
}

/** A construction is a block of its own: a table, a stat row or a divider
 * run into a line of text — or a heading, which takes the rest of its line —
 * does not lay out as one. The caret goes on past it, ready for what follows. */
function block(token: string) {
  return (_selected: string, before: string, after: string): Edit => ({
    text: ownLine(token, before, after).text,
  });
}

/** The arrow a power table points with, from the left column to the right. */
function TableArrow() {
  return (
    <svg
      className={styles.arrow}
      viewBox="0 0 480 480"
      aria-hidden="true"
      focusable="false"
    >
      <path fill="#e8d66b" d="M400 240 80 140l30 100z" />
      <path fill="#a24f18" d="M400 240H110L80 340z" />
    </svg>
  );
}

/** What is selected once the insert has been rendered. */
interface Caret {
  id: string;
  start: number;
  end: number;
}

/**
 * The icons a card's text can carry, each one a button that types its token
 * into the field being edited. With more than one field on the form the icon
 * follows the caret: it lands in whichever was last worked in, or the first
 * one when none has been touched yet.
 */
export default function IconPalette({ targets }: { targets: IconTarget[] }) {
  const caret = useRef<Caret | null>(null);
  // Refs rather than state: nothing on screen turns on either of them, and the
  // listener below is registered once, so it would otherwise be left holding
  // the targets of the render that set it up.
  const focused = useRef<string | null>(null);
  const latest = useRef(targets);
  latest.current = targets;

  useEffect(() => {
    const remember = (event: FocusEvent) => {
      const id = (event.target as Partial<HTMLElement> | null)?.id;
      if (id && latest.current.some((target) => target.id === id)) {
        focused.current = id;
      }
    };

    // Capture phase: focus does not bubble, so a listener on the document
    // only ever sees it on the way down.
    document.addEventListener("focus", remember, true);
    return () => document.removeEventListener("focus", remember, true);
  }, []);

  // Runs after the insert has been rendered, which is the earliest the new
  // text is there to put the caret behind.
  useEffect(() => {
    const pending = caret.current;
    if (!pending) return;
    caret.current = null;

    const field = document.getElementById(pending.id);
    if (!(field instanceof HTMLTextAreaElement)) return;

    field.focus();
    field.setSelectionRange(pending.start, pending.end);
  });

  const edit = (
    build: (selected: string, before: string, after: string) => Edit,
  ) => {
    // A field that has since gone — a switched tab, an effect toggled off —
    // hands the job back to the first one still on the form.
    const worked = targets.find(({ id }) => id === focused.current);
    const target = worked ?? targets[0];
    if (!target) return;

    // Only a field that has been worked in has a caret worth honouring: an
    // untouched one reports the very start, where nobody meant to type. The
    // icon goes on the end of that one instead.
    const field = worked ? document.getElementById(target.id) : null;
    const caretIn = field instanceof HTMLTextAreaElement;
    const start = caretIn ? field.selectionStart : target.value.length;
    const end = caretIn ? field.selectionEnd : start;

    const before = target.value.slice(0, start);
    const after = target.value.slice(end);
    const { text, select } = build(
      target.value.slice(start, end),
      before,
      after,
    );

    target.setValue(before + text + after);
    caret.current = select
      ? { id: target.id, start: start + select[0], end: start + select[1] }
      : { id: target.id, start: start + text.length, end: start + text.length };
  };

  const insert = (token: string) => edit(() => ({ text: token }));

  /** Every palette button: a press must not take focus from the field. */
  const button = (
    key: string,
    label: string,
    title: string,
    className: string,
    onClick: () => void,
    face: React.ReactNode,
  ) => (
    <button
      key={key}
      type="button"
      className={className}
      title={title}
      aria-label={label}
      // Without this the press blurs the field before the click lands, and
      // the caret it should type at goes with it.
      onMouseDown={(event) => event.preventDefault()}
      onClick={onClick}
    >
      {face}
    </button>
  );

  return (
    <>
      <div>Available icons</div>

      <div className={styles.palette}>
        <div className={styles.row}>
          {button(
            "heading",
            "Heading",
            "Heading: # on a line of its own",
            `${styles.icon} ${styles.format}`,
            () => edit(heading),
            "H1",
          )}
          {button(
            "bold",
            "Bold",
            "Bold: **text**",
            `${styles.icon} ${styles.format} ${styles.bold}`,
            () => edit(bold),
            "B",
          )}
          <span className={styles.separator} aria-hidden="true" />
          {CONSTRUCTIONS.map(({ token, label, title, face }) =>
            button(
              token,
              label,
              title ?? `${label}: ${token}`,
              `${styles.icon} ${styles.table}`,
              () => edit(block(token)),
              face,
            ),
          )}
        </div>

        <div className={styles.row}>
          {Object.entries(iconMap)
            .filter(([token]) => !HIDDEN_ICONS.has(token))
            .map(([token, icon]) =>
              button(
                token,
                `Insert ${token}`,
                `Insert ${token}`,
                styles.icon,
                () => insert(token),
                icon,
              ),
            )}
        </div>
      </div>
    </>
  );
}
