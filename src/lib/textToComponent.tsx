import React from "react";
import { JSX } from "react";

import OrDividerIcon from "@/assets/glyphsInternal/or_divider.svg";

import InstantIcon from "@/assets/glyphs/instant.svg";
import OngoingIcon from "@/assets/glyphs/ongoing.svg";
import PermanentIcon from "@/assets/glyphs/permanent.svg";

import AttackIcon from "@/assets/glyphs/attack.svg";
import DefenseIcon from "@/assets/glyphs/defense.svg";
import EmpowerIcon from "@/assets/glyphs/empower.svg";
import HealthPointsIcon from "@/assets/glyphs/health_points.svg";
import MapIcon from "@/assets/glyphs/map.svg";
import SpellIcon from "@/assets/glyphs/spellpower.svg";

import MovementIcon from "@/assets/glyphs/movement.svg";
import InitiativeIcon from "@/assets/glyphs/initiative.svg";
import ActivationIcon from "@/assets/glyphs/activation.svg";
import MoraleIcon from "@/assets/glyphs/morale_positive.svg";
import MoraleNegativeIcon from "@/assets/glyphs/morale_negative.svg";
import DamageIcon from "@/assets/glyphs/damage-yellow.svg";
import ParalysisIcon from "@/assets/glyphs/paralysis.svg";

import GoldIcon from "@/assets/glyphs/gold.svg";
import ValuableIcon from "@/assets/glyphs/valuablegreater.svg";
import BuildingMaterialIcon from "@/assets/glyphs/building_materials.svg";
import PayIcon from "@/assets/glyphsInternal/price-icons/pay.png";

import UnitGroundIcon from "@/assets/glyphsInternal/unit_ground.svg";
import UnitFlyingIcon from "@/assets/glyphsInternal/unit_flying.svg";
import UnitRangedIcon from "@/assets/glyphs/unit_ranged.svg";

import TreasureIcon from "@/assets/glyphs/treasure.svg";
import ResourceIcon from "@/assets/glyphs/resource_die.svg";

import NecroIcon from "@/assets/glyphs/necro-yellow.svg";

import ExpertIcon from "@/assets/glyphs/expert.svg";
import HandLimitIcon from "@/assets/glyphs/hand.svg";
import ExperienceIcon from "@/assets/glyphs/experience.svg";
import ReinforceIcon from "@/assets/glyphs/reinforce.svg";

import UnitAttackIcon from "@/assets/glyphs/unit_attack-yellow.svg";
import UnitRetaliateIcon from "@/assets/glyphs/unit_retaliate.svg";
import UnitSpecialIcon from "@/assets/glyphs/unit_other.svg";
import UnitPassiveIcon from "@/assets/glyphs/unit_passive.svg";

import Valuables1Icon from "@/assets/glyphs/1_valuables.svg";
import Valuables2Icon from "@/assets/glyphs/2_valuables.svg";
import Building2Icon from "@/assets/glyphs/2_building_materials.svg";
import Building4Icon from "@/assets/glyphs/4_building_materials.svg";
import Gold3Icon from "@/assets/glyphs/3_gold.svg";
import Gold6Icon from "@/assets/glyphs/6_gold.svg";
import TreasureDie2Icon from "@/assets/glyphs/2_treasure_die.svg";
import PayV2Icon from "@/assets/glyphs/pay_v2.svg";

import ArtifactIcon from "@/assets/glyphs/artifact.svg";
import SkillIcon from "@/assets/glyphs/skill.svg";
import MightIcon from "@/assets/glyphs/might.svg";
import MagicIcon from "@/assets/glyphs/magic.svg";
import DefenseColorIcon from "@/assets/glyphs/defense_color.svg";
import PlusOneIcon from "@/assets/glyphs/plusone.svg";
import ZeroIcon from "@/assets/glyphs/zero.svg";
import ArrowRightIcon from "@/assets/glyphs/arrow_right.svg";
import ArrowRightGrayIcon from "@/assets/glyphs/arrow_right_gray.svg";

