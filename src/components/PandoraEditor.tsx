"use client";

import {
  PandoraCard as PandoraCardModel,
  defaultPandoraName,
  initialPandoraCard,
} from "@/models/pandoraCard";
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
import PandoraForm from "./PandoraForm";
import PandoraCard from "./PandoraCard";
import PandoraCardBack from "./PandoraCardBack";
import clsx from "clsx";
import styles from "./PandoraEditor.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGears,
  faMagnifyingGlass,
  faDownload,
  faUpload,
} from "@fortawesome/free-solid-svg-icons";
import { loadPandoraCard, savePandoraCard } from "@/lib/serializePandoraCard";
import { loadOrToast } from "@/lib/toast";
import { normalizeString } from "@/lib/normalizeString";
import DownloadableCard from "./DownloadableCard";

export default function PandoraEditor() {
  const {
    instances,
    selected,
    current: pandora,
    select,
    add,
    append,
    setCurrent: setPandora,
  } = useCardInstances<PandoraCardModel>(initialPandoraCard, "pandora");


  const previewName =
    normalizeString(String(pandora.name || defaultPandoraName)) || "pandora";
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
            // Pandora cards carry no name, so the circles fall back to numbers.
            labels={instances.map(() => "")}
            selected={selected}
            onSelect={select}
            onAdd={add}
          />
          <PandoraForm pandora={pandora} setPandora={(v) => setPandora(v)} />
        </CardBody>
        <CardFooter>
          <div className="d-flex justify-content-start gap-2">
            <Button
              variant="primary"
              onClick={async () => {
                const pandora = await loadOrToast(loadPandoraCard);

                if (pandora) append([pandora]);
              }}
            >
              <FontAwesomeIcon icon={faUpload} /> Open
            </Button>
            <Button
              variant="success"
              onClick={() => {
                savePandoraCard(pandora);
              }}
            >
              <FontAwesomeIcon icon={faDownload} /> Save
            </Button>
            <Button
              variant="outline-success"
              onClick={() =>
                sendToPdf(
                  "pandora",
                  pandora.name || defaultPandoraName,
                  pandora,
                )
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
                <PandoraCard pandora={pandora} />
              </DownloadableCard>
              <DownloadableCard filename={`${previewName}-back`}>
                <PandoraCardBack />
              </DownloadableCard>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
