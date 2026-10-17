import { Hero } from "@/models/hero";
import styles from "./HeroCard.module.css";
import clsx from "clsx";
import { SpecialtyLevel } from "@/models/specialty";

import { textToComponent } from "@/lib/textToComponent";
import { cardTextProps } from "./cardTextProps";

import { townColors } from "@/models/color";
import { useBackground } from "@/hooks/background";

export default function HeroCard({
  hero,
  specialtyLevel,
}: {
  hero: Hero;
  specialtyLevel: SpecialtyLevel;
}) {
  const townColor = townColors[hero.town];
  const bgUrl = useBackground(
    hero.customClass?.background ?? townColor.background ?? townColor.color
  );

  return (
    <div
      className={clsx(styles.card, styles[`specialty${specialtyLevel}`])}
      style={{ "--name-background": bgUrl } as React.CSSProperties}
    >
      <div className={clsx(styles.block, styles.content)}>
        <img
          className={styles.icon}
          src={hero.specialty.path}
          alt="Specialty Icon"
        />
        <h3>{hero.specialty.name}</h3>
        <div className={styles.description}>
          <div>
            {textToComponent(
              hero.specialtyContent[specialtyLevel],
              cardTextProps
            )}
          </div>
        </div>
      </div>
      <div
        className={clsx(styles.portrait, styles.block)}
        style={{ backgroundImage: `url("${hero.portrait.path}")` }}
      ></div>
      <div className={clsx(styles.level, styles.block)}>
        <div className={styles.levelIcon}></div>
      </div>
    </div>
  );
}