import Level1Icon from "@/assets/glyphs/level1.svg";
import Level4Icon from "@/assets/glyphs/level4.svg";
import Level6Icon from "@/assets/glyphs/level6.svg";

import BronzeMonoIcon from "@/assets/glyphs/bronze-mono.svg";
import SilverMonoIcon from "@/assets/glyphs/silver-mono.svg";
import GoldenMonoIcon from "@/assets/glyphs/golden-mono.svg";
import AzureMonoIcon from "@/assets/glyphs/azure-mono.svg";

import DamageDarkIcon from "@/assets/glyphs/damage.svg";

// These four and defense_color ship without a viewBox, and SVGO strips the one
// that matches width/height, so they need it supplied explicitly or they render
// at 1:1 user units inside a 1em box — i.e. blank.
const MONO_STAR_VIEWBOX = "0 0 350.23517 325.52435";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

export const iconMap: Record<string, JSX.Element> = {
  // Order matters only to the icon palette, which lists the map as it stands.
  // The glyphs most reached for while writing a card lead; the rest follow in
  // the groups they have always been in. Every lookup here is by key.
  ":or:": (
    <OrDividerIcon
      aria-label="Or"
      className="textIcon"
      style={{
        width: "15mm",
        height: "auto",
        marginTop: "0.75mm",
        marginBottom: "0.5mm",
      }}
    />
  ),
  ":permanent:": (
    <PermanentIcon
      viewBox="-10 -200 1722 1250"
      aria-label="Permanent"
      className="textIcon"
    />
  ),
  ":unit_passive:": (
    <UnitPassiveIcon aria-label="Unit passive" className="textIcon" />
  ),
  ":ongoing:": <OngoingIcon aria-label="Ongoing" className="textIcon" />,
  ":activation:": (
    <ActivationIcon aria-label="Activation" className="textIcon" />
  ),
  ":instant:": <InstantIcon aria-label="Instant" className="textIcon" />,
  ":unit_attack:": (
    <UnitAttackIcon aria-label="Unit attack" className="textIcon" />
  ),
  ":unit_retaliate:": (
    <UnitRetaliateIcon aria-label="Unit retaliate" className="textIcon" />
  ),
  ":unit_special:": (
    <UnitSpecialIcon aria-label="Unit Special acion" className="textIcon" />
  ),
  ":paralysis:": <ParalysisIcon aria-label="Paralysis" className="textIcon" />,
  ":map:": <MapIcon aria-label="Map" className="textIcon" />,
  ":attack:": <AttackIcon aria-label="Attack" className="textIcon" />,
  ":defense:": <DefenseIcon aria-label="Defense" className="textIcon" />,
  ":health:": <HealthPointsIcon aria-label="Health" className="textIcon" />,
  ":initiative:": (
    <InitiativeIcon aria-label="Initiative" className="textIcon" />
  ),
  ":damage:": <DamageIcon aria-label="Damage" className="textIcon" />,
  ":unit_ground:": (
    <UnitGroundIcon
      viewBox="0 0 76 76"
      aria-label="Ground unit"
      className="textIcon"
    >
      <path fill="currentColor" />
    </UnitGroundIcon>
  ),
  ":unit_flying:": (
    <UnitFlyingIcon aria-label="Flying unit" className="textIcon" />
  ),
  ":unit_ranged:": (
    <UnitRangedIcon aria-label="Ranged unit" className="textIcon" />
  ),
  ":expert:": <ExpertIcon aria-label="Expert" className="textIcon" />,
  ":hand_limit:": (
    <HandLimitIcon aria-label="Hand limit" className="textIcon" />
  ),
  ":pay:": <img src={PayIcon.src} alt="Pay" className="textIcon" />,
  ":reinforce:": <ReinforceIcon aria-label="Reinforce" className="textIcon" />,
  ":bronze:": <FontAwesomeIcon icon={faStar} className="bronze" />,
  ":silver:": <FontAwesomeIcon icon={faStar} className="silver" />,
  ":golden:": <FontAwesomeIcon icon={faStar} className="golden" />,
  ":azure:": <FontAwesomeIcon icon={faStar} className="azure" />,

  ":empower:": <EmpowerIcon aria-label="Empower" className="textIcon" />,

  ":spell:": <SpellIcon aria-label="Spell" className="textIcon" />,

  ":movement:": <MovementIcon aria-label="Movement" className="textIcon" />,
  ":morale:": <MoraleIcon aria-label="Morale" className="textIcon" />,
  ":morale_negative:": (
    <MoraleNegativeIcon
      aria-label="Negative Morale"
      className="textIcon"
      style={{ color: "#a8a8a7" }}
    />
  ),

  ":gold:": <GoldIcon aria-label="Gold" className="textIcon" />,
  ":valuable:": <ValuableIcon aria-label="Valuable" className="textIcon" />,
  ":building:": (
    <BuildingMaterialIcon aria-label="Building Material" className="textIcon" />
  ),

  ":necro:": <NecroIcon aria-label="Necro" className="textIcon" />,

  ":experience:": (
    <ExperienceIcon aria-label="Experience" className="textIcon" />
  ),
  ":skill:": <SkillIcon aria-label="Skill" className="textIcon" />,
  ":might:": <MightIcon aria-label="Might" className="textIcon" />,
  ":magic:": <MagicIcon aria-label="Magic" className="textIcon" />,
  ":artifact:": <ArtifactIcon aria-label="Artifact" className="textIcon" />,
  ":treasure:": <TreasureIcon aria-label="Treasure" className="textIcon" />,
  ":resource:": <ResourceIcon aria-label="Resource" className="textIcon" />,
  ":2_treasure_die:": (
    <TreasureDie2Icon aria-label="2 Treasure dice" className="textIcon" />
  ),

  ":1_valuables:": (
    <Valuables1Icon aria-label="1 Valuables" className="textIcon" />
  ),
  ":2_valuables:": (
    <Valuables2Icon aria-label="2 Valuables" className="textIcon" />
  ),
  ":2_building_materials:": (
    <Building2Icon aria-label="2 Building Materials" className="textIcon" />
  ),
  ":4_building_materials:": (
    <Building4Icon aria-label="4 Building Materials" className="textIcon" />
  ),
  ":3_gold:": <Gold3Icon aria-label="3 Gold" className="textIcon" />,
  ":6_gold:": <Gold6Icon aria-label="6 Gold" className="textIcon" />,
  ":pay_v2:": <PayV2Icon aria-label="Pay" className="textIcon" />,

  ":defense_color:": (
    <DefenseColorIcon
      viewBox="0 0 249.99348 282.92319"
      aria-label="Defense"
      className="textIcon"
    />
  ),
  ":plusone:": <PlusOneIcon aria-label="Plus one" className="textIcon" />,
  ":zero:": <ZeroIcon aria-label="Zero" className="textIcon" />,
  ":arrow_right:": (
    <ArrowRightIcon aria-label="Arrow right" className="textIcon" />
  ),
  ":arrow_right_gray:": (
    <ArrowRightGrayIcon aria-label="Arrow right (gray)" className="textIcon" />
  ),

  ":level1:": <Level1Icon aria-label="Level I" className="textIcon" />,
  ":level4:": <Level4Icon aria-label="Level IV" className="textIcon" />,
  ":level6:": <Level6Icon aria-label="Level VI" className="textIcon" />,

  ":bronze_mono:": (
    <BronzeMonoIcon
      viewBox={MONO_STAR_VIEWBOX}
      aria-label="Bronze tier"
      className="textIcon"
    />
  ),
  ":silver_mono:": (
    <SilverMonoIcon
      viewBox={MONO_STAR_VIEWBOX}
      aria-label="Silver tier"
      className="textIcon"
    />
  ),
  ":golden_mono:": (
    <GoldenMonoIcon
      viewBox={MONO_STAR_VIEWBOX}
      aria-label="Golden tier"
      className="textIcon"
    />
  ),
  ":azure_mono:": (
    <AzureMonoIcon
      viewBox={MONO_STAR_VIEWBOX}
      aria-label="Azure tier"
      className="textIcon"
    />
  ),

  ":damage_dark:": <DamageDarkIcon aria-label="Damage" className="textIcon" />,
};

