"use client";

import { useEffect, useRef } from "react";
import { iconMap } from "@/lib/textToComponent";
import styles from "./IconPalette.module.css";

/** A text field an icon can be dropped into. */
export interface IconTarget {
  /** The field's controlId, which is also the id react-bootstrap gives it. */
  id: string;
  value: string;
  setValue: (value: string) => void;
}

/** Where the caret goes once the insert has been rendered. */
interface Caret {
  id: string;
  at: number;
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
    field.setSelectionRange(pending.at, pending.at);
  });

  const insert = (token: string) => {
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

    target.setValue(
      target.value.slice(0, start) + token + target.value.slice(end),
    );
    caret.current = { id: target.id, at: start + token.length };
  };

  return (
    <>
      <div>Available icons</div>

      <div className={styles.palette}>
        {Object.entries(iconMap).map(([token, icon]) => (
          <button
            key={token}
            type="button"
            className={styles.icon}
            title={`Insert ${token}`}
            aria-label={`Insert ${token}`}
            // Without this the press blurs the field before the click lands,
            // and the caret it should type at goes with it.
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => insert(token)}
          >
            {icon}
          </button>
        ))}
      </div>
    </>
  );
}
