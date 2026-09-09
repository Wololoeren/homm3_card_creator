"use client";

import { MoraleCard, MoraleType } from "@/models/moraleCard";
import { Form } from "react-bootstrap";
import IconPalette from "./IconPalette";

export default function MoraleForm({
  morale,
  setMorale,
}: {
  morale: MoraleCard;
  setMorale: (morale: MoraleCard) => void;
}) {
  const setType = (type: MoraleType) => setMorale({ ...morale, type });
  const setEffect = (effect: string) => setMorale({ ...morale, effect });

  return (
    <Form>
      <Form.Group controlId="moraleTypeSelect" className="mb-3">
        <Form.Label>Type</Form.Label>
        <Form.Select
          value={morale.type}
          onChange={(e) => setType(e.target.value as MoraleType)}
        >
          {Object.values(MoraleType).map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </Form.Select>
      </Form.Group>

      <Form.Group className="mb-3" controlId="moraleEffectContent">
        <Form.Label>Effect</Form.Label>
        <Form.Control
          as="textarea"
          rows={4}
          placeholder="Enter morale effect"
          value={morale.effect}
          onChange={(e) => setEffect(e.target.value)}
        />
      </Form.Group>

      <IconPalette
        targets={[
          {
            id: "moraleEffectContent",
            value: morale.effect,
            setValue: setEffect,
          },
        ]}
      />
    </Form>
  );
}
