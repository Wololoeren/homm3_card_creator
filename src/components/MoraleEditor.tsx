"use client";

import {
  MoraleCard as MoraleCardModel,
  initialMoraleCard,
} from "@/models/moraleCard";
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
import MoraleForm from "./MoraleForm";
import MoraleCard from "./MoraleCard";
import MoraleCardBack from "./MoraleCardBack";
import clsx from "clsx";
import ScaledPreview from "./ScaledPreview";
import styles from "./MoraleEditor.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGears,
  faMagnifyingGlass,
  faDownload,
  faUpload,
} from "@fortawesome/free-solid-svg-icons";
import { loadMoraleCard, saveMoraleCard } from "@/lib/serializeMoraleCard";
import { loadOrToast } from "@/lib/toast";
import { normalizeString } from "@/lib/normalizeString";
import DownloadableCard from "./DownloadableCard";

export default function MoraleEditor() {
  const {
    instances,
    selected,
    current: morale,
    select,
    add,
    append,
    setCurrent: setMorale,
  } = useCardInstances<MoraleCardModel>(initialMoraleCard, "morale");


  // Morale cards are identified by type rather than a name, matching the
  // filename the JSON export uses.
  const previewName = `${
    normalizeString(String(morale.type ?? "")) || "morale"
  }_morale`;
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
            labels={instances.map((item) => String(item.type ?? ""))}
            selected={selected}
            onSelect={select}
            onAdd={add}
          />
          <MoraleForm morale={morale} setMorale={(v) => setMorale(v)} />
        </CardBody>
        <CardFooter>
          <div className="d-flex justify-content-start gap-2">
            <Button
              variant="primary"
              onClick={async () => {
                const morale = await loadOrToast(loadMoraleCard);

                if (morale) append([morale]);
              }}
            >
              <FontAwesomeIcon icon={faUpload} /> Open
            </Button>
            <Button
              variant="success"
              onClick={() => {
                saveMoraleCard(morale);
              }}
            >
              <FontAwesomeIcon icon={faDownload} /> Save
            </Button>
            <SendToPdfButton
              cardKey="morale"
              name={String(morale.type ?? "")}
              payload={morale}
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
              <MoraleCard morale={morale} />
            </DownloadableCard>
            <DownloadableCard filename={`${previewName}-back`}>
              <MoraleCardBack type={morale.type} />
            </DownloadableCard>
          </ScaledPreview>
        </CardBody>
      </Card>
    </div>
  );
}
