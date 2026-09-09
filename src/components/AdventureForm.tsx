"use client";

import {
  AdventureCard,
  AdventureCardType,
  AdventurePortrait,
  adventurePortraits,
} from "@/models/adventureCard";
import { useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import ReplaceEntityModal from "./ReplaceEntityModal";
import IconPalette from "./IconPalette";

export default function AdventureForm({
  adventure,
  setAdventure,
}: {
  adventure: AdventureCard;
  setAdventure: (adventure: AdventureCard) => void;
}) {
  const [showPortraitModal, setShowPortraitModal] = useState<boolean>(false);

  const setName = (name: string) => setAdventure({ ...adventure, name });
  const setType = (type: AdventureCardType) =>
    setAdventure({ ...adventure, type });
  const setPortrait = (portrait: AdventurePortrait) =>
    setAdventure({ ...adventure, portrait });
  const setEffect = (effect: string) => setAdventure({ ...adventure, effect });

  return (
    <Form>
      <Form.Group controlId="adventureNameInput" className="mb-3">
        <Form.Label>Name</Form.Label>
        <Form.Control
          type="text"
          value={adventure.name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter adventure card name"
        />
      </Form.Group>

      <Form.Group controlId="adventureTypeSelect" className="mb-3">
        <Form.Label>Type</Form.Label>
        <Form.Select
          value={adventure.type}
          onChange={(e) => setType(e.target.value as AdventureCardType)}
        >
          {Object.values(AdventureCardType).map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </Form.Select>
      </Form.Group>

      <Row className="my-3 text-center g-2">
        <Col xs={12}>
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
            entityList={adventurePortraits}
            onSelect={(portrait) => setPortrait(portrait)}
            hideName
          />
        </Col>
      </Row>

      <Form.Group className="mb-3" controlId="adventureEffectContent">
        <Form.Label>Effect</Form.Label>
        <Form.Control
          as="textarea"
          rows={5}
          placeholder="Enter adventure effect"
          value={adventure.effect}
          onChange={(e) => setEffect(e.target.value)}
        />
        <Form.Text muted>
          Use :spell{"{{6;8;10};{effect0;effect1;effect2}}"}: for a Combat
          card&apos;s power-scaled reward table.
        </Form.Text>
      </Form.Group>

      <IconPalette
        targets={[
          {
            id: "adventureEffectContent",
            value: adventure.effect,
            setValue: setEffect,
          },
        ]}
      />
    </Form>
  );
}
