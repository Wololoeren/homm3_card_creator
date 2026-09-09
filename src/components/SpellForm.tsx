"use client";

import {
  SpellCard,
  SpellIcon,
  spellIcons,
  SpellTier,
  SpellSchool,
} from "@/models/spellCard";
import { useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import ReplaceEntityModal from "./ReplaceEntityModal";
import IconPalette from "./IconPalette";

export default function SpellForm({
  spell,
  setSpell,
}: {
  spell: SpellCard;
  setSpell: (spell: SpellCard) => void;
}) {
  const [showIconModal, setShowIconModal] = useState<boolean>(false);

  const setName = (name: string) => setSpell({ ...spell, name });
  const setIcon = (icon: SpellIcon) => setSpell({ ...spell, icon });
  const setEffect = (effect: string) => setSpell({ ...spell, effect });
  const setTier = (tier: SpellTier) => setSpell({ ...spell, tier });
  const setSchool = (school: SpellSchool) => setSpell({ ...spell, school });

  return (
    <Form>
      <Form.Group controlId="spellNameInput" className="mb-3">
        <Form.Label>Name</Form.Label>
        <Form.Control
          type="text"
          value={spell.name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter spell name"
        />
      </Form.Group>

      <Row className="mb-3">
        <Col xs={6}>
          <Form.Group controlId="spellTierSelect">
            <Form.Label>Tier</Form.Label>
            <Form.Select
              value={spell.tier}
              onChange={(e) => setTier(e.target.value as SpellTier)}
            >
              {Object.values(SpellTier).map((tier) => (
                <option key={tier} value={tier}>
                  {tier}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
        <Col xs={6}>
          <Form.Group controlId="spellSchoolSelect">
            <Form.Label>School</Form.Label>
            <Form.Select
              value={spell.school}
              disabled={spell.tier === SpellTier.Any}
              onChange={(e) => setSchool(e.target.value as SpellSchool)}
            >
              {Object.values(SpellSchool).map((school) => (
                <option key={school} value={school}>
                  {school}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>

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
            entityList={spellIcons}
            onSelect={(icon) => setIcon(icon)}
            hideName
          />
        </Col>
      </Row>

      <Form.Group className="mb-3" controlId="spellEffectContent">
        <Form.Label>Effect</Form.Label>
        <Form.Control
          as="textarea"
          rows={6}
          placeholder="Enter spell effect"
          value={spell.effect}
          onChange={(e) => setEffect(e.target.value)}
        />
        <Form.Text muted>
          Use :spell{"{{0;1;2};{effect0;effect1;effect2}}"}: for the
          power-scaled effect table. Use :scale
          {"{{:gold:};{0;1;2};{1;2;3};{:valuable:}}"}: for the same table with
          both icons chosen.
        </Form.Text>
      </Form.Group>

      <IconPalette
        targets={[
          {
            id: "spellEffectContent",
            value: spell.effect,
            setValue: setEffect,
          },
        ]}
      />
    </Form>
  );
}
