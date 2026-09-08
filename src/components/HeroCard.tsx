import { Hero } from "@/models/hero";
import styles from "./HeroCard.module.css";
import clsx from "clsx";
import { SpecialtyLevel } from "@/models/specialty";

import { textToComponent, TextToComponentProps } from "@/lib/textToComponent";
import SpellEffect from "./SpellEffect";

import { townColors } from "@/models/color";
import { useBackground } from "@/hooks/background";
import { unitStatIcons } from "@/lib/unitIcons";

const textToComponentProps: TextToComponentProps = {
  renderSpell: (props) => <SpellEffect {...props} />,
  renderUnitStats: (props) => (
    <div className={styles.unitStats}>
      <div>
        <img
          className={styles.unitIcon}
          src={unitStatIcons.attack.src}
          alt="Attack"
        />{" "}
        {props.attack}
      </div>
      <div>
        <img
          className={styles.unitIcon}
          src={unitStatIcons.defense.src}
          alt="Defense"
        />{" "}
        {props.defense}
      </div>
      <div>
        <img
          className={styles.unitIcon}
          src={unitStatIcons.health.src}
          alt="Health"
        />{" "}
        {props.health}
      </div>
      <div>
        <img
          className={styles.unitIcon}
          src={unitStatIcons.initiative.src}
          alt="Speed"
        />{" "}
        {props.speed}
      </div>
    </div>
  ),
};

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
              textToComponentProps
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