type IconToken = keyof typeof iconMap;

// Renders arbitrary text flanked by the same tapered wedge lines as the
// ":or:" glyph, but with the text width (and thus the whole glyph's width)
// scaling to fit the given string instead of being fixed to "OR".
function renderDivide(text: string): React.ReactNode {
  const wedgeWidth = 50;
  const charWidth = 13;
  const textPadding = 20;
  const textWidth = Math.max(wedgeWidth, text.length * charWidth + textPadding);
  const totalWidth = wedgeWidth * 2 + textWidth;
  const leftWide = wedgeWidth;
  const rightWide = wedgeWidth + textWidth;

  return (
    <svg
      viewBox={`0 0 ${totalWidth} 14`}
      aria-label={text}
      className="textIcon"
      style={{
        height: "1.4mm",
        width: "auto",
        marginTop: "0.75mm",
        marginBottom: "0.5mm",
        overflow: "visible",
      }}
    >
      <text
        x={leftWide + textWidth / 2}
        y="50%"
        textAnchor="middle"
        dominantBaseline="central"
        fill="currentColor"
        fontSize="20"
      >
        {text}
      </text>
      <polygon
        points={`${leftWide},5.5 ${leftWide},8.5 0,7`}
        fill="currentColor"
      />
      <polygon
        points={`${rightWide},5.5 ${rightWide},8.5 ${totalWidth},7`}
        fill="currentColor"
      />
    </svg>
  );
}

