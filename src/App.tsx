import { useEffect, useMemo, useState } from 'react';
import { HashRouter, NavLink, Route, Routes } from 'react-router-dom';
import {
  ArrowRight,
  BookOpen,
  Briefcase,
  Crown,
  Flame,
  Gem,
  Gift,
  Home,
  LayoutGrid,
  Shield,
  ShieldCheck,
  Sparkles,
  Swords,
  Target,
  Trophy,
  UserRound,
  Users,
  Wallet,
  Zap,
} from 'lucide-react';
import { boosterCatalog, catalog, marketListings, universeCatalog, starterDeck } from './data/cards';
import type { CardDefinition, Rarity, Variant } from './types';

const LS_KEY = 'rishi-demo-save';

type Inventory = Record<string, number>;

type PlayerState = {
  name: string;
  level: number;
  xp: number;
  rc: number;
  boostersOpened: number;
  wins: number;
  losses: number;
  cardsOwned: number;
  uniqueCards: number;
  avatar: string;
};

type RecentOpening = {
  id: string;
  label: string;
  rarity: Rarity;
  variant: Variant;
  name: string;
};

type SaveState = {
  player: PlayerState;
  inventory: Inventory;
  deck: string[];
  recentOpenings: RecentOpening[];
};

const defaultInventory: Inventory = catalog.reduce((acc, card) => {
  acc[card.id] = card.id === 'luffy-r' || card.id === 'naruto-r' || card.id === 'goku-r' || card.id === 'ichigo-sp' ? 1 : 0;
  return acc;
}, {} as Inventory);

const defaultPlayer: PlayerState = {
  name: 'Aoi Nova',
  level: 18,
  xp: 420,
  rc: 1450,
  boostersOpened: 12,
  wins: 27,
  losses: 14,
  cardsOwned: 4,
  uniqueCards: 4,
  avatar: 'AN',
};

const defaultDeck = ['luffy-r', 'naruto-r', 'goku-r', 'ichigo-sp', 'eren-r'];

const defaultRecent: RecentOpening[] = [
  { id: '1', label: 'Booster Premium', rarity: 'SP', variant: 'Shiny', name: 'Ichigo' },
  { id: '2', label: 'Booster Découverte', rarity: 'R', variant: 'Standard', name: 'Naruto' },
  { id: '3', label: 'Booster Univers', rarity: 'UR', variant: 'Alternative', name: 'Luffy' },
];

const readSave = (): SaveState => {
  const loaded = localStorage.getItem(LS_KEY);
  if (!loaded) {
    return { player: defaultPlayer, inventory: defaultInventory, deck: defaultDeck, recentOpenings: defaultRecent };
  }

  try {
    return JSON.parse(loaded) as SaveState;
  } catch {
    return { player: defaultPlayer, inventory: defaultInventory, deck: defaultDeck, recentOpenings: defaultRecent };
  }
};

const rarityWeight: Record<Rarity, number> = {
  C: 48,
  UC: 27,
  R: 15,
  SP: 7,
  UR: 2,
  E: 0.8,
  L: 0.2,
};

const variantChance: Record<Variant, number> = {
  Standard: 96,
  Alternative: 1.5,
  Shiny: 1,
  Secrète: 0.7,
  Gold: 0.4,
  Rainbow: 0.2,
  Manga: 0.15,
  Mythique: 0.05,
};

const randomFrom<T>(items: T[]): T => items[Math.floor(Math.random() * items.length)];

const getRarityByWeight = (): Rarity => {
  const rng = Math.random() * 100;
  let cumulative = 0;

  for (const [rarity, weight] of Object.entries(rarityWeight) as [Rarity, number][]) {
    cumulative += weight;
    if (rng <= cumulative) return rarity;
  }

  return 'C';
};

const getVariantByWeight = (): Variant => {
  const rng = Math.random() * 100;
  let cumulative = 0;

  for (const [variant, weight] of Object.entries(variantChance) as [Variant, number][]) {
    cumulative += weight;
    if (rng <= cumulative) return variant;
  }

  return 'Standard';
};

