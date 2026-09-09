"use client";

import { PandoraCard, defaultPandoraName } from "@/models/pandoraCard";
import { Form } from "react-bootstrap";
import IconPalette from "./IconPalette";

export default function PandoraForm({
  pandora,
  setPandora,
}: {
  pandora: PandoraCard;
  setPandora: (pandora: PandoraCard) => void;
}) {
  const setName = (name: string) => setPandora({ ...pandora, name });
  const setEffect = (effect: string) => setPandora({ ...pandora, effect });

  return (
    <Form>
      <Form.Group className="mb-3" controlId="pandoraName">
        <Form.Label>Name</Form.Label>
        <Form.Control
          type="text"
          placeholder={defaultPandoraName}
          value={pandora.name ?? ""}
          onChange={(e) => setName(e.target.value)}
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="pandoraEffectContent">
        <Form.Label>Effect</Form.Label>
        <Form.Control
          as="textarea"
          rows={6}
          placeholder="Enter Pandora's Box effect"
          value={pandora.effect}
          onChange={(e) => setEffect(e.target.value)}
        />
      </Form.Group>

      <IconPalette
        targets={[
          {
            id: "pandoraEffectContent",
            value: pandora.effect,
            setValue: setEffect,
          },
        ]}
      />
    </Form>
  );
}
