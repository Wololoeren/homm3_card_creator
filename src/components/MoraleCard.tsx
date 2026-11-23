"use client";

import { MoraleCard as MoraleCardModel, MoraleType } from "@/models/moraleCard";
import styles from "./MoraleCard.module.css";
import { textToComponent } from "@/lib/textToComponent";

import PositiveTemplate from "@/assets/cards/morale-positive-template.webp";
import NegativeTemplate from "@/assets/cards/morale-negative-template.webp";
import PositiveBlank from "@/assets/cards/morale-positive-template-blank.webp";
import NegativeBlank from "@/assets/cards/morale-negative-template-blank.webp";
import { cardTextProps } from "./cardTextProps";

const moraleTemplates: Record<MoraleType, string> = {
  [MoraleType.Positive]: PositiveTemplate.src,
  [MoraleType.Negative]: NegativeTemplate.src,
};

/** The same art with the title plaque left empty, to set a title over. */
const blankTemplates: Record<MoraleType, string> = {
  [MoraleType.Positive]: PositiveBlank.src,
  [MoraleType.Negative]: NegativeBlank.src,
};

export default function MoraleCard({ morale }: { morale: MoraleCardModel }) {
  const templates = morale.title === undefined ? moraleTemplates : blankTemplates;

  return (
    <div
      className={styles.card}
      style={{ backgroundImage: `url("${templates[morale.type]}")` }}
    >
      {morale.title === undefined ? null : (
        <div className={styles.title}>
          <h3>{morale.title}</h3>
        </div>
      )}

      <div className={styles.effect}>
        <div>{textToComponent(morale.effect, cardTextProps)}</div>
      </div>
    </div>
  );
}
