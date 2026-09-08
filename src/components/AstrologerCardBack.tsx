import styles from "./AstrologerCardBack.module.css";

export default function AstrologerCardBack() {
  return (
    <div
      className={styles.cardBack}
      style={{ backgroundImage: `url("astrolog_back.webp")` }}
    />
  );
}
