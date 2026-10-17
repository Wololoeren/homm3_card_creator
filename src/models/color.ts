import { TownType } from "./town";

interface TownColor {
  color: string;
  background?: string;
}

export const townColors: Record<TownType, TownColor> = {
  [TownType.Castle]: { color: "#0054b6", background: "#062450" },
  [TownType.Conflux]: { color: "#c9888e", background: "#aa5966" },
  [TownType.Cove]: { color: "#549c82", background: "#006666" },
  [TownType.Dungeon]: { color: "#6019a1", background: "#660566" },
  [TownType.Factory]: { color: "#f77802", background: "#8b3300" },
  [TownType.Fortress]: { color: "#355539", background: "#003b00" },
  [TownType.Inferno]: { color: "#ab0305", background: "#5f0000" },
  [TownType.Necropolis]: { color: "#5f5a5f", background: "#808080" },
  [TownType.Rampart]: { color: "#6c8a38", background: "#006e00" },
  [TownType.Stronghold]: { color: "#a86f4f", background: "#926242" },
  [TownType.Tower]: { color: "#c9d8c2", background: "#e0e0e0" },
};
