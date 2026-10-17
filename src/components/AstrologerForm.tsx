"use client";

import { AstrologerCard } from "@/models/astrologerCard";
import { Form } from "react-bootstrap";
import IconPalette from "./IconPalette";

export default function AstrologerForm({
  astrologer,
  setAstrologer,
}: {
  astrologer: AstrologerCard;
  setAstrologer: (astrologer: AstrologerCard) => void;
}) {
  const setName = (name: string) => setAstrologer({ ...astrologer, name });
  const setEffect = (effect: string) =>
    setAstrologer({ ...astrologer, effect });
  const setFlavorText = (flavorText: string) =>
    setAstrologer({ ...astrologer, flavorText });

  return (
    <Form>
      <Form.Group controlId="astrologerNameInput" className="mb-3">
        <Form.Label>Name</Form.Label>
        <Form.Control
          type="text"
          value={astrologer.name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter astrologer card name"
        />
        <Form.Text muted>
          Shown as &quot;Astrologers proclaim week of the{" "}
          {astrologer.name || "..."}&quot;.
        </Form.Text>
      </Form.Group>

      <Form.Group className="mb-3" controlId="astrologerEffectContent">
        <Form.Label>Effect</Form.Label>
        <Form.Control
          as="textarea"
          rows={5}
          placeholder="Enter astrologer effect"
          value={astrologer.effect}
          onChange={(e) => setEffect(e.target.value)}
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="astrologerFlavorTextContent">
        <Form.Label>Flavor text</Form.Label>
        <Form.Control
          as="textarea"
          rows={4}
          placeholder="Enter flavor text"
          value={astrologer.flavorText}
          onChange={(e) => setFlavorText(e.target.value)}
        />
      </Form.Group>

      <IconPalette
        targets={[
          {
            id: "astrologerEffectContent",
            value: astrologer.effect,
            setValue: setEffect,
          },
          {
            id: "astrologerFlavorTextContent",
            value: astrologer.flavorText,
            setValue: setFlavorText,
          },
        ]}
      />
    </Form>
  );
}
