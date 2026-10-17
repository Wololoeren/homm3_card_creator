"use client";

import {
  AdventureCard as AdventureCardModel,
  adventureCardColors,
} from "@/models/adventureCard";
import styles from "./AdventureCard.module.css";
import { textToComponent } from "@/lib/textToComponent";
import { cardTextProps } from "./cardTextProps";
import { useBorder } from "@/hooks/background";

export default function AdventureCard({
  adventure,
}: {
  adventure: AdventureCardModel;
}) {
  const borderUrl = useBorder(adventureCardColors[adventure.type]);

  return (
    <div
      className={styles.card}
      style={{ "--border-image": borderUrl } as React.CSSProperties}
    >
      <div className={styles.inner}>
        <div className={styles.title}>
          <h3>{adventure.name}</h3>
        </div>

        <div
          className={styles.icon}
          style={{ backgroundImage: `url("${adventure.portrait.path}")` }}
        />

        <div className={styles.typeLabel}>
          <span>{adventure.type}</span>
        </div>

        <div className={styles.effect}>
          <div>{textToComponent(adventure.effect, cardTextProps)}</div>
        </div>
      </div>
    </div>
  );
}
