"use client";

import { AbilityCard, AbilityIcon, abilityIcons } from "@/models/abilityCard";
import { useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import ReplaceEntityModal from "./ReplaceEntityModal";
import IconPalette from "./IconPalette";

export default function AbilityForm({
  ability,
  setAbility,
}: {
  ability: AbilityCard;
  setAbility: (ability: AbilityCard) => void;
}) {
  const [showIconModal, setShowIconModal] = useState<boolean>(false);

  const setName = (name: string) => setAbility({ ...ability, name });
  const setIcon = (icon: AbilityIcon) => setAbility({ ...ability, icon });
  const setRegularEffect = (regularEffect: string) =>
    setAbility({ ...ability, regularEffect });
  const setExpertEffect = (expertEffect: string) =>
    setAbility({ ...ability, expertEffect });
  const setEmpowered = (empowered: boolean) =>
    setAbility({ ...ability, empowered });

  return (
    <Form>
      <Form.Group controlId="abilityNameInput" className="mb-3">
        <Form.Label>Name</Form.Label>
        <Form.Control
          type="text"
          value={ability.name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter ability name"
        />
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
            entityList={abilityIcons}
            onSelect={(icon) => setIcon(icon)}
            hideName
          />
        </Col>
      </Row>

      <Form.Group className="mb-3" controlId="abilityEmpoweredSwitch">
        <Form.Check
          type="switch"
          label="Empowered"
          checked={ability.empowered}
          onChange={(e) => setEmpowered(e.target.checked)}
        />
        <Form.Text muted>
          Empowered cards show only the Expert effect, with an
          &quot;Empowered&quot; label under the name.
        </Form.Text>
      </Form.Group>

      {!ability.empowered ? (
        <Form.Group className="mb-3" controlId="abilityRegularEffectContent">
          <Form.Label>Regular Effect</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Enter regular effect"
            value={ability.regularEffect}
            onChange={(e) => setRegularEffect(e.target.value)}
          />
        </Form.Group>
      ) : null}

      <Form.Group className="mb-3" controlId="abilityExpertEffectContent">
        <Form.Label>
          {ability.empowered ? "Effect" : "Expert Effect"}
        </Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          placeholder="Enter expert effect"
          value={ability.expertEffect}
          onChange={(e) => setExpertEffect(e.target.value)}
        />
      </Form.Group>

      <IconPalette
        targets={[
          // The regular effect is only on the form while it is printed.
          ...(ability.empowered
            ? []
            : [
                {
                  id: "abilityRegularEffectContent",
                  value: ability.regularEffect,
                  setValue: setRegularEffect,
                },
              ]),
          {
            id: "abilityExpertEffectContent",
            value: ability.expertEffect,
            setValue: setExpertEffect,
          },
        ]}
      />
    </Form>
  );
}