const pickCardFromPool = (rarity: Rarity): CardDefinition => {
  const filter = catalog.filter((card) => card.rarity === rarity);
  return filter.length ? randomFrom(filter) : randomFrom(catalog);
};

const formatRC = (amount: number) => `${amount.toLocaleString('fr-FR')} RC`;

function App() {
  const saved = useMemo(() => readSave(), []);
  const [player, setPlayer] = useState<PlayerState>(saved.player);
  const [inventory, setInventory] = useState<Inventory>(saved.inventory);
  const [deck, setDeck] = useState<string[]>(saved.deck);
  const [recentOpenings, setRecentOpenings] = useState<RecentOpening[]>(saved.recentOpenings);
  const [notice, setNotice] = useState<string>('Mode local actif — données enregistrées dans le navigateur.');

  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify({ player, inventory, deck, recentOpenings }));
  }, [player, inventory, deck, recentOpenings]);

  const ownedCards = useMemo(
    () => catalog.filter((card) => (inventory[card.id] ?? 0) > 0),
    [inventory],
  );

  const uniqueCount = ownedCards.length;

  useEffect(() => {
    setPlayer((current) => ({ ...current, cardsOwned: Object.values(inventory).reduce((a, b) => a + b, 0), uniqueCards: uniqueCount }));
  }, [inventory, uniqueCount]);

  const openBooster = (boosterId: string) => {
    const booster = boosterCatalog.find((item) => item.id === boosterId);
    if (!booster) return;

    setPlayer((current) => {
      if (current.rc < booster.cost) {
        setNotice(`Solde insuffisant pour ${booster.name}.`);
        return current;
      }

      const nextInventory = { ...inventory };
      const draws: CardDefinition[] = [];

      for (let index = 0; index < booster.cards; index += 1) {
        const finalRarity = getRarityByWeight();
        const selectedCard = pickCardFromPool(finalRarity);
        const selectedVariant = getVariantByWeight();
        const picked = {
          ...selectedCard,
          rarity: finalRarity,
          variant: selectedVariant,
          id: `${selectedCard.id}-${Date.now()}-${index}`,
        };

        draws.push(picked);
        nextInventory[picked.id] = (nextInventory[picked.id] ?? 0) + 1;
      }

      setInventory(nextInventory);
      setPlayer({
        ...current,
        rc: current.rc - booster.cost,
        boostersOpened: current.boostersOpened + 1,
      });

      setRecentOpenings((items) => [
        {
          id: `${Date.now()}`,
          label: booster.name,
          rarity: draws[0].rarity,
          variant: draws[0].variant,
          name: draws[0].name,
        },
        ...items,
      ].slice(0, 5));

      setNotice(`${booster.name} ouvert : ${draws.map((card) => `${card.name} (${card.rarity})`).join(', ')}`);

      return {
        ...current,
        rc: current.rc - booster.cost,
        boostersOpened: current.boostersOpened + 1,
      };
    });
  };

  const buyMarketListing = (listingId: string) => {
    const listing = marketListings.find((item) => item.id === listingId);
    if (!listing) return;

    if (player.rc < listing.price) {
      setNotice('Fonds insuffisants pour acheter cette carte.');
      return;
    }

    const chosenCard = catalog.find((card) => card.id === listing.cardId);
    if (!chosenCard) return;

    setPlayer((current) => ({ ...current, rc: current.rc - listing.price }));
    setInventory((current) => ({ ...current, [chosenCard.id]: (current[chosenCard.id] ?? 0) + 1 }));
    setNotice(`${chosenCard.name} ajoutée à votre collection.`);
  };

  const addDeckCard = (cardId: string) => {
    setDeck((current) => {
      if (current.includes(cardId)) return current;
      return [...current, cardId].slice(-5);
    });
    setNotice('Carte ajoutée au deck actif.');
  };

  return (
    <HashRouter>
      <div className="app-shell">
        <aside className="sidebar">
          <div className="brand">
            <div className="brand-mark">R</div>
            <div>
              <strong>RISHI</strong>
              <span>Collect. Evolve. Conquer.</span>
            </div>
          </div>

          <nav className="main-nav">
            {[
              { to: '/', label: 'Accueil', icon: Home },
              { to: '/collection', label: 'Collection', icon: LayoutGrid },
              { to: '/boosters', label: 'Boosters', icon: Gift },
              { to: '/decks', label: 'Decks', icon: Shield },
              { to: '/combats', label: 'Combats', icon: Swords },
              { to: '/market', label: 'Marché', icon: Briefcase },
              { to: '/community', label: 'Communauté', icon: Users },
              { to: '/univers', label: 'Univers', icon: BookOpen },
              { to: '/classements', label: 'Classements', icon: Trophy },
              { to: '/profil', label: 'Profil', icon: UserRound },
              { to: '/parametres', label: 'Paramètres', icon: Zap },
              { to: '/admin', label: 'Admin', icon: ShieldCheck },
            ].map(({ to, label, icon: Icon }) => (
              <NavLink key={to} to={to} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                <Icon size={18} />
                {label}
              </NavLink>
            ))}
          </nav>

          <div className="status-box">
            <span className="eyebrow">Mode</span>
            <strong>Local de démonstration</strong>
            <small>Synchronisation cloud prête pour Supabase.</small>
          </div>
        </aside>

        <main className="main-panel">
          <header className="topbar">
            <div>
              <p className="eyebrow">Bienvenue</p>
              <h1>{player.name}</h1>
            </div>
            <div className="topbar-actions">
              <div className="avatar-box">{player.avatar}</div>
              <div className="mini-stat">
                <span>Niveau</span>
                <strong>{player.level}</strong>
              </div>
              <div className="mini-stat accent">
                <Wallet size={16} />
                <strong>{formatRC(player.rc)}</strong>
              </div>
            </div>
          </header>

          <div className="notice-bar">{notice}</div>

          <Routes>
            <Route path="/" element={<DashboardPage player={player} recentOpenings={recentOpenings} />} />
            <Route path="/collection" element={<CollectionPage inventory={inventory} addDeckCard={addDeckCard} />} />
            <Route path="/boosters" element={<BoostersPage openBooster={openBooster} player={player} />} />
            <Route path="/decks" element={<DeckPage deck={deck} inventory={inventory} />} />
            <Route path="/combats" element={<BattlePage player={player} deck={deck} />} />
            <Route path="/market" element={<MarketPage buyMarketListing={buyMarketListing} player={player} />} />
            <Route path="/community" element={<CommunityPage />} />
            <Route path="/univers" element={<UniversePage />} />
            <Route path="/classements" element={<RankingsPage player={player} />} />
            <Route path="/profil" element={<ProfilePage player={player} />} />
            <Route path="/parametres" element={<SettingsPage />} />
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </main>
      </div>
    </HashRouter>
  );
}

