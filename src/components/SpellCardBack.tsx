import styles from "./SpellCardBack.module.css";

export default function SpellCardBack() {
  return (
    <div
      className={styles.cardBack}
      style={{ backgroundImage: `url("card_back.webp")` }}
    />
  );
}
