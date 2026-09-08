"use client";

import {
  EventCard as EventCardModel,
  initialEventCard,
} from "@/models/eventCard";
import { useCardInstances } from "@/hooks/cardInstances";
import CardInstances from "./CardInstances";
import { sendToPdf } from "@/lib/pdfQueue";
import { faFilePdf } from "@fortawesome/free-solid-svg-icons";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
} from "react-bootstrap";
import EventForm from "./EventForm";
import EventCard from "./EventCard";
import EventCardBack from "./EventCardBack";
import clsx from "clsx";
import styles from "./EventEditor.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGears,
  faMagnifyingGlass,
  faDownload,
  faUpload,
} from "@fortawesome/free-solid-svg-icons";
import { loadEventCard, saveEventCard } from "@/lib/serializeEventCard";
import { loadOrToast } from "@/lib/toast";
import { normalizeString } from "@/lib/normalizeString";
import DownloadableCard from "./DownloadableCard";

export default function EventEditor() {
  const {
    instances,
    selected,
    current: event,
    select,
    add,
    append,
    setCurrent: setEvent,
  } = useCardInstances<EventCardModel>(initialEventCard, "event");


  const previewName =
    normalizeString(String(event.name ?? "")) || "event";
  return (
    <div className={clsx("d-print-none", styles.editor)}>
      <Card className={styles.properties}>
        <CardHeader>
          <h2>
            <FontAwesomeIcon icon={faGears} /> Properties
          </h2>
        </CardHeader>
        <CardBody>
          <CardInstances
            labels={instances.map((item) => String(item.name ?? ""))}
            selected={selected}
            onSelect={select}
            onAdd={add}
          />
          <EventForm event={event} setEvent={(v) => setEvent(v)} />
        </CardBody>
        <CardFooter>
          <div className="d-flex justify-content-start gap-2">
            <Button
              variant="primary"
              onClick={async () => {
                const event = await loadOrToast(loadEventCard);

                if (event) append([event]);
              }}
            >
              <FontAwesomeIcon icon={faUpload} /> Open
            </Button>
            <Button
              variant="success"
              onClick={() => {
                saveEventCard(event);
              }}
            >
              <FontAwesomeIcon icon={faDownload} /> Save
            </Button>
            <Button
              variant="outline-success"
              onClick={() =>
                sendToPdf("event", String(event.name ?? ""), event)
              }
            >
              <FontAwesomeIcon icon={faFilePdf} /> Send to PDF
            </Button>
          </div>
        </CardFooter>
      </Card>

      <Card className={styles.preview}>
        <CardHeader>
          <h2>
            <FontAwesomeIcon icon={faMagnifyingGlass} /> Preview
          </h2>
        </CardHeader>
        <CardBody>
          <div className={styles.previewContainer}>
            <div className={styles.previewRow}>
              <DownloadableCard filename={`${previewName}-front`}>
                <EventCard event={event} />
              </DownloadableCard>
              <DownloadableCard filename={`${previewName}-back`} flipped>
                <EventCardBack />
              </DownloadableCard>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
