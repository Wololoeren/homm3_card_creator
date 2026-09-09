"use client";

import { Unit, initialUnit } from "@/models/unit";
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
import UnitForm from "./UnitForm";
import UnitCard from "./UnitCard";
import UnitCardBack from "./UnitCardBack";
import clsx from "clsx";
import ScaledPreview from "./ScaledPreview";
import styles from "./UnitEditor.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGears,
  faMagnifyingGlass,
  faDownload,
  faUpload,
} from "@fortawesome/free-solid-svg-icons";
import { loadUnit, saveUnit } from "@/lib/serializeUnit";
import { loadOrToast } from "@/lib/toast";
import { normalizeString } from "@/lib/normalizeString";
import DownloadableCard from "./DownloadableCard";

export default function UnitEditor() {
  const {
    instances,
    selected,
    current: unit,
    select,
    add,
    append,
    setCurrent: setUnit,
  } = useCardInstances<Unit>(initialUnit, "unit");

  const previewName = normalizeString(String(unit.name ?? "")) || "unit";
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
          <UnitForm unit={unit} setUnit={(v) => setUnit(v)} />
        </CardBody>
        <CardFooter>
          <div className="d-flex justify-content-start gap-2">
            <Button
              variant="primary"
              onClick={async () => {
                const unit = await loadOrToast(loadUnit);

                if (unit) append([unit]);
              }}
            >
              <FontAwesomeIcon icon={faUpload} /> Open
            </Button>
            <Button
              variant="success"
              onClick={() => {
                saveUnit(unit);
              }}
            >
              <FontAwesomeIcon icon={faDownload} /> Save
            </Button>
            <SendToPdfButton
              cardKey="unit"
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
            <DownloadableCard filename={`${previewName}-few`}>
              <UnitCard unit={unit} />
            </DownloadableCard>
            <DownloadableCard filename={`${previewName}-back`}>
              <UnitCardBack unit={unit} />
            </DownloadableCard>
          </ScaledPreview>
        </CardBody>
      </Card>
    </div>
  );
}
