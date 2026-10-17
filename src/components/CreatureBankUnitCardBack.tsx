import styles from "./CreatureBankUnitCardBack.module.css";

export default function CreatureBankUnitCardBack() {
  return (
    <div
      className={styles.cardBack}
      style={{ backgroundImage: `url("creature_bank_back.webp")` }}
    />
  );
}
