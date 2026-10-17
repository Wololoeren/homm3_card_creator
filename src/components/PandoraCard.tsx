"use client";

import {
  PandoraCard as PandoraCardModel,
  defaultPandoraName,
} from "@/models/pandoraCard";
import styles from "./PandoraCard.module.css";
import { textToComponent } from "@/lib/textToComponent";
import { useBorder } from "@/hooks/background";
import { cardTextProps } from "./cardTextProps";

export default function PandoraCard({
  pandora,
}: {
  pandora: PandoraCardModel;
}) {
  const borderUrl = useBorder("#a5202f");

  return (
    <div
      className={styles.card}
      style={{ "--border-image": borderUrl } as React.CSSProperties}
    >
      <div className={styles.inner}>
        <div className={styles.title}>
          <h3>{pandora.name || defaultPandoraName}</h3>
        </div>

        <div
          className={styles.icon}
          style={{ backgroundImage: `url("pandora_box.png")` }}
        />

        <div className={styles.effect}>
          <div>{textToComponent(pandora.effect, cardTextProps)}</div>
        </div>
      </div>
    </div>
  );
}
