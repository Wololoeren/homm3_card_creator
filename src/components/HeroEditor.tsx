"use client";

import HeroBoard from "./HeroBoard";
import { useCardInstances } from "@/hooks/cardInstances";
import CardInstances from "./CardInstances";
import SendToPdfButton from "./SendToPdfButton";
import { Hero, initialHero } from "@/models/hero";
import HeroCards from "./HeroCards";
import {
  Alert,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
} from "react-bootstrap";
import HeroForm from "./HeroForm";
import clsx from "clsx";
import styles from "./HeroEditor.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDownload,
  faUpload,
  faMagnifyingGlass,
  faGears,
} from "@fortawesome/free-solid-svg-icons";
import { loadHero, saveHero } from "@/lib/serializeHero";
import { loadOrToast } from "@/lib/toast";
import { normalizeString } from "@/lib/normalizeString";
import DownloadableCard from "./DownloadableCard";

export default function HeroEditor() {
  const {
    instances,
    selected,
    current: hero,
    select,
    add,
    append,
    setCurrent: setHero,
  } = useCardInstances<Hero>(initialHero, "hero");

  const previewName = normalizeString(String(hero.name ?? "")) || "hero";

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
          <Alert variant="warning" className="d-block d-md-none mb-0">
            This app works best on a desktop and may not display correctly on
            smaller screens.
          </Alert>

          <HeroForm hero={hero} setHero={(v) => setHero(v)} />
        </CardBody>
        <CardFooter>
          <div className="d-flex justify-content-start gap-2">
            <Button
              variant="primary"
              onClick={async () => {
                const hero = await loadOrToast(loadHero);

                if (hero) append([hero]);
              }}
            >
              <FontAwesomeIcon icon={faUpload} /> Open
            </Button>
            <Button
              variant="success"
              onClick={() => {
                saveHero(hero);
              }}
            >
              <FontAwesomeIcon icon={faDownload} /> Save
            </Button>
            <SendToPdfButton
              cardKey="hero"
              name={String(hero.name ?? "")}
              payload={hero}
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
        <CardBody className={styles.previewBody}>
          <div className={styles.previewContainer}>
            <div className="d-flex justify-content-center">
              <DownloadableCard filename={`${previewName}-board`}>
                <HeroBoard hero={hero} />
              </DownloadableCard>
            </div>
            <br />
            <HeroCards hero={hero} />
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
