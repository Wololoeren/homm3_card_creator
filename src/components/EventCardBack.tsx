import styles from "./EventCardBack.module.css";

export default function EventCardBack() {
  return (
    <div
      className={styles.cardBack}
      style={{ backgroundImage: `url("event_back.webp")` }}
    />
  );
}
