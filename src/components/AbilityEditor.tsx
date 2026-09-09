"use client";

import {
  AbilityCard as AbilityCardModel,
  initialAbilityCard,
} from "@/models/abilityCard";
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
import AbilityForm from "./AbilityForm";
import AbilityCard from "./AbilityCard";
import AbilityCardBack from "./AbilityCardBack";
import clsx from "clsx";
import ScaledPreview from "./ScaledPreview";
import styles from "./AbilityEditor.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGears,
  faMagnifyingGlass,
  faDownload,
  faUpload,
} from "@fortawesome/free-solid-svg-icons";
import { loadAbilityCard, saveAbilityCard } from "@/lib/serializeAbilityCard";
import { loadOrToast } from "@/lib/toast";
import { normalizeString } from "@/lib/normalizeString";
import DownloadableCard from "./DownloadableCard";

export default function AbilityEditor() {
  const {
    instances,
    selected,
    current: ability,
    select,
    add,
    append,
    setCurrent: setAbility,
  } = useCardInstances<AbilityCardModel>(initialAbilityCard, "ability");


  const previewName =
    normalizeString(String(ability.name ?? "")) || "ability";
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
          <AbilityForm ability={ability} setAbility={(v) => setAbility(v)} />
        </CardBody>
        <CardFooter>
          <div className="d-flex justify-content-start gap-2">
            <Button
              variant="primary"
              onClick={async () => {
                const ability = await loadOrToast(loadAbilityCard);

                if (ability) append([ability]);
              }}
            >
              <FontAwesomeIcon icon={faUpload} /> Open
            </Button>
            <Button
              variant="success"
              onClick={() => {
                saveAbilityCard(ability);
              }}
            >
              <FontAwesomeIcon icon={faDownload} /> Save
            </Button>
            <SendToPdfButton
              cardKey="ability"
              name={String(ability.name ?? "")}
              payload={ability}
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
              <AbilityCard ability={ability} />
            </DownloadableCard>
            <DownloadableCard filename={`${previewName}-back`}>
              <AbilityCardBack />
            </DownloadableCard>
          </ScaledPreview>
        </CardBody>
      </Card>
    </div>
  );
}