interface UnitStatProps {
  attack: number;
  defense: number;
  health: number;
  speed: number;
}

interface SpellProps {
  power: [number, number, number];
  effect: [React.ReactNode, React.ReactNode, React.ReactNode];
  effectIcon?: React.ReactNode;
  /** Left-hand icon. Defaults to the spell power book when omitted. */
  powerIcon?: React.ReactNode;
}

export interface TextToComponentProps {
  renderUnitStats?: (props: UnitStatProps) => React.ReactNode;
  renderSpell?: (props: SpellProps) => React.ReactNode;
}

export function textToComponent(
  text: string,
  props: TextToComponentProps = {}
): React.ReactNode {
  // Digits are allowed so tokens can carry a quantity, e.g. :3_gold:.
  const re =
    /(\*\*|:[a-z0-9_]+:|:stats{[\s;0-9]*}:|:spell{.*?(?=}:)}:|:scale{.*?(?=}:)}:|:divide{.*?(?=}:)}:|\n\#|\n)/g;
  let last = 0;
  let result: React.ReactNode = null;

  const append = (node: React.ReactNode) => {
    result =
      result === null ? (
        node
      ) : (
        <>
          {result}
          {node}
        </>
      );
  };

  if (text[0] === "#") {
    text = "\n" + text;
  }

  const matches = Array.from(text.matchAll(re));
  for (const m of matches) {
    const tok = m[1];
    const tokStart = m.index!;
    const tokEnd = tokStart + tok.length;

    // If we've already advanced past this (due to consuming bold/heading), skip it
    if (tokStart < last) continue;

    // Append any plain text before this token
    if (tokStart > last) {
      append(text.slice(last, tokStart));
    }

    if (tok === "**") {
      const start = tokEnd; // after opening **
      const close = text.indexOf("**", start);
      if (close === -1) {
        append("**");
        last = start; // match original behavior when there's no closing **
      } else {
        append(
          <strong>{textToComponent(text.slice(start, close), props)}</strong>
        );
        last = close + 2; // jump past closing **
      }
    } else if (tok === "\n#") {
      const start = tokEnd;
      const close = text.indexOf("\n", start);
      if (close === -1) {
        append(<h4>{text.slice(start)}</h4>);
        last = text.length;
      } else {
        append(<h4>{text.slice(start, close)}</h4>);
        last = close + 1; // include trailing newline
      }
    } else if (tok === "\n") {
      append(<br />);
      last = tokEnd;
    } else if (tok.startsWith(":stats{")) {
      const stats = tok
        .slice(7, -2)
        .split(";")
        .map((s) => parseInt(s.trim()));

      if (stats.length !== 4) {
        append(
          <span className="text-danger">Stats must have 4 components</span>
        );
      }

      append(
        props.renderUnitStats ? (
          props.renderUnitStats({
            attack: stats[0],
            defense: stats[1],
            health: stats[2],
            speed: stats[3],
          })
        ) : (
          <span className="text-danger">No renderUnitStats available</span>
        )
      );
      last = tokEnd;
    } else if (tok.startsWith(":spell{")) {
      const spellParts = tok
        .slice(7, -2)
        .trim()
        .slice(1, -1)
        .split(/\}\s*;\s*\{/)
        .map((s) =>
          s
            .trim()
            .split(";")
            .map((p) => p.trim())
        );

      if (spellParts.length === 3) {
        const [power, effect, effectIcon] = [
          spellParts[0].map((p) => parseInt(p)) as [number, number, number],
          spellParts[1].map((p) => textToComponent(p, props)) as [
            React.ReactNode,
            React.ReactNode,
            React.ReactNode
          ],
          spellParts[2][0],
        ];
        append(
          props.renderSpell ? (
            props.renderSpell({
              power,
              effect,
              effectIcon: iconMap[effectIcon as IconToken],
            })
          ) : (
            <span className="text-danger">No renderSpell available</span>
          )
        );
      } else if (spellParts.length === 2) {
        const [power, effect] = [
          spellParts[0].map((p) => parseInt(p)) as [number, number, number],
          spellParts[1].map((p) => textToComponent(p, props)) as [
            React.ReactNode,
            React.ReactNode,
            React.ReactNode
          ],
        ];
        append(
          props.renderSpell ? (
            props.renderSpell({ power, effect })
          ) : (
            <span className="text-danger">No renderSpell available</span>
          )
        );
      } else {
        append(
          <span className="text-danger">Spell must have 2 or 3 components</span>
        );
      }
      last = tokEnd;
    } else if (tok.startsWith(":scale{")) {
      // Same two-column table as :spell{}:, but both icons are chosen rather
      // than fixed to the spell power book and the effect icon.
      const scaleParts = tok
        .slice(7, -2)
        .trim()
        .slice(1, -1)
        .split(/\}\s*;\s*\{/)
        .map((s) =>
          s
            .trim()
            .split(";")
            .map((p) => p.trim())
        );

      if (scaleParts.length === 4) {
        append(
          props.renderSpell ? (
            props.renderSpell({
              powerIcon: iconMap[scaleParts[0][0] as IconToken],
              power: scaleParts[1].map((p) => parseInt(p)) as [
                number,
                number,
                number
              ],
              effect: scaleParts[2].map((p) => textToComponent(p, props)) as [
                React.ReactNode,
                React.ReactNode,
                React.ReactNode
              ],
              effectIcon: iconMap[scaleParts[3][0] as IconToken],
            })
          ) : (
            <span className="text-danger">No renderSpell available</span>
          )
        );
      } else {
        append(
          <span className="text-danger">Scale must have 4 components</span>
        );
      }
      last = tokEnd;
    } else if (tok.startsWith(":divide{")) {
      const divideText = tok.slice(8, -2);
      append(renderDivide(divideText));
      last = tokEnd;
    } else if ((tok as IconToken) in iconMap) {
      append(iconMap[tok as IconToken]);
      last = tokEnd;
    } else {
      append(tok);
      last = tokEnd;
    }
  }

  // Trailing text after the last token
  if (last < text.length) {
    append(text.slice(last));
  }

  return result ?? null;
}
