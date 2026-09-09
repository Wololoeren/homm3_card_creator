"use client";

import HeroEditor from "@/components/HeroEditor";
import UnitEditor from "@/components/UnitEditor";
import FactionUnitEditor from "@/components/FactionUnitEditor";
import AbilityEditor from "@/components/AbilityEditor";
import SpellEditor from "@/components/SpellEditor";
import ArtifactEditor from "@/components/ArtifactEditor";
import AstrologerEditor from "@/components/AstrologerEditor";
import EventEditor from "@/components/EventEditor";
import PandoraEditor from "@/components/PandoraEditor";
import CreatureBankUnitEditor from "@/components/CreatureBankUnitEditor";
import AdventureEditor from "@/components/AdventureEditor";
import MoraleEditor from "@/components/MoraleEditor";
import PdfEditor from "@/components/PdfEditor";
import PdfSheets, { LoadedCard } from "@/components/PdfSheets";
import WelcomeModal from "@/components/WelcomeModal";
import { useEffect, useState } from "react";
import { onPdfCard } from "@/lib/pdfQueue";
import { useLocalStorage } from "usehooks-ts";
import { Tab, Tabs } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCrown,
  faUsers,
  faDragon,
  faHatWizard,
  faWandMagicSparkles,
  faGem,
  faCalendarDays,
  faStar,
  faBoxOpen,
  faVault,
  faCompass,
  faScaleBalanced,
  faFilePdf,
} from "@fortawesome/free-solid-svg-icons";

export default function Home() {
  const [welcomeMessageAccepted, setWelcomeMessageAccepted] = useLocalStorage(
    "welcomeMessageAccepted",
    false,
  );

  const [activeTab, setActiveTab] = useState("heroes");
  // Held here rather than inside PdfEditor: the printable sheets have to
  // render outside the d-print-none wrapper around the tabs.
  const [pdfCards, setPdfCards] = useState<LoadedCard[]>([]);
  const [pdfCropped, setPdfCropped] = useState(false);
  const [pdfCutoutLevels, setPdfCutoutLevels] = useState(false);
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);

  // Editors push cards here via "Send to PDF".
  useEffect(
    () => onPdfCard((card) => setPdfCards((current) => [...current, card])),
    [],
  );

  return (
    <>
      <div className="d-print-none">
        <Tabs
          activeKey={activeTab}
          onSelect={(key) => setActiveTab(key ?? "heroes")}
          className="justify-content-center mt-2"
          fill
        >
          <Tab
            eventKey="heroes"
            title={
              <>
                <FontAwesomeIcon icon={faCrown} /> Heroes
              </>
            }
          >
            <HeroEditor />
          </Tab>
          <Tab
            eventKey="neutral-units"
            title={
              <>
                <FontAwesomeIcon icon={faDragon} /> Neutral Units
              </>
            }
          >
            <UnitEditor />
          </Tab>
          <Tab
            eventKey="faction-units"
            title={
              <>
                <FontAwesomeIcon icon={faUsers} /> Faction Units
              </>
            }
          >
            <FactionUnitEditor />
          </Tab>
          <Tab
            eventKey="creature-bank"
            title={
              <>
                <FontAwesomeIcon icon={faVault} /> Creature Bank
              </>
            }
          >
            <CreatureBankUnitEditor />
          </Tab>
          <Tab
            eventKey="abilities"
            title={
              <>
                <FontAwesomeIcon icon={faHatWizard} /> Abilities
              </>
            }
          >
            <AbilityEditor />
          </Tab>
          <Tab
            eventKey="spells"
            title={
              <>
                <FontAwesomeIcon icon={faWandMagicSparkles} /> Spells
              </>
            }
          >
            <SpellEditor />
          </Tab>
          <Tab
            eventKey="artifacts"
            title={
              <>
                <FontAwesomeIcon icon={faGem} /> Artifacts
              </>
            }
          >
            <ArtifactEditor />
          </Tab>
          <Tab
            eventKey="events"
            title={
              <>
                <FontAwesomeIcon icon={faCalendarDays} /> Events
              </>
            }
          >
            <EventEditor />
          </Tab>
          <Tab
            eventKey="astrologers"
            title={
              <>
                <FontAwesomeIcon icon={faStar} /> Astrologers
              </>
            }
          >
            <AstrologerEditor />
          </Tab>
          <Tab
            eventKey="pandora"
            title={
              <>
                <FontAwesomeIcon icon={faBoxOpen} /> Pandora&apos;s Box
              </>
            }
          >
            <PandoraEditor />
          </Tab>
          <Tab
            eventKey="adventure"
            title={
              <>
                <FontAwesomeIcon icon={faCompass} /> Adventure
              </>
            }
          >
            <AdventureEditor />
          </Tab>
          <Tab
            eventKey="morale"
            title={
              <>
                <FontAwesomeIcon icon={faScaleBalanced} /> Morale
              </>
            }
          >
            <MoraleEditor />
          </Tab>
          <Tab
            eventKey="pdf"
            tabClassName="pdfTab"
            title={
              <>
                <FontAwesomeIcon icon={faFilePdf} /> PDF
              </>
            }
          >
            <PdfEditor
              cards={pdfCards}
              setCards={setPdfCards}
              cropped={pdfCropped}
              setCropped={setPdfCropped}
              cutoutLevels={pdfCutoutLevels}
              setCutoutLevels={setPdfCutoutLevels}
            />
          </Tab>
        </Tabs>
      </div>
      {activeTab === "pdf" ? (
        <div className="printOnly">
          <PdfSheets
            cards={pdfCards}
            cropped={pdfCropped}
            cutoutLevels={pdfCutoutLevels}
          />
        </div>
      ) : null}
      <WelcomeModal
        show={!welcomeMessageAccepted && ready}
        onHide={() => setWelcomeMessageAccepted(true)}
      />
    </>
  );
}
