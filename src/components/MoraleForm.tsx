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

      <Form.Group className="mb-3" controlId="moraleCustomTitle">
        <Form.Check
          type="switch"
          label="Custom title"
          checked={morale.title !== undefined}
          onChange={(e) =>
            setMorale({
              ...morale,
              title: e.target.checked ? `${morale.type} Morale` : undefined,
            })
          }
        />
        {morale.title === undefined ? (
          <Form.Text muted>
            Off, the card keeps the title printed in its own art.
          </Form.Text>
        ) : (
          <>
            <Form.Control
              type="text"
              className="mt-1"
              value={morale.title}
              placeholder={`${morale.type} Morale`}
              aria-label="Morale card title"
              onChange={(e) => setMorale({ ...morale, title: e.target.value })}
            />
            <Form.Text muted>
              Set over an empty plaque, in place of the art&apos;s own title.
            </Form.Text>
          </>
        )}
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
