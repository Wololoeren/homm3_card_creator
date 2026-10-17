"use client";

import {
  Unit,
  UnitPortrait,
  UnitStatistics,
  UnitTier,
  UnitType,
  unitPortraits,
} from "@/models/unit";
import { useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import ReplaceEntityModal from "./ReplaceEntityModal";
import IconPalette from "./IconPalette";

export default function UnitForm({
  unit,
  setUnit,
}: {
  unit: Unit;
  setUnit: (unit: Unit) => void;
}) {
  const [showPortraitModal, setShowPortraitModal] = useState<boolean>(false);

  const setName = (name: string) => setUnit({ ...unit, name });
  const setType = (type: UnitType) => setUnit({ ...unit, type });
  const setTier = (tier: UnitTier) => setUnit({ ...unit, tier });
  const setPortrait = (portrait: UnitPortrait) =>
    setUnit({ ...unit, portrait });
  const setSpecialty = (specialty: string) => setUnit({ ...unit, specialty });

  const setStatistic = (key: keyof UnitStatistics, value: number) =>
    setUnit({ ...unit, statistics: { ...unit.statistics, [key]: value } });

  return (
    <Form>
      <Form.Group controlId="unitNameInput" className="mb-3">
        <Form.Label>Name</Form.Label>
        <Form.Control
          type="text"
          value={unit.name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter unit name"
        />
      </Form.Group>

      <Row className="mb-3">
        <Col>
          <Form.Group controlId="unitTypeSelect">
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
        </Col>

        <Col>
          <Form.Group controlId="unitTierSelect">
            <Form.Label>Tier</Form.Label>
            <Form.Select
              value={unit.tier}
              onChange={(e) => setTier(e.target.value as UnitTier)}
            >
              <option value={UnitTier.Bronze}>Bronze</option>
              <option value={UnitTier.Silver}>Silver</option>
              <option value={UnitTier.Golden}>Golden</option>
              <option value={UnitTier.Azure}>Azure</option>
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>

      <Form.Group controlId="unitStats" className="mb-3">
        <Form.Label>Statistics</Form.Label>
        <Row className="g-2">
          <Col xs={4} sm>
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
          <Col xs={4} sm>
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
          <Col xs={4} sm>
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
          <Col xs={6} sm>
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
          <Col xs={6} sm>
            <Form.Label className="small text-muted mb-0">Price</Form.Label>
            <Form.Control
              type="number"
              min={0}
              value={unit.statistics.price}
              onChange={(e) =>
                setStatistic("price", Number(e.currentTarget.value))
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
            entityList={unitPortraits}
            onSelect={(portrait) => setPortrait(portrait)}
            hideName
          />
        </Col>
      </Row>

      <Form.Group className="mb-3" controlId="unitSpecialtyContent">
        <Form.Label>Unit Speciality</Form.Label>
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
            id: "unitSpecialtyContent",
            value: unit.specialty,
            setValue: setSpecialty,
          },
        ]}
      />
    </Form>
  );
}
