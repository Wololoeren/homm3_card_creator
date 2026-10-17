"use client";

import { EventCard as EventCardModel } from "@/models/eventCard";
import styles from "./EventCard.module.css";
import { textToComponent } from "@/lib/textToComponent";

import FlourishIcon from "@/assets/glyphsInternal/event-flourish.png";
import { cardTextProps } from "./cardTextProps";

export default function EventCard({ event }: { event: EventCardModel }) {
  return (
    <div className={styles.card}>
      <div className={styles.title}>
        <img src={FlourishIcon.src} alt="" />
        <h3>{event.name}</h3>
        <img src={FlourishIcon.src} alt="" className={styles.flourishRight} />
      </div>

      <div className={styles.flavor}>
        <div>{event.flavorText}</div>
      </div>

      <div className={styles.effect}>
        <div>{textToComponent(event.effect, cardTextProps)}</div>
      </div>
    </div>
  );
}
