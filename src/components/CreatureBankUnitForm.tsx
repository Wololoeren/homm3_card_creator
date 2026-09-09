"use client";

import {
  CreatureBankUnit,
  CreatureBankPortrait,
  CreatureBankStatistics,
  creatureBankPortraits,
} from "@/models/creatureBankUnit";
import { UnitType } from "@/models/unit";
import { useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import ReplaceEntityModal from "./ReplaceEntityModal";
import IconPalette from "./IconPalette";

export default function CreatureBankUnitForm({
  unit,
  setUnit,
}: {
  unit: CreatureBankUnit;
  setUnit: (unit: CreatureBankUnit) => void;
}) {
  const [showPortraitModal, setShowPortraitModal] = useState<boolean>(false);

  const setName = (name: string) => setUnit({ ...unit, name });
  const setBankName = (bankName: string) => setUnit({ ...unit, bankName });
  const setType = (type: UnitType) => setUnit({ ...unit, type });
  const setPortrait = (portrait: CreatureBankPortrait) =>
    setUnit({ ...unit, portrait });
  const setSpecialty = (specialty: string) => setUnit({ ...unit, specialty });

  const setStatistic = (key: keyof CreatureBankStatistics, value: number) =>
    setUnit({ ...unit, statistics: { ...unit.statistics, [key]: value } });

  return (
    <Form>
      <Form.Group controlId="creatureBankUnitNameInput" className="mb-3">
        <Form.Label>Unit Name</Form.Label>
        <Form.Control
          type="text"
          value={unit.name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter unit name"
        />
      </Form.Group>

      <Form.Group controlId="creatureBankNameInput" className="mb-3">
        <Form.Label>Bank Name</Form.Label>
        <Form.Control
          type="text"
          value={unit.bankName}
          onChange={(e) => setBankName(e.target.value)}
          placeholder="Enter creature bank name"
        />
      </Form.Group>

      <Form.Group controlId="creatureBankUnitTypeSelect" className="mb-3">
        <Form.Label>Type</Form.Label>
        <Form.Select
          value={unit.type}
          onChange={(e) => setType(e.target.value as UnitType)}
        >
          <option value={UnitType.Melee}>Melee</option>
          <option value={UnitType.Flying}>Flying</option>
          <option value={UnitType.Ranged}>Ranged</option>
        </Form.Select>
      </Form.Group>

      <Form.Group controlId="creatureBankUnitStats" className="mb-3">
        <Form.Label>Statistics</Form.Label>
        <Row className="g-2">
          <Col xs={3}>
            <Form.Label className="small text-muted mb-0">Attack</Form.Label>
            <Form.Control
              type="number"
              min={0}
              value={unit.statistics.attack}
              onChange={(e) =>
                setStatistic("attack", Number(e.currentTarget.value))
              }
            />
          </Col>
          <Col xs={3}>
            <Form.Label className="small text-muted mb-0">Defense</Form.Label>
            <Form.Control
              type="number"
              min={0}
              value={unit.statistics.defense}
              onChange={(e) =>
                setStatistic("defense", Number(e.currentTarget.value))
              }
            />
          </Col>
          <Col xs={3}>
            <Form.Label className="small text-muted mb-0">Health</Form.Label>
            <Form.Control
              type="number"
              min={0}
              value={unit.statistics.health}
              onChange={(e) =>
                setStatistic("health", Number(e.currentTarget.value))
              }
            />
          </Col>
          <Col xs={3}>
            <Form.Label className="small text-muted mb-0">
              Initiative
            </Form.Label>
            <Form.Control
              type="number"
              min={0}
              value={unit.statistics.initiative}
              onChange={(e) =>
                setStatistic("initiative", Number(e.currentTarget.value))
              }
            />
          </Col>
        </Row>
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
            entityList={creatureBankPortraits}
            onSelect={(portrait) => setPortrait(portrait)}
            hideName
          />
        </Col>
      </Row>

      <Form.Group className="mb-3" controlId="creatureBankUnitSpecialtyContent">
        <Form.Label>Specialty</Form.Label>
        <Form.Control
          as="textarea"
          rows={4}
          placeholder="Enter unit speciality"
          value={unit.specialty}
          onChange={(e) => setSpecialty(e.target.value)}
        />
      </Form.Group>

      <IconPalette
        targets={[
          {
            id: "creatureBankUnitSpecialtyContent",
            value: unit.specialty,
            setValue: setSpecialty,
          },
        ]}
      />
    </Form>
  );
}
