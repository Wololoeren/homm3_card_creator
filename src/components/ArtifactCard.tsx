"use client";

import {
  ArtifactCard as ArtifactCardModel,
  ArtifactRarity,
  artifactRarityColors,
} from "@/models/artifactCard";
import styles from "./ArtifactCard.module.css";
import { textToComponent } from "@/lib/textToComponent";
import { useBorder } from "@/hooks/background";
import clsx from "clsx";

export default function ArtifactCard({
  artifact,
}: {
  artifact: ArtifactCardModel;
}) {
  const minor = artifact.rarity === ArtifactRarity.Minor;
  const borderUrl = useBorder(artifactRarityColors[artifact.rarity], minor);

  return (
    <div
      className={clsx(styles.card, minor && styles.silver)}
      style={{ "--border-image": borderUrl } as React.CSSProperties}
    >
      <div className={styles.inner}>
        <div className={styles.title}>
          <h3>{artifact.name}</h3>
        </div>

        <div
          className={styles.icon}
          style={{ backgroundImage: `url("${artifact.icon.path}")` }}
        />

        <div className={styles.effect}>
          <div>{textToComponent(artifact.effect)}</div>
        </div>

        <div className={styles.divider} />

        <div className={styles.flavor}>
          <div>{artifact.flavorText}</div>
        </div>
      </div>
    </div>
  );
}
