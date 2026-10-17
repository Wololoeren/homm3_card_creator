import { unitStatIcons } from "@/lib/unitIcons";
import styles from "./UnitStats.module.css";

/** A unit's stat row, as :stats{}: writes it into a card's text. */
export default function UnitStats({
  attack,
  defense,
  health,
  speed,
}: {
  attack: number;
  defense: number;
  health: number;
  speed: number;
}) {
  const stats = [
    { icon: unitStatIcons.attack, alt: "Attack", value: attack },
    { icon: unitStatIcons.defense, alt: "Defense", value: defense },
    { icon: unitStatIcons.health, alt: "Health", value: health },
    { icon: unitStatIcons.initiative, alt: "Speed", value: speed },
  ];

  return (
    <div className={styles.unitStats}>
      {stats.map(({ icon, alt, value }) => (
        <div key={alt}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className={styles.unitIcon} src={icon.src} alt={alt} /> {value}
        </div>
      ))}
    </div>
  );
}