function StatCard({ label, value, icon: Icon }: { label: string; value: string; icon: typeof Home }) {
  return (
    <div className="stat-card">
      <div className="stat-icon"><Icon size={18} /></div>
      <div>
        <small>{label}</small>
        <strong>{value}</strong>
      </div>
    </div>
  );
}

function DashboardPage({ player, recentOpenings }: { player: PlayerState; recentOpenings: RecentOpening[] }) {
  const stats = [
    { label: 'Collection', value: `${player.uniqueCards} cartes`, icon: BookOpen },
    { label: 'Boosters', value: `${player.boostersOpened}`, icon: Gift },
    { label: 'Victoires', value: `${player.wins}`, icon: Trophy },
    { label: 'RC', value: formatRC(player.rc), icon: Wallet },
  ];

  return (
    <div className="page-stack">
      <section className="hero-panel">
        <div>
          <p className="eyebrow">Tableau de bord</p>
          <h2>Mission du jour</h2>
          <p>Complétez votre collection, ouvrez un booster premium et préparez votre prochain deck.</p>
        </div>
        <button className="primary-button">Ouvrir un booster</button>
      </section>

      <div className="stats-grid">
        {stats.map((stat) => (
          <StatCard key={stat.label} label={stat.label} value={stat.value} icon={stat.icon} />
        ))}
      </div>

      <div className="content-grid two-cols">
        <section className="panel">
          <div className="panel-header">
            <h3>Dernières cartes</h3>
            <span>Récemment obtenues</span>
          </div>
          <div className="stack-list">
            {recentOpenings.map((item) => (
              <div key={item.id} className="mini-row">
                <div className="mini-tile">{item.name.slice(0, 2).toUpperCase()}</div>
                <div>
                  <strong>{item.name}</strong>
                  <small>{item.label}</small>
                </div>
                <span className={`badge ${item.rarity.toLowerCase()}`}>{item.rarity}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="panel">
          <div className="panel-header">
            <h3>Missions quotidiennes</h3>
            <span>3/5 terminées</span>
          </div>
          <div className="mission-list">
            <div className="mission-item done"><span>Ouvrir un booster</span><strong>Terminé</strong></div>
            <div className="mission-item done"><span>Gagner un duel</span><strong>Terminé</strong></div>
            <div className="mission-item"><span>Compléter un deck</span><strong>2/3</strong></div>
            <div className="mission-item"><span>Vendre une carte</span><strong>À faire</strong></div>
          </div>
        </section>
      </div>
    </div>
  );
}

function CollectionPage({ inventory, addDeckCard }: { inventory: Inventory; addDeckCard: (cardId: string) => void }) {
  const [query, setQuery] = useState('');
  const [rarity, setRarity] = useState('all');
  const [variant, setVariant] = useState('all');
  const [universe, setUniverse] = useState('all');

  const visibleCards = useMemo(() => {
    return catalog.filter((card) => {
      const matchesQuery = card.name.toLowerCase().includes(query.toLowerCase()) || card.universe.toLowerCase().includes(query.toLowerCase());
      const matchesRarity = rarity === 'all' || card.rarity === rarity;
      const matchesVariant = variant === 'all' || card.variant === variant;
      const matchesUniverse = universe === 'all' || card.universe === universe;
      return matchesQuery && matchesRarity && matchesVariant && matchesUniverse && (inventory[card.id] ?? 0) > 0;
    });
  }, [inventory, query, rarity, universe, variant]);

  const countOwned = (cardId: string) => inventory[cardId] ?? 0;

  return (
    <div className="page-stack">
      <section className="panel">
        <div className="panel-header">
          <h3>Collection</h3>
          <span>{visibleCards.length} cartes possédées</span>
        </div>

        <div className="filter-grid">
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Rechercher une carte ou un univers" />
          <select value={rarity} onChange={(event) => setRarity(event.target.value)}>
            <option value="all">Toutes raretés</option>
            {['C', 'UC', 'R', 'SP', 'UR', 'E', 'L'].map((level) => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>
          <select value={variant} onChange={(event) => setVariant(event.target.value)}>
            <option value="all">Toutes variantes</option>
            {['Standard', 'Alternative', 'Shiny', 'Secrète', 'Gold', 'Rainbow', 'Manga', 'Mythique'].map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
          <select value={universe} onChange={(event) => setUniverse(event.target.value)}>
            <option value="all">Tous univers</option>
            {universeCatalog.map((item) => (
              <option key={item.name} value={item.name}>{item.name}</option>
            ))}
          </select>
        </div>

        <div className="card-grid">
          {visibleCards.map((card) => (
            <article key={card.id} className="card-tile rarity-${card.rarity.toLowerCase()}">
              <div className="card-art">{card.name.slice(0, 2).toUpperCase()}</div>
              <div className="card-content">
                <div className="card-header">
                  <strong>{card.name}</strong>
                  <span>{card.rarity}</span>
                </div>
                <small>{card.universe}</small>
                <p>{card.description}</p>
                <div className="card-footer">
                  <span>{countOwned(card.id)}x</span>
                  <button onClick={() => addDeckCard(card.id)}>Ajouter</button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function BoostersPage({ openBooster, player }: { openBooster: (boosterId: string) => void; player: PlayerState }) {
  return (
    <div className="page-stack">
      <section className="panel">
        <div className="panel-header">
          <h3>Boosters</h3>
          <span>Probabilités visibles et configurables</span>
        </div>

        <div className="booster-grid">
          {boosterCatalog.map((booster) => (
            <article key={booster.id} className="booster-card">
              <div> <p className="eyebrow">{booster.id}</p><h4>{booster.name}</h4> </div>
              <ul>
                <li>Prix : {formatRC(booster.cost)}</li>
                <li>Cartes : {booster.cards}</li>
                <li>{booster.description}</li>
              </ul>
              <button disabled={player.rc < booster.cost} className="primary-button" onClick={() => openBooster(booster.id)}>
                {player.rc >= booster.cost ? 'Ouvrir' : 'Solde insuffisant'}
              </button>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function DeckPage({ deck, inventory }: { deck: string[]; inventory: Inventory }) {
  const validDeck = deck.map((cardId) => catalog.find((card) => card.id === cardId)).filter(Boolean) as CardDefinition[];

  return (
    <div className="page-stack">
      <section className="panel">
        <div className="panel-header">
          <h3>Deck actif</h3>
          <span>{validDeck.length}/5 cartes</span>
        </div>
        <div className="deck-grid">
          {validDeck.length ? validDeck.map((card) => (
            <div key={card.id} className="deck-card">
              <strong>{card.name}</strong>
              <small>{card.universe}</small>
              <span>{card.rarity}</span>
            </div>
          )) : <p>Ajoutez des cartes dans votre collection pour construire votre deck.</p>}
        </div>

        <div className="inventory-list">
          {catalog.filter((card) => (inventory[card.id] ?? 0) > 0).slice(0, 8).map((card) => (
            <button key={card.id} className="chip-button" onClick={() => {}}>{card.name}</button>
          ))}
        </div>
      </section>
    </div>
  );
}

function BattlePage({ player, deck }: { player: PlayerState; deck: string[] }) {
  const [battleState, setBattleState] = useState({ playerHp: 100, enemyHp: 100, turn: 1, winner: '' as 'player' | 'enemy' | '' });

  const attack = () => {
    const playerDamage = 18 + (deck.length * 6);
    const enemyDamage = 12 + Math.random() * 12;

    setBattleState((current) => {
      const nextEnemyHp = Math.max(0, current.enemyHp - playerDamage);
      const nextPlayerHp = Math.max(0, current.playerHp - enemyDamage);

      if (nextEnemyHp <= 0) return { playerHp: nextPlayerHp, enemyHp: 0, turn: current.turn + 1, winner: 'player' };
      if (nextPlayerHp <= 0) return { playerHp: 0, enemyHp: nextEnemyHp, turn: current.turn + 1, winner: 'enemy' };
      return { playerHp: nextPlayerHp, enemyHp: nextEnemyHp, turn: current.turn + 1, winner: '' };
    });
  };

  return (
    <div className="page-stack">
      <section className="panel battle-panel">
        <div className="battle-head">
          <div>
            <p className="eyebrow">Duel d’entraînement</p>
            <h3>{player.name} vs. IA</h3>
          </div>
          <button className="primary-button" onClick={attack}>Attaquer</button>
        </div>

        <div className="health-bars">
          <div>
            <span>Joueur</span>
            <div className="health-bar"><div style={{ width: `${battleState.playerHp}%` }} /></div>
          </div>
          <div>
            <span>IA</span>
            <div className="health-bar enemy"><div style={{ width: `${battleState.enemyHp}%` }} /></div>
          </div>
        </div>

        <div className="battle-result">
          {battleState.winner ? `Résultat : ${battleState.winner === 'player' ? 'Victoire' : 'Défaite'}` : `Tour ${battleState.turn}`}
        </div>
      </section>
    </div>
  );
}

function MarketPage({ buyMarketListing, player }: { buyMarketListing: (listingId: string) => void; player: PlayerState }) {
  return (
    <div className="page-stack">
      <section className="panel">
        <div className="panel-header">
          <h3>Marché des cartes</h3>
          <span>Achats sécurisés en local</span>
        </div>

        <div className="market-list">
          {marketListings.map((item) => {
            const card = catalog.find((entry) => entry.id === item.cardId);
            return (
              <div key={item.id} className="market-item">
                <div>
                  <strong>{card?.name}</strong>
                  <small>{card?.rarity} • {card?.universe}</small>
                </div>
                <div className="market-price">
                  <span>{formatRC(item.price)}</span>
                  <button onClick={() => buyMarketListing(item.id)} disabled={player.rc < item.price}>Acheter</button>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function CommunityPage() {
  return (
    <div className="page-stack">
      <section className="panel">
        <div className="panel-header">
          <h3>Communauté</h3>
          <span>Joueurs actifs</span>
        </div>
        <div className="community-grid">
          {['Aoi Nova', 'Kenshi', 'Ayla', 'Mira K', 'Rin Zero'].map((user) => (
            <div key={user} className="community-card">
              <div className="mini-tile">{user.slice(0, 2).toUpperCase()}</div>
              <strong>{user}</strong>
              <small>Collection : 142 cartes</small>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function UniversePage() {
  return (
    <div className="page-stack">
      <section className="panel">
        <div className="panel-header">
          <h3>Univers</h3>
          <span>Catalogues extensibles</span>
        </div>
        <div className="universe-grid">
          {universeCatalog.map((item) => (
            <div key={item.name} className="universe-card">
              <div className="mini-tile large">{item.short}</div>
              <h4>{item.name}</h4>
              <p>{item.description}</p>
              <small>{item.cards} cartes • {item.extensions} extensions</small>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function RankingsPage({ player }: { player: PlayerState }) {
  const ranking = [
    { username: 'Aoi Nova', score: 9800, badge: 'Champion' },
    { username: 'Kenshi', score: 9440, badge: 'Top 3' },
    { username: 'Mira K', score: 9010, badge: 'Elite' },
    { username: player.name, score: 8450, badge: 'Vous' },
  ];

  return (
    <div className="page-stack">
      <section className="panel">
        <div className="panel-header">
          <h3>Classements</h3>
          <span>Progression globale</span>
        </div>
        <div className="ranking-list">
          {ranking.map((entry, index) => (
            <div key={entry.username} className="ranking-item">
              <span>#{index + 1}</span>
              <strong>{entry.username}</strong>
              <small>{entry.badge}</small>
              <em>{entry.score} pts</em>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function ProfilePage({ player }: { player: PlayerState }) {
  return (
    <div className="page-stack">
      <section className="panel profile-panel">
        <div className="profile-header">
          <div className="avatar-box large">{player.avatar}</div>
          <div>
            <p className="eyebrow">Profil public</p>
            <h3>{player.name}</h3>
            <small>Niveau {player.level} • {player.uniqueCards} cartes uniques</small>
          </div>
        </div>
        <div className="stats-grid compact">
          <StatCard label="XP" value={`${player.xp}`} icon={Target} />
          <StatCard label="Défenses" value={`${player.wins}`} icon={Shield} />
          <StatCard label="Duel" value={`${player.wins}V / ${player.losses}D`} icon={Crown} />
          <StatCard label="RC" value={formatRC(player.rc)} icon={Gem} />
        </div>
      </section>
    </div>
  );
}

function SettingsPage() {
  return (
    <div className="page-stack">
      <section className="panel">
        <div className="panel-header">
          <h3>Paramètres</h3>
          <span>Mode local / cloud</span>
        </div>

        <div className="settings-list">
          <label><input type="checkbox" defaultChecked /> Activer le mode local de sauvegarde</label>
          <label><input type="checkbox" /> Réduire les animations</label>
          <label><input type="checkbox" /> Autoriser les notifications push</label>
          <label><input type="checkbox" /> Masquer les profils public</label>
        </div>
      </section>
    </div>
  );
}

function AdminPage() {
  return (
    <div className="page-stack">
      <section className="panel">
        <div className="panel-header">
          <h3>Administration</h3>
          <span>Permissions serveur requises</span>
        </div>
        <div className="admin-grid">
          <div className="admin-card"><strong>Univers</strong><small>+1</small></div>
          <div className="admin-card"><strong>Extensions</strong><small>12</small></div>
          <div className="admin-card"><strong>Boosters</strong><small>4</small></div>
          <div className="admin-card"><strong>Probabilités</strong><small>Validées</small></div>
        </div>
      </section>
    </div>
  );
}

export default App;
