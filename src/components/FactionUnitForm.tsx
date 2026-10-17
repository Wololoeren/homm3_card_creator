"use client";

import {
  DEFAULT_BACK_REINFORCEMENT_TEXT,
  DEFAULT_FRONT_REINFORCEMENT_TEXT,
  FactionUnit,
  FactionUnitStats,
  PriceGlyph,
  ResourceCost,
} from "@/models/factionUnit";
import { UnitPortrait, UnitTier, UnitType, unitPortraits } from "@/models/unit";
import { TownType } from "@/models/town";
import { townColors } from "@/models/color";
import { useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import ReplaceEntityModal from "./ReplaceEntityModal";
import IconPalette from "./IconPalette";

export default function FactionUnitForm({
  unit,
  setUnit,
}: {
  unit: FactionUnit;
  setUnit: (unit: FactionUnit) => void;
}) {
  const [showPortraitModal, setShowPortraitModal] = useState<boolean>(false);
  const [showBackPortraitModal, setShowBackPortraitModal] =
    useState<boolean>(false);

  const setName = (name: string) => setUnit({ ...unit, name });
  const setTown = (town: TownType) => setUnit({ ...unit, town });
  const setTier = (tier: UnitTier) => setUnit({ ...unit, tier });
  const townColor = townColors[unit.town];
  // The panel colour used before custom colours existed.
  const defaultPanelColor = "#5b3e1f";
  // Border and panels toggle independently. Each seeds from its own default
  // when switched on, so flipping a switch changes nothing until a colour is
  // moved: the border from the town, the panels from their original brown.
  const toggleBorderColor = (on: boolean) =>
    setUnit({ ...unit, borderColor: on ? townColor.color : undefined });
  const toggleBackgroundColor = (on: boolean) =>
    setUnit({
      ...unit,
      backgroundColor: on ? defaultPanelColor : undefined,
    });
  const setPortrait = (portrait: UnitPortrait) =>
    setUnit({ ...unit, portrait });
  const setFewSpecialty = (fewSpecialty: string) =>
    setUnit({ ...unit, fewSpecialty });
  const setPackSpecialty = (packSpecialty: string) =>
    setUnit({ ...unit, packSpecialty });

  type NumericStatKey = Exclude<keyof FactionUnitStats, "type">;

  const setFewStat = (key: NumericStatKey, value: number) =>
    setUnit({ ...unit, few: { ...unit.few, [key]: value } });
  const setPackStat = (key: NumericStatKey, value: number) =>
    setUnit({ ...unit, pack: { ...unit.pack, [key]: value } });

  const setFewType = (type: UnitType) =>
    setUnit({ ...unit, few: { ...unit.few, type } });
  const setPackType = (type: UnitType) =>
    setUnit({ ...unit, pack: { ...unit.pack, type } });

  const setRecruitCost = (key: keyof ResourceCost, value: number) =>
    setUnit({ ...unit, recruitCost: { ...unit.recruitCost, [key]: value } });
  const setReinforceCost = (key: keyof ResourceCost, value: number) =>
    setUnit({
      ...unit,
      reinforceCost: { ...unit.reinforceCost, [key]: value },
    });

  // The card falls back to the defaults on its own, so these toggles only have
  // to flip the flag; anything already set survives switching off and back on.
  const toggleMoreReinforcements = (on: boolean) =>
    setUnit({ ...unit, moreReinforcements: on });
  const toggleSeparateBackFace = (on: boolean) =>
    setUnit({ ...unit, separateBackFace: on });

  return (
    // px-2 absorbs the negative margin Bootstrap puts on a Row; without a
    // container to cancel against, the top-level rows overflow the form.
    <Form className="px-2">
      <Row className="g-2 mb-3">
        <Col md={6}>
          <Form.Group controlId="factionUnitNameInput">
            <Form.Label>
              {unit.separateBackFace ? "Name — Front" : "Name"}
            </Form.Label>
            <Form.Control
              type="text"
              value={unit.name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter unit name"
            />
          </Form.Group>
        </Col>

        <Col md={3}>
          <Form.Group controlId="factionUnitTownSelect">
            <Form.Label>Town</Form.Label>
            <Form.Select
              value={unit.town}
              onChange={(e) => setTown(e.target.value as TownType)}
            >
              {Object.values(TownType).map((town) => (
                <option key={town} value={town}>
                  {town}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>

        <Col md={3}>
          <Form.Group controlId="factionUnitTierSelect">
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

      <Row className="g-2 mb-3">
        <Col md={6}>
          <Form.Group controlId="factionUnitCustomBorder">
            <Form.Check
              type="switch"
              label="Custom border colour"
              checked={unit.borderColor !== undefined}
              onChange={(e) => toggleBorderColor(e.target.checked)}
            />
            {unit.borderColor !== undefined ? (
              <Form.Control
                type="color"
                className="w-100 mt-1"
                value={unit.borderColor}
                onChange={(e) =>
                  setUnit({ ...unit, borderColor: e.target.value })
                }
                title={unit.borderColor}
              />
            ) : (
              <Form.Text muted>
                Follows {unit.town}, {townColor.color}.
              </Form.Text>
            )}
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group controlId="factionUnitCustomPanels">
            <Form.Check
              type="switch"
              label="Custom panel colour"
              checked={unit.backgroundColor !== undefined}
              onChange={(e) => toggleBackgroundColor(e.target.checked)}
            />
            {unit.backgroundColor !== undefined ? (
              <Form.Control
                type="color"
                className="w-100 mt-1"
                value={unit.backgroundColor}
                onChange={(e) =>
                  setUnit({ ...unit, backgroundColor: e.target.value })
                }
                title={unit.backgroundColor}
              />
            ) : (
              <Form.Text muted>Defaults to {defaultPanelColor}.</Form.Text>
            )}
          </Form.Group>
        </Col>
      </Row>

      <Row className="g-2 mb-3">
        <Col md={12}>
          <Form.Group controlId="factionUnitMoreReinforcements">
            <Form.Check
              type="switch"
              label="More Reinforcements"
              checked={!!unit.moreReinforcements}
              onChange={(e) => toggleMoreReinforcements(e.target.checked)}
            />
            <Form.Text muted>
              Gives the back the same two-box row as the front: a price box —
              front from the recruitment cost, back from the reinforcement cost,
              each with a choice of glyph — beside a free-text reinforcement
              box.
            </Form.Text>
          </Form.Group>
        </Col>
      </Row>

      <Row className="g-3 mb-3">
        <Col md={6}>
          <Form.Group>
            <Form.Label>Statistics — Few</Form.Label>
            <Row className="g-2 mb-2">
              <Col xs={12} sm={4}>
                <Form.Label className="small text-muted mb-0">Type</Form.Label>
                <Form.Select
                  value={unit.few.type}
                  onChange={(e) => setFewType(e.target.value as UnitType)}
                >
                  <option value={UnitType.Melee}>Melee</option>
                  <option value={UnitType.Flying}>Flying</option>
                  <option value={UnitType.Ranged}>Ranged</option>
                </Form.Select>
              </Col>
            </Row>
            <Row className="g-2">
              <Col xs={3}>
                <Form.Label className="small text-muted mb-0">
                  Attack
                </Form.Label>
                <Form.Control
                  type="number"
                  min={0}
                  value={unit.few.attack}
                  onChange={(e) =>
                    setFewStat("attack", Number(e.currentTarget.value))
                  }
                />
              </Col>
              <Col xs={3}>
                <Form.Label className="small text-muted mb-0">
                  Defense
                </Form.Label>
                <Form.Control
                  type="number"
                  min={0}
                  value={unit.few.defense}
                  onChange={(e) =>
                    setFewStat("defense", Number(e.currentTarget.value))
                  }
                />
              </Col>
              <Col xs={3}>
                <Form.Label className="small text-muted mb-0">
                  Health
                </Form.Label>
                <Form.Control
                  type="number"
                  min={0}
                  value={unit.few.health}
                  onChange={(e) =>
                    setFewStat("health", Number(e.currentTarget.value))
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
                  value={unit.few.initiative}
                  onChange={(e) =>
                    setFewStat("initiative", Number(e.currentTarget.value))
                  }
                />
              </Col>
            </Row>
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group>
            <Form.Label>Statistics — Pack</Form.Label>
            <Row className="g-2 mb-2">
              <Col xs={12} sm={4}>
                <Form.Label className="small text-muted mb-0">Type</Form.Label>
                <Form.Select
                  value={unit.pack.type}
                  onChange={(e) => setPackType(e.target.value as UnitType)}
                >
                  <option value={UnitType.Melee}>Melee</option>
                  <option value={UnitType.Flying}>Flying</option>
                  <option value={UnitType.Ranged}>Ranged</option>
                </Form.Select>
              </Col>
            </Row>
            <Row className="g-2">
              <Col xs={3}>
                <Form.Label className="small text-muted mb-0">
                  Attack
                </Form.Label>
                <Form.Control
                  type="number"
                  min={0}
                  value={unit.pack.attack}
                  onChange={(e) =>
                    setPackStat("attack", Number(e.currentTarget.value))
                  }
                />
              </Col>
              <Col xs={3}>
                <Form.Label className="small text-muted mb-0">
                  Defense
                </Form.Label>
                <Form.Control
                  type="number"
                  min={0}
                  value={unit.pack.defense}
                  onChange={(e) =>
                    setPackStat("defense", Number(e.currentTarget.value))
                  }
                />
              </Col>
              <Col xs={3}>
                <Form.Label className="small text-muted mb-0">
                  Health
                </Form.Label>
                <Form.Control
                  type="number"
                  min={0}
                  value={unit.pack.health}
                  onChange={(e) =>
                    setPackStat("health", Number(e.currentTarget.value))
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
                  value={unit.pack.initiative}
                  onChange={(e) =>
                    setPackStat("initiative", Number(e.currentTarget.value))
                  }
                />
              </Col>
            </Row>
          </Form.Group>
        </Col>
      </Row>

      {/* Front and back price boxes. In More Reinforcements format each gets
          a glyph of the author's choosing; the front prices from the recruit
          cost and the back from the reinforce cost. */}
      <Row className="g-3 mb-3">
        <Col md={6}>
          <Form.Group>
            <Form.Label>
              {unit.moreReinforcements
                ? "Price — Front (recruitment)"
                : "Recruitment Cost"}
            </Form.Label>
            {unit.moreReinforcements ? (
              <Form.Check
                type="switch"
                className="mb-1"
                label={
                  (unit.frontPriceGlyph ?? PriceGlyph.Pay) === PriceGlyph.Pay
                    ? "Pay glyph"
                    : "Reinforcement glyph"
                }
                checked={
                  (unit.frontPriceGlyph ?? PriceGlyph.Pay) === PriceGlyph.Pay
                }
                onChange={(e) =>
                  setUnit({
                    ...unit,
                    frontPriceGlyph: e.target.checked
                      ? PriceGlyph.Pay
                      : PriceGlyph.Reinforce,
                  })
                }
              />
            ) : null}
            <Row className="g-2">
              <Col xs={6}>
                <Form.Label className="small text-muted mb-0">Gold</Form.Label>
                <Form.Control
                  type="number"
                  min={0}
                  value={unit.recruitCost.gold}
                  onChange={(e) =>
                    setRecruitCost("gold", Number(e.currentTarget.value))
                  }
                />
              </Col>
              <Col xs={6}>
                <Form.Label className="small text-muted mb-0">
                  Valuables
                </Form.Label>
                <Form.Control
                  type="number"
                  min={0}
                  value={unit.recruitCost.valuables}
                  onChange={(e) =>
                    setRecruitCost("valuables", Number(e.currentTarget.value))
                  }
                />
              </Col>
            </Row>
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group>
            <Form.Label>
              {unit.moreReinforcements
                ? "Price — Back (reinforcement)"
                : "Reinforcement Cost"}
            </Form.Label>
            {unit.moreReinforcements ? (
              <Form.Check
                type="switch"
                className="mb-1"
                label={
                  (unit.backPriceGlyph ?? PriceGlyph.Reinforce) ===
                  PriceGlyph.Pay
                    ? "Pay glyph"
                    : "Reinforcement glyph"
                }
                checked={
                  (unit.backPriceGlyph ?? PriceGlyph.Reinforce) ===
                  PriceGlyph.Pay
                }
                onChange={(e) =>
                  setUnit({
                    ...unit,
                    backPriceGlyph: e.target.checked
                      ? PriceGlyph.Pay
                      : PriceGlyph.Reinforce,
                  })
                }
              />
            ) : null}
            <Row className="g-2">
              <Col xs={6}>
                <Form.Label className="small text-muted mb-0">Gold</Form.Label>
                <Form.Control
                  type="number"
                  min={0}
                  value={unit.reinforceCost.gold}
                  onChange={(e) =>
                    setReinforceCost("gold", Number(e.currentTarget.value))
                  }
                />
              </Col>
              <Col xs={6}>
                <Form.Label className="small text-muted mb-0">
                  Valuables
                </Form.Label>
                <Form.Control
                  type="number"
                  min={0}
                  value={unit.reinforceCost.valuables}
                  onChange={(e) =>
                    setReinforceCost("valuables", Number(e.currentTarget.value))
                  }
                />
              </Col>
            </Row>
          </Form.Group>
        </Col>
      </Row>

      {unit.moreReinforcements ? (
        <Row className="g-3 mb-3">
          <Col md={6}>
            <Form.Group controlId="factionUnitFrontReinforcement">
              <Form.Label>Reinforcement — Front</Form.Label>
              <Form.Control
                type="text"
                value={
                  unit.frontReinforcementText ??
                  DEFAULT_FRONT_REINFORCEMENT_TEXT
                }
                onChange={(e) =>
                  setUnit({ ...unit, frontReinforcementText: e.target.value })
                }
                placeholder={DEFAULT_FRONT_REINFORCEMENT_TEXT}
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group controlId="factionUnitBackReinforcement">
              <Form.Label>Reinforcement — Back</Form.Label>
              <Form.Control
                type="text"
                value={
                  unit.backReinforcementText ?? DEFAULT_BACK_REINFORCEMENT_TEXT
                }
                onChange={(e) =>
                  setUnit({ ...unit, backReinforcementText: e.target.value })
                }
                placeholder={DEFAULT_BACK_REINFORCEMENT_TEXT}
              />
            </Form.Group>
          </Col>
        </Row>
      ) : null}

      <Row className="g-2 mb-3">
        <Col md={12}>
          <Form.Group controlId="factionUnitSeparateBackFace">
            <Form.Check
              type="switch"
              label="Separate name and portrait on the back"
              checked={!!unit.separateBackFace}
              onChange={(e) => toggleSeparateBackFace(e.target.checked)}
            />
            <Form.Text muted>
              While off, the back mirrors the front. The back&apos;s own name
              and portrait are kept either way, so switching back on restores
              them.
            </Form.Text>
          </Form.Group>
        </Col>
      </Row>

      {/* Back name on its own row so the two portrait buttons below stay on
          the same line as each other. */}
      {unit.separateBackFace ? (
        <Row className="g-2 mb-2">
          <Col md={6}>
            <Form.Group controlId="factionUnitBackNameInput">
              <Form.Label>Name — Back</Form.Label>
              <Form.Control
                type="text"
                value={unit.backName ?? unit.name}
                onChange={(e) => setUnit({ ...unit, backName: e.target.value })}
                placeholder="Enter unit name"
              />
            </Form.Group>
          </Col>
        </Row>
      ) : null}

      <Row className="my-3 text-center g-2">
        <Col xs={12} md={unit.separateBackFace ? 6 : 12}>
          <Button
            variant="outline-secondary"
            className="w-100"
            onClick={() => setShowPortraitModal(true)}
          >
            {unit.separateBackFace
              ? "Replace portrait — Front"
              : "Replace portrait"}
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

        {unit.separateBackFace ? (
          <Col xs={12} md={6}>
            <Button
              variant="outline-secondary"
              className="w-100"
              onClick={() => setShowBackPortraitModal(true)}
            >
              Replace portrait — Back
            </Button>
            <ReplaceEntityModal
              title="back portrait"
              show={showBackPortraitModal}
              onHide={() => setShowBackPortraitModal(false)}
              entityList={unitPortraits}
              onSelect={(backPortrait) => setUnit({ ...unit, backPortrait })}
              hideName
            />
          </Col>
        ) : null}
      </Row>

      <Row className="g-3 mb-3">
        <Col md={6}>
          <Form.Group controlId="factionUnitFewSpecialtyContent">
            <Form.Label>Unit Speciality — Few</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Enter unit speciality"
              value={unit.fewSpecialty}
              onChange={(e) => setFewSpecialty(e.target.value)}
            />
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group controlId="factionUnitPackSpecialtyContent">
            <Form.Label>Unit Speciality — Pack</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Enter unit speciality"
              value={unit.packSpecialty}
              onChange={(e) => setPackSpecialty(e.target.value)}
            />
          </Form.Group>
        </Col>
      </Row>

      <IconPalette
        targets={[
          {
            id: "factionUnitFewSpecialtyContent",
            value: unit.fewSpecialty,
            setValue: setFewSpecialty,
          },
          {
            id: "factionUnitPackSpecialtyContent",
            value: unit.packSpecialty,
            setValue: setPackSpecialty,
          },
        ]}
      />
    </Form>
  );
}
