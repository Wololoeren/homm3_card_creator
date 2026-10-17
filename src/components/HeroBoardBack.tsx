/**
 * The back of the hero tablet. The art is fixed, so unlike the board itself
 * there is nothing on it to edit and nothing to preview: it only ever appears
 * on the print sheet, next to the board it folds onto.
 */
import styles from "./HeroBoardBack.module.css";

export default function HeroBoardBack() {
  return (
    <div
      className={styles.boardBack}
      style={{ backgroundImage: `url("hero_tablet_back.webp")` }}
    />
  );
}
