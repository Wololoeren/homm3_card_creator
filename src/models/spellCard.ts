import Aging from "@/assets/spells/aging.png";
import Berserk from "@/assets/spells/berserk.png";
import Bless from "@/assets/spells/bless.png";
import Blind from "@/assets/spells/blind.png";
import ChainOfLightning from "@/assets/spells/chain_of_lightning.png";
import Cure from "@/assets/spells/cure.png";
import Curse from "@/assets/spells/curse.png";
import DimensionDoor from "@/assets/spells/dimension_door.png";
import Dispell from "@/assets/spells/dispell.png";
import Firewall from "@/assets/spells/firewall.png";
import Forgetfulness from "@/assets/spells/forgetfulness.png";
import Fortune from "@/assets/spells/fortune.png";
import Frenzy from "@/assets/spells/frenzy.png";
import Haste from "@/assets/spells/haste.png";
import Implosion from "@/assets/spells/implosion.png";
import MagicArrow from "@/assets/spells/magic_arrow.png";
import MeteorShower from "@/assets/spells/meteor_shower.png";
import Misfortune from "@/assets/spells/misfortune.png";
import Precision from "@/assets/spells/precision.png";
import Resurrect from "@/assets/spells/resurrect.png";
import Shield from "@/assets/spells/shield.png";
import Slayer from "@/assets/spells/slayer.png";
import StoneSkin from "@/assets/spells/stone_skin.png";
import TownPortal from "@/assets/spells/town_portal.png";

export interface SpellIcon {
  name: string;
  path: string;
}

// prettier-ignore
export const spellIcons: SpellIcon[] = [
  { name: "Bless", path: Bless.src },
  { name: "Aging", path: Aging.src },
  { name: "Berserk", path: Berserk.src },
  { name: "Blind", path: Blind.src },
  { name: "Chain of Lightning", path: ChainOfLightning.src },
  { name: "Cure", path: Cure.src },
  { name: "Curse", path: Curse.src },
  { name: "Dimension Door", path: DimensionDoor.src },
  { name: "Dispell", path: Dispell.src },
  { name: "Firewall", path: Firewall.src },
  { name: "Forgetfulness", path: Forgetfulness.src },
  { name: "Fortune", path: Fortune.src },
  { name: "Frenzy", path: Frenzy.src },
  { name: "Haste", path: Haste.src },
  { name: "Implosion", path: Implosion.src },
  { name: "Magic Arrow", path: MagicArrow.src },
  { name: "Meteor Shower", path: MeteorShower.src },
  { name: "Misfortune", path: Misfortune.src },
  { name: "Precision", path: Precision.src },
  { name: "Resurrect", path: Resurrect.src },
  { name: "Shield", path: Shield.src },
  { name: "Slayer", path: Slayer.src },
  { name: "Stone Skin", path: StoneSkin.src },
  { name: "Town Portal", path: TownPortal.src },
];

export enum SpellTier {
  Basic = "Basic",
  Expert = "Expert",
  Any = "Any",
}

export enum SpellSchool {
  Water = "Water",
  Fire = "Fire",
  Air = "Air",
  Earth = "Earth",
}

export interface SpellCard {
  name: string;
  icon: SpellIcon;
  effect: string;
  tier: SpellTier;
  school: SpellSchool;
}

export const initialSpellCard: SpellCard = {
  name: "Magic Arrow",
  icon: spellIcons.find((icon) => icon.name === "Magic Arrow") ?? spellIcons[0],
  effect:
    ":activation: The selected unit suffers:\n:spell{{0;1;2};{1;2;3};{:damage:}}:\n:or:\n:instant: +1 :empower:.",
  // Magic Arrow belongs to every school, which is what Any renders.
  tier: SpellTier.Any,
  school: SpellSchool.Water,
};
