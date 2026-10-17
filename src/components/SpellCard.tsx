import {
  SpellCard as SpellCardModel,
  SpellSchool,
  SpellTier,
} from "@/models/spellCard";
import styles from "./SpellCard.module.css";
import { textToComponent } from "@/lib/textToComponent";
import { cardTextProps } from "./cardTextProps";
import clsx from "clsx";

import EarthIcon from "@/assets/glyphsInternal/spell-schools/earth.png";
import WaterIcon from "@/assets/glyphsInternal/spell-schools/water.png";
import FireIcon from "@/assets/glyphsInternal/spell-schools/fire.png";
import AirIcon from "@/assets/glyphsInternal/spell-schools/air.png";

const schoolIcons: Record<SpellSchool, string> = {
  [SpellSchool.Water]: WaterIcon.src,
  [SpellSchool.Fire]: FireIcon.src,
  [SpellSchool.Air]: AirIcon.src,
  [SpellSchool.Earth]: EarthIcon.src,
};

function CornerSymbols({
  tier,
  school,
}: {
  tier: SpellTier;
  school: SpellSchool;
}) {
  if (tier === SpellTier.Any) {
    return (
      <>
        <img
          src={schoolIcons[SpellSchool.Earth]}
          alt="Earth"
          className={clsx(styles.corner, styles.cornerTopLeft)}
        />
        <img
          src={schoolIcons[SpellSchool.Water]}
          alt="Water"
          className={clsx(styles.corner, styles.cornerTopRight)}
        />
        <img
          src={schoolIcons[SpellSchool.Fire]}
          alt="Fire"
          className={clsx(styles.corner, styles.cornerBottomLeft)}
        />
        <img
          src={schoolIcons[SpellSchool.Air]}
          alt="Air"
          className={clsx(styles.corner, styles.cornerBottomRight)}
        />
      </>
    );
  }

  const icon = schoolIcons[school];
  const corners =
    tier === SpellTier.Expert
      ? [
          styles.cornerTopLeft,
          styles.cornerTopRight,
          styles.cornerBottomLeft,
          styles.cornerBottomRight,
        ]
      : [styles.cornerBottomLeft];

  return (
    <>
      {corners.map((corner) => (
        <img key={corner} src={icon} alt={school} className={clsx(styles.corner, corner)} />
      ))}
    </>
  );
}

export default function SpellCard({ spell }: { spell: SpellCardModel }) {
  return (
    <div className={styles.card}>
      <div className={styles.title}>
        <h3>{spell.name}</h3>
      </div>

      {/* Corners first, art second: the spell art paints over the school
          symbols where they overlap. */}
      <div className={styles.icon}>
        <CornerSymbols tier={spell.tier} school={spell.school} />
        <div
          className={styles.art}
          style={{ backgroundImage: `url("${spell.icon.path}")` }}
        />
      </div>

      <div className={styles.effect}>
        <div>{textToComponent(spell.effect, cardTextProps)}</div>
      </div>
    </div>
  );
}
