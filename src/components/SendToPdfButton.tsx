"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faFilePdf } from "@fortawesome/free-solid-svg-icons";
import { CardKey } from "@/lib/detectCardFile";
import { sendToPdf } from "@/lib/pdfQueue";
import styles from "./SendToPdfButton.module.css";

/** How long the button stays on "Added" before offering to send again. */
const ADDED_MS = 2000;

/**
 * Sends the card an editor is showing to the PDF tab. The card lands on
 * another tab, so nothing here would otherwise move and the press looks
 * ignored — the button reports it for a moment instead.
 */
export default function SendToPdfButton({
  cardKey,
  name,
  payload,
}: {
  cardKey: CardKey;
  /** What the card is called in the PDF tab's list. */
  name: string;
  payload: unknown;
}) {
  const [added, setAdded] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Also covers unmounting, so nothing is left to fire into a gone component.
  useEffect(() => () => clearTimeout(timer.current), []);

  return (
    <Button
      className={styles.button}
      variant={added ? "success" : "outline-success"}
      onClick={() => {
        sendToPdf(cardKey, name, payload);
        setAdded(true);
        // A second press restarts the window rather than cutting it short.
        clearTimeout(timer.current);
        timer.current = setTimeout(() => setAdded(false), ADDED_MS);
      }}
    >
      {added ? (
        <>
          <FontAwesomeIcon icon={faCheck} /> Added
        </>
      ) : (
        <>
          <FontAwesomeIcon icon={faFilePdf} /> Send to PDF
        </>
      )}
    </Button>
  );
}
