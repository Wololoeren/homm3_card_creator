"use client";

import { MoraleCard as MoraleCardModel, MoraleType } from "@/models/moraleCard";
import styles from "./MoraleCard.module.css";
import { textToComponent } from "@/lib/textToComponent";

import PositiveTemplate from "@/assets/cards/morale-positive-template.webp";
import NegativeTemplate from "@/assets/cards/morale-negative-template.webp";

const moraleTemplates: Record<MoraleType, string> = {
  [MoraleType.Positive]: PositiveTemplate.src,
  [MoraleType.Negative]: NegativeTemplate.src,
};

export default function MoraleCard({ morale }: { morale: MoraleCardModel }) {
  return (
    <div
      className={styles.card}
      style={{ backgroundImage: `url("${moraleTemplates[morale.type]}")` }}
    >
      <div className={styles.effect}>
        <div>{textToComponent(morale.effect)}</div>
      </div>
    </div>
  );
}
