"use client";

import { AstrologerCard as AstrologerCardModel } from "@/models/astrologerCard";
import styles from "./AstrologerCard.module.css";
import { textToComponent } from "@/lib/textToComponent";
import { useBorder } from "@/hooks/background";
import { cardTextProps } from "./cardTextProps";

export default function AstrologerCard({
  astrologer,
}: {
  astrologer: AstrologerCardModel;
}) {
  const borderUrl = useBorder("#a5202f");

  return (
    <div
      className={styles.card}
      style={{ "--border-image": borderUrl } as React.CSSProperties}
    >
      <div className={styles.inner}>
        <div className={styles.title}>
          <h3>Astrologers proclaim week of the {astrologer.name}</h3>
        </div>

        <div className={styles.effect}>
          <div>{textToComponent(astrologer.effect, cardTextProps)}</div>
        </div>

        <div className={styles.divider} />

        <div className={styles.flavor}>
          <div>{textToComponent(astrologer.flavorText, cardTextProps)}</div>
        </div>
      </div>
    </div>
  );
}
