"use client";

import { AbilityCard as AbilityCardModel } from "@/models/abilityCard";
import styles from "./AbilityCard.module.css";
import { textToComponent } from "@/lib/textToComponent";
import { useBackground, useBorder } from "@/hooks/background";
import clsx from "clsx";
import { colord } from "colord";

import ExpertIcon from "@/assets/glyphs/expert.svg";
import { cardTextProps } from "./cardTextProps";

export default function AbilityCard({
  ability,
}: {
  ability: AbilityCardModel;
}) {
  const borderUrl = useBorder("#334d73");
  // Same panel brown as the faction unit cards, with the expert half a shade
  // deeper below the divider.
  const panelColor = "#5b3e1f";
  const tintUrl = useBackground(panelColor);
  const tintDarkUrl = useBackground(colord(panelColor).darken(0.1).toHex());

  return (
    <div
      className={styles.card}
      style={
        {
          "--border-image": borderUrl,
          "--tint-background": tintUrl,
          "--tint-background-dark": tintDarkUrl,
        } as React.CSSProperties
      }
    >
      <div className={styles.inner}>
        {ability.empowered ? (
          <>
            <div className={clsx(styles.title, styles.titleEmpowered)}>
              <h3>{ability.name}</h3>
              <div className={styles.empoweredLabel}>Empowered</div>
            </div>

            <div className={styles.icon} style={{ backgroundImage: `url("${ability.icon.path}")` }} />

            <div className={styles.effect}>
              <div>{textToComponent(ability.expertEffect, cardTextProps)}</div>
            </div>
          </>
        ) : (
          <>
            <div
              className={styles.icon}
              style={{ backgroundImage: `url("${ability.icon.path}")` }}
            />

            <div className={styles.title}>
              <h3>{ability.name}</h3>
            </div>

            <div className={styles.effect}>
              <div>{textToComponent(ability.regularEffect, cardTextProps)}</div>
            </div>

            <div className={styles.lower}>
              <div className={styles.divider}>
                <div className={styles.dividerBadge}>
                  <ExpertIcon aria-label="Expert effect" />
                </div>
              </div>

              <div className={styles.effect}>
                <div>{textToComponent(ability.expertEffect, cardTextProps)}</div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
