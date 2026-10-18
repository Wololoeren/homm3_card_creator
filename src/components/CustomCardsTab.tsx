"use client";

import { useState } from "react";
import { Form } from "react-bootstrap";
import clsx from "clsx";

import SecondaryHeroEditor from "./SecondaryHeroEditor";
import styles from "./CustomCardsTab.module.css";

/**
 * The fan-made card types, which live behind one tab rather than widening the
 * tab bar further. Adding a type is an entry here and its editor.
 */
const CUSTOM_CARD_TYPES = [
  {
    key: "secondaryHero",
    label: "Secondary Hero",
    Editor: SecondaryHeroEditor,
  },
] as const;

type CustomCardKey = (typeof CUSTOM_CARD_TYPES)[number]["key"];

export default function CustomCardsTab() {
  const [key, setKey] = useState<CustomCardKey>(CUSTOM_CARD_TYPES[0].key);

  const active =
    CUSTOM_CARD_TYPES.find((type) => type.key === key) ?? CUSTOM_CARD_TYPES[0];
  const Editor = active.Editor;

  return (
    <>
      <div className={clsx("d-print-none", styles.picker)}>
        <Form.Group controlId="customCardType">
          <Form.Label>Card type</Form.Label>
          <Form.Select
            value={key}
            onChange={(e) => setKey(e.target.value as CustomCardKey)}
          >
            {CUSTOM_CARD_TYPES.map((type) => (
              <option key={type.key} value={type.key}>
                {type.label}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
      </div>
      <Editor />
    </>
  );
}
