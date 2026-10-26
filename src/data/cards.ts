import type { BoosterDefinition, CardDefinition, Listing, UniverseInfo } from '../types';

export const universeCatalog: UniverseInfo[] = [
  { name: 'One Piece', short: 'OP', description: 'Pirates, ambitions et pouvoirs élémentaires.', cards: 164, extensions: 12 },
  { name: 'Naruto', short: 'NA', description: 'Ninja, chakra et duels d’élite.', cards: 142, extensions: 10 },
  { name: 'Bleach', short: 'BL', description: 'Soul Reapers et esprits combattants.', cards: 128, extensions: 9 },
  { name: 'Dragon Ball', short: 'DB', description: 'Puissance brute et transformations.', cards: 188, extensions: 14 },
  { name: 'My Hero Academia', short: 'MHA', description: 'Héros et combats tactiques.', cards: 121, extensions: 8 },
  { name: 'Attack on Titan', short: 'AOT', description: 'Tactiques de survie et héroïsme.', cards: 110, extensions: 7 },
  { name: 'Jujutsu Kaisen', short: 'JK', description: 'Curses et shikigami.', cards: 133, extensions: 9 },
];

export const catalog: CardDefinition[] = [
  { id: 'luffy-r', name: 'Monkey D. Luffy', universe: 'One Piece', series: 'Pirates', rarity: 'R', variant: 'Standard', power: 94, description: 'Attaque de la houle avec un esprit de leader.' },
  { id: 'zoro-r', name: 'Roronoa Zoro', universe: 'One Piece', series: 'Pirates', rarity: 'R', variant: 'Standard', power: 89, description: 'Lame tranchante et endurance élevée.' },
  { id: 'naruto-r', name: 'Naruto Uzumaki', universe: 'Naruto', series: 'Shinobi', rarity: 'R', variant: 'Alternative', power: 91, description: 'Rasengan explosif et volonté de vaincre.' },
  { id: 'sasuke-r', name: 'Sasuke Uchiha', universe: 'Naruto', series: 'Shinobi', rarity: 'SP', variant: 'Shiny', power: 96, description: 'Technique électrique et précision ultime.' },
  { id: 'ichigo-sp', name: 'Ichigo Kurosaki', universe: 'Bleach', series: 'Soul Reapers', rarity: 'SP', variant: 'Standard', power: 92, description: 'Vitesse, puissance et contrôle du reishi.' },
  { id: 'goku-r', name: 'Son Goku', universe: 'Dragon Ball', series: 'Saiyan', rarity: 'UR', variant: 'Rainbow', power: 99, description: 'Transformation explosive et puissance inégalée.' },
  { id: 'vegeta-r', name: 'Vegeta', universe: 'Dragon Ball', series: 'Saiyan', rarity: 'R', variant: 'Gold', power: 88, description: 'Puissance de prince des Saiyans.' },
  { id: 'deku-r', name: 'Izuku Midoriya', universe: 'My Hero Academia', series: 'Heroes', rarity: 'UC', variant: 'Standard', power: 76, description: 'Poursuite de l’innovation et de l’ascension.' },
  { id: 'eren-r', name: 'Eren Yeager', universe: 'Attack on Titan', series: 'Titans', rarity: 'SP', variant: 'Manga', power: 90, description: 'Combattant redoutable aux instincts brutaux.' },
  { id: 'yuji-r', name: 'Yuuji Itadori', universe: 'Jujutsu Kaisen', series: 'Sorcerer', rarity: 'R', variant: 'Standard', power: 84, description: 'Vigueur et technique maîtrisée.' },
  { id: 'sukuna-l', name: 'Ryomen Sukuna', universe: 'Jujutsu Kaisen', series: 'Curse', rarity: 'L', variant: 'Mythique', power: 100, description: 'Force démoniaque et domination absolue.' },
  { id: 'luffy-legend', name: 'Gear 5 Luffy', universe: 'One Piece', series: 'Pirates', rarity: 'L', variant: 'Secrète', power: 100, description: 'Évolution 100% ludique et visuelle.' },
  { id: 'madara-ur', name: 'Madara Uchiha', universe: 'Naruto', series: 'Shinobi', rarity: 'UR', variant: 'Alternative', power: 97, description: 'Contrôle immense et puissance écrasante.' },
  { id: 'zenitsu-c', name: 'Zenitsu', universe: 'Demon Slayer', series: 'Hashira', rarity: 'C', variant: 'Standard', power: 62, description: 'Vitesse de réaction et puissance sous tension.' },
  { id: 'sailor-moon-r', name: 'Sailor Moon', universe: 'Sailor Moon', series: 'Magical Girls', rarity: 'R', variant: 'Shiny', power: 88, description: 'Énergie lunaire et magie symbole.' },
];

export const boosterCatalog: BoosterDefinition[] = [
  { id: 'decouverte', name: 'Booster Découverte', cost: 100, cards: 5, description: 'Pool orienté vers les cartes communes et peu communes.' },
  { id: 'premium', name: 'Booster Premium', cost: 250, cards: 5, description: 'Pool plus favorable aux cartes R, SP et UR.' },
  { id: 'elite', name: 'Booster Élite', cost: 500, cards: 5, description: 'Cible les cartes haute rareté et variantes fortes.' },
  { id: 'univers', name: 'Booster Univers', cost: 200, cards: 5, description: 'Sélection ciblée autour d’un univers précis.' },
];

export const marketListings: Listing[] = [
  { id: 'm-001', cardId: 'vegeta-r', seller: 'Kenshi', price: 220 },
  { id: 'm-002', cardId: 'naruto-r', seller: 'Mira K', price: 330 },
  { id: 'm-003', cardId: 'ichigo-sp', seller: 'Ayla', price: 480 },
  { id: 'm-004', cardId: 'sailor-moon-r', seller: 'Rin Zero', price: 290 },
];

export const starterDeck = ['luffy-r', 'naruto-r', 'goku-r', 'ichigo-sp', 'eren-r'];
