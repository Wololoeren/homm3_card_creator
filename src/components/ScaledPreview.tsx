"use client";

import { useLayoutEffect, useRef, useState } from "react";
import styles from "./ScaledPreview.module.css";

/** How much larger than its printed size a card is previewed. */
const SCALE = 1.2;

/**
 * Draws a card preview larger than its printed size without changing how it is
 * laid out.
 *
 * The magnification is a transform rather than `zoom` on purpose: `zoom` runs
 * the layout again at the larger size, where the text lands on different pixel
 * boundaries, so a line that fits the printed card can wrap in the preview and
 * a card would not look like the file it exports. A transform scales a layout
 * that already ran at 1:1, so the preview breaks its lines exactly where the
 * export and the printed sheet do.
 *
 * A transform paints outside the box it reserves, so the drawn size is measured
 * back onto a wrapper and the page keeps flowing around the preview.
 */
export default function ScaledPreview({
  className,
  children,
}: {
  /** Lays the cards out inside the preview — a row or a column of them. */
  className?: string;
  children: React.ReactNode;
}) {
  const content = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<{ width: number; height: number } | null>(
    null
  );

  useLayoutEffect(() => {
    const node = content.current;
    if (!node) return;

    // The rect already carries the scale, so it is the drawn size the frame has
    // to reserve.
    const measure = () => {
      const { width, height } = node.getBoundingClientRect();
      setSize((previous) =>
        previous?.width === width && previous?.height === height
          ? previous
          : { width, height }
      );
    };

    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div className={styles.viewport}>
      <div className={styles.frame} style={size ?? undefined}>
        <div
          ref={content}
          className={[styles.content, className].filter(Boolean).join(" ")}
          style={{ "--preview-scale": SCALE } as React.CSSProperties}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
