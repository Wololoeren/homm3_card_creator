"use client";

import {
  ArtifactCard,
  ArtifactIcon,
  ArtifactRarity,
  artifactIcons,
} from "@/models/artifactCard";
import { useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import ReplaceEntityModal from "./ReplaceEntityModal";
import IconPalette from "./IconPalette";

export default function ArtifactForm({
  artifact,
  setArtifact,
}: {
  artifact: ArtifactCard;
  setArtifact: (artifact: ArtifactCard) => void;
}) {
  const [showIconModal, setShowIconModal] = useState<boolean>(false);

  const setName = (name: string) => setArtifact({ ...artifact, name });
  const setRarity = (rarity: ArtifactRarity) =>
    setArtifact({ ...artifact, rarity });
  const setIcon = (icon: ArtifactIcon) => setArtifact({ ...artifact, icon });
  const setEffect = (effect: string) => setArtifact({ ...artifact, effect });
  const setFlavorText = (flavorText: string) =>
    setArtifact({ ...artifact, flavorText });

  return (
    <Form>
      <Form.Group controlId="artifactNameInput" className="mb-3">
        <Form.Label>Name</Form.Label>
        <Form.Control
          type="text"
          value={artifact.name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter artifact name"
        />
      </Form.Group>

      <Form.Group controlId="artifactRaritySelect" className="mb-3">
        <Form.Label>Rarity</Form.Label>
        <Form.Select
          value={artifact.rarity}
          onChange={(e) => setRarity(e.target.value as ArtifactRarity)}
        >
          {Object.values(ArtifactRarity).map((rarity) => (
            <option key={rarity} value={rarity}>
              {rarity}
            </option>
          ))}
        </Form.Select>
      </Form.Group>

      <Row className="my-3 text-center g-2">
        <Col xs={12}>
          <Button
            variant="outline-secondary"
            className="w-100"
            onClick={() => setShowIconModal(true)}
          >
            Replace icon
          </Button>
          <ReplaceEntityModal
            title="icon"
            show={showIconModal}
            onHide={() => setShowIconModal(false)}
            entityList={artifactIcons}
            onSelect={(icon) => setIcon(icon)}
            hideName
          />
        </Col>
      </Row>

      <Form.Group className="mb-3" controlId="artifactEffectContent">
        <Form.Label>Effect</Form.Label>
        <Form.Control
          as="textarea"
          rows={5}
          placeholder="Enter artifact effect"
          value={artifact.effect}
          onChange={(e) => setEffect(e.target.value)}
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="artifactFlavorTextContent">
        <Form.Label>Flavor text</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          placeholder="Enter flavor text"
          value={artifact.flavorText}
          onChange={(e) => setFlavorText(e.target.value)}
        />
      </Form.Group>

      <IconPalette
        targets={[
          {
            id: "artifactEffectContent",
            value: artifact.effect,
            setValue: setEffect,
          },
          {
            id: "artifactFlavorTextContent",
            value: artifact.flavorText,
            setValue: setFlavorText,
          },
        ]}
      />
    </Form>
  );
}
