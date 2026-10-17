import styles from "./AbilityCardBack.module.css";

export default function AbilityCardBack() {
  return (
    <div
      className={styles.cardBack}
      style={{ backgroundImage: `url("card_back.webp")` }}
    />
  );
}
