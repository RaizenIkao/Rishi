export type Rarity = 'C' | 'UC' | 'R' | 'SP' | 'UR' | 'E' | 'L';
export type Variant = 'Standard' | 'Alternative' | 'Shiny' | 'Secrète' | 'Gold' | 'Rainbow' | 'Manga' | 'Mythique';

export interface CardDefinition {
  id: string;
  name: string;
  universe: string;
  series: string;
  rarity: Rarity;
  variant: Variant;
  power: number;
  description: string;
}

export interface BoosterDefinition {
  id: string;
  name: string;
  cost: number;
  cards: number;
  description: string;
}

export interface Listing {
  id: string;
  cardId: string;
  seller: string;
  price: number;
}

export interface UniverseInfo {
  name: string;
  short: string;
  description: string;
  cards: number;
  extensions: number;
}
