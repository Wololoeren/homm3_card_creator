"use client";

import { Unit, UnitTier, UnitType } from "@/models/unit";
import styles from "./UnitCard.module.css";
import clsx from "clsx";
import { textToComponent } from "@/lib/textToComponent";
import { useBackground, useBorder } from "@/hooks/background";

import { unitStatIcons } from "@/lib/unitIcons";
import PayIcon from "@/assets/glyphsInternal/price-icons/pay.png";
import GoldIcon from "@/assets/glyphsInternal/price-icons/gold.png";

import BronzeStar from "@/assets/glyphsInternal/tier-stars/bronze.png";
import SilverStar from "@/assets/glyphsInternal/tier-stars/silver.png";
import GoldenStar from "@/assets/glyphsInternal/tier-stars/golden.png";
import AzureStar from "@/assets/glyphsInternal/tier-stars/azure.png";

import UnitGroundIcon from "@/assets/glyphsInternal/unit_ground.svg";
import UnitFlyingIcon from "@/assets/glyphsInternal/unit_flying.svg";
import UnitRangedIcon from "@/assets/glyphs/unit_ranged.svg";

const tierStars: Record<UnitTier, { src: string }> = {
  [UnitTier.Bronze]: BronzeStar,
  [UnitTier.Silver]: SilverStar,
  [UnitTier.Golden]: GoldenStar,
  [UnitTier.Azure]: AzureStar,
};

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

/* Fixed for every neutral unit — hoisted so the whole deck shares one string,
   and with it one cached render of each. */
const BORDER_COLOR = "#e8d66b";
const TINT_COLOR = "#6c5e38";
const TINT_DARK_COLOR = "#3c3321";

export default function UnitCard({ unit }: { unit: Unit }) {
  const tierStar = tierStars[unit.tier];
  const borderUrl = useBorder(BORDER_COLOR);
  const tintUrl = useBackground(TINT_COLOR);
  const tintDarkUrl = useBackground(TINT_DARK_COLOR);

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
      <div className={clsx(styles.block, styles.tint, styles.title)}>
        <h3>{unit.name}</h3>
        <img
          src={tierStar.src}
          className={styles.tierStar}
          alt={`${unit.tier} tier`}
        />
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

      <div className={clsx(styles.block, styles.tint, styles.price)}>
        <img src={PayIcon.src} alt="Recruitment cost" />
        <img src={GoldIcon.src} alt="Gold" />
        <span>{unit.statistics.price}</span>
      </div>

      <div className={clsx(styles.block, styles.tintDark, styles.specialty)}>
        <div>{textToComponent(unit.specialty)}</div>
      </div>
    </div>
  );
}
