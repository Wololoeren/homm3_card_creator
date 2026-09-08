import { Unit, UnitTier } from "@/models/unit";
import styles from "./UnitCardBack.module.css";

import BronzeBack from "@/assets/cards/neutral-back-tiers/bronze.webp";
import SilverBack from "@/assets/cards/neutral-back-tiers/silver.webp";
import GoldenBack from "@/assets/cards/neutral-back-tiers/golden.webp";
import AzureBack from "@/assets/cards/neutral-back-tiers/azure.webp";

const backImages: Record<UnitTier, { src: string }> = {
  [UnitTier.Bronze]: BronzeBack,
  [UnitTier.Silver]: SilverBack,
  [UnitTier.Golden]: GoldenBack,
  [UnitTier.Azure]: AzureBack,
};

export default function UnitCardBack({ unit }: { unit: Unit }) {
  const backImage = backImages[unit.tier];

  return (
    <div
      className={styles.cardBack}
      style={{ backgroundImage: `url("${backImage.src}")` }}
    />
  );
}
