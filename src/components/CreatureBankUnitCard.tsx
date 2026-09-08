"use client";

import { CreatureBankUnit } from "@/models/creatureBankUnit";
import { UnitType } from "@/models/unit";
import styles from "./CreatureBankUnitCard.module.css";
import clsx from "clsx";
import { textToComponent } from "@/lib/textToComponent";
import { useBorder } from "@/hooks/background";

import { unitStatIcons } from "@/lib/unitIcons";

import UnitGroundIcon from "@/assets/glyphsInternal/unit_ground.svg";
import UnitFlyingIcon from "@/assets/glyphsInternal/unit_flying.svg";
import UnitRangedIcon from "@/assets/glyphs/unit_ranged.svg";

function TypeBadge({ type }: { type: UnitType }) {
  switch (type) {
    case UnitType.Melee:
      return (
        <UnitGroundIcon
          viewBox="0 0 76 76"
          aria-label="Melee unit"
          className={styles.typeBadge}
        >
          <path fill="currentColor" />
        </UnitGroundIcon>
      );
    case UnitType.Flying:
      return (
        <UnitFlyingIcon aria-label="Flying unit" className={styles.typeBadge} />
      );
    case UnitType.Ranged:
      return (
        <UnitRangedIcon aria-label="Ranged unit" className={styles.typeBadge} />
      );
  }
}

export default function CreatureBankUnitCard({
  unit,
}: {
  unit: CreatureBankUnit;
}) {
  const borderUrl = useBorder("#a8a8a8");

  return (
    <div
      className={styles.card}
      style={{ "--border-image": borderUrl } as React.CSSProperties}
    >
      <div className={clsx(styles.block, styles.leather, styles.title)}>
        <h3>{unit.name}</h3>
      </div>

      <div className={styles.stats}>
        <div className={clsx(styles.block, styles.leather, styles.stat)}>
          <img src={unitStatIcons.attack.src} alt="Attack" />
          <span>{unit.statistics.attack}</span>
        </div>
        <div className={clsx(styles.block, styles.leather, styles.stat)}>
          <img src={unitStatIcons.defense.src} alt="Defense" />
          <span>{unit.statistics.defense}</span>
        </div>
        <div className={clsx(styles.block, styles.leather, styles.stat)}>
          <img src={unitStatIcons.health.src} alt="Health" />
          <span>{unit.statistics.health}</span>
        </div>
        <div className={clsx(styles.block, styles.leather, styles.stat)}>
          <img src={unitStatIcons.initiative.src} alt="Initiative" />
          <span>{unit.statistics.initiative}</span>
        </div>
      </div>

      <div
        className={clsx(styles.block, styles.portrait)}
        style={{ backgroundImage: `url("${unit.portrait.path}")` }}
      >
        <TypeBadge type={unit.type} />
      </div>

      <div className={clsx(styles.block, styles.leather, styles.bankName)}>
        <span>{unit.bankName}</span>
      </div>

      <div className={clsx(styles.block, styles.leather, styles.specialty)}>
        <div>{textToComponent(unit.specialty)}</div>
      </div>
    </div>
  );
}
