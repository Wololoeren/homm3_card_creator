"use client";

import clsx from "clsx";
import { colord } from "colord";

import { SecondaryHeroSide } from "@/models/secondaryHeroCard";
import { HeroType } from "@/models/town";
import { townColors } from "@/models/color";
import { useBackground, useBorder } from "@/hooks/background";
import { textToComponent } from "@/lib/textToComponent";
import { cardTextProps } from "./cardTextProps";

import MagicIcon from "@/assets/glyphs/magic.svg";
import MightIcon from "@/assets/glyphs/might.svg";
import XpTrack from "@/assets/cards/secondary-hero-xp-track.png";

import styles from "./SecondaryHeroCard.module.css";

/** The brown the panels take when the card names no colour of its own. */
export const defaultPanelColor = "#5b3e1f";

/** One face of a secondary hero card; the card itself carries two of them. */
export default function SecondaryHeroCard({
  side,
}: {
  side: SecondaryHeroSide;
}) {
  const townColor = townColors[side.town];
  const borderUrl = useBorder(townColor.color);
  // The name band carries the faction colour; the panels below it are the
  // plain brown of a hero board unless the card names a colour of its own.
  const nameUrl = useBackground(townColor.background ?? townColor.color);
  const panelColor = side.backgroundColor ?? defaultPanelColor;
  const tintUrl = useBackground(panelColor);
  // The stat cells are brown like a hero board's unless they are asked to
  // follow the town, which is a separate choice from the panel colour.
  const statTintUrl = useBackground(
    side.colouredStatPanels
      ? (townColor.background ?? townColor.color)
      : panelColor,
  );
  // The same step the faction unit cards put between their panels and their
  // specialty band.
  const tintDarkUrl = useBackground(colord(panelColor).darken(0.1).toHex());
  const { statistics } = side;

  return (
    <div
      className={styles.card}
      style={
        {
          "--border-image": borderUrl,
          "--name-background": nameUrl,
          "--tint-background": tintUrl,
          "--stat-background": statTintUrl,
          "--tint-background-dark": tintDarkUrl,
        } as React.CSSProperties
      }
    >
      <div className={clsx(styles.block, styles.name)}>
        <h3>{side.name}</h3>
        <figure className={styles.mightMagicIcon}>
          {side.type === HeroType.Magic ? (
            <MagicIcon aria-label="Magic" className={styles.magic} />
          ) : (
            <MightIcon aria-label="Might" />
          )}
        </figure>
      </div>

      <div className={styles.middle}>
        <div className={styles.statColumn}>
          <div className={clsx(styles.block, styles.statTint, styles.stat)}>
            <img src="images/attack.png" alt="Attack" />
            <span>{statistics.attack}</span>
          </div>
          <div className={clsx(styles.block, styles.statTint, styles.stat)}>
            <img src="images/defense.png" alt="Defense" />
            <span>{statistics.defense}</span>
          </div>
        </div>

        <div
          className={clsx(styles.block, styles.portrait)}
          style={{ backgroundImage: `url("${side.portrait.path}")` }}
        />

        <div className={styles.statColumn}>
          <div className={clsx(styles.block, styles.statTint, styles.stat)}>
            <img src="images/power.png" alt="Spell Power" />
            <span>{statistics.spellPower}</span>
          </div>
          <div className={clsx(styles.block, styles.statTint, styles.stat)}>
            <img src="images/knowledge.png" alt="Knowledge" />
            <span>{statistics.knowledge}</span>
          </div>
        </div>
      </div>

      {/* Fixed art: the track is the same on every secondary hero, so there is
          nothing on it to edit. */}
      <div
        className={styles.track}
        style={{ backgroundImage: `url("${XpTrack.src}")` }}
        role="img"
        aria-label="Experience track, levels I to V"
      />

      <div className={clsx(styles.block, styles.tintDark, styles.effects)}>
        <div>{textToComponent(side.effects, cardTextProps)}</div>
      </div>
    </div>
  );
}
