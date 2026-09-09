"use client";

import {
  SpellCard as SpellCardModel,
  initialSpellCard,
} from "@/models/spellCard";
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
import SpellForm from "./SpellForm";
import SpellCard from "./SpellCard";
import SpellCardBack from "./SpellCardBack";
import clsx from "clsx";
import ScaledPreview from "./ScaledPreview";
import styles from "./SpellEditor.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGears,
  faMagnifyingGlass,
  faDownload,
  faUpload,
} from "@fortawesome/free-solid-svg-icons";
import { loadSpellCard, saveSpellCard } from "@/lib/serializeSpellCard";
import { loadOrToast } from "@/lib/toast";
import { normalizeString } from "@/lib/normalizeString";
import DownloadableCard from "./DownloadableCard";

export default function SpellEditor() {
  const {
    instances,
    selected,
    current: spell,
    select,
    add,
    append,
    setCurrent: setSpell,
  } = useCardInstances<SpellCardModel>(initialSpellCard, "spell");


  const previewName =
    normalizeString(String(spell.name ?? "")) || "spell";
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
          <SpellForm spell={spell} setSpell={(v) => setSpell(v)} />
        </CardBody>
        <CardFooter>
          <div className="d-flex justify-content-start gap-2">
            <Button
              variant="primary"
              onClick={async () => {
                const spell = await loadOrToast(loadSpellCard);

                if (spell) append([spell]);
              }}
            >
              <FontAwesomeIcon icon={faUpload} /> Open
            </Button>
            <Button
              variant="success"
              onClick={() => {
                saveSpellCard(spell);
              }}
            >
              <FontAwesomeIcon icon={faDownload} /> Save
            </Button>
            <SendToPdfButton
              cardKey="spell"
              name={String(spell.name ?? "")}
              payload={spell}
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
              <SpellCard spell={spell} />
            </DownloadableCard>
            <DownloadableCard filename={`${previewName}-back`}>
              <SpellCardBack />
            </DownloadableCard>
          </ScaledPreview>
        </CardBody>
      </Card>
    </div>
  );
}
