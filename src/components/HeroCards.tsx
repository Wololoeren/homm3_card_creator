import { Hero } from "@/models/hero";
import HeroCard from "./HeroCard";
import styles from "./HeroCards.module.css";
import { SpecialtyLevel } from "@/models/specialty";
import { normalizeString } from "@/lib/normalizeString";
import DownloadableCard from "./DownloadableCard";

/** Tier numbers match the suffixes the card art is published under. */
const LEVELS: Array<[SpecialtyLevel, string]> = [
  [SpecialtyLevel.One, "1"],
  [SpecialtyLevel.Four, "4"],
  [SpecialtyLevel.Six, "6"],
];

export default function HeroCards({ hero }: { hero: Hero }) {
  const previewName = normalizeString(String(hero.name ?? "")) || "hero";

  return (
    <div className={styles.cards}>
      {LEVELS.map(([level, tier]) => (
        <DownloadableCard key={tier} filename={`${previewName}-${tier}`}>
          <HeroCard hero={hero} specialtyLevel={level} />
        </DownloadableCard>
      ))}
    </div>
  );
}
