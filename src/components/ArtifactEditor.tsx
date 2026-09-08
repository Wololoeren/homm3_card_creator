"use client";

import {
  ArtifactCard as ArtifactCardModel,
  initialArtifactCard,
} from "@/models/artifactCard";
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
import ArtifactForm from "./ArtifactForm";
import ArtifactCard from "./ArtifactCard";
import ArtifactCardBack from "./ArtifactCardBack";
import clsx from "clsx";
import styles from "./ArtifactEditor.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGears,
  faMagnifyingGlass,
  faDownload,
  faUpload,
} from "@fortawesome/free-solid-svg-icons";
import {
  loadArtifactCard,
  saveArtifactCard,
} from "@/lib/serializeArtifactCard";
import { loadOrToast } from "@/lib/toast";
import { normalizeString } from "@/lib/normalizeString";
import DownloadableCard from "./DownloadableCard";

export default function ArtifactEditor() {
  const {
    instances,
    selected,
    current: artifact,
    select,
    add,
    append,
    setCurrent: setArtifact,
  } = useCardInstances<ArtifactCardModel>(initialArtifactCard, "artifact");


  const previewName =
    normalizeString(String(artifact.name ?? "")) || "artifact";
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
          <ArtifactForm
            artifact={artifact}
            setArtifact={(v) => setArtifact(v)}
          />
        </CardBody>
        <CardFooter>
          <div className="d-flex justify-content-start gap-2">
            <Button
              variant="primary"
              onClick={async () => {
                const artifact = await loadOrToast(loadArtifactCard);

                if (artifact) append([artifact]);
              }}
            >
              <FontAwesomeIcon icon={faUpload} /> Open
            </Button>
            <Button
              variant="success"
              onClick={() => {
                saveArtifactCard(artifact);
              }}
            >
              <FontAwesomeIcon icon={faDownload} /> Save
            </Button>
            <Button
              variant="outline-success"
              onClick={() =>
                sendToPdf("artifact", String(artifact.name ?? ""), artifact)
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
                <ArtifactCard artifact={artifact} />
              </DownloadableCard>
              <DownloadableCard filename={`${previewName}-back`}>
                <ArtifactCardBack />
              </DownloadableCard>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
