"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileImage, faSpinner } from "@fortawesome/free-solid-svg-icons";
import {
  downloadCardWebp,
  renderCardImage,
  type CardImage,
} from "@/lib/downloadCardImage";
import { showToast } from "@/lib/toast";
import styles from "./DownloadableCard.module.css";

/**
 * Wraps a preview card with a button that saves just that card as WEBP, and
 * makes the card itself open full screen at the size a download would carry.
 * The button sits outside the captured element so it never lands in the export.
 */
export default function DownloadableCard({
  filename,
  flipped = false,
  children,
}: {
  filename: string;
  /** Shows the card upside down, the way a landscape back is printed. */
  flipped?: boolean;
  children: React.ReactNode;
}) {
  const card = useRef<HTMLDivElement>(null);
  const [exporting, setExporting] = useState(false);
  const [rendering, setRendering] = useState(false);
  const [zoomed, setZoomed] = useState<CardImage | null>(null);

  // Also covers unmounting, and a re-render that replaces one image with the
  // next, so no object URL is left holding its blob.
  useEffect(() => {
    if (!zoomed) return;
    return () => URL.revokeObjectURL(zoomed.url);
  }, [zoomed]);

  useEffect(() => {
    if (!zoomed) return;

    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") setZoomed(null);
    };

    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [zoomed]);

  const openZoom = async () => {
    // A card takes a moment to render, and a second click while that runs would
    // only throw the first render away.
    if (rendering || zoomed) return;

    setRendering(true);
    try {
      const image = await renderCardImage(card.current);
      if (image) setZoomed(image);
    } finally {
      setRendering(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div
        ref={card}
        className={[
          styles.preview,
          flipped ? styles.flipped : "",
          rendering ? styles.rendering : "",
        ]
          .filter(Boolean)
          .join(" ")}
        role="button"
        tabIndex={0}
        title={`View ${filename} at full size`}
        aria-label={`View ${filename} at full size`}
        onClick={openZoom}
        onKeyDown={(event) => {
          if (event.key !== "Enter" && event.key !== " ") return;
          // Space would otherwise scroll the preview pane instead.
          event.preventDefault();
          void openZoom();
        }}
      >
        {children}
      </div>
      <Button
        variant="outline-secondary"
        size="sm"
        className={styles.button}
        disabled={exporting}
        title={`Download ${filename}.webp`}
        aria-label={`Download ${filename} as WEBP`}
        onClick={async () => {
          setExporting(true);
          try {
            await downloadCardWebp(card.current, filename);
          } catch (error) {
            // Export failures are reported by downloadCardWebp itself, so this
            // only catches the unexpected rather than leaving the click with a
            // rejected promise nobody handles.
            showToast(
              error instanceof Error
                ? error.message
                : "Could not export the card."
            );
          } finally {
            setExporting(false);
          }
        }}
      >
        <FontAwesomeIcon icon={exporting ? faSpinner : faFileImage} spin={exporting} />
      </Button>
      {zoomed &&
        // Portalled to the body because the previews are magnified with a
        // transform, and a fixed descendant of one is laid out against the
        // transformed box rather than the window, so the overlay would land
        // scaled and offset instead of covering the screen.
        createPortal(
          <div
            className={styles.lightbox}
            role="presentation"
            onClick={() => setZoomed(null)}
          >
            <img
              className={styles.lightboxImage}
              src={zoomed.url}
              width={zoomed.width}
              height={zoomed.height}
              alt={`${filename} at full size`}
            />
          </div>,
          document.body
        )}
    </div>
  );
}
