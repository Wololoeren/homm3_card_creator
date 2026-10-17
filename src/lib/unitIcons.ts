import AttackIcon from "@/assets/unit-icons/faction_icon_attack.png";
import DefenseIcon from "@/assets/unit-icons/faction_icon_defense.png";
import HealthIcon from "@/assets/unit-icons/faction_icon_hp.png";
import InitiativeIcon from "@/assets/unit-icons/faction_icon_speed.png";
import PackHashIcon from "@/assets/unit-icons/pack_reinf_hash.png";

/**
 * The four stat glyphs every unit card carries, in the order they are printed.
 * Shared because neutral units, faction units and creature bank units all draw
 * the same row, and a swap in one of them should never leave the others behind.
 */
export const unitStatIcons = {
  attack: AttackIcon,
  defense: DefenseIcon,
  health: HealthIcon,
  initiative: InitiativeIcon,
} as const;

/** The "#" of the "# PACK" band, as it is drawn on the printed card. */
export { PackHashIcon };
