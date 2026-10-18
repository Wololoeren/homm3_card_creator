"use client";

import clsx from "clsx";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDownload,
  faGears,
  faMagnifyingGlass,
  faUpload,
} from "@fortawesome/free-solid-svg-icons";

import {
  SecondaryHeroCard as SecondaryHeroCardModel,
  initialSecondaryHeroCard,
} from "@/models/secondaryHeroCard";
import { useCardInstances } from "@/hooks/cardInstances";
import {
  loadSecondaryHeroCard,
  saveSecondaryHeroCard,
} from "@/lib/serializeSecondaryHeroCard";
import { loadOrToast } from "@/lib/toast";
import { normalizeString } from "@/lib/normalizeString";

import CardInstances from "./CardInstances";
import DownloadableCard from "./DownloadableCard";
import ScaledPreview from "./ScaledPreview";
import SecondaryHeroCard from "./SecondaryHeroCard";
import SecondaryHeroForm from "./SecondaryHeroForm";
import SendToPdfButton from "./SendToPdfButton";
import styles from "./SecondaryHeroEditor.module.css";

export default function SecondaryHeroEditor() {
  const {
    instances,
    selected,
    current: card,
    select,
    add,
    append,
    setCurrent: setCard,
  } = useCardInstances<SecondaryHeroCardModel>(
    initialSecondaryHeroCard,
    "secondaryHero",
  );

  const previewName =
    normalizeString(`${card.front.name}-${card.back.name}`) || "secondary-hero";

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
            labels={instances.map((instance) => instance.front.name)}
            selected={selected}
            onSelect={select}
            onAdd={add}
          />
          <SecondaryHeroForm card={card} setCard={setCard} />
        </CardBody>
        <CardFooter>
          <div className="d-flex gap-2">
            <Button
              variant="primary"
              onClick={async () => {
                const loaded = await loadOrToast(loadSecondaryHeroCard);

                if (loaded) append([loaded]);
              }}
            >
              <FontAwesomeIcon icon={faUpload} /> Open
            </Button>
            <Button variant="success" onClick={() => saveSecondaryHeroCard(card)}>
              <FontAwesomeIcon icon={faDownload} /> Save
            </Button>
            <SendToPdfButton
              cardKey="secondaryHero"
              name={`${card.front.name} / ${card.back.name}`}
              payload={card}
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
              <SecondaryHeroCard side={card.front} />
            </DownloadableCard>
            <DownloadableCard filename={`${previewName}-back`}>
              <SecondaryHeroCard side={card.back} />
            </DownloadableCard>
          </ScaledPreview>
        </CardBody>
      </Card>
    </div>
  );
}
