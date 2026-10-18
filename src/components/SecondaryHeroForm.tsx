"use client";

import { useState } from "react";
import { Button, Col, Form, Row, Tab, Tabs } from "react-bootstrap";

import {
  SecondaryHeroCard,
  SecondaryHeroSide,
  SecondaryHeroStatistics,
  secondaryHeroLevels,
} from "@/models/secondaryHeroCard";
import { HeroType, TownType } from "@/models/town";
import { townColors } from "@/models/color";
import { Portrait, portraits } from "@/models/hero";
import IconPalette from "./IconPalette";
import ReplaceEntityModal from "./ReplaceEntityModal";
import { defaultPanelColor } from "./SecondaryHeroCard";

/** Which face of the card is being edited. */
type Face = "front" | "back";

const FACES: { key: Face; label: string }[] = [
  { key: "front", label: "Front" },
  { key: "back", label: "Back" },
];

const STATS: { key: keyof SecondaryHeroStatistics; label: string }[] = [
  { key: "attack", label: "Attack" },
  { key: "defense", label: "Defense" },
  { key: "spellPower", label: "Spell Power" },
  { key: "knowledge", label: "Knowledge" },
];

/** The textarea the palette types into; one per face. */
function effectsFieldId(face: Face): string {
  return `secondaryHeroEffects-${face}`;
}

export default function SecondaryHeroForm({
  card,
  setCard,
}: {
  card: SecondaryHeroCard;
  setCard: (card: SecondaryHeroCard) => void;
}) {
  const [face, setFace] = useState<Face>("front");
  const [showPortraitModal, setShowPortraitModal] = useState(false);

  const side = card[face];
  const setSide = (changes: Partial<SecondaryHeroSide>) =>
    setCard({ ...card, [face]: { ...side, ...changes } });

  return (
    <Form>
      <Tabs
        activeKey={face}
        onSelect={(key) => setFace((key as Face) ?? "front")}
        className="mb-3"
        fill
      >
        {FACES.map(({ key, label }) => (
          <Tab key={key} eventKey={key} title={label} />
        ))}
      </Tabs>

      <Row className="mb-3">
        <Col xs={12} md={6}>
          <Form.Group controlId="secondaryHeroName">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter hero name"
              value={side.name}
              onChange={(e) => setSide({ name: e.target.value })}
            />
          </Form.Group>
        </Col>
        <Col xs={6} md={3}>
          <Form.Group controlId="secondaryHeroTown">
            <Form.Label>Town</Form.Label>
            <Form.Select
              value={side.town}
              onChange={(e) => setSide({ town: e.target.value as TownType })}
            >
              {Object.values(TownType).map((town) => (
                <option key={town} value={town}>
                  {town}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
        <Col xs={6} md={3}>
          <Form.Group controlId="secondaryHeroType">
            <Form.Label>Type</Form.Label>
            <Form.Select
              value={side.type}
              onChange={(e) => setSide({ type: e.target.value as HeroType })}
            >
              {Object.values(HeroType).map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>

      <Row className="mb-3">
        {STATS.map(({ key, label }) => (
          <Col xs={6} md={3} key={key}>
            <Form.Group controlId={`secondaryHeroStat-${key}`}>
              <Form.Label>{label}</Form.Label>
              <Form.Control
                type="number"
                value={side.statistics[key]}
                onChange={(e) =>
                  setSide({
                    statistics: {
                      ...side.statistics,
                      [key]: Math.floor(Number(e.target.value)) || 0,
                    },
                  })
                }
              />
            </Form.Group>
          </Col>
        ))}
      </Row>

      <Row className="mb-3">
        <Col xs={12} md={6}>
          <Form.Group controlId="secondaryHeroColouredStats">
            <Form.Check
              type="switch"
              label="Colour the stat panels"
              checked={side.colouredStatPanels === true}
              onChange={(e) =>
                setSide({ colouredStatPanels: e.target.checked || undefined })
              }
            />
            <Form.Text muted>
              Off they stay brown, as on a hero board; on they follow the town.
            </Form.Text>
          </Form.Group>
        </Col>

        <Col xs={12} md={6}>
          <Form.Group controlId="secondaryHeroCustomPanels">
            <Form.Check
              type="switch"
              label="Custom panel colour"
              checked={side.backgroundColor !== undefined}
              onChange={(e) =>
                setSide({
                  backgroundColor: e.target.checked
                    ? (townColors[side.town].background ??
                      townColors[side.town].color)
                    : undefined,
                })
              }
            />
            {side.backgroundColor !== undefined ? (
              <Form.Control
                type="color"
                className="w-100 mt-1"
                value={side.backgroundColor}
                onChange={(e) => setSide({ backgroundColor: e.target.value })}
                title={side.backgroundColor}
              />
            ) : (
              <Form.Text muted>Defaults to {defaultPanelColor}.</Form.Text>
            )}
          </Form.Group>
        </Col>
      </Row>

      <div className="mb-3">
        <Button
          variant="outline-secondary"
          className="w-100"
          onClick={() => setShowPortraitModal(true)}
        >
          Replace portrait
        </Button>
        <ReplaceEntityModal
          title="portrait"
          show={showPortraitModal}
          onHide={() => setShowPortraitModal(false)}
          entityList={portraits}
          onSelect={(portrait: Portrait) => setSide({ portrait })}
          hideName
        />
      </div>

      <Form.Group className="mb-3" controlId={effectsFieldId(face)}>
        <Form.Label>Effects</Form.Label>
        <Form.Control
          as="textarea"
          rows={6}
          placeholder="Enter the hero's effects"
          value={side.effects}
          onChange={(e) => setSide({ effects: e.target.value })}
        />
        <Form.Text muted>
          Mark each level with :level1:, :level3: or :level5:. They are kept off
          the icons below because they belong to this card rather than to every
          card&apos;s text.
        </Form.Text>
      </Form.Group>

      <IconPalette
        targets={[
          {
            id: effectsFieldId(face),
            value: side.effects,
            setValue: (value: string) => setSide({ effects: value }),
          },
        ]}
      />
    </Form>
  );
}
