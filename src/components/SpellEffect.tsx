"use client";

import React from "react";
import clsx from "clsx";
import styles from "./SpellEffect.module.css";

import ArrowIcon from "@/assets/arrow.svg";
import EmpowerIcon from "@/assets/glyphs/empower.svg";

/* Bracket geometry, in the viewBox units of the original three-row art
   (src/assets/spell_options.svg): a column of small option circles on one
   side, one large circle on the other, and a spoke joining each to it.
   Everything is derived from the row count, so a two- or four-row table keeps
   the same circle size and the same gap between rows - only the bracket as a
   whole gets shorter or taller. */
const SMALL_CX = 24;
const SMALL_R = 22;
const ROW_GAP = 52;
const BIG_CX = 138;
const BIG_R = 50;
const VIEW_WIDTH = 190;
const PADDING = 2;
/** How far up the big circle the outermost spoke lands, as a fraction of its
    radius. Taken from the original art, and kept the same at every row count
    so the fan always covers the same part of the circle. */
const SPOKE_SPREAD = 27.36 / 50;
/** That art printed 152 units tall at 14mm; every row count keeps that scale. */
const MM_PER_UNIT = 14 / 152;

interface Bracket {
  viewBox: string;
  heightMm: number;
  /** Centre of each option circle, and of the row of text beside it. */
  rows: number[];
  spokes: { y1: number; x2: number; y2: number }[];
}

/** Rows are centred on y=0, so the big circle never has to move. */
function bracket(rows: number): Bracket {
  const ys = Array.from(
    { length: rows },
    (_, i) => (i - (rows - 1) / 2) * ROW_GAP
  );
  const outermost = ys[ys.length - 1];
  // The outermost circle is what the bracket has to clear - the small ones
  // once there are three or more rows, the big one when there are only two.
  const reach = Math.max(outermost + SMALL_R, BIG_R) + PADDING;
  const height = reach * 2;

  return {
    viewBox: `0 ${-reach} ${VIEW_WIDTH} ${height}`,
    heightMm: height * MM_PER_UNIT,
    rows: ys,
    spokes: ys.map((y) => {
      // The spoke leaves the option circle's edge and lands on the big circle,
      // so it always meets it cleanly. Spread rather than a fixed rise per
      // row: five rows reach further than the circle is tall, and a fixed
      // rise would send the outer spokes off it entirely.
      const y2 = outermost ? (y / outermost) * SPOKE_SPREAD * BIG_R : 0;
      return { y1: y, x2: BIG_CX - Math.sqrt(BIG_R ** 2 - y2 ** 2), y2 };
    }),
  };
}

function OptionBracket({ shape }: { shape: Bracket }) {
  return (
    <svg
      viewBox={shape.viewBox}
      xmlns="http://www.w3.org/2000/svg"
      className={styles.spellOptionsIcon}
    >
      {shape.rows.map((y) => (
        <circle
          key={y}
          cx={SMALL_CX}
          cy={y}
          r={SMALL_R}
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
        />
      ))}
      <circle
        cx={BIG_CX}
        cy={0}
        r={BIG_R}
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
      />
      {shape.spokes.map((spoke) => (
        <line
          key={spoke.y1}
          x1={SMALL_CX + SMALL_R}
          y1={spoke.y1}
          x2={spoke.x2}
          y2={spoke.y2}
          stroke="currentColor"
          strokeWidth="1"
        />
      ))}
    </svg>
  );
}

export interface SpellEffectProps {
  /** One entry per option; two to five of them. */
  power: number[];
  effect: React.ReactNode[];
  effectIcon?: React.ReactNode;
  /** Left-hand icon. Defaults to the spell power book when omitted. */
  powerIcon?: React.ReactNode;
}

export default function SpellEffect({
  power,
  effect,
  effectIcon,
  powerIcon,
}: SpellEffectProps) {
  const shape = bracket(power.length);
  // Set here rather than in the stylesheet: the bracket grows with its row
  // count, and the text column beside it has to match.
  const rowHeight = `${shape.heightMm}mm`;

  return (
    <div className={styles.spellContainer}>
      <div
        className={clsx(styles.spellOptions, styles.flip)}
        style={{ height: rowHeight }}
      >
        <OptionBracket shape={shape} />
        <span className={styles.spellPowerIcon}>
          {powerIcon ?? <EmpowerIcon />}
        </span>
        <div className={styles.powerCount}>
          {power.map((value, row) => (
            <span key={row}>{value}</span>
          ))}
        </div>
      </div>
      {effectIcon ? (
        <>
          <div className={styles.arrow}>
            <ArrowIcon />
          </div>
          <div className={styles.spellOptions} style={{ height: rowHeight }}>
            <OptionBracket shape={shape} />
            <span className={styles.spellPowerIcon}>{effectIcon}</span>
            <div className={styles.powerCount}>
              {effect.map((value, row) => (
                <span key={row}>{value}</span>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div
          className={styles.spellOptionsText}
          style={{ minHeight: rowHeight }}
        >
          {effect.map((value, row) => (
            <span key={row}>{value}</span>
          ))}
        </div>
      )}
    </div>
  );
}
