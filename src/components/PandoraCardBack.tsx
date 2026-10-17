import styles from "./PandoraCardBack.module.css";

export default function PandoraCardBack() {
  return (
    <div
      className={styles.cardBack}
      style={{ backgroundImage: `url("pandora_back.webp")` }}
    />
  );
}
