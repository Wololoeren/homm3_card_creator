export enum SpecialtyLevel {
  One = 1,
  Four = 4,
  Six = 6,
}

export interface Specialty {
  name: string;
  path: string;
}

// prettier-ignore
export const monsterSpecialties: Specialty[] = [
  {
    name: "Evil Eyes",
    path: "monsters/evil_eyes.webp"
  },
  {
    name: "Harpies",
    path: "monsters/harpies.webp"
  },
  {
    name: "Liches",
    path: "monsters/liches.webp"
  },
  {
    name: "Nagas",
    path: "monsters/nagas.webp"
  },
  {
    name: "Pegasi",
    path: "monsters/pegasi.webp"
  },
  {
    name: "Troglodytes",
    path: "monsters/troglodytes.webp"
  }
];
