"use client";

import { FactionUnit, initialFactionUnit } from "@/models/factionUnit";
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
import FactionUnitForm from "./FactionUnitForm";
import FactionUnitCard from "./FactionUnitCard";
import FactionUnitCardPack from "./FactionUnitCardPack";
import clsx from "clsx";
import styles from "./FactionUnitEditor.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGears,
  faMagnifyingGlass,
  faDownload,
  faUpload,
} from "@fortawesome/free-solid-svg-icons";
import { loadFactionUnit, saveFactionUnit } from "@/lib/serializeFactionUnit";
import { loadOrToast } from "@/lib/toast";
import { normalizeString } from "@/lib/normalizeString";
import DownloadableCard from "./DownloadableCard";

export default function FactionUnitEditor() {
  const {
    instances,
    selected,
    current: unit,
    select,
    add,
    append,
    setCurrent: setUnit,
  } = useCardInstances<FactionUnit>(initialFactionUnit, "factionUnit");


  const previewName =
    normalizeString(String(unit.name ?? "")) || "faction_unit";
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
          <FactionUnitForm unit={unit} setUnit={(v) => setUnit(v)} />
        </CardBody>
        <CardFooter>
          <div className="d-flex justify-content-start gap-2">
            <Button
              variant="primary"
              onClick={async () => {
                const unit = await loadOrToast(loadFactionUnit);

                if (unit) append([unit]);
              }}
            >
              <FontAwesomeIcon icon={faUpload} /> Open
            </Button>
            <Button
              variant="success"
              onClick={() => {
                saveFactionUnit(unit);
              }}
            >
              <FontAwesomeIcon icon={faDownload} /> Save
            </Button>
            <SendToPdfButton
              cardKey="factionUnit"
              name={String(unit.name ?? "")}
              payload={unit}
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
          <div className={styles.previewContainer}>
            <div className={styles.previewRow}>
              <DownloadableCard filename={`${previewName}-front`}>
                <FactionUnitCard unit={unit} />
              </DownloadableCard>
              <DownloadableCard filename={`${previewName}-pack`}>
                <FactionUnitCardPack unit={unit} />
              </DownloadableCard>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
