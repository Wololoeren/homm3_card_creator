import styles from "./ArtifactCardBack.module.css";

export default function ArtifactCardBack() {
  return (
    <div
      className={styles.cardBack}
      style={{ backgroundImage: `url("card_back.webp")` }}
    />
  );
}
