"use client";

import {
  CreatureBankUnit as CreatureBankUnitModel,
  initialCreatureBankUnit,
} from "@/models/creatureBankUnit";
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
import CreatureBankUnitForm from "./CreatureBankUnitForm";
import CreatureBankUnitCard from "./CreatureBankUnitCard";
import CreatureBankUnitCardBack from "./CreatureBankUnitCardBack";
import clsx from "clsx";
import ScaledPreview from "./ScaledPreview";
import styles from "./CreatureBankUnitEditor.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGears,
  faMagnifyingGlass,
  faDownload,
  faUpload,
} from "@fortawesome/free-solid-svg-icons";
import {
  loadCreatureBankUnit,
  saveCreatureBankUnit,
} from "@/lib/serializeCreatureBankUnit";
import { loadOrToast } from "@/lib/toast";
import { normalizeString } from "@/lib/normalizeString";
import DownloadableCard from "./DownloadableCard";

export default function CreatureBankUnitEditor() {
  const {
    instances,
    selected,
    current: unit,
    select,
    add,
    append,
    setCurrent: setUnit,
  } = useCardInstances<CreatureBankUnitModel>(initialCreatureBankUnit, "creatureBankUnit");


  const previewName =
    normalizeString(String(unit.name ?? "")) || "creature_bank_unit";
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
          <CreatureBankUnitForm unit={unit} setUnit={(v) => setUnit(v)} />
        </CardBody>
        <CardFooter>
          <div className="d-flex justify-content-start gap-2">
            <Button
              variant="primary"
              onClick={async () => {
                const unit = await loadOrToast(loadCreatureBankUnit);

                if (unit) append([unit]);
              }}
            >
              <FontAwesomeIcon icon={faUpload} /> Open
            </Button>
            <Button
              variant="success"
              onClick={() => {
                saveCreatureBankUnit(unit);
              }}
            >
              <FontAwesomeIcon icon={faDownload} /> Save
            </Button>
            <SendToPdfButton
              cardKey="creatureBankUnit"
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
          <ScaledPreview className={styles.previewRow}>
            <DownloadableCard filename={`${previewName}-front`}>
              <CreatureBankUnitCard unit={unit} />
            </DownloadableCard>
            <DownloadableCard filename={`${previewName}-back`}>
              <CreatureBankUnitCardBack />
            </DownloadableCard>
          </ScaledPreview>
        </CardBody>
      </Card>
    </div>
  );
}
