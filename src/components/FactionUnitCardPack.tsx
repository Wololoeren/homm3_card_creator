"use client";

import {
  DEFAULT_BACK_REINFORCEMENT_TEXT,
  FactionUnit,
  PriceGlyph,
} from "@/models/factionUnit";
import { UnitTier } from "@/models/unit";
import { townColors } from "@/models/color";
import styles from "./FactionUnitCard.module.css";
import clsx from "clsx";
import { textToComponent } from "@/lib/textToComponent";
import { useBackground, useBorder } from "@/hooks/background";
import { colord } from "colord";
import { TypeBadge } from "./FactionUnitCard";

import { PackHashIcon, unitStatIcons } from "@/lib/unitIcons";
import GoldIcon from "@/assets/glyphsInternal/price-icons/gold.png";
import ValuableIcon from "@/assets/glyphsInternal/price-icons/valuables.png";
import PayIcon from "@/assets/glyphsInternal/price-icons/pay.png";
import ReinforceIcon from "@/assets/glyphs/reinforce.svg";

import BronzeStar from "@/assets/glyphsInternal/tier-stars/bronze.png";
import SilverStar from "@/assets/glyphsInternal/tier-stars/silver.png";
import GoldenStar from "@/assets/glyphsInternal/tier-stars/golden.png";
import AzureStar from "@/assets/glyphsInternal/tier-stars/azure.png";

const tierStars: Record<UnitTier, { src: string }> = {
  [UnitTier.Bronze]: BronzeStar,
  [UnitTier.Silver]: SilverStar,
  [UnitTier.Golden]: GoldenStar,
  [UnitTier.Azure]: AzureStar,
};

export default function FactionUnitCardPack({ unit }: { unit: FactionUnit }) {
  const tierStar = tierStars[unit.tier];
  const townColor = townColors[unit.town];
  const borderUrl = useBorder(unit.borderColor ?? townColor.color);
  // Panels default to the same brown used before custom colours existed —
  // only the border follows the town by default. The specialty panel is a
  // shade deeper; the printed cards separate the two bands that way.
  const panelColor = unit.backgroundColor ?? "#6c5e38";
  const tintUrl = useBackground(panelColor);
  const tintDarkUrl = useBackground(colord(panelColor).darken(0.1).toHex());
  // The back mirrors the front unless it has been given its own identity.
  const name = unit.separateBackFace ? (unit.backName ?? unit.name) : unit.name;
  const portrait = unit.separateBackFace
    ? (unit.backPortrait ?? unit.portrait)
    : unit.portrait;

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
        <h3>{name}</h3>
        <img
          src={tierStar.src}
          className={styles.tierStar}
          alt={`${unit.tier} tier`}
        />
      </div>

      <div className={clsx(styles.stats, styles.statsAloneRow)}>
        <div className={clsx(styles.block, styles.tint, styles.stat)}>
          <img src={unitStatIcons.attack.src} alt="Attack" />
          <span>{unit.pack.attack}</span>
        </div>
        <div className={clsx(styles.block, styles.tint, styles.stat)}>
          <img src={unitStatIcons.defense.src} alt="Defense" />
          <span>{unit.pack.defense}</span>
        </div>
        <div className={clsx(styles.block, styles.tint, styles.stat)}>
          <img src={unitStatIcons.health.src} alt="Health" />
          <span>{unit.pack.health}</span>
        </div>
        <div className={clsx(styles.block, styles.tint, styles.stat)}>
          <img src={unitStatIcons.initiative.src} alt="Initiative" />
          <span>{unit.pack.initiative}</span>
        </div>
      </div>

      <div
        className={clsx(styles.block, styles.portrait)}
        style={{ backgroundImage: `url("${portrait.path}")` }}
      >
        <TypeBadge type={unit.pack.type} />
      </div>

      {unit.moreReinforcements ? (
        // Same two-box row as the front, but priced from the reinforce cost.
        <div className={clsx(styles.block, styles.tint, styles.costRow)}>
          <div className={styles.costBox}>
            {(unit.backPriceGlyph ?? PriceGlyph.Reinforce) ===
            PriceGlyph.Pay ? (
              <img src={PayIcon.src} alt="Pay" />
            ) : (
              <ReinforceIcon aria-label="Reinforce" />
            )}
            <img src={GoldIcon.src} alt="Gold" />
            <span>{unit.reinforceCost.gold}</span>
            {unit.reinforceCost.valuables > 0 ? (
              <>
                <img src={ValuableIcon.src} alt="Valuables" />
                <span>{unit.reinforceCost.valuables}</span>
              </>
            ) : null}
          </div>
          <div className={styles.costDivider} />
          <div className={styles.costBox}>
            {/* Rendered literally, not through textToComponent: the default
                "#PACK" starts with a #, which that parser reads as a heading. */}
            <span className={styles.reinforcementText}>
              {unit.backReinforcementText ?? DEFAULT_BACK_REINFORCEMENT_TEXT}
            </span>
          </div>
        </div>
      ) : (
        <div className={clsx(styles.block, styles.tint, styles.packBand)}>
          <span>
            <img className={styles.packHash} src={PackHashIcon.src} alt="#" />
            PACK
          </span>
        </div>
      )}

      <div className={clsx(styles.block, styles.tintDark, styles.specialty)}>
        <div>{textToComponent(unit.packSpecialty)}</div>
      </div>
    </div>
  );
}
