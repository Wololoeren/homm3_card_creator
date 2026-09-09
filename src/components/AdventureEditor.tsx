"use client";

import {
  AdventureCard as AdventureCardModel,
  initialAdventureCard,
} from "@/models/adventureCard";
import { useCardInstances } from "@/hooks/cardInstances";
import CardInstances from "./CardInstances";
import SendToPdfButton from "./SendToPdfButton";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
} from "react-bootstrap";
import AdventureForm from "./AdventureForm";
import AdventureCard from "./AdventureCard";
import AdventureCardBack from "./AdventureCardBack";
import clsx from "clsx";
import ScaledPreview from "./ScaledPreview";
import styles from "./AdventureEditor.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGears,
  faMagnifyingGlass,
  faDownload,
  faUpload,
} from "@fortawesome/free-solid-svg-icons";
import {
  loadAdventureCard,
  saveAdventureCard,
} from "@/lib/serializeAdventureCard";
import { loadOrToast } from "@/lib/toast";
import { normalizeString } from "@/lib/normalizeString";
import DownloadableCard from "./DownloadableCard";

export default function AdventureEditor() {
  const {
    instances,
    selected,
    current: adventure,
    select,
    add,
    append,
    setCurrent: setAdventure,
  } = useCardInstances<AdventureCardModel>(initialAdventureCard, "adventure");


  const previewName =
    normalizeString(String(adventure.name ?? "")) || "adventure";
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
          <AdventureForm
            adventure={adventure}
            setAdventure={(v) => setAdventure(v)}
          />
        </CardBody>
        <CardFooter>
          <div className="d-flex justify-content-start gap-2">
            <Button
              variant="primary"
              onClick={async () => {
                const adventure = await loadOrToast(loadAdventureCard);

                if (adventure) append([adventure]);
              }}
            >
              <FontAwesomeIcon icon={faUpload} /> Open
            </Button>
            <Button
              variant="success"
              onClick={() => {
                saveAdventureCard(adventure);
              }}
            >
              <FontAwesomeIcon icon={faDownload} /> Save
            </Button>
            <SendToPdfButton
              cardKey="adventure"
              name={String(adventure.name ?? "")}
              payload={adventure}
            />
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
          <ScaledPreview className={styles.previewRow}>
            <DownloadableCard filename={`${previewName}-front`}>
              <AdventureCard adventure={adventure} />
            </DownloadableCard>
            <DownloadableCard filename={`${previewName}-back`}>
              <AdventureCardBack />
            </DownloadableCard>
          </ScaledPreview>
        </CardBody>
      </Card>
    </div>
  );
}
