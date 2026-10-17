export enum ArtifactRarity {
  Minor = "Minor",
  Major = "Major",
  Relic = "Relic",
}

export const artifactRarityColors: Record<ArtifactRarity, string> = {
  [ArtifactRarity.Minor]: "#5485aa",
  [ArtifactRarity.Major]: "#d00006",
  [ArtifactRarity.Relic]: "#450063",
};

export interface ArtifactIcon {
  name: string;
  path: string;
}

// prettier-ignore
export const artifactIcons: ArtifactIcon[] = [
  {
    name: "Angel Wings",
    path: "artifacts/angel_wings.png"
  }
];

export interface ArtifactCard {
  name: string;
  rarity: ArtifactRarity;
  icon: ArtifactIcon;
  effect: string;
  flavorText: string;
}

export const initialArtifactCard: ArtifactCard = {
  name: "Angel Wings",
  rarity: ArtifactRarity.Relic,
  icon: artifactIcons[0],
  effect:
    ":map: Chosen Hero gains +1 :movement: and can move through any fields without resolving them. The last visited field must be resolved normally.\n:or:\n:instant: Draw a card.",
  flavorText:
    "Not really wanting to know where the Angel, whose wings these belong to, is, you take the wings and quickly depart.",
};
