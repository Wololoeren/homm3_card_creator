"use client";

import {
  DEFAULT_FRONT_REINFORCEMENT_TEXT,
  FactionUnit,
  PriceGlyph,
} from "@/models/factionUnit";
import { UnitTier, UnitType } from "@/models/unit";
import { townColors } from "@/models/color";
import styles from "./FactionUnitCard.module.css";
import clsx from "clsx";
import { textToComponent } from "@/lib/textToComponent";
import { useBackground, useBorder } from "@/hooks/background";
import { colord } from "colord";

import { unitStatIcons } from "@/lib/unitIcons";
import GoldIcon from "@/assets/glyphsInternal/price-icons/gold.png";
import ValuableIcon from "@/assets/glyphsInternal/price-icons/valuables.png";
import PayIcon from "@/assets/glyphsInternal/price-icons/pay.png";
import RecruitIcon from "@/assets/glyphsInternal/recruit.svg";
import ReinforceIcon from "@/assets/glyphs/reinforce.svg";

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

export function TypeBadge({ type }: { type: UnitType }) {
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

export default function FactionUnitCard({ unit }: { unit: FactionUnit }) {
  const tierStar = tierStars[unit.tier];
  const townColor = townColors[unit.town];
  const borderUrl = useBorder(unit.borderColor ?? townColor.color);
  // Panels default to the same brown used before custom colours existed —
  // only the border follows the town by default. The specialty panel is a
  // shade deeper; the printed cards separate the two bands that way.
  const panelColor = unit.backgroundColor ?? "#5b3e1f";
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
      <div className={clsx(styles.block, styles.tint, styles.title)}>
        <h3>{unit.name}</h3>
        <img
          src={tierStar.src}
          className={styles.tierStar}
          alt={`${unit.tier} tier`}
        />
      </div>

      <div className={clsx(styles.stats, styles.statsAloneRow)}>
        <div className={clsx(styles.block, styles.tint, styles.stat)}>
          <img src={unitStatIcons.attack.src} alt="Attack" />
          <span>{unit.few.attack}</span>
        </div>
        <div className={clsx(styles.block, styles.tint, styles.stat)}>
          <img src={unitStatIcons.defense.src} alt="Defense" />
          <span>{unit.few.defense}</span>
        </div>
        <div className={clsx(styles.block, styles.tint, styles.stat)}>
          <img src={unitStatIcons.health.src} alt="Health" />
          <span>{unit.few.health}</span>
        </div>
        <div className={clsx(styles.block, styles.tint, styles.stat)}>
          <img src={unitStatIcons.initiative.src} alt="Initiative" />
          <span>{unit.few.initiative}</span>
        </div>
      </div>

      <div
        className={clsx(styles.block, styles.portrait)}
        style={{ backgroundImage: `url("${unit.portrait.path}")` }}
      >
        <TypeBadge type={unit.few.type} />
      </div>

      <div className={clsx(styles.block, styles.tint, styles.costRow)}>
        <div className={styles.costBox}>
          {/* In More Reinforcements format the front prices from the recruit
              cost with a glyph of the author's choosing; otherwise it keeps
              the fixed recruit glyph. */}
          {unit.moreReinforcements ? (
            (unit.frontPriceGlyph ?? PriceGlyph.Pay) === PriceGlyph.Pay ? (
              <img src={PayIcon.src} alt="Pay" />
            ) : (
              <ReinforceIcon aria-label="Reinforce" />
            )
          ) : (
            <RecruitIcon aria-label="Recruitment cost" />
          )}
          <img src={GoldIcon.src} alt="Gold" />
          <span>{unit.recruitCost.gold}</span>
          {unit.recruitCost.valuables > 0 ? (
            <>
              <img src={ValuableIcon.src} alt="Valuables" />
              <span>{unit.recruitCost.valuables}</span>
            </>
          ) : null}
        </div>
        <div className={styles.costDivider} />
        <div className={styles.costBox}>
          {unit.moreReinforcements ? (
            // Rendered literally, not through textToComponent: the default
            // "#FEW" starts with a #, which that parser reads as a heading.
            <span className={styles.reinforcementText}>
              {unit.frontReinforcementText ?? DEFAULT_FRONT_REINFORCEMENT_TEXT}
            </span>
          ) : (
            <>
              <ReinforceIcon aria-label="Reinforcement cost" />
              <img src={GoldIcon.src} alt="Gold" />
              <span>{unit.reinforceCost.gold}</span>
              {unit.reinforceCost.valuables > 0 ? (
                <>
                  <img src={ValuableIcon.src} alt="Valuables" />
                  <span>{unit.reinforceCost.valuables}</span>
                </>
              ) : null}
            </>
          )}
        </div>
      </div>

      <div className={clsx(styles.block, styles.tintDark, styles.specialty)}>
        <div>{textToComponent(unit.fewSpecialty)}</div>
      </div>
    </div>
  );
}
